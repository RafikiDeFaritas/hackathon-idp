import Document from "../models/document.model.js";
export const uploadDocument = async (req, res) => {

    try {
    const file = req.file;

    const document = await Document.create({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path
    });

    res.json({
      message: "File uploaded successfully",
      document
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};