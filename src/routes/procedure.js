import express from "express";
import ProcedureController from "../controllers/ProcedureController.js";

const router = express.Router();

router.get("/count-booking", ProcedureController.countBooking);

export default router;