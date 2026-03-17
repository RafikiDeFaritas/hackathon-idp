import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  status: {
    type: String,
    default: "uploaded"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Document = mongoose.model("Document", documentSchema);

export default Document;