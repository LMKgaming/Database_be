import express from "express";
import RevenueController from "../controllers/revenueController.js";

const router = express.Router();

router.get("/:id/revenue-detail", RevenueController.revenueDetail);
router.get("/", RevenueController.movies);

export default router;