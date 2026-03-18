import argparse
import os
import logging
from pdf2image import convert_from_path
import pytesseract
import os

os.environ['TESSDATA_PREFIX'] = '/opt/homebrew/share/tessdata/'

# --- CONFIGURATION LOGGING ---
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger("OCR_Tool")

# --- CONFIGURATION WINDOWS (Optionnel) ---
# Décommente et adapte si tu es sur Windows :
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# POPPLER_PATH = r'C:\poppler-xx\bin' 

def run_ocr(pdf_path, output_file):
    if not os.path.exists(pdf_path):
        logger.error(f"Le fichier '{pdf_path}' n'existe pas.")
        return

    try:
        logger.info(f"Début du traitement : {pdf_path}")
        
        # Conversion PDF -> Images (DPI 300 est le standard pour l'OCR)
        # Note : Si le PDF est très lourd, utilise thread_count=2 pour accélérer
        pages = convert_from_path(pdf_path, 300)
        total_pages = len(pages)
        
        final_text = []

        for i, page in enumerate(pages):
            current_page = i + 1
            logger.info(f"OCR en cours : Page {current_page}/{total_pages}...")
            
            # --psm 3 : Analyse automatique de la mise en page
            custom_config = r'--oem 3 --psm 3'
            text = pytesseract.image_to_string(page, lang='fra', config=custom_config)
            
            # Construction de la page avec un en-tête clair
            page_content = f"--- PAGE {current_page} ---\n{text.strip()}"
            final_text.append(page_content)

        # Sauvegarde finale
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("\n\n".join(final_text))
        
        logger.info(f"Traitement terminé avec succès ! Fichier généré : {output_file}")

    except Exception as e:
        logger.error(f"Erreur lors de l'exécution de l'OCR : {str(e)}")

# if __name__ == "__main__":
#     # Configuration des arguments de la ligne de commande
#     parser = argparse.ArgumentParser(description="Outil OCR pour transformer un PDF en texte via Tesseract.")
    
#     # Argument obligatoire : le chemin du PDF
#     parser.add_argument("input", help="Chemin vers le fichier PDF à traiter")
    
#     args = parser.parse_args()

#     base_name = os.path.splitext(args.input)[0].split("/")[-1]
#     output_file = f"txt/{base_name}.txt"

#     # Lancement du traitement
#     run_ocr(args.input, output_file)