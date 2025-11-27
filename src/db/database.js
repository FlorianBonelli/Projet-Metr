import Dexie from 'dexie';

// Créer une instance de la base de données
export const db = new Dexie('ProjetMetrDatabase');

// Définir le schéma de la base de données (version mise à jour)
db.version(2).stores({
  utilisateur: '++id_utilisateur, nom, prenom, email, mot_de_passe, role, profession, entreprise',
  projets: '++id, nom, client, status, date, membre, fichier, referenceInterne, typologieProjet, adresseProjet, dateLivraison, dateCreation, user_id',
  libraries: '++id, user_id, nom, created_at',
  articles: '++id, library_id, designation, lot, sous_categorie, unite, prix_unitaire, is_favorite, statut, created_at, updated_at',
  taches: '++id, titre, description, projet_id, priorite, etat, date_creation, date_echeance, user_id, created_at, updated_at',
  modifications: '++id, projectId, userId, dateModification, changeType'
}).upgrade(trans => {
  // Migration pour ajouter user_id aux projets existants
  return trans.projets.toCollection().modify(projet => {
    if (!projet.user_id) {
      // Assigner les projets existants à l'utilisateur de test par défaut
      projet.user_id = 1; // ID de l'utilisateur de test
    }
  });
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

// Fonction pour initialiser un utilisateur de test
export const initializeTestUser = async () => {
  try {
    const existingUser = await db.utilisateur.where('email').equals('antoine.brosseau@edu.ece.fr').first();
    if (!existingUser) {
      await db.utilisateur.add({
        nom: 'Brosseau',
        prenom: 'Antoine',
        email: 'antoine.brosseau@edu.ece.fr',
        mot_de_passe: 'password123',
        profession: 'Économiste',
        entreprise: 'Bouygues Immobilier',
        role: 'utilisateur'
      });
      console.log('Utilisateur de test créé avec succès');
    } else {
      console.log('Utilisateur de test existe déjà');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'utilisateur de test:', error);
  }
};

// Fonction pour initialiser des données de test
export const initializeTestData = async () => {
  try {
    // Vérifier s'il y a déjà des modifications
    const existingMods = await db.modifications.toArray();
    if (existingMods.length === 0) {
      // Ajouter des modifications de test
      const testUser = await db.utilisateur.where('email').equals('antoine.brosseau@edu.ece.fr').first();
      const projects = await db.projets.toArray();
      
      if (testUser && projects.length > 0) {
        // Ajouter des modifications pour le premier projet
        await db.modifications.add({
          projectId: projects[0].id,
          userId: testUser.id_utilisateur,
          changeType: 'nom',
          status: 'à voir',
          dateModification: new Date().toISOString()
        });

        await db.modifications.add({
          projectId: projects[0].id,
          userId: testUser.id_utilisateur,
          changeType: 'export',
          status: 'vu',
          dateModification: new Date(Date.now() - 86400000).toISOString()
        });

        if (projects.length > 1) {
          await db.modifications.add({
            projectId: projects[1].id,
            userId: testUser.id_utilisateur,
            changeType: 'client',
            status: 'vu',
            dateModification: new Date(Date.now() - 172800000).toISOString()
          });
        }

        console.log('Données de test créées avec succès');
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données de test:', error);
  }
};

// Fonction pour migrer les projets existants sans user_id
export const migrateExistingProjects = async () => {
  try {
    console.log('Vérification de la migration des projets...');
    
    // Récupérer tous les projets
    const allProjects = await db.projets.toArray();
    console.log('Projets trouvés:', allProjects.length);
    
    // Trouver les projets sans user_id
    const projectsWithoutUserId = allProjects.filter(p => !p.user_id);
    console.log('Projets sans user_id:', projectsWithoutUserId.length);
    
    if (projectsWithoutUserId.length > 0) {
      // Récupérer l'utilisateur de test
      const testUser = await db.utilisateur.where('email').equals('antoine.brosseau@edu.ece.fr').first();
      const defaultUserId = testUser ? testUser.id_utilisateur : 1;
      
      console.log('Attribution des projets à l\'utilisateur ID:', defaultUserId);
      
      // Mettre à jour chaque projet sans user_id
      for (const project of projectsWithoutUserId) {
        await db.projets.update(project.id, { user_id: defaultUserId });
        console.log(`Projet ${project.id} (${project.nom}) assigné à l'utilisateur ${defaultUserId}`);
      }
      
      console.log('Migration des projets terminée');
    } else {
      console.log('Tous les projets ont déjà un user_id');
    }
  } catch (error) {
    console.error('Erreur lors de la migration des projets:', error);
  }
};

// Initialiser l'utilisateur de test au démarrage
initializeTestUser().then(() => {
  // Migrer les projets existants après l'initialisation de l'utilisateur
  migrateExistingProjects();
});
initializeTestData();

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
        fichier = [],
        user_id
      } = projectData;

      // Vérifier que user_id est fourni
      if (!user_id) {
        throw new Error('L\'ID utilisateur est requis pour créer un projet');
      }
      
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
        user_id,
        date: new Date().toISOString().split('T')[0], // Date au format YYYY-MM-DD
        dateCreation: new Date().toISOString()
      });
      
      console.log('Projet créé avec l\'ID:', projectId);
      
      // Déclencher l'événement de création de projet pour mettre à jour la sidebar
      window.dispatchEvent(new CustomEvent('projectCreated', { detail: { projectId } }));
      
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
  
  // Récupérer les projets d'un utilisateur spécifique
  async getProjectsByUser(userId) {
    try {
      const userProjects = await db.projets
        .where('user_id')
        .equals(userId)
        .toArray();
      
      // Trier manuellement par date de création (plus récent en premier)
      return userProjects.sort((a, b) => {
        const dateA = new Date(a.dateCreation || 0);
        const dateB = new Date(b.dateCreation || 0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets de l\'utilisateur:', error);
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
      
      // Déclencher l'événement de mise à jour de projet pour mettre à jour la sidebar
      window.dispatchEvent(new CustomEvent('projectUpdated', { detail: { projectId: id, updates } }));
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
      
      // Déclencher l'événement de suppression de projet pour mettre à jour la sidebar
      window.dispatchEvent(new CustomEvent('projectDeleted', { detail: { projectId: id } }));
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      throw error;
    }
  },
  
  // Récupérer les projets récents (limité à un nombre)
  async getRecentProjects(limit = 6, userId = null) {
    try {
      if (userId) {
        const userProjects = await db.projets
          .where('user_id')
          .equals(userId)
          .toArray();
        
        // Trier manuellement par date de création et limiter
        return userProjects
          .sort((a, b) => {
            const dateA = new Date(a.dateCreation || 0);
            const dateB = new Date(b.dateCreation || 0);
            return dateB - dateA;
          })
          .slice(0, limit);
      } else {
        return await db.projets
          .orderBy('dateCreation')
          .reverse()
          .limit(limit)
          .toArray();
      }
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
    return db.libraries.delete(id);
  },

  async deleteArticle(id) {
    return db.articles.delete(id);
  }
};

// Service pour la gestion des tâches
export const tacheService = {
  async createTache(tacheData) {
    try {
      const now = new Date().toISOString();
      const {
        titre,
        description = '',
        projet_id,
        priorite = 'Moyenne',
        etat = 'À faire',
        date_echeance = null,
        user_id
      } = tacheData;

      if (!titre || !projet_id) {
        throw new Error('Le titre et le projet sont requis pour créer une tâche');
      }

      const tacheId = await db.taches.add({
        titre,
        description,
        projet_id,
        priorite,
        etat,
        date_creation: now.split('T')[0],
        date_echeance,
        user_id,
        created_at: now,
        updated_at: now
      });

      console.log('Tâche créée avec l\'ID:', tacheId);
      return tacheId;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  async getAllTaches() {
    try {
      return await db.taches.orderBy('created_at').reverse().toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },

  async getTachesByProject(projectId) {
    try {
      return await db.taches.where('projet_id').equals(projectId).toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches du projet:', error);
      throw error;
    }
  },

  async getTacheById(id) {
    try {
      return await db.taches.get(id);
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      throw error;
    }
  },

  async updateTache(id, updates) {
    try {
      await db.taches.update(id, { 
        ...updates, 
        updated_at: new Date().toISOString() 
      });
      console.log('Tâche mise à jour:', id);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      throw error;
    }
  },

  async deleteTache(id) {
    try {
      await db.taches.delete(id);
      console.log('Tâche supprimée:', id);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw error;
    } finally {
      // Ajouter un finally pour s'assurer que la fonction se termine correctement
    }
  }
};

// Service pour la gestion des articles
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

  async getAllArticles() {
    return db.articles.toArray();
  },

  async updateArticle(id, updates) {
    return db.articles.update(id, { ...updates, updated_at: new Date().toISOString() });
  },

  async deleteArticle(id) {
    return db.articles.delete(id);
  }
};

// Fonctions utilitaires pour la gestion des modifications/notifications
export const modificationService = {
  // Ajouter une modification
  async addModification(modificationData) {
    try {
      const {
        projectId,
        userId,
        changeType,
        status = 'à voir'
      } = modificationData;

      const modificationId = await db.modifications.add({
        projectId,
        userId,
        changeType,
        status,
        dateModification: new Date().toISOString()
      });

      console.log('Modification ajoutée avec l\'ID:', modificationId);
      return modificationId;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la modification:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'une modification
  async updateModificationStatus(modificationId, newStatus) {
    try {
      await db.modifications.update(modificationId, { status: newStatus });
      console.log('Statut de la modification mis à jour:', modificationId);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  // Récupérer les modifications d'un projet
  async getModificationsByProject(projectId) {
    try {
      return await db.modifications
        .where('projectId')
        .equals(projectId)
        .reverse()
        .toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des modifications:', error);
      throw error;
    }
  },

  // Récupérer tous les projets avec modifications
  async getProjectsWithModifications() {
    try {
      const allProjects = await db.projets.toArray();
      const projectsWithMods = await Promise.all(
        allProjects.map(async (project) => {
          const modifications = await db.modifications
            .where('projectId')
            .equals(project.id)
            .toArray();
          return {
            ...project,
            modifications: modifications || [],
            hasModifications: modifications && modifications.length > 0
          };
        })
      );
      
      // Trier par date de modification la plus récente
      return projectsWithMods.sort((a, b) => {
        const aDate = a.modifications[0]?.dateModification || a.dateCreation || '';
        const bDate = b.modifications[0]?.dateModification || b.dateCreation || '';
        return new Date(bDate) - new Date(aDate);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets avec modifications:', error);
      throw error;
    }
  }
};

// Fonction de débogage pour vérifier l'état de la base de données
export const debugDatabase = async () => {
  try {
    console.log('=== DÉBOGAGE BASE DE DONNÉES ===');
    
    // Vérifier les utilisateurs
    const users = await db.utilisateur.toArray();
    console.log('Utilisateurs:', users.map(u => ({ id: u.id_utilisateur, email: u.email, nom: u.nom, prenom: u.prenom })));
    
    // Vérifier les projets
    const projects = await db.projets.toArray();
    console.log('Projets:', projects.map(p => ({ 
      id: p.id, 
      nom: p.nom, 
      user_id: p.user_id,
      client: p.client 
    })));
    
    // Vérifier les projets sans user_id
    const projectsWithoutUserId = projects.filter(p => !p.user_id);
    console.log('Projets sans user_id:', projectsWithoutUserId.length);
    
    // Vérifier les projets par utilisateur
    for (const user of users) {
      const userProjects = await projectService.getProjectsByUser(user.id_utilisateur);
      console.log(`Projets de ${user.prenom} ${user.nom} (ID: ${user.id_utilisateur}):`, userProjects.length);
    }
    
    console.log('=== FIN DÉBOGAGE ===');
    
    // Si des projets n'ont pas de user_id, les migrer maintenant
    if (projectsWithoutUserId.length > 0) {
      console.log('🔧 Migration forcée des projets sans user_id...');
      await migrateExistingProjects();
    }
  } catch (error) {
    console.error('Erreur lors du débogage:', error);
  }
};

// Fonction pour forcer la réinitialisation de la base de données (ATTENTION: supprime tout!)
export const resetDatabase = async () => {
  try {
    console.log('🚨 RÉINITIALISATION DE LA BASE DE DONNÉES...');
    await db.delete();
    await db.open();
    console.log('✅ Base de données réinitialisée');
    
    // Réinitialiser les données
    await initializeTestUser();
    await initializeTestData();
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
  }
};

export default db;