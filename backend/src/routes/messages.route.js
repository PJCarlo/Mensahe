import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {getUserInSidebar, getMessages, sendMessage, messageStatus, deletedMessage} from "../controllers/messages.controller.js";

const router = express.Router();

router.get("/users", protectedRoute, getUserInSidebar);
router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);
router.patch("/status/:messageId", protectedRoute, messageStatus);
router.delete("/:id", protectedRoute, deletedMessage);

export default router;
