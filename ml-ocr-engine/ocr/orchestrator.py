import os
import argparse
import logging

# Import des fonctions depuis tes fichiers existants
# (Assure-toi que tesseract_script.py et extractor.py sont dans le même dossier)
from tesseract_script import run_ocr
from extractor import load_patterns, extract_data

# Configuration minimale du logging pour le main
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger("Orchestrator")

def main():
    parser = argparse.ArgumentParser(description="Pipeline complet : PDF -> OCR -> Extraction")
    parser.add_argument("pdf_input", help="Chemin vers le fichier PDF (ex: facture2025.pdf)")
    parser.add_argument("--patterns", help="Chemin vers le YAML des regex", default="patterns.yaml")
    
    args = parser.parse_args()

    # 1. Définition des chemins de fichiers
    # On récupère juste le nom du fichier sans l'extension)
    base_name = os.path.splitext(os.path.basename(args.pdf_input))[0]
    
    # Création du dossier 'txt' s'il n'existe pas
    if not os.path.exists("txt"):
        os.makedirs("txt")
    
    txt_output = f"txt/{base_name}.txt"

    # 2. ÉTAPE OCR (Tesseract)
    logger.info(f"--- ÉTAPE 1 : OCR de {args.pdf_input} ---")
    run_ocr(args.pdf_input, txt_output)

    # 3. ÉTAPE EXTRACTION (Regex)
    if os.path.exists(txt_output):
        logger.info(f"--- ÉTAPE 2 : Extraction depuis {txt_output} ---")
        
        # Lecture du texte généré
        with open(txt_output, 'r', encoding='utf-8') as f:
            contenu_texte = f.read()

        # Chargement des règles YAML
        regles = load_patterns(args.patterns)

        # Extraction
        donnees = extract_data(contenu_texte, regles)

        # Affichage des résultats
        print(f"\n{'='*40}")
        print(f"RÉSULTATS POUR : {base_name}")
        print(f"{'='*40}")
        for k, v in donnees.items():
            valeur = v if v else "Non trouvé"
            print(f"{k.upper():<15}: {valeur}")
        print(f"{'='*40}\n")
    else:
        logger.error("L'étape d'extraction a échoué car le fichier texte n'a pas été généré.")

if __name__ == "__main__":
    main()