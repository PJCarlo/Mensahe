import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { shareLocation, stopSharing, getUserLocation } from "../controllers/location.controller.js";

const router = express.Router();

router.post("/share", protectedRoute, shareLocation);
router.post("/stop", protectedRoute, stopSharing);
router.get("/:userId", protectedRoute, getUserLocation);

export default router;
