import pool from '../config/db.js'

// add blog post
export async function addBlog({ title, description, image_url }) {
    const result = await pool.query(
      'INSERT INTO blogs (title, image_url, description) VALUES ($1, $2, $3) RETURNING *',
      [title, image_url, description]
    );
    return result.rows[0];
  }
//  view all blog posts
  export async function getAllBlogs() {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    return result.rows;
  }

