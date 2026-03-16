from faker import Faker
from jinja2 import Environment, FileSystemLoader
import pdfkit
from pathlib import Path
import random
from datetime import timedelta

fake = Faker("fr_FR")

config = pdfkit.configuration(
    wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
)

BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = (BASE_DIR / "../templates").resolve()
OUTPUT_DIR = (BASE_DIR / "../../data-lake/raw").resolve()

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))

company = {
    "name": "BâtirPlus SARL",
    "siret": "812 456 923 00018",
    "address": "12 Rue des Artisans, 69007 Lyon",
    "activity": "Travaux de maçonnerie générale et gros œuvre",
    "vat": "FR12812456923"
}


def render(template_name, data, filename):
    template = env.get_template(template_name)
    html = template.render(data)

    output_file = OUTPUT_DIR / filename

    pdfkit.from_string(
        html,
        str(output_file),
        configuration=config
    )

    print("PDF généré :", output_file)


def generate_quote_number(prefix):
    return f"{prefix}-{random.randint(1000, 9999)}"


def random_amount(min_value, max_value):
    return round(random.uniform(min_value, max_value), 2)


def generate_devis_client(index):
    issue = fake.date_between(start_date="-6m", end_date="today")
    expiry = issue + timedelta(days=30)

    amount_ht = random_amount(1500, 25000)
    amount_ttc = round(amount_ht * 1.20, 2)

    data = {
        "company": company,
        "client_name": fake.company(),
        "client_address": fake.address().replace("\n", ", "),
        "quote_number": generate_quote_number("DEVCL"),
        "issue_date": issue.strftime("%d/%m/%Y"),
        "expiry_date": expiry.strftime("%d/%m/%Y"),
        "service": random.choice([
            "Construction mur porteur",
            "Travaux de maçonnerie pour extension",
            "Rénovation façade",
            "Dallage béton armé",
            "Création fondations"
        ]),
        "amount_ht": amount_ht,
        "amount_ttc": amount_ttc
    }

    render("devis_client.html", data, f"devis_client_{index}.pdf")


def generate_devis_fournisseur(index):
    issue = fake.date_between(start_date="-6m", end_date="today")
    expiry = issue + timedelta(days=15)

    amount_ht = random_amount(300, 12000)
    amount_ttc = round(amount_ht * 1.20, 2)

    data = {
        "company": company,
        "supplier_name": fake.company(),
        "supplier_address": fake.address().replace("\n", ", "),
        "quote_number": generate_quote_number("DEVFOU"),
        "issue_date": issue.strftime("%d/%m/%Y"),
        "expiry_date": expiry.strftime("%d/%m/%Y"),
        "product": random.choice([
            "Parpaings creux",
            "Ciment Portland",
            "Treillis soudé",
            "Location d'échafaudage",
            "Béton prêt à l'emploi"
        ]),
        "amount_ht": amount_ht,
        "amount_ttc": amount_ttc
    }

    render("devis_fournisseur.html", data, f"devis_fournisseur_{index}.pdf")


def generate_attestation_siret(index):
    issue = fake.date_between(start_date="-6m", end_date="today")
    expiry = issue + timedelta(days=365)

    data = {
        "company": company,
        "reference": f"ATTEST-{random.randint(10000, 99999)}",
        "issue_date": issue.strftime("%d/%m/%Y"),
        "expiry_date": expiry.strftime("%d/%m/%Y")
    }

    render("attestation_siret.html", data, f"attestation_siret_{index}.pdf")


def generate_documents(n_client=5, n_supplier=5, n_attestation=3):
    for i in range(n_client):
        generate_devis_client(i)

    for i in range(n_supplier):
        generate_devis_fournisseur(i)

    for i in range(n_attestation):
        generate_attestation_siret(i)


if __name__ == "__main__":
    generate_documents()