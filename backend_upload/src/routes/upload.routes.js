// src/routes/upload.routes.js

import express from "express";
import multer from "multer";
import { uploadDocument } from "../controllers/upload.controller.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadDocument);

export default router;