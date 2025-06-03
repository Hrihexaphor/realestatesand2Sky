import pool from '../config/db.js';

export async function createAdvertisement(ad) {
  const {
    link,
    image_url,
    image_size,
    location,
    start_date,
    end_date,
    cityIds = []
  } = ad;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const adQuery = `
      INSERT INTO advertisements (link, image_url, image_size, location, start_date, end_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;
    const adValues = [link, image_url, image_size, location, start_date, end_date];
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
  await pool.query(`DELETE FROM advertisements WHERE id = $1`, [id]);
}

export async function updateAdvertisement(id, link, image_url, image_size, location, start_date, end_date, cityIds = []) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateQuery = `
      UPDATE advertisements
      SET link = $1,
          image_url = $2,
          image_size = $3,
          location = $4,
          start_date = $5,
          end_date = $6
      WHERE id = $7
      RETURNING *;
    `;
    const updateValues = [link, image_url, image_size, location, start_date, end_date, id];
    const { rows } = await client.query(updateQuery, updateValues);
    const updatedAd = rows[0];

    await client.query(`DELETE FROM advertisement_cities WHERE advertisement_id = $1`, [id]);

    for (const cityId of cityIds) {
      await client.query(
        `INSERT INTO advertisement_cities (advertisement_id, city_id) VALUES ($1, $2)`,
        [id, cityId]
      );
    }

    await client.query('COMMIT');
    return updatedAd;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
