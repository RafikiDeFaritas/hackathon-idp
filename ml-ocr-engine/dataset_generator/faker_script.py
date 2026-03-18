from faker import Faker
from jinja2 import Environment, FileSystemLoader
import pdfkit
from pathlib import Path
import random
from datetime import timedelta, datetime
import copy

fake = Faker("fr_FR")

MODE_DEBUG = True

config = pdfkit.configuration(
    wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
)

BASE_DIR = Path(__file__).resolve().parent
DOSSIER_TEMPLATES = (BASE_DIR / "../templates").resolve()
DOSSIER_SORTIE = (BASE_DIR / "../../data-lake/raw").resolve()

DOSSIER_SORTIE.mkdir(parents=True, exist_ok=True)

env = Environment(loader=FileSystemLoader(str(DOSSIER_TEMPLATES)))

ENTREPRISE_BASE = {
    "nom": "BâtirPlus SARL",
    "siret": "81245692300018",
    "adresse": "12 Rue des Artisans, 69007 Lyon",
    "activite": "Travaux de maçonnerie générale et gros œuvre",
}

SERVICES_BTP = [
    "Construction mur porteur",
    "Travaux de maçonnerie pour extension",
    "Rénovation façade",
    "Dallage béton armé",
    "Création fondations",
    "Ouverture mur porteur",
]

PRODUITS_BTP = [
    "Parpaings creux B40",
    "Ciment Portland 25kg",
    "Treillis soudé ST25",
    "Location d'échafaudage",
    "Béton prêt à l'emploi",
]

TYPES_ASSURANCE = [
    "Responsabilité Civile Professionnelle",
    "Assurance Décennale",
    "Multirisque Professionnelle",
]


def generer_tva_depuis_siret(siret: str) -> str:
    siren = "".join(filter(str.isdigit, siret))[:9]
    cle = (12 + 3 * (int(siren) % 97)) % 97
    return f"FR{cle:02d}{siren}"


def generer_numero_document(prefixe: str, index: int) -> str:
    return f"{prefixe}-{datetime.now().year}-{index:04d}"


def montant_aleatoire(min_val: float, max_val: float) -> float:
    return round(random.uniform(min_val, max_val), 2)


def generer_client():
    return {
        "nom": fake.company(),
        "adresse": fake.street_address(),
        "code_postal": fake.postcode(),
        "ville": fake.city(),
    }


def generer_fournisseur():
    return {
        "nom": fake.company(),
        "adresse": fake.street_address(),
        "code_postal": fake.postcode(),
        "ville": fake.city(),
    }


def generer_lignes(total_ht: float, catalogue):
    nb_lignes = random.randint(2, 4)
    lignes = []
    reste = total_ht

    for i in range(nb_lignes):
        quantite = 1 if i == nb_lignes - 1 else random.randint(1, 5)
        description = random.choice(catalogue)

        if i == nb_lignes - 1:
            prix_unitaire = round(reste / quantite, 2)
        else:
            part = random.uniform(0.2, 0.5)
            prix_unitaire = round((total_ht * part) / quantite, 2)
            reste -= prix_unitaire * quantite

        total = round(prix_unitaire * quantite, 2)

        lignes.append({
            "description": description,
            "quantite": quantite,
            "prix_unitaire_ht": prix_unitaire,
            "total_ht": total,
        })

    total_corrige = round(sum(l["total_ht"] for l in lignes), 2)
    return lignes, total_corrige


def layout_aleatoire():
    return {
        "taille_titre": random.choice([22, 24, 26]),
        "couleur": random.choice(["#1f2937", "#1d4ed8", "#0f766e"]),
        "afficher_note": random.choice([True, False]),
    }


def injecter_anomalie(donnees, type_doc):

    if type_doc == "attestation":
        anomalies = ["siret_invalide", "tva_invalide", "date_incoherente"]
    else:
        anomalies = [
            "siret_invalide",
            "tva_invalide",
            "ttc_inferieur_ht",
            "date_incoherente",
            "quantite_zero"
        ]

    anomalie = random.choice(anomalies)

    if anomalie == "siret_invalide":
        donnees["entreprise"]["siret"] = "1234567890123"

    elif anomalie == "tva_invalide":
        donnees["entreprise"]["tva"] = "FR00000000000"

    elif anomalie == "ttc_inferieur_ht":
        if "montant_ht" in donnees:
            donnees["montant_ttc"] = round(donnees["montant_ht"] * 0.6, 2)

    elif anomalie == "date_incoherente":
        donnees["date_expiration"] = "01/01/2020"

    elif anomalie == "quantite_zero":
        if "lignes" in donnees and len(donnees["lignes"]) > 0:
            donnees["lignes"][0]["quantite"] = 0

    if MODE_DEBUG:
        print(f"[DEBUG] anomalie injectée ({type_doc})")

    return donnees


def generer_pdf(nom_template: str, donnees: dict, nom_fichier: str):
    template = env.get_template(nom_template)
    html = template.render(donnees)

    chemin_fichier = DOSSIER_SORTIE / nom_fichier

    pdfkit.from_string(
        html,
        str(chemin_fichier),
        configuration=config
    )

    print("PDF généré :", chemin_fichier)


def generer_devis_client(index: int):
    entreprise = copy.deepcopy(ENTREPRISE_BASE)
    entreprise["tva"] = generer_tva_depuis_siret(entreprise["siret"])

    date_emission = fake.date_between(start_date="-6m", end_date="today")
    date_expiration = date_emission + timedelta(days=30)

    montant_initial = montant_aleatoire(3000, 20000)
    lignes, montant_ht = generer_lignes(montant_initial, SERVICES_BTP)
    montant_ttc = round(montant_ht * 1.20, 2)

    data = {
        "layout": layout_aleatoire(),
        "entreprise": entreprise,
        "client": generer_client(),
        "numero": generer_numero_document("DEVCL", index + 1),
        "date_emission": date_emission.strftime("%d/%m/%Y"),
        "date_expiration": date_expiration.strftime("%d/%m/%Y"),
        "lignes": lignes,
        "montant_ht": montant_ht,
        "montant_ttc": montant_ttc,
        "label": "Devis client"
    }

    if random.random() < 0.2:
        data = injecter_anomalie(data, "devis_client")

    generer_pdf("devis_client.html", data, f"{data['numero']}.pdf")


def generer_devis_fournisseur(index: int):
    entreprise = copy.deepcopy(ENTREPRISE_BASE)
    entreprise["tva"] = generer_tva_depuis_siret(entreprise["siret"])

    date_emission = fake.date_between(start_date="-6m", end_date="today")
    date_expiration = date_emission + timedelta(days=15)

    montant_initial = montant_aleatoire(500, 10000)
    lignes, montant_ht = generer_lignes(montant_initial, PRODUITS_BTP)
    montant_ttc = round(montant_ht * 1.20, 2)

    data = {
        "layout": layout_aleatoire(),
        "entreprise": entreprise,
        "fournisseur": generer_fournisseur(),
        "numero": generer_numero_document("DEVFOU", index + 1),
        "date_emission": date_emission.strftime("%d/%m/%Y"),
        "date_expiration": date_expiration.strftime("%d/%m/%Y"),
        "lignes": lignes,
        "montant_ht": montant_ht,
        "montant_ttc": montant_ttc,
        "label": "Devis fournisseur"
    }

    if random.random() < 0.2:
        data = injecter_anomalie(data, "devis_fournisseur")

    generer_pdf("devis_fournisseur.html", data, f"{data['numero']}.pdf")


def generer_attestation(index: int):
    entreprise = copy.deepcopy(ENTREPRISE_BASE)
    entreprise["tva"] = generer_tva_depuis_siret(entreprise["siret"])

    data = {
        "layout": layout_aleatoire(),
        "entreprise": entreprise,
        "reference": generer_numero_document("ATTEST", index + 1),
        "type_assurance": random.choice(TYPES_ASSURANCE),
        "date_emission": fake.date_between("-6m", "today").strftime("%d/%m/%Y"),
        "date_expiration": fake.date_between("today", "+1y").strftime("%d/%m/%Y"),
        "label": "Attestation"
    }

    if random.random() < 0.2:
        data = injecter_anomalie(data, "attestation")

    generer_pdf("attestation_siret.html", data, f"{data['reference']}.pdf")


def generer_documents(nb_clients=50, nb_fournisseurs=50, nb_attestations=50):
    for i in range(nb_clients):
        generer_devis_client(i)

    for i in range(nb_fournisseurs):
        generer_devis_fournisseur(i)

    for i in range(nb_attestations):
        generer_attestation(i)


if __name__ == "__main__":
    generer_documents(50, 50, 25)