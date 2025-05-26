import pool from "../config/db.js";
// City-related service functions
export async function getAllCities() {
  const result = await pool.query(`SELECT id, name FROM cities ORDER BY name`);
  return result.rows;
}

export async function getCityById(id) {
  const result = await pool.query(`SELECT id, name FROM cities WHERE id = $1`, [
    id,
  ]);
  return result.rows[0];
}

export async function createCity(name) {
  const result = await pool.query(
    `INSERT INTO cities (name) VALUES ($1) RETURNING id, name`,
    [name]
  );
  return result.rows[0];
}

export async function updateCity(id, name) {
  const result = await pool.query(
    `UPDATE cities SET name = $1 WHERE id = $2 RETURNING id, name`,
    [name, id]
  );
  return result.rows[0];
}

export async function deleteCity(id) {
  const result = await pool.query(
    `DELETE FROM cities WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows[0];
}

export async function getCitiesForFeaturedProperty(featuredPropertyId) {
  const result = await pool.query(
    `SELECT c.id, c.name
     FROM cities c
     JOIN featured_property_cities fpc ON c.id = fpc.city_id
     WHERE fpc.featured_property_id = $1
     ORDER BY c.name`,
    [featuredPropertyId]
  );
  return result.rows;
}

// get the all locality by city name
export async function getLocalityByCity(cityName) {
  const result = await pool.query(
    `
    SELECT DISTINCT locality
    FROM property_details
    WHERE city = $1
  `,
    [cityName]
  );

  // Return just the list of locality names
  return result.rows.map((row) => row.locality);
}
