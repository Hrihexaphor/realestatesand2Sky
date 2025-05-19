import pool from '../config/db.js'

// Add blog post
export async function addBlog({ title, description, image_url, meta_title, meta_description, blog_category_id,youtube_link }) {
  const result = await pool.query(
    `INSERT INTO blogs 
     (title, image_url, description, meta_title, meta_description, blog_category_id,youtube_link) 
     VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *`,
    [title, image_url, description, meta_title, meta_description, blog_category_id,youtube_link]
  );
  return result.rows[0];
}


// View all blog posts
export async function getAllBlogs() {
  const result = await pool.query(
    `SELECT b.*, 
            c.name AS category_name, 
            c.slug AS category_slug
     FROM blogs b
     LEFT JOIN blog_category c ON b.blog_category_id = c.id
     ORDER BY b.created_at DESC`
  );
  return result.rows;
}


// Update blog post
    export async function updateBlog(id, {
      title,
      description,
      image_url,
      meta_title,
      meta_description,
      blog_category_id
    }) {
      const result = await pool.query(
        `UPDATE blogs 
        SET title = COALESCE($1, title), 
            description = COALESCE($2, description),
            image_url = COALESCE($3, image_url),
            meta_title = COALESCE($4, meta_title),
            meta_description = COALESCE($5, meta_description),
            blog_category_id = COALESCE($6, blog_category_id)
        WHERE id = $7 
        RETURNING *`,
        [title, description, image_url, meta_title, meta_description, blog_category_id, id]
      );
      return result.rows[0];
    }


// Delete blog post
export async function deleteBlog(id) {
  const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

// blog category services
// Get all categories
export async function getAllBlogCategories() {
  try {
    const result = await pool.query('SELECT * FROM blog_category ORDER BY name ASC');
    return result.rows;
  } catch (error) {
    console.error('Error getting blog categories:', error);
    throw new Error(`Failed to get blog categories: ${error.message}`);
  }
}

// Get a specific category by ID
export async function getBlogCategoryById(id) {
  try {
    const result = await pool.query('SELECT * FROM blog_category WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting blog category by ID:', error);
    throw new Error(`Failed to get blog category: ${error.message}`);
  }
}

// Create a new blog category
export async function createBlogCategory(name, slug) {
  try {
    const result = await pool.query(
      'INSERT INTO blog_category (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating blog category:', error);
    throw new Error(`Failed to create blog category: ${error.message}`);
  }
}

// Update an existing blog category
export async function updateBlogCategory(id, name, slug) {
  try {
    const result = await pool.query(
      'UPDATE blog_category SET name = $1, slug = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, slug, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating blog category:', error);
    throw new Error(`Failed to update blog category: ${error.message}`);
  }
}

// Delete a blog category
export async function deleteBlogCategory(id) {
  try {
    const result = await pool.query('DELETE FROM blog_category WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting blog category:', error);
    throw new Error(`Failed to delete blog category: ${error.message}`);
  }
}

export async function getBlogCategoryCounts() {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.slug,
        COUNT(b.id) AS blog_count
      FROM blog_category c
      LEFT JOIN blogs b ON b.blog_category_id = c.id
      GROUP BY c.id, c.name, c.slug
      ORDER BY c.name ASC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error getting blog category counts:', error);
    throw new Error(`Failed to get blog category counts: ${error.message}`);
  }
}