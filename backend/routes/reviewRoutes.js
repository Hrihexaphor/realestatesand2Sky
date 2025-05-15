import express from 'express';
import { insertReview,fetchPendingReviews,updateReviewApproval,fetchApprovedReviews } from '../services/reviewService.js';
const router = express.Router()
router.post('/review', async (req, res) => {
  try {
    const review = await insertReview(req.body);
    res.status(201).json({ success: true, message: 'Submitted for approval', review_id: review.id });
  } catch (err) {
    console.error('Add Review Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/reviews/pending - Admin gets pending reviews
router.get('/pendingreview', async (req, res) => {
  try {
    const reviews = await fetchPendingReviews();
    res.json(reviews);
  } catch (err) {
    console.error('Get Pending Reviews Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/reviews/:id/approve - Approve or reject review
router.put('/review/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { is_approved } = req.body;

  try {
    await updateReviewApproval(id, is_approved);
    res.json({ success: true, message: `Review ${is_approved ? 'approved' : 'rejected'}` });
  } catch (err) {
    console.error('Approve/Reject Review Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/reviews/approved/:propertyId - Get approved reviews
router.get('/approvedreview/:propertyId', async (req, res) => {
  try {
    const reviews = await fetchApprovedReviews(req.params.propertyId);
    res.json(reviews);
  } catch (err) {
    console.error('Get Approved Reviews Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
export default router;