/**
 * Module d'administration - Point d'entrée principal
 * 
 * Ce module fournit une interface complète pour la gestion et la visualisation
 * des données de l'application Terralys.
 */

// Composants principaux
export { AdminDashboard, DataTable, DataFilters } from './components';

// Procédures serveur
export { adminRouter } from './server/procedures';