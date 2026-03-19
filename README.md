# Hackathon

Ce projet propose une solution complete d'Intelligence Document Processing (IDP). Elle met en place tous les services necessaires pour la plateforme automatisee de traitement de documents administratifs.

## Application en ligne

L'application a ete deployee et est accessible a l'adresse suivante :
**[https://hackathon26.lulu960.xyz](https://hackathon26.lulu960.xyz)**

## Stack Technique

| Domaine | Technologies |
|---|---|
| **Frontend** | React, API Fetch, CSS Vanilla |
| **Backend API** | Node.js, Express, TypeScript, Mongoose, JWT, Multer |
| **OCR Engine** | Python, FastAPI, Tesseract OCR |
| **Base de donnees** | MongoDB |
| **DevOps / Infra** | Docker, Docker Compose |

## Architecture des dossiers

```
/hackathon-idp
├── /data-lake               # Volume local pour le stockage des fichiers partages
│   ├── /raw                 # Documents originaux
│   ├── /clean               # Texte brut (txt) extrait de l'OCR
│   └── /curated             # Donnees structurees (json) validees
├── /airflow                 # Orchestration des data pipelines (Airflow)
├── /ml-ocr-engine           # API Backend OCR en Python (FastAPI + Tesseract)
├── /app-crm                 # Application CRM principale
│   ├── /frontend            # React App (Interface Utilisateur)
│   └── /backend             # Node.js/Express App (API principale)
└── docker-compose.yml       # Fichier d'orchestration global
```

## Comment lancer le projet complet

Assurez-vous d'avoir Docker et Docker Compose installes sur votre machine.

1. Allez a la racine du projet :
```bash
cd "Hackathon 2026/hackathon-idp"
```

2. Lancez la construction et le demarrage des conteneurs en tache de fond :
```bash
docker-compose up --build -d
```

## Architecture des ports et acces locaux

Les services suivants seront exposes apres le lancement des conteneurs via Docker :

### Frontends
- **App CRM (React)** : http://localhost:3010

### Backends / APIs
- **App CRM Backend (Node/Express)** : http://localhost:4000
- **ML OCR Engine (FastAPI)** : http://localhost:8000

Une fois les tests valides, arretez les services avec :
```bash
docker-compose down
```

---

## Architecture Technique Detaillee

```mermaid
---
config:
  layout: dagre
  theme: default
  look: classic
---
flowchart TB
 subgraph CLIENT["Couche Client — React (port 3010)"]
    direction LR
        P1["Login / Register"]
        P2["Upload Document"]
        P3["Mes Documents"]
        P4["Gestion Utilisateurs\n(Admin)"]
        P5["Tableau de Bord\n(Admin)"]
        API_FE["api/\ndocument.ts · user.ts"]
  end
 subgraph ROUTES["Routes Express"]
        R1["/api/users\nPOST /login · /register\nGET · PUT · DELETE"]
        R2["/api/documents\nPOST /upload\nGET / · /user/:id"]
  end
 subgraph MW["Middleware"]
        AUTH["authenticate()\nJWT verify"]
        MULTER["multer\nfile upload"]
  end
 subgraph CTRL["Controleurs"]
        UC["user.controller.ts\nloginUser · createUser\ngetAllUsers · updateUser\ndeleteUser"]
        DC["document.controller.ts\nuploadDocument\ngetDocuments\ngetDocsByUserId"]
  end
 subgraph MODELS["Modeles Mongoose"]
        UM["User\nname · email\nrole · mdpHash"]
        DM["Document\nownerId · filename\npath · status\nextractedData"]
  end
 subgraph BACKEND["Backend API — Node.js / Express (port 4000)"]
    direction TB
        ROUTES
        MW
        CTRL
        MODELS
  end
 subgraph OCR_SVC["OCR Engine — FastAPI / Python (port 8000)"]
    direction LR
        EP["POST /extract\n(FastAPI)"]
        TESS["Tesseract\nOCR"]
        EXT["Extractor\nRegex + patterns.yml"]
  end
 subgraph LAKE["Data Lake — Volume Docker partage"]
    direction LR
        RAW["/raw\nPDF originaux"]
        CLEAN["/clean\nTexte extrait (.txt)"]
        CURATED["/curated\nDonnees structurees (.json)"]
  end
    P1 --> API_FE
    P2 --> API_FE
    P3 --> API_FE
    P4 --> API_FE
    P5 --> API_FE
    R1 --> AUTH
    AUTH --> UC & MULTER
    UC --> UM
    R2 --> AUTH
    MULTER --> DC
    DC --> DM
    EP --> TESS
    TESS --> EXT
    RAW --> CLEAN
    CLEAN --> CURATED
    API_FE -- HTTP REST\nJWT Bearer --> R1
    API_FE -- "HTTP REST\nmultipart/form-data" --> R2
    UM -- Mongoose\nODM --> DB[("MongoDB\nAtlas / Local")]
    DM -- Mongoose\nODM --> DB
    DC -- POST /extract\nHTTP interne --> EP
    DC -- "fs.copyFileSync\n-> /raw" --> RAW
    EXT -- "-> /clean\n-> /curated" --> CLEAN
    DC -- fetch SIRET\nvalidation --> SIRET["API SIRET\nrecherche-entreprises\n.api.gouv.fr"]
```

### Description des composants

#### Frontend — React (port 3010)

| Fichier | Role |
|---|---|
| `Login.jsx` / `Register.jsx` | Authentification utilisateur |
| `Upload.jsx` | Depot de fichier PDF |
| `MyDocuments.jsx` | Liste + filtre des documents |
| `DashboardAdmin.jsx` | Stats (nb users, nb docs) |
| `UsersManagement.jsx` | CRUD utilisateurs (Admin) |
| `api/document.ts` · `api/user.ts` | Appels REST vers le backend |

#### Backend — Node.js / Express + TypeScript (port 4000)

| Composant | Role |
|---|---|
| `authenticate()` middleware | Verifie le JWT sur toutes les routes protegees |
| `multer` middleware | Reception du fichier PDF en `multipart/form-data` |
| `user.controller.ts` | Login (bcrypt + JWT), CRUD utilisateurs |
| `document.controller.ts` | Upload -> appel OCR -> validation SIRET -> save MongoDB |
| `User` model | Schema Mongoose : role `USER` ou `ADMIN` |
| `Document` model | Schema Mongoose : status (`processing` / `done` / `ocr_failed`) |

#### OCR Engine — FastAPI / Python (port 8000)

| Composant | Role |
|---|---|
| `POST /extract` | Recoit le PDF, declenche le pipeline OCR |
| `tesseract_script.py` | Conversion PDF -> texte via Tesseract OCR |
| `extractor.py` | Extraction des champs avec regex |
| Resultats | Sauvegarde `.txt` dans `/clean` et `.json` dans `/curated` |

#### Data Lake — Volume Docker partage

| Zone | Contenu |
|---|---|
| `/raw` | PDF originaux uploades par les utilisateurs |
| `/clean` | Texte brut extrait par Tesseract |
| `/curated` | JSON structure avec les champs extraits |

#### Securite et Deploiement

- **JWT** signe avec `JWT_SECRET` (env var), expiration 24h
- **bcrypt** pour le hashage des mots de passe
- Route `GET /documents/user/:id` reservee aux **ADMIN** uniquement
- Services Docker : Frontend (`node:18-alpine`), Backend (`node:20-alpine`), OCR API (Python custom)

---

## Diagramme des Cas d'Utilisation

```mermaid
flowchart LR
    Adm["Administrateur"]
    U["Utilisateur"]

    subgraph SYS["Systeme IDP"]
        direction LR

        subgraph AUTH[" "]
            CU1(["S'inscrire"])
            CU2(["Se connecter"])
        end

        subgraph MAIN[" "]
            CU3(["Uploader un document"])
            CU4(["Consulter mes documents"])
            CU5(["Gerer les utilisateurs"])
            CU6(["Tableau de bord Admin"])
        end

        CU3 -. "«include»" .-> CU2
        CU4 -. "«include»" .-> CU2
        CU5 -. "«include»" .-> CU2
        CU6 -. "«include»" .-> CU2
    end

    OCR["OCR API"]
    SIR["API SIRET\n(gouv.fr)"]
    MDB["MongoDB"]

    Adm -. "herite" .-> U
    U --> CU1
    U --> CU2
    U --> CU3
    U --> CU4
    Adm --> CU5
    Adm --> CU6

    CU3 --> OCR
    CU3 --> SIR
    CU1 --> MDB
    CU2 --> MDB
    CU3 --> MDB
    CU4 --> MDB
    CU5 --> MDB
    CU6 --> MDB

    style U    fill:#d5f5e3,stroke:#27ae60,color:#1e8449
    style Adm  fill:#d6eaf8,stroke:#2980b9,color:#1a5276
    style OCR  fill:#fdebd0,stroke:#e67e22,color:#784212
    style SIR  fill:#fdebd0,stroke:#e67e22,color:#784212
    style MDB  fill:#f4ecf7,stroke:#8e44ad,color:#6c3483
    style AUTH fill:transparent,stroke:transparent
    style MAIN fill:transparent,stroke:transparent
```

---

## Modele Conceptuel de Donnees (MCD)

```mermaid
---
config:
  layout: elk
---
erDiagram
	direction LR
	USER {
		ObjectId _id PK "Identifiant unique"  
		string name  "Nom complet"  
		string email  "Email (unique)"  
		string role  "USER ou ADMIN"  
		string mdpHash  "Mot de passe hache (bcrypt)"  
		date createdAt  "Date de creation"  
		date updatedAt  "Date de mise a jour"  
	}

	DOCUMENT {
		ObjectId _id PK "Identifiant unique"  
		ObjectId ownerId FK "Ref vers User"  
		string originalName  "Nom original du fichier"  
		string filename  "Nom stocke sur disque"  
		string path  "Chemin fichier sur le Data Lake"  
		string status  "uploaded / processing / done / ocr_failed"  
		json extractedData  "Donnees extraites par OCR (siret, nom...)"  
		date createdAt  "Date d'upload"  
	}

	USER||--o{DOCUMENT:"possede"
```

### Description des entites

#### USER

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `_id` | ObjectId | PK, auto | Identifiant MongoDB |
| `name` | String | required | Nom complet de l'utilisateur |
| `email` | String | required, unique | Adresse email (cle de login) |
| `role` | String | enum | `USER` (defaut) ou `ADMIN` |
| `mdpHash` | String | required | Mot de passe hache via bcrypt |
| `createdAt` / `updatedAt` | Date | auto | Genere par `timestamps: true` |

#### DOCUMENT

| Attribut | Type | Contrainte | Description |
|---|---|---|---|
| `_id` | ObjectId | PK, auto | Identifiant MongoDB |
| `ownerId` | ObjectId | FK -> USER | Proprietaire du document |
| `originalName` | String | required | Nom original du fichier uploade |
| `filename` | String | required | Nom genere pour le stockage |
| `path` | String | required | Chemin absolu sur le Data Lake |
| `status` | String | default: "uploaded" | Etat du pipeline OCR |
| `extractedData` | Mixed (JSON) | nullable | Champs extraits : siret, nom, adresse... |
| `createdAt` | Date | auto | Date d'upload |

#### Valeurs possibles du statut (DOCUMENT)

| Statut | Signification |
|---|---|
| `uploaded` | Fichier recu, traitement en attente |
| `processing` | Pipeline OCR en cours |
| `done` | Extraction reussie, donnees disponibles |
| `ocr_failed` | Echec de l'extraction OCR |
