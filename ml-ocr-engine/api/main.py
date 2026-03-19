import os
import sys
import json
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
DATA_LAKE_CLEAN   = os.environ.get("DATA_LAKE_CLEAN",   "/data-lake/clean")
DATA_LAKE_CURATED = os.environ.get("DATA_LAKE_CURATED", "/data-lake/curated")

os.makedirs(DATA_LAKE_CLEAN,   exist_ok=True)
os.makedirs(DATA_LAKE_CURATED, exist_ok=True)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "OCR API is running"}


@app.post("/extract")
async def extract_from_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés.")

    base_name = os.path.splitext(file.filename)[0]

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


        with open(os.path.join(DATA_LAKE_CLEAN, f"{base_name}.txt"), "w", encoding="utf-8") as f:
            f.write(texte)

        patterns = load_patterns(PATTERNS_PATH)
        donnees = extract_data(texte, patterns)


        with open(os.path.join(DATA_LAKE_CURATED, f"{base_name}.json"), "w", encoding="utf-8") as f:
            json.dump(donnees, f, ensure_ascii=False, indent=2)

    return {
        "filename": file.filename,
        "extracted_data": donnees
    }
