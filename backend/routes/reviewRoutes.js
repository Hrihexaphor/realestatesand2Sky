// routes/reviewRoutes.js

import express from "express";
import {
  insertReview,
  fetchPendingReviews,
  updateReviewApproval,
  fetchApprovedReviews,
} from "../services/reviewService.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

// POST: Add a new review (user)
router.post("/review", async (req, res) => {
  try {
    const review = await insertReview(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Submitted for approval",
        review_id: review.id,
      });
  } catch (err) {
    console.error("Add Review Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: Admin gets all pending reviews
router.get("/review/pending", async (req, res) => {
  try {
    const reviews = await fetchPendingReviews();
    res.json(reviews);
  } catch (err) {
    console.error("Get Pending Reviews Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PATCH: Admin approves or rejects a review
router.patch("/review/:id/approval", async (req, res) => {
  const { id } = req.params;
  const { is_approved } = req.body;

  if (typeof is_approved !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "is_approved must be a boolean" });
  }

  try {
    const updated = await updateReviewApproval(id, is_approved);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.json({
      success: true,
      message: `Review ${is_approved ? "approved" : "rejected"}`,
    });
  } catch (err) {
    console.error("Review Approval Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: Get approved reviews for a property
router.get("/review/approved/:propertyId", async (req, res) => {
  try {
    const reviews = await fetchApprovedReviews(req.params.propertyId);
    res.json(reviews);
  } catch (err) {
    console.error("Get Approved Reviews Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
