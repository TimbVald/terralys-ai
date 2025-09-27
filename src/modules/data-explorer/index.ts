/**
 * Point d'entrée du module data-explorer
 * Exporte les composants et hooks principaux
 */

// Types
export * from './types';

// Hooks
export * from './hooks/useDataExplorer';

// Composants UI
export { ExplorerView } from './ui/views/explorer-view';

// Procédures TRPC
export { dataExplorerRouter } from './server/procedures';