import re
import yaml
import argparse
import sys

def load_patterns(yaml_file):
    """Charge les regex depuis le fichier YAML."""
    try:
        with open(yaml_file, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        return config.get('extractions', {})
    except FileNotFoundError:
        print(f"Erreur : Le fichier de patterns '{yaml_file}' est introuvable.")
        sys.exit(1)

def extract_data(text, patterns):
    """Applique les regex sur le texte et retourne un dictionnaire de résultats."""
    results = {}
    
    for key, info in patterns.items():
        pattern = info.get('pattern')
        if not pattern:
            continue
            
        match = re.search(pattern, text)
        
        if match:
            # On prend le premier groupe capturé s'il existe, sinon le match complet
            results[key] = match.group(1) if match.groups() else match.group(0)
            results[key] = results[key].strip()
        else:
            results[key] = None
            
    return results

# def main():
#     # Configuration des arguments de la ligne de commande
#     parser = argparse.ArgumentParser(description="Extrait des données d'un fichier texte via des regex YAML.")
#     parser.add_argument("texte", help="Chemin vers le fichier texte à analyser")
#     parser.add_argument("patterns", help="Chemin vers le fichier YAML contenant les patterns")
    
#     args = parser.parse_args()

#     # 1. Lire le fichier texte
#     try:
#         with open(args.texte, 'r', encoding='utf-8') as f:
#             contenu_texte = f.read()
#     except FileNotFoundError:
#         print(f"Erreur : Le fichier texte '{args.texte}' est introuvable.")
#         return

#     # 2. Charger les patterns
#     regles = load_patterns(args.patterns)

#     # 3. Extraire les informations
#     donnees_extraites = extract_data(contenu_texte, regles)

#     # 4. Afficher le résultat
#     print(f"\n--- Résultats de l'extraction ({args.texte}) ---")
#     for k, v in donnees_extraites.items():
#         valeur = v if v else "Non trouvé"
#         print(f"{k.upper():<15}: {valeur}")

# if __name__ == "__main__":
#     main()