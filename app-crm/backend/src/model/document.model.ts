import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IDocument extends MongooseDocument {
  ownerId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  path: string;
  status: string;
  createdAt: Date;
}

const documentSchema: Schema = new Schema({
  ownerId: {type: Schema.Types.ObjectId,ref: "User",required: true},
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  status: {
    type: String,
    default: "uploaded"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DocumentModel = mongoose.model<IDocument>("Document", documentSchema);

export default DocumentModel;
