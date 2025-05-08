import pool from '../config/db.js'

// Add blog post
export async function addBlog({ title, description, image_url, meta_title, meta_description }) {
  const result = await pool.query(
    'INSERT INTO blogs (title, image_url, description, meta_title, meta_description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, image_url, description, meta_title, meta_description]
  );
  return result.rows[0];
}

// View all blog posts
export async function getAllBlogs() {
  const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
  return result.rows;
}

// Update blog post
export async function updateBlog(id, { title, description, image_url }) {
  const result = await pool.query(
    `UPDATE blogs 
     SET title = COALESCE($1, title), 
         description = COALESCE($2, description),
         image_url = COALESCE($3, image_url)
     WHERE id = $4 
     RETURNING *`,
    [title, description, image_url, id]
  );
  return result.rows[0];
}

// Delete blog post
export async function deleteBlog(id) {
  const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}