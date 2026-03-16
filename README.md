# Hackathon IDP (Intelligent Document Processing) Architecture

Cette architecture est prête pour le hackathon. Elle met en place tous les services nécessaires pour la plateforme automatisée de traitement de documents administratifs.

## 📁 Architecture des dossiers

```
/hackathon-idp
├── /data-lake               # Stockage des fichiers
│   ├── /raw                 # Documents bruts
│   ├── /clean               # Données nettoyées de l'OCR
│   └── /curated             # Données validées
├── /airflow                 # Orchestration des pipelines
├── /ml-ocr-engine           # Backend Python
├── /app-crm                 # Application métier 1 (Stack MERN)
├── /app-compliance          # Application métier 2 (Stack MERN)
└── docker-compose.yml       # Fichier d'orchestration global
```

## 🚀 Comment lancer le projet complet

Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.

1. Allez à la racine du projet :
```bash
cd hackathon-idp
```

2. Lancez la construction et le démarrage des conteneurs en tâche de fond :
```bash
docker-compose up --build -d
```

## 🌐 Architecture des ports et accès

### Frontends
- **App CRM (React)** : http://localhost:3000
- **App Compliance (React)** : http://localhost:3001

### Backends / APIs
- **ML OCR Engine (FastAPI)** : http://localhost:8000
- **App CRM Backend (Node/Express)** : http://localhost:5000
- **App Compliance Backend (Node/Express)** : http://localhost:5001

### Outils Data & Orchestration
- **Apache Airflow UI** : http://localhost:8080
- **MinIO Console (S3 Datalake UI)** : http://localhost:9001 (User: `admin` / Password: `password123`)
- **MinIO API** : http://localhost:9000

## 🛑 Arrêter les conteneurs

Pour arrêter les services :
```bash
docker-compose down
```
