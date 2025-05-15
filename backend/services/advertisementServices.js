import pool from '../config/db.js'

export async function createAdvertisement(ad) {
    const {
        link,
        image_url,
        position,
        location,
        start_date,
        end_date
    } = ad;
    const query = `INSERT INTO advertisements (link, image_url, image_position, location, start_date,end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
    const values = [link,image_url,position,location,start_date,end_date];
    const {rows} = await pool.query(query, values);
    return rows[0];
    
}
export async function getAllAdvertisements() {
  const query = `SELECT * FROM advertisements ORDER BY created_at DESC`;
  const { rows } = await pool.query(query);
  return rows;
}

export async function getAdvertisementsByLocation(location) {
  const query = `SELECT * FROM advertisements WHERE location = $1 ORDER BY created_at DESC`;
  const { rows } = await pool.query(query, [location]);
  return rows;
}

export async function deleteAdvertisement(id) {
  const query = `DELETE FROM advertisements WHERE id = $1`;
  await pool.query(query, [id]);
}
