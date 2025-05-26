import pool from '../config/db.js'

export async function createAdvertisement(ad) {
  const {
    link,
    image_url,
    image_size,
    position,
    location,
    start_date,
    end_date,
    cityIds = []
  } = ad;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const adQuery = `
        INSERT INTO advertisements (link, image_url, image_size, image_position, location, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
    const adValues = [link, image_url, image_size, position, location, start_date, end_date];
    const { rows } = await client.query(adQuery, adValues);
    const newAd = rows[0];

    for (const cityId of cityIds) {
      await client.query(
        `INSERT INTO advertisement_cities (advertisement_id, city_id) VALUES ($1, $2)`,
        [newAd.id, cityId]
      );
    }

    await client.query('COMMIT');
    return newAd;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getAllAdvertisements() {
  const query = `
    SELECT a.*, 
      COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL), '[]') AS cities
    FROM advertisements a
    LEFT JOIN advertisement_cities ac ON a.id = ac.advertisement_id
    LEFT JOIN cities c ON ac.city_id = c.id
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

export async function getAdvertisementsByLocation(location) {
  const query = `
    SELECT a.*, 
      COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL), '[]') AS cities
    FROM advertisements a
    LEFT JOIN advertisement_cities ac ON a.id = ac.advertisement_id
    LEFT JOIN cities c ON ac.city_id = c.id
    WHERE a.location = $1
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `;
  const { rows } = await pool.query(query, [location]);
  return rows;
}

export async function deleteAdvertisement(id) {
  const query = `DELETE FROM advertisements WHERE id = $1`;
  await pool.query(query, [id]);
}