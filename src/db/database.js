import Dexie from 'dexie';

// Créer une instance de la base de données
export const db = new Dexie('ProjetMetrDatabase');

// Définir le schéma de la base de données
db.version(1).stores({
  utilisateur: '++id_utilisateur, nom, prenom, email, mot_de_passe, role',
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

export default db;