import Dexie from 'dexie';

// Créer une instance de la base de données
export const db = new Dexie('ProjetMetrDatabase');

// Définir le schéma de la base de données (version unique)
db.version(1).stores({
  utilisateur: '++id_utilisateur, nom, prenom, email, mot_de_passe, role',
  projets: '++id, nom, client, status, date, membre, fichier, referenceInterne, typologieProjet, adresseProjet, dateLivraison, dateCreation',
  libraries: '++id, user_id, nom, created_at',
  articles: '++id, library_id, designation, lot, sous_categorie, unite, prix_unitaire, is_favorite, statut, created_at, updated_at'
});

// Pré-remplir la bibliothèque par défaut lors de la création de la base
db.on('populate', async () => {
  await db.libraries.add({
    nom: 'Bibliothèque par défaut',
    user_id: null,
    created_at: new Date().toISOString()
  });
});

console.log('Database configured successfully!');

// Fonctions utilitaires pour la gestion des utilisateurs
export const userService = {
  // Créer un nouvel utilisateur
  async createUser(userData) {
    try {
      const { nom, prenom, email, mot_de_passe, role = 'utilisateur' } = userData;
      
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
        role
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

export const libraryService = {
  async createLibrary({ nom, user_id = null }) {
    try {
      const now = new Date().toISOString();
      return await db.libraries.add({ nom, user_id, created_at: now });
    } catch (error) {
      console.error('Erreur lors de la création de la bibliothèque :', error);
      throw error;
    }
  },

  async getAllLibraries() {
    return db.libraries.orderBy('created_at').reverse().toArray();
  },

  async getLibraryById(id) {
    return db.libraries.get(id);
  },

  async deleteLibrary(id) {
    await db.libraries.delete(id);
  }
};

export const articleService = {
  async createArticle(articleData) {
    try {
      const now = new Date().toISOString();
      const {
        library_id,
        designation,
        lot,
        sous_categorie,
        unite,
        prix_unitaire,
        is_favorite = false,
        statut = 'Nouveau',
        description = ''
      } = articleData;

      if (!library_id) {
        throw new Error('library_id est requis pour créer un article');
      }

      return await db.articles.add({
        library_id,
        designation,
        lot,
        sous_categorie,
        unite,
        prix_unitaire,
        is_favorite,
        statut,
        description,
        created_at: now,
        updated_at: now
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'article :", error);
      throw error;
    }
  },

  async getArticlesByLibrary(libraryId) {
    return db.articles.where('library_id').equals(libraryId).toArray();
  },

  async updateArticle(id, updates) {
    return db.articles.update(id, { ...updates, updated_at: new Date().toISOString() });
  },

  async deleteArticle(id) {
    return db.articles.delete(id);
  }
};

export default db;