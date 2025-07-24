# Ticket Management System - Frontend

Une application React.js moderne pour la gestion de tickets bancaires avec deux rôles : **Admin** et **Agent**.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Page de login avec redirection basée sur le rôle
- Gestion des sessions avec JWT
- Protection des routes par rôle

### 👨‍💼 Dashboard Admin
- **Statistiques** : Vue d'ensemble des performances
- **Gestion des agences** : CRUD complet des agences
- **Gestion des agents** : Liste et ajout d'agents
- **Paramètres** : Configuration du système

### 👤 Dashboard Agent
- **File d'attente** : Liste des tickets en temps réel
- **Appeler client** : Interface pour gérer les appels
- **Statistiques personnelles** : Performance individuelle

## 🛠 Tech Stack

- **Frontend** : React.js 18
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM
- **HTTP Client** : Axios
- **Maps** : Leaflet + React Leaflet
- **Real-time** : WebSocket
- **State Management** : React Context

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd ticket-management-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos configurations :
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_DEFAULT_LAT=14.6937
REACT_APP_DEFAULT_LNG=-17.4441
```

4. **Démarrer l'application**
```bash
npm start
```

L'application sera disponible sur `http://localhost:3000`

## 🏗 Structure du projet

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.js
│   │   └── Sidebar.js
│   └── common/
│       ├── ProtectedRoute.js
│       ├── LoadingSpinner.js
│       ├── ErrorBoundary.js
│       └── MapComponent.js
├── pages/
│   ├── auth/
│   │   └── Login.js
│   ├── admin/
│   │   ├── AdminDashboard.js
│   │   ├── StatisticsPage.js
│   │   ├── AgenciesPage.js
│   │   ├── AgentsPage.js
│   │   └── SettingsPage.js
│   └── agent/
│       ├── AgentDashboard.js
│       ├── QueuePage.js
│       ├── CallPage.js
│       └── StatsPage.js
├── contexts/
│   └── AuthContext.js
├── services/
│   ├── authService.js
│   ├── apiService.js
│   └── websocketService.js
└── utils/
    ├── geolocation.js
    └── notifications.js
```

## 🎨 Design System

### Couleurs
- **Primaire** : #3B82F6 (Bleu)
- **Secondaire** : #6B7280 (Gris)
- **Succès** : #10B981 (Vert)
- **Attention** : #F59E0B (Orange)

### Composants
- Interface responsive avec Tailwind CSS
- Icônes SVG intégrées
- Animations et transitions fluides

## 🔌 API Integration

### Endpoints utilisés
```javascript
// Authentification
POST /api/login

// Statistiques
GET /api/statistics

// Agences
GET /api/agencies
POST /api/agencies
PUT /api/agencies/:id
DELETE /api/agencies/:id

// Agents
GET /api/agents
POST /api/agents

// Tickets
GET /api/tickets/queue
POST /api/tickets/call-next

// Géolocalisation
POST /api/calculate-travel-time
```

## 🗺 Fonctionnalités de géolocalisation

- Détection automatique de la position utilisateur
- Calcul de distance vers les agences
- Estimation du temps de trajet
- Calcul du temps d'attente optimisé

### Algorithme de calcul du temps d'attente
```javascript
function calculateWaitTime(queueLength, travelTime) {
  const waitTimePerClient = 5; // 5 min par client
  const totalWaitTime = queueLength * waitTimePerClient;
  return Math.max(totalWaitTime - travelTime, 0);
}
```

## 🔄 Temps réel

- Mise à jour automatique de la file d'attente
- Notifications pour nouveaux tickets
- Statut des agents en temps réel
- WebSocket pour la communication bidirectionnelle

## 📱 Responsive Design

- Interface adaptée mobile/tablet/desktop
- Navigation optimisée pour tous les écrans
- Composants réutilisables

## 🧪 Comptes de test

### Admin
- **Email** : admin@test.com
- **Password** : password

### Agent
- **Email** : agent@test.com
- **Password** : password

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Variables d'environnement de production
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_WEBSOCKET_URL=wss://your-websocket-domain.com
```

## 🔧 Scripts disponibles

- `npm start` : Démarrage en mode développement
- `npm run build` : Build de production
- `npm test` : Exécution des tests
- `npm run eject` : Éjection de la configuration

## 📋 Fonctionnalités à venir

- [ ] Intégration Chart.js pour les graphiques
- [ ] Notifications push
- [ ] Mode sombre
- [ ] Export des données
- [ ] Rapports avancés
- [ ] Application mobile (React Native)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour optimiser la gestion des files d'attente bancaires**
