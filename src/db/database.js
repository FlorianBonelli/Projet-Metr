import Dexie from 'dexie';

// Créer une instance de la base de données
export const db = new Dexie('ProjetMetrDatabase');

// Définir le schéma de la base de données (version mise à jour)
db.version(5).stores({
  utilisateur: '++id_utilisateur, nom, prenom, email, mot_de_passe, role, profession, entreprise, photo_profil',
  projets: '++id, nom, client, status, date, membre, fichier, referenceInterne, typologieProjet, adresseProjet, dateLivraison, dateCreation, user_id',
  libraries: '++id, user_id, nom, created_at',
  articles: '++id, library_id, designation, lot, sous_categorie, unite, prix_unitaire, is_favorite, statut, created_at, updated_at',
  taches: '++id, titre, description, projet_id, priorite, etat, date_creation, date_echeance, user_id, created_at, updated_at',
  modifications: '++id, projectId, userId, dateModification, changeType',
  collaborateurs: '++id, project_id, user_id, role, [project_id+user_id]',
  exports: '++id, project_id, user_id, file_name, file_type, file_size, file_data, date_export'
}).upgrade(trans => {
  // Migration pour ajouter user_id aux projets existants
  return trans.projets.toCollection().modify(projet => {
    if (!projet.user_id) {
      // Assigner les projets existants à l'utilisateur de test par défaut
      projet.user_id = 1; // ID de l'utilisateur de test
    }
  });
});

// Version 6: Ajout des champs pour l'authentification Google
db.version(6).stores({
  utilisateur: '++id_utilisateur, nom, prenom, email, mot_de_passe, role, profession, entreprise, photo_profil, google_id, auth_provider',
  projets: '++id, nom, client, status, date, membre, fichier, referenceInterne, typologieProjet, adresseProjet, dateLivraison, dateCreation, user_id',
  libraries: '++id, user_id, nom, created_at',
  articles: '++id, library_id, designation, lot, sous_categorie, unite, prix_unitaire, is_favorite, statut, created_at, updated_at',
  taches: '++id, titre, description, projet_id, priorite, etat, date_creation, date_echeance, user_id, created_at, updated_at',
  modifications: '++id, projectId, userId, dateModification, changeType',
  collaborateurs: '++id, project_id, user_id, role, [project_id+user_id]',
  exports: '++id, project_id, user_id, file_name, file_type, file_size, file_data, date_export'
});

// Version 7: Ajout de la table plan_versions pour gérer les versions de plans
db.version(7).stores({
  utilisateur: '++id_utilisateur, nom, prenom, email, mot_de_passe, role, profession, entreprise, photo_profil, google_id, auth_provider',
  projets: '++id, nom, client, status, date, membre, fichier, referenceInterne, typologieProjet, adresseProjet, dateLivraison, dateCreation, user_id',
  libraries: '++id, user_id, nom, created_at',
  articles: '++id, library_id, designation, lot, sous_categorie, unite, prix_unitaire, is_favorite, statut, created_at, updated_at',
  taches: '++id, titre, description, projet_id, priorite, etat, date_creation, date_echeance, user_id, created_at, updated_at',
  modifications: '++id, projectId, userId, dateModification, changeType',
  collaborateurs: '++id, project_id, user_id, role, [project_id+user_id]',
  exports: '++id, project_id, user_id, file_name, file_type, file_size, file_data, date_export',
  plan_versions: '++id, project_id, plan_name, version_index, file_name, file_type, file_size, file_data, is_current, uploaded_by, created_at, [project_id+plan_name]'
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

// Fonction pour migrer les projets et tâches existants sans user_id
export const migrateExistingData = async () => {
  try {
    console.log('Vérification de la migration des données...');
    
    // Récupérer l'utilisateur de test
    const testUser = await db.utilisateur.where('email').equals('antoine.brosseau@edu.ece.fr').first();
    const defaultUserId = testUser ? testUser.id_utilisateur : 1;
    
    // Migration des projets
    const allProjects = await db.projets.toArray();
    console.log('Projets trouvés:', allProjects.length);
    
    const projectsWithoutUserId = allProjects.filter(p => !p.user_id);
    console.log('Projets sans user_id:', projectsWithoutUserId.length);
    
    if (projectsWithoutUserId.length > 0) {
      console.log('Attribution des projets à l\'utilisateur ID:', defaultUserId);
      
      for (const project of projectsWithoutUserId) {
        await db.projets.update(project.id, { user_id: defaultUserId });
        console.log(`Projet ${project.id} (${project.nom}) assigné à l'utilisateur ${defaultUserId}`);
      }
      
      console.log('Migration des projets terminée');
    } else {
      console.log('Tous les projets ont déjà un user_id');
    }
    
    // Migration des tâches
    const allTaches = await db.taches.toArray();
    console.log('Tâches trouvées:', allTaches.length);
    
    const tachesWithoutUserId = allTaches.filter(t => !t.user_id);
    console.log('Tâches sans user_id:', tachesWithoutUserId.length);
    
    if (tachesWithoutUserId.length > 0) {
      console.log('Attribution des tâches à l\'utilisateur ID:', defaultUserId);
      
      for (const tache of tachesWithoutUserId) {
        await db.taches.update(tache.id, { user_id: defaultUserId });
        console.log(`Tâche ${tache.id} (${tache.titre}) assignée à l'utilisateur ${defaultUserId}`);
      }
      
      console.log('Migration des tâches terminée');
    } else {
      console.log('Toutes les tâches ont déjà un user_id');
    }
  } catch (error) {
    console.error('Erreur lors de la migration des données:', error);
  }
};

// Initialiser l'utilisateur de test au démarrage
initializeTestUser().then(() => {
  // Migrer les données existantes après l'initialisation de l'utilisateur
  migrateExistingData();
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
  },

  // Créer ou récupérer un utilisateur Google
  async createOrGetGoogleUser(googleUserData) {
    try {
      const { email, given_name, family_name, picture, sub } = googleUserData;
      
      // Vérifier si l'utilisateur existe déjà (par email ou google_id)
      let existingUser = await db.utilisateur.where('email').equals(email).first();
      
      if (existingUser) {
        // Mettre à jour les infos Google si nécessaire
        if (!existingUser.google_id) {
          await db.utilisateur.update(existingUser.id_utilisateur, {
            google_id: sub,
            photo_profil: picture || existingUser.photo_profil
          });
          existingUser = await db.utilisateur.get(existingUser.id_utilisateur);
        }
        return existingUser;
      }
      
      // Créer un nouvel utilisateur Google
      const userId = await db.utilisateur.add({
        nom: family_name || '',
        prenom: given_name || '',
        email: email,
        mot_de_passe: null, // Pas de mot de passe pour les utilisateurs Google
        google_id: sub,
        photo_profil: picture || '',
        role: 'utilisateur',
        profession: '',
        entreprise: '',
        auth_provider: 'google'
      });
      
      console.log('Utilisateur Google créé avec l\'ID:', userId);
      return await db.utilisateur.get(userId);
    } catch (error) {
      console.error('Erreur lors de la création/récupération de l\'utilisateur Google:', error);
      throw error;
    }
  },

  // Authentifier un utilisateur via Google
  async authenticateGoogleUser(googleUserData) {
    try {
      const user = await this.createOrGetGoogleUser(googleUserData);
      return user;
    } catch (error) {
      console.error('Erreur lors de l\'authentification Google:', error);
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
      // 1. Projets dont l'utilisateur est propriétaire
      const userProjects = await db.projets
        .where('user_id')
        .equals(userId)
        .toArray();

      // 2. Projets partagés via la table collaborateurs
      let sharedProjectsWithMeta = [];
      try {
        const sharedLinks = await db.table('collaborateurs')
          .where('user_id')
          .equals(userId)
          .toArray();

        if (sharedLinks && sharedLinks.length > 0) {
          const sharedProjects = await Promise.all(
            sharedLinks.map(async (link) => {
              const project = await db.projets.get(link.project_id);
              if (!project) return null;
              return {
                ...project,
                isShared: true,
                userRole: link.role
              };
            })
          );

          sharedProjectsWithMeta = sharedProjects.filter(p => p !== null);
        }
      } catch (e) {
        console.error('Erreur lors de la récupération des projets partagés:', e);
      }

      const allProjects = [...userProjects, ...sharedProjectsWithMeta];

      // Trier manuellement par date de création (plus récent en premier)
      return allProjects.sort((a, b) => {
        const dateA = new Date(a.dateCreation || 0);
        const dateB = new Date(b.dateCreation || 0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets de l\'utilisateur:', error);
      throw error;
    }
  },

  // Ajouter ou mettre à jour un collaborateur sur un projet
  async addCollaborator(projectId, email, role = 'lecture') {
    try {
      const user = await db.utilisateur.where('email').equals(email).first();
      if (!user) {
        throw new Error('Utilisateur non trouvé avec cet email');
      }

      const userId = user.id_utilisateur || user.id;

      const collaborateursTable = db.table('collaborateurs');

      const existingLink = await collaborateursTable
        .where({ project_id: projectId, user_id: userId })
        .first();

      if (existingLink) {
        await collaborateursTable.update(existingLink.id, { role });
        return existingLink.id;
      }

      const linkId = await collaborateursTable.add({
        project_id: projectId,
        user_id: userId,
        role,
        date_ajout: new Date().toISOString()
      });

      // Récupérer l'utilisateur qui fait l'invitation (l'utilisateur connecté)
      let inviterId = null;
      let inviterName = 'Un utilisateur';
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const userData = JSON.parse(userInfo);
          inviterId = userData.id_utilisateur || userData.id;
          inviterName = `${userData.prenom || ''} ${userData.nom || ''}`.trim() || 'Un utilisateur';
        }
      } catch (e) {
        console.error('Impossible de récupérer l\'utilisateur connecté:', e);
      }

      // Créer la notification d'invitation avec les infos de l'inviteur
      await modificationService.addModification({
        projectId,
        userId, // Le destinataire (celui qui est invité)
        changeType: 'invitation_projet',
        status: 'à voir',
        authorId: inviterId,
        authorName: inviterName
      });

      return linkId;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du collaborateur:', error);
      throw error;
    }
  },

  // Récupérer les collaborateurs d'un projet
  async getProjectCollaborators(projectId) {
    try {
      const collaborateursTable = db.table('collaborateurs');
      const links = await collaborateursTable
        .where('project_id')
        .equals(projectId)
        .toArray();

      const collaborators = await Promise.all(
        links.map(async (link) => {
          const user = await db.utilisateur.get(link.user_id);
          if (!user) return null;
          return {
            ...user,
            role: link.role,
            linkId: link.id
          };
        })
      );

      return collaborators.filter(c => c !== null);
    } catch (error) {
      console.error('Erreur lors de la récupération des collaborateurs:', error);
      throw error;
    }
  },

  // Supprimer un collaborateur
  async removeCollaborator(projectId, userId) {
    try {
      const collaborateursTable = db.table('collaborateurs');
      const link = await collaborateursTable
        .where({ project_id: projectId, user_id: userId })
        .first();

      if (link) {
        await collaborateursTable.delete(link.id);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du collaborateur:', error);
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
  async updateProject(id, updates, userId = null) {
    try {
      // S'assurer que l'ID est un nombre
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (isNaN(numericId)) {
        throw new Error('ID de projet invalide');
      }

      // Récupérer l'état actuel du projet pour détecter les changements
      const currentProject = await db.projets.get(numericId);
      if (!currentProject) {
        throw new Error('Projet non trouvé');
      }

      // Détecter les champs modifiés
      const changedFields = [];
      const fieldMapping = {
        nom: 'nom',
        client: 'client', 
        referenceInterne: 'referenceInterne',
        typologieProjet: 'typologieProjet',
        adresseProjet: 'adresseProjet',
        dateLivraison: 'dateLivraison',
        status: 'status'
      };

      for (const [field, changeType] of Object.entries(fieldMapping)) {
        if (updates.hasOwnProperty(field) && updates[field] !== currentProject[field]) {
          changedFields.push(changeType);
        }
      }

      // Mettre à jour le projet
      await db.projets.update(numericId, updates);
      console.log('Projet mis à jour:', numericId);

      // Créer des notifications pour tous les membres du projet (sauf l'auteur)
      if (changedFields.length > 0 && userId) {
        for (const changeType of changedFields) {
          await modificationService.notifyProjectMembers(
            numericId,
            userId,
            changeType
          );
        }
      }
      
      // Déclencher l'événement de mise à jour de projet pour mettre à jour la sidebar
      window.dispatchEvent(new CustomEvent('projectUpdated', { detail: { projectId: numericId, updates } }));
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
        // Utiliser getProjectsByUser qui inclut les projets partagés
        const allUserProjects = await this.getProjectsByUser(userId);
        
        // Limiter le nombre de projets retournés
        return allUserProjects.slice(0, limit);
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
      
      // Si user_id n'est pas fourni, récupérer l'utilisateur connecté
      let userId = user_id;
      if (!userId) {
        try {
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const userData = JSON.parse(userInfo);
            userId = userData.id_utilisateur || userData.id;
          }
        } catch (e) {
          console.error('Impossible de récupérer l\'utilisateur connecté:', e);
        }
      }
      
      return await db.libraries.add({ nom, user_id: userId, created_at: now });
    } catch (error) {
      console.error('Erreur lors de la création de la bibliothèque :', error);
      throw error;
    }
  },

  async getAllLibraries(userId = null) {
    try {
      // Si userId n'est pas fourni, récupérer l'utilisateur connecté
      let currentUserId = userId;
      if (!currentUserId) {
        try {
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const userData = JSON.parse(userInfo);
            currentUserId = userData.id_utilisateur || userData.id;
          }
        } catch (e) {
          console.error('Impossible de récupérer l\'utilisateur connecté:', e);
        }
      }
      
      if (currentUserId) {
        // Retourner uniquement les bibliothèques de l'utilisateur
        return await db.libraries
          .where('user_id')
          .equals(currentUserId)
          .reverse()
          .toArray();
      }
      
      // Fallback: retourner toutes les bibliothèques si pas d'utilisateur
      return db.libraries.orderBy('created_at').reverse().toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des bibliothèques:', error);
      return [];
    }
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

      // Créer une notification liée au projet associé
      if (projet_id) {
        const numericProjectId = Number(projet_id);
        let notificationUserId = user_id || null;

        // Si aucun user_id n'est passé, essayer de récupérer l'utilisateur connecté
        if (!notificationUserId) {
          try {
            const userInfo = window.localStorage.getItem('userInfo');
            if (userInfo) {
              const userData = JSON.parse(userInfo);
              notificationUserId = userData.id_utilisateur || userData.id || null;
            }
          } catch (e) {
            console.error('Impossible de récupérer userInfo pour la notification de création de tâche:', e);
          }
        }

        if (notificationUserId && !Number.isNaN(numericProjectId)) {
          await modificationService.notifyProjectMembers(
            numericProjectId,
            notificationUserId,
            'tache_creation'
          );
        }
      }
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

  // Récupérer les tâches d'un utilisateur spécifique
  async getTachesByUser(userId) {
    try {
      const userTaches = await db.taches
        .where('user_id')
        .equals(userId)
        .toArray();
      
      // Trier manuellement par date de création (plus récent en premier)
      return userTaches.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches de l\'utilisateur:', error);
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
      // Récupérer la tâche actuelle pour détecter les changements
      const currentTache = await db.taches.get(id);

      await db.taches.update(id, { 
        ...updates, 
        updated_at: new Date().toISOString() 
      });
      console.log('Tâche mise à jour:', id);

      // Détecter les changements sur priorite et etat pour créer des notifications
      if (currentTache) {
        const changedTypes = [];

        if (updates.hasOwnProperty('priorite') && updates.priorite !== currentTache.priorite) {
          changedTypes.push('tache_priorite');
        }
        if (updates.hasOwnProperty('etat') && updates.etat !== currentTache.etat) {
          changedTypes.push('tache_etat');
        }

        if (changedTypes.length > 0 && currentTache.projet_id) {
          const numericProjectId = Number(currentTache.projet_id);
          // Récupérer l'utilisateur connecté pour l'assigner à la notification
          let userId = null;
          try {
            const userInfo = window.localStorage.getItem('userInfo');
            if (userInfo) {
              const userData = JSON.parse(userInfo);
              userId = userData.id_utilisateur || userData.id || null;
            }
          } catch (e) {
            console.error('Impossible de récupérer userInfo pour les notifications de tâches:', e);
          }

          if (userId && !Number.isNaN(numericProjectId)) {
            for (const changeType of changedTypes) {
              await modificationService.notifyProjectMembers(
                numericProjectId,
                userId,
                changeType
              );
            }
          }
        }
      }

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
  // Notifier tous les membres d'un projet (sauf l'auteur de l'action)
  async notifyProjectMembers(projectId, authorUserId, changeType, status = 'à voir') {
    try {
      const numericProjectId = Number(projectId);
      if (Number.isNaN(numericProjectId)) return;

      // 1. Récupérer le projet pour trouver le propriétaire
      const project = await db.projets.get(numericProjectId);
      if (!project) return;

      // 2. Récupérer les collaborateurs
      const collaborators = await projectService.getProjectCollaborators(numericProjectId);

      // 3. Construire la liste des destinataires (Propriétaire + Collaborateurs)
      const recipients = new Set();
      
      // Ajouter le propriétaire s'il n'est pas l'auteur
      if (project.user_id && project.user_id !== authorUserId) {
        recipients.add(project.user_id);
      }

      // Ajouter les collaborateurs s'ils ne sont pas l'auteur
      collaborators.forEach(collab => {
        const collabId = collab.id_utilisateur || collab.id;
        if (collabId && collabId !== authorUserId) {
          recipients.add(collabId);
        }
      });

      // 4. Récupérer les infos de l'auteur pour les inclure dans la notification
      const author = await db.utilisateur.get(authorUserId);
      const authorName = author ? `${author.prenom} ${author.nom}` : 'Un utilisateur';

      // 5. Envoyer les notifications
      for (const recipientId of recipients) {
        await this.addModification({
          projectId: numericProjectId,
          userId: recipientId,
          changeType,
          status,
          authorId: authorUserId,
          authorName: authorName
        });
      }
      
      console.log(`Notifications envoyées à ${recipients.size} membres pour le projet ${projectId}`);
    } catch (error) {
      console.error('Erreur lors de la notification des membres du projet:', error);
    }
  },

  // Ajouter une modification
  async addModification(modificationData) {
    try {
      const {
        projectId,
        userId,
        changeType,
        status = 'à voir',
        authorId = null,
        authorName = null
      } = modificationData;

      const modificationId = await db.modifications.add({
        projectId,
        userId,
        changeType,
        status,
        authorId,
        authorName,
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
  },

  // Récupérer les projets (avec notifications) appartenant à un utilisateur donné
  async getProjectsWithModificationsByUser(userId) {
    try {
      // Utiliser getProjectsByUser qui inclut déjà les projets partagés
      const allUserProjects = await projectService.getProjectsByUser(userId);

      const projectsWithMods = await Promise.all(
        allUserProjects.map(async (project) => {
          // Récupérer les modifications destinées à cet utilisateur pour ce projet
          const modifications = await db.modifications
            .where('projectId')
            .equals(project.id)
            .and(mod => mod.userId === userId)
            .toArray();
          return {
            ...project,
            modifications: modifications || [],
            hasModifications: modifications && modifications.length > 0
          };
        })
      );

      return projectsWithMods.sort((a, b) => {
        const aDate = a.modifications[0]?.dateModification || a.dateCreation || '';
        const bDate = b.modifications[0]?.dateModification || b.dateCreation || '';
        return new Date(bDate) - new Date(aDate);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets avec modifications pour l\'utilisateur:', error);
      throw error;
    }
  },

  // Compter les notifications non vues pour un utilisateur
  async getUnseenNotificationsCount(userId) {
    try {
      // Récupérer les notifications destinées à cet utilisateur
      const userNotifications = await db.modifications
        .where('userId')
        .equals(userId)
        .and(mod => mod.status === 'à voir')
        .toArray();

      return userNotifications.length;
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non vues:', error);
      return 0;
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
    
    // Vérifier les tâches
    const tasks = await db.taches.toArray();
    console.log('Tâches:', tasks.map(t => ({ 
      id: t.id, 
      titre: t.titre, 
      user_id: t.user_id,
      projet_id: t.projet_id 
    })));
    
    // Vérifier les tâches sans user_id
    const tasksWithoutUserId = tasks.filter(t => !t.user_id);
    console.log('Tâches sans user_id:', tasksWithoutUserId.length);
    
    // Vérifier les projets et tâches par utilisateur
    for (const user of users) {
      const userProjects = await projectService.getProjectsByUser(user.id_utilisateur);
      const userTasks = await tacheService.getTachesByUser(user.id_utilisateur);
      console.log(`${user.prenom} ${user.nom} (ID: ${user.id_utilisateur}): ${userProjects.length} projets, ${userTasks.length} tâches`);
    }
    
    console.log('=== FIN DÉBOGAGE ===');
    
    // Si des données n'ont pas de user_id, les migrer maintenant
    if (projectsWithoutUserId.length > 0 || tasksWithoutUserId.length > 0) {
      console.log('🔧 Migration forcée des données sans user_id...');
      await migrateExistingData();
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

// Service pour gérer l'historique des exports/téléchargements
export const exportService = {
  // Enregistrer un export dans l'historique
  async createExport(exportData) {
    try {
      const { project_id, user_id, file_name, file_type, file_size, file_data } = exportData;
      
      const exportId = await db.exports.add({
        project_id,
        user_id,
        file_name,
        file_type,
        file_size,
        file_data, // Données du fichier en base64 ou Blob
        date_export: new Date().toISOString()
      });
      
      console.log('Export enregistré avec l\'ID:', exportId);
      return exportId;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'export:', error);
      throw error;
    }
  },
  
  // Récupérer l'historique des exports d'un projet
  async getExportsByProject(projectId) {
    try {
      const exports = await db.exports
        .where('project_id')
        .equals(projectId)
        .reverse()
        .sortBy('date_export');
      
      // Récupérer les informations des utilisateurs pour chaque export
      const exportsWithUserInfo = await Promise.all(
        exports.map(async (exp) => {
          const user = await db.utilisateur.get(exp.user_id);
          return {
            ...exp,
            user_name: user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu'
          };
        })
      );
      
      return exportsWithUserInfo;
    } catch (error) {
      console.error('Erreur lors de la récupération des exports:', error);
      throw error;
    }
  },
  
  // Récupérer un export par son ID
  async getExportById(exportId) {
    try {
      return await db.exports.get(exportId);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'export:', error);
      throw error;
    }
  },
  
  // Supprimer un export
  async deleteExport(exportId) {
    try {
      await db.exports.delete(exportId);
      console.log('Export supprimé:', exportId);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'export:', error);
      throw error;
    }
  }
};

// Service pour gérer les versions de plans
export const planVersionService = {
  // Créer une nouvelle version de plan
  async createPlanVersion(versionData) {
    try {
      const { project_id, plan_name, file_name, file_type, file_size, file_data, uploaded_by } = versionData;
      
      // Récupérer toutes les versions existantes de ce plan
      const existingVersions = await db.plan_versions
        .where({ project_id, plan_name })
        .toArray();
      
      // Calculer le prochain indice de version
      const version_index = existingVersions.length;
      
      // Marquer toutes les versions existantes comme non courantes
      for (const version of existingVersions) {
        await db.plan_versions.update(version.id, { is_current: false });
      }
      
      // Créer la nouvelle version
      const versionId = await db.plan_versions.add({
        project_id,
        plan_name,
        version_index,
        file_name,
        file_type,
        file_size,
        file_data,
        is_current: true,
        uploaded_by,
        created_at: new Date().toISOString()
      });
      
      console.log(`Version ${version_index} du plan "${plan_name}" créée avec l'ID:`, versionId);
      return versionId;
    } catch (error) {
      console.error('Erreur lors de la création de la version du plan:', error);
      throw error;
    }
  },
  
  // Récupérer toutes les versions d'un plan spécifique
  async getPlanVersions(project_id, plan_name) {
    try {
      const versions = await db.plan_versions
        .where({ project_id, plan_name })
        .toArray();
      
      // Trier par indice de version
      return versions.sort((a, b) => a.version_index - b.version_index);
    } catch (error) {
      console.error('Erreur lors de la récupération des versions du plan:', error);
      throw error;
    }
  },
  
  // Récupérer tous les plans d'un projet avec leurs versions
  async getAllPlansWithVersions(project_id) {
    try {
      const allVersions = await db.plan_versions
        .where('project_id')
        .equals(project_id)
        .toArray();
      
      // Grouper par nom de plan
      const planGroups = {};
      allVersions.forEach(version => {
        if (!planGroups[version.plan_name]) {
          planGroups[version.plan_name] = [];
        }
        planGroups[version.plan_name].push(version);
      });
      
      // Convertir en tableau et trier les versions
      const plans = Object.entries(planGroups).map(([plan_name, versions]) => ({
        plan_name,
        versions: versions.sort((a, b) => a.version_index - b.version_index),
        current_version: versions.find(v => v.is_current) || versions[versions.length - 1]
      }));
      
      return plans;
    } catch (error) {
      console.error('Erreur lors de la récupération des plans avec versions:', error);
      throw error;
    }
  },
  
  // Définir une version spécifique comme version courante
  async setCurrentVersion(project_id, plan_name, version_index) {
    try {
      // Récupérer toutes les versions de ce plan
      const versions = await db.plan_versions
        .where({ project_id, plan_name })
        .toArray();
      
      // Marquer toutes les versions comme non courantes
      for (const version of versions) {
        await db.plan_versions.update(version.id, { is_current: false });
      }
      
      // Marquer la version spécifiée comme courante
      const targetVersion = versions.find(v => v.version_index === version_index);
      if (targetVersion) {
        await db.plan_versions.update(targetVersion.id, { is_current: true });
        console.log(`Version ${version_index} du plan "${plan_name}" définie comme courante`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la définition de la version courante:', error);
      throw error;
    }
  },
  
  // Supprimer une version spécifique d'un plan
  async deletePlanVersion(versionId) {
    try {
      const version = await db.plan_versions.get(versionId);
      if (!version) {
        throw new Error('Version non trouvée');
      }
      
      // Vérifier si c'est la version courante
      if (version.is_current) {
        // Récupérer toutes les versions de ce plan
        const versions = await db.plan_versions
          .where({ project_id: version.project_id, plan_name: version.plan_name })
          .toArray();
        
        if (versions.length === 1) {
          throw new Error('Impossible de supprimer la dernière version d\'un plan');
        }
        
        // Supprimer la version
        await db.plan_versions.delete(versionId);
        
        // Définir la version la plus récente comme courante
        const remainingVersions = versions.filter(v => v.id !== versionId);
        const latestVersion = remainingVersions.sort((a, b) => b.version_index - a.version_index)[0];
        await db.plan_versions.update(latestVersion.id, { is_current: true });
      } else {
        await db.plan_versions.delete(versionId);
      }
      
      console.log('Version du plan supprimée:', versionId);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la version du plan:', error);
      throw error;
    }
  },
  
  // Récupérer la version courante d'un plan
  async getCurrentVersion(project_id, plan_name) {
    try {
      const currentVersion = await db.plan_versions
        .where({ project_id, plan_name })
        .and(v => v.is_current === true)
        .first();
      
      return currentVersion || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la version courante:', error);
      throw error;
    }
  }
};

export default db;