'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

/**
 * Page des paramètres utilisateur avec accès admin sécurisé
 */
const SettingsPage = () => {
  const router = useRouter();
  
  // États pour les paramètres utilisateur
  const [userSettings, setUserSettings] = useState({
    displayName: '',
    email: '',
    language: 'fr',
    timezone: 'Europe/Paris',
    notifications: {
      email: true,
      push: true,
      meetings: true,
      analyses: true,
    },
    privacy: {
      profileVisible: true,
      dataSharing: false,
      analytics: true,
    },
    appearance: {
      theme: 'light',
      compactMode: false,
    }
  });

  // États pour l'accès admin
  const [adminAccess, setAdminAccess] = useState({
    showAdminSection: false,
    accessCode: '',
    isAuthenticated: false,
    showPassword: false,
  });

  /**
   * Navigation vers l'explorateur de données
   *
  const navigateToDataExplorer = () => {
    router.push('/data-explorer');
  };
  */

  /**
   * Gestion de la sauvegarde des paramètres utilisateur
   */
  const handleSaveSettings = async () => {
    try {
      // TODO: Implémenter la sauvegarde via tRPC
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des paramètres');
    }
  };

  /**
   * Gestion de l'authentification admin
   */
  const handleAdminAuth = () => {
    if (adminAccess.accessCode === 'terralysadmin') {
      setAdminAccess(prev => ({ ...prev, isAuthenticated: true }));
      toast.success('Accès administrateur accordé');
      // Rediriger vers la page admin après 1 seconde
      setTimeout(() => {
        router.push('/data-explorer');
      }, 1000);
    } else {
      toast.error('Code d\'accès incorrect');
      setAdminAccess(prev => ({ ...prev, accessCode: '' }));
    }
  };

  /**
   * Basculer l'affichage de la section admin
   */
  const toggleAdminSection = () => {
    setAdminAccess(prev => ({ 
      ...prev, 
      showAdminSection: !prev.showAdminSection,
      accessCode: '',
      isAuthenticated: false 
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
          </div>
        </div>

        {/* Paramètres du profil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil utilisateur
            </CardTitle>
            <CardDescription>
              Informations personnelles et paramètres de compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nom d'affichage</Label>
                <Input
                  id="displayName"
                  value={userSettings.displayName}
                  onChange={(e) => setUserSettings(prev => ({ 
                    ...prev, 
                    displayName: e.target.value 
                  }))}
                  placeholder="Votre nom d'affichage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings(prev => ({ 
                    ...prev, 
                    email: e.target.value 
                  }))}
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <select
                  id="language"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={userSettings.language}
                  onChange={(e) => setUserSettings(prev => ({ 
                    ...prev, 
                    language: e.target.value 
                  }))}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <select
                  id="timezone"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={userSettings.timezone}
                  onChange={(e) => setUserSettings(prev => ({ 
                    ...prev, 
                    timezone: e.target.value 
                  }))}
                >
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications par email</Label>
                <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
              </div>
              <Switch
                checked={userSettings.notifications.email}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: checked }
                }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications push</Label>
                <p className="text-sm text-gray-600">Recevoir des notifications push</p>
              </div>
              <Switch
                checked={userSettings.notifications.push}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: checked }
                }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications de réunions</Label>
                <p className="text-sm text-gray-600">Alertes pour les réunions à venir</p>
              </div>
              <Switch
                checked={userSettings.notifications.meetings}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, meetings: checked }
                }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications d'analyses</Label>
                <p className="text-sm text-gray-600">Alertes pour les analyses terminées</p>
              </div>
              <Switch
                checked={userSettings.notifications.analyses}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, analyses: checked }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confidentialité et sécurité
            </CardTitle>
            <CardDescription>
              Contrôlez vos paramètres de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profil visible</Label>
                <p className="text-sm text-gray-600">Rendre votre profil visible aux autres utilisateurs</p>
              </div>
              <Switch
                checked={userSettings.privacy.profileVisible}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, profileVisible: checked }
                }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Partage de données</Label>
                <p className="text-sm text-gray-600">Autoriser le partage de données anonymisées</p>
              </div>
              <Switch
                checked={userSettings.privacy.dataSharing}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, dataSharing: checked }
                }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Analytics</Label>
                <p className="text-sm text-gray-600">Autoriser la collecte de données d'usage</p>
              </div>
              <Switch
                checked={userSettings.privacy.analytics}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, analytics: checked }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres d'apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <div className="flex gap-2">
                <Button
                  variant={userSettings.appearance.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, theme: 'light' }
                  }))}
                >
                  Clair
                </Button>
                <Button
                  variant={userSettings.appearance.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, theme: 'dark' }
                  }))}
                >
                  Sombre
                </Button>
                <Button
                  variant={userSettings.appearance.theme === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, theme: 'auto' }
                  }))}
                >
                  Auto
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Mode compact</Label>
                <p className="text-sm text-gray-600">Interface plus compacte</p>
              </div>
              <Switch
                checked={userSettings.appearance.compactMode}
                onCheckedChange={(checked) => setUserSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, compactMode: checked }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section Admin (sécurisée) */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Database className="h-5 w-5" />
              Administration
              <Badge variant="destructive" className="ml-2">Accès restreint</Badge>
            </CardTitle>
            <CardDescription>
              Accès aux outils d'administration du système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <Button
              variant="outline"
              onClick={navigateToDataExplorer}
              className="w-full mb-2"
            >
              <Database className="h-4 w-4 mr-2" />
              Explorateur de données
            </Button> */}
            
            {!adminAccess.showAdminSection ? (
              <Button
                variant="outline"
                onClick={toggleAdminSection}
                className="w-full"
              >
                <Key className="h-4 w-4 mr-2" />
                Accéder à l'administration
              </Button>
            ) : (
              <div className="space-y-4">
                {!adminAccess.isAuthenticated ? (
                  <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-600">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Authentification requise</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminCode">Code d'accès administrateur</Label>
                      <div className="relative">
                        <Input
                          id="adminCode"
                          type={adminAccess.showPassword ? 'text' : 'password'}
                          value={adminAccess.accessCode}
                          onChange={(e) => setAdminAccess(prev => ({ 
                            ...prev, 
                            accessCode: e.target.value 
                          }))}
                          placeholder="Entrez le code d'accès"
                          className="pr-10"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAdminAuth();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setAdminAccess(prev => ({ 
                            ...prev, 
                            showPassword: !prev.showPassword 
                          }))}
                        >
                          {adminAccess.showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAdminAuth}
                        className="flex-1"
                        disabled={!adminAccess.accessCode}
                      >
                        Authentifier
                      </Button>
                      <Button
                        variant="outline"
                        onClick={toggleAdminSection}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Accès administrateur accordé</span>
                    </div>
                    <p className="text-sm text-green-700 mb-4">
                      Redirection vers le panneau d'administration...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex gap-4">
          <Button onClick={handleSaveSettings} className="flex-1">
            Sauvegarder les paramètres
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;