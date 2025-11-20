# 🚀 Bilan de Compétences IA - Plateforme Full-Stack

Une plateforme moderne et intelligente pour réaliser des bilans de compétences professionnels avec analyse par IA et génération de rapports personnalisés.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Déploiement](#-déploiement)
- [Structure du projet](#-structure-du-projet)
- [Utilisation](#-utilisation)

## ✨ Fonctionnalités

### 🎯 Pour les utilisateurs

- **Authentification sécurisée** : Inscription, connexion, gestion de session avec Supabase Auth
- **Parcours d'évaluation structuré** : 6 étapes complètes pour analyser parcours, compétences, motivations, valeurs, objectifs et plan d'action
- **Analyse IA avancée** : Génération automatique de rapports détaillés avec GPT-4
- **Tableau de bord intuitif** : Suivi de progression, statistiques et historique
- **Rapports personnalisés** : Synthèse, recommandations, opportunités de carrière
- **Interface responsive** : Compatible mobile, tablette et desktop

### 👥 Pour les administrateurs

- **Gestion des utilisateurs** : Vue d'ensemble, statistiques par rôle
- **Multi-tenant** : Système de rôles (Admin, Consultant, Client)
- **Logs d'activité** : Traçabilité complète des actions
- **Gestion des évaluations** : Vue globale de toutes les évaluations

## 🛠 Technologies utilisées

### Frontend
- **Next.js 14** (App Router) - Framework React full-stack
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utility-first
- **Lucide React** - Icônes modernes

### Backend & Base de données
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + RLS)
- **OpenAI GPT-4** - Génération d'analyses IA
- **Next.js API Routes** - Endpoints API

## 🏗 Architecture

```
Client (Browser) → Next.js Server → Supabase (PostgreSQL) + OpenAI API
```

## 📦 Installation

### Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn
- Un compte Supabase (gratuit)
- Une clé API OpenAI

### Étapes

```bash
# 1. Cloner le repository
git clone <repository-url>
cd bilan-20112025

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés

# 4. Lancer le serveur
npm run dev
```

## ⚙️ Configuration

### 1. Supabase Setup

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Dans SQL Editor, exécuter le fichier `supabase-schema.sql`
3. Récupérer URL et clé dans Settings > API

### 2. OpenAI Setup

1. Créer un compte sur [platform.openai.com](https://platform.openai.com)
2. Générer une API key

### 3. Variables d'environnement (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
OPENAI_API_KEY=sk-votre-cle-openai
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Déploiement

### Vercel (recommandé)

```bash
npm install -g vercel
vercel
```

Ou via l'interface web de Vercel. Pensez à ajouter les variables d'environnement.

## 📁 Structure du projet

```
app/
├── api/              # API Routes
├── dashboard/        # Pages protégées
├── login/            # Authentification
└── page.tsx          # Landing page

components/
├── ui/               # Composants UI
└── dashboard/        # Composants dashboard

lib/
├── supabase/         # Clients Supabase
└── utils.ts          # Utilitaires
```

## 📖 Utilisation

1. **Créer un compte** sur `/register`
2. **Se connecter** sur `/login`
3. **Créer une évaluation** depuis le dashboard
4. **Compléter les 6 étapes** du questionnaire
5. **Générer l'analyse IA** automatiquement
6. **Consulter les rapports** dans la section dédiée

## 🔐 Sécurité

- Authentification JWT via Supabase
- Row Level Security (RLS) sur toutes les tables
- Middleware de protection des routes
- Variables d'environnement sécurisées

## 👨‍💻 Auteur

**Mikail Lekesiz**
- GitHub: [@lekesiz](https://github.com/lekesiz)

---

⭐ Star ce projet si vous l'aimez !
