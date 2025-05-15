import pool from '../config/db.js'


// Add a new review
export async function insertReview({ property_id, name, email, phone, rating, review }) {
  const result = await pool.query(
    `INSERT INTO property_reviews (property_id, name, email, phone, rating, review)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [property_id, name, email, phone, rating, review]
  );
  return result.rows[0];
}

// Get all pending reviews
export async function fetchPendingReviews() {
  const result = await pool.query(
    `SELECT r.*, p.title AS property_title
     FROM property_reviews r
     JOIN property p ON r.property_id = p.id
     WHERE r.is_approved = FALSE
     ORDER BY r.created_at DESC`
  );
  return result.rows;
}

// Approve or reject a review
export async function updateReviewApproval(id, is_approved) {
  await pool.query(
    `UPDATE property_reviews SET is_approved = $1 WHERE id = $2`,
    [is_approved, id]
  );
}

// Get approved reviews for a property
export async function fetchApprovedReviews(propertyId) {
  const result = await pool.query(
    `SELECT name, rating, review, created_at
     FROM property_reviews
     WHERE property_id = $1 AND is_approved = TRUE
     ORDER BY created_at DESC`,
    [propertyId]
  );
  return result.rows;
}