import os
import sys
import tempfile

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from ocr.tesseract_script import run_ocr
from ocr.extractor import load_patterns, extract_data

app = FastAPI(
    title="OCR API",
    description="Extraction de données depuis un PDF via OCR + regex",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PATTERNS_PATH = os.path.join(os.path.dirname(__file__), "..", "ocr", "patterns.yml")


@app.get("/")
def health_check():
    return {"status": "ok", "message": "OCR API is running"}


@app.post("/extract")
async def extract_from_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés.")

    with tempfile.TemporaryDirectory() as tmp_dir:
        pdf_path = os.path.join(tmp_dir, file.filename)
        with open(pdf_path, "wb") as f:
            content = await file.read()
            f.write(content)

        txt_path = os.path.join(tmp_dir, "output.txt")
        run_ocr(pdf_path, txt_path)

        if not os.path.exists(txt_path):
            raise HTTPException(status_code=500, detail="L'OCR a échoué, aucun texte extrait.")

        with open(txt_path, "r", encoding="utf-8") as f:
            texte = f.read()

        patterns = load_patterns(PATTERNS_PATH)
        donnees = extract_data(texte, patterns)

    return {
        "filename": file.filename,
        "extracted_data": donnees
    }
