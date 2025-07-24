# Système de Gestion de Tickets IBAM

Un système complet de gestion de tickets pour les services publics (ONEA, SONABEL, BANQUE) avec interface web moderne et API REST.

## 🚀 Fonctionnalités

### Pour les Clients
- **Création de tickets** avec géolocalisation
- **Suivi en temps réel** de la position dans la file d'attente
- **Notifications** de progression
- **Calcul du temps de trajet** vers l'agence

### Pour les Agents
- **Tableau de bord** avec statistiques personnelles
- **Gestion de la file d'attente** en temps réel
- **Appel du prochain ticket**
- **Gestion des tickets** (traitement, annulation)
- **Profil utilisateur** modifiable

### Pour les Administrateurs
- **Dashboard complet** avec statistiques globales
- **Gestion des agents** (création, modification, suppression)
- **Gestion des agences**
- **Paramètres système**
- **Rapports et analytics**

## 🛠️ Technologies Utilisées

### Backend (Laravel)
- **Laravel 11** - Framework PHP
- **MySQL** - Base de données
- **Laravel Sanctum** - Authentification API
- **Eloquent ORM** - Gestion des données

### Frontend (React)
- **React 18** - Interface utilisateur
- **Tailwind CSS** - Styling moderne
- **React Router** - Navigation
- **Axios** - Communication API
- **Leaflet** - Cartes et géolocalisation
- **WebSocket** - Mises à jour temps réel

## 📁 Structure du Projet

```
tuteuré/
├── ticket-ibam-back/          # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/  # Contrôleurs API
│   │   ├── Models/           # Modèles Eloquent
│   │   └── Http/Requests/    # Validation des requêtes
│   ├── database/
│   │   ├── migrations/       # Migrations de base de données
│   │   └── seeders/         # Données de test
│   └── routes/api.php       # Routes API
│
└── React/ticket-management-frontend/  # Frontend React
    ├── src/
    │   ├── components/      # Composants réutilisables
    │   ├── pages/          # Pages de l'application
    │   ├── services/       # Services API
    │   ├── contexts/       # Contextes React
    │   └── utils/          # Utilitaires
    └── public/             # Fichiers statiques
```

## 🚀 Installation et Configuration

### Prérequis
- **PHP 8.1+**
- **Composer**
- **Node.js 16+**
- **MySQL 8.0+**

### Backend (Laravel)

1. **Installation des dépendances**
```bash
cd ticket-ibam-back
composer install
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configuration de la base de données**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ticket_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

4. **Migration et données de test**
```bash
php artisan migrate
php artisan db:seed
```

5. **Lancement du serveur**
```bash
php artisan serve
```

### Frontend (React)

1. **Installation des dépendances**
```bash
cd React/ticket-management-frontend
npm install
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
```

3. **Configuration de l'API**
```env
REACT_APP_API_URL=http://localhost:8000/api
```

4. **Lancement de l'application**
```bash
npm start
```

## 👥 Comptes de Test

### Administrateur
- **Email**: admin@test.com
- **Mot de passe**: password

### Agent
- **Email**: agent@test.com
- **Mot de passe**: password

## 🔧 API Endpoints

### Authentification
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription
- `POST /api/logout` - Déconnexion

### Gestion des Tickets
- `GET /api/tickets/queue` - File d'attente
- `POST /api/tickets` - Créer un ticket
- `POST /api/tickets/call-next` - Appeler le prochain ticket
- `POST /api/tickets/{id}/cancel` - Annuler un ticket

### Gestion des Agents
- `GET /api/agents` - Liste des agents
- `POST /api/agents` - Créer un agent
- `PUT /api/agents/{id}` - Modifier un agent
- `DELETE /api/agents/{id}` - Supprimer un agent

### Profil Utilisateur
- `GET /api/user/profile` - Récupérer le profil
- `PUT /api/user/profile` - Modifier le profil

## 🌟 Fonctionnalités Avancées

- **Géolocalisation** - Calcul automatique du temps de trajet
- **Temps réel** - Mises à jour WebSocket
- **Responsive Design** - Compatible mobile et desktop
- **Validation robuste** - Frontend et backend
- **Gestion d'erreurs** - Messages utilisateur clairs
- **Sécurité** - Authentification par tokens

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

**Développeur**: KOLOGO Alassane
**Email**: Alassane.kologo44@gmail.com

---

⭐ N'hésitez pas à donner une étoile si ce projet vous a été utile !
