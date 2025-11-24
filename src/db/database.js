import Dexie from 'dexie';

// Créer une instance de la base de données
export const db = new Dexie('ProjetMetrDatabase');

// Définir le schéma de la base de données
db.version(1).stores({
  utilisateur: '++id_utilisateur, nom, prenom, email, mot_de_passe, role, profession, entreprise',
  projets: '++id, nom, client, status, date, membre, fichier, referenceInterne, typologieProjet, adresseProjet, dateLivraison, dateCreation'
});

console.log('Database configured successfully!');

// Fonctions utilitaires pour la gestion des utilisateurs
export const userService = {
  // Créer un nouvel utilisateur
  async createUser(userData) {
    try {
      const { nom, prenom, email, mot_de_passe, role = 'utilisateur', profession = '', entreprise = '' } = userData;
      
      // Vérifier si l'email existe déjà
      const existingUser = await db.utilisateur.where('email').equals(email).first();
      if (existingUser) {
        throw new Error('Un compte existe déjà avec cet email');
      }
      
      // Créer l'utilisateur
      const userId = await db.utilisateur.add({
        nom,
        prenom,
        email,
        mot_de_passe,
        role,
        profession,
        entreprise
      });
      
      return userId;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },
  
  // Authentifier un utilisateur
  async authenticateUser(email, password) {
    try {
      const user = await db.utilisateur
        .where({ email, mot_de_passe: password })
        .first();
      
      return user || null;
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
      throw error;
    }
  },
  
  // Récupérer un utilisateur par email
  async getUserByEmail(email) {
    try {
      return await db.utilisateur.where('email').equals(email).first();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },
  
  // Récupérer tous les utilisateurs
  async getAllUsers() {
    try {
      return await db.utilisateur.toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Mettre à jour le mot de passe d'un utilisateur
  async updateUserPassword(userId, newPassword) {
    try {
      await db.utilisateur.update(userId, { mot_de_passe: newPassword });
      console.log('Mot de passe mis à jour pour l\'utilisateur:', userId);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      throw error;
    }
  },

  // Mettre à jour les données d'un utilisateur
  async updateUser(userId, updates) {
    try {
      await db.utilisateur.update(userId, updates);
      console.log('Utilisateur mis à jour:', userId);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }
};

// Fonctions utilitaires pour la gestion des projets
export const projectService = {
  // Créer un nouveau projet
  async createProject(projectData) {
    try {
      const {
        nom,
        client,
        referenceInterne,
        typologieProjet,
        adresseProjet,
        dateLivraison,
        status = 'En cours',
        membre = [],
        fichier = []
      } = projectData;
      
      const projectId = await db.projets.add({
        nom,
        client,
        referenceInterne,
        typologieProjet,
        adresseProjet,
        dateLivraison,
        status,
        membre,
        fichier,
        date: new Date().toISOString().split('T')[0], // Date au format YYYY-MM-DD
        dateCreation: new Date().toISOString()
      });
      
      console.log('Projet créé avec l\'ID:', projectId);
      return projectId;
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw error;
    }
  },
  
  // Récupérer tous les projets
  async getAllProjects() {
    try {
      return await db.projets.orderBy('dateCreation').reverse().toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
  },
  
  // Récupérer un projet par ID
  async getProjectById(id) {
    try {
      return await db.projets.get(id);
    } catch (error) {
      console.error('Erreur lors de la récupération du projet:', error);
      throw error;
    }
  },
  
  // Mettre à jour un projet
  async updateProject(id, updates) {
    try {
      await db.projets.update(id, updates);
      console.log('Projet mis à jour:', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      throw error;
    }
  },
  
  // Supprimer un projet
  async deleteProject(id) {
    try {
      await db.projets.delete(id);
      console.log('Projet supprimé:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      throw error;
    }
  },
  
  // Récupérer les projets récents (limité à un nombre)
  async getRecentProjects(limit = 6) {
    try {
      return await db.projets
        .orderBy('dateCreation')
        .reverse()
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des projets récents:', error);
      throw error;
    }
  }
};

export default db;