import fs from "fs";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import uploadRoutes from "./routes/upload.routes.js";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", uploadRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});