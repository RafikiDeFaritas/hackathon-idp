from faker import Faker
import random
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import timedelta
from pathlib import Path

fake = Faker("fr_FR")

# Chemin absolu basé sur l'emplacement du script
BASE_DIR = Path(__file__).resolve().parent
output_dir = (BASE_DIR / "../../data-lake/raw").resolve()
output_dir.mkdir(parents=True, exist_ok=True)

print("Dossier de sortie :", output_dir)


def generate_siret():
    return "".join(str(random.randint(0, 9)) for _ in range(14))


def generate_vat():
    return "FR" + "".join(str(random.randint(0, 9)) for _ in range(11))


def generate_invoice_data():
    ht = round(random.uniform(100, 5000), 2)
    tva = 0.20
    ttc = round(ht * (1 + tva), 2)

    issue_date = fake.date_between(start_date="-2y", end_date="today")
    expiry_date = issue_date + timedelta(days=365)

    return {
        "company": fake.company(),
        "address": fake.address().replace("\n", ", "),
        "siret": generate_siret(),
        "vat": generate_vat(),
        "amount_ht": ht,
        "amount_ttc": ttc,
        "issue_date": issue_date.strftime("%d/%m/%Y"),
        "expiry_date": expiry_date.strftime("%d/%m/%Y"),
        "invoice_number": fake.uuid4()[:8],
    }


def generate_invoice_pdf(data, file_path):
    c = canvas.Canvas(str(file_path), pagesize=A4)
    y = 800

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "FACTURE")
    y -= 40

    c.setFont("Helvetica", 11)
    c.drawString(50, y, f"Société : {data['company']}")
    y -= 20

    c.drawString(50, y, f"Adresse : {data['address']}")
    y -= 20

    c.drawString(50, y, f"SIRET : {data['siret']}")
    y -= 20

    c.drawString(50, y, f"TVA : {data['vat']}")
    y -= 20

    c.drawString(50, y, f"Numéro facture : {data['invoice_number']}")
    y -= 20

    c.drawString(50, y, f"Date d'émission : {data['issue_date']}")
    y -= 20

    c.drawString(50, y, f"Date expiration attestation : {data['expiry_date']}")
    y -= 40

    c.drawString(50, y, f"Montant HT : {data['amount_ht']} €")
    y -= 20

    c.drawString(50, y, f"Montant TTC : {data['amount_ttc']} €")

    c.save()


def generate_dataset(n=10):
    for i in range(n):
        data = generate_invoice_data()
        file_path = output_dir / f"facture_{i}.pdf"
        generate_invoice_pdf(data, file_path)
        print("Facture générée :", file_path)


if __name__ == "__main__":
    generate_dataset(10)