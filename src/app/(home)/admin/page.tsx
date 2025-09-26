'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft, 
  Key, 
  Eye, 
  EyeOff,
  Database,
  Users,
  Activity,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminDashboard } from '@/modules/admin';

/**
 * Page d'administration sécurisée avec authentification par code d'accès
 */
const AdminPage = () => {
  const router = useRouter();
  
  // États pour l'authentification admin
  const [adminAuth, setAdminAuth] = useState({
    isAuthenticated: false,
    accessCode: '',
    showPassword: false,
    isLoading: false,
  });

  /**
   * Vérifier si l'utilisateur est déjà authentifié (session storage)
   */
  useEffect(() => {
    const isAdminAuthenticated = sessionStorage.getItem('terralys_admin_auth');
    if (isAdminAuthenticated === 'true') {
      setAdminAuth(prev => ({ ...prev, isAuthenticated: true }));
    }
  }, []);

  /**
   * Gestion de l'authentification admin
   */
  const handleAdminAuth = async () => {
    setAdminAuth(prev => ({ ...prev, isLoading: true }));
    
    // Simulation d'une vérification asynchrone
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (adminAuth.accessCode === 'terralysadmin') {
      setAdminAuth(prev => ({ 
        ...prev, 
        isAuthenticated: true, 
        isLoading: false 
      }));
      
      // Sauvegarder l'authentification dans la session
      sessionStorage.setItem('terralys_admin_auth', 'true');
      
      toast.success('Accès administrateur accordé');
    } else {
      setAdminAuth(prev => ({ 
        ...prev, 
        accessCode: '', 
        isLoading: false 
      }));
      toast.error('Code d\'accès incorrect');
    }
  };

  /**
   * Déconnexion admin
   */
  const handleLogout = () => {
    setAdminAuth({
      isAuthenticated: false,
      accessCode: '',
      showPassword: false,
      isLoading: false,
    });
    sessionStorage.removeItem('terralys_admin_auth');
    toast.success('Déconnexion réussie');
  };

  /**
   * Retour aux paramètres
   */
  const handleBackToSettings = () => {
    router.push('/settings');
  };

  // Interface d'authentification
  if (!adminAuth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-red-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-red-600">
                Administration Terralys
              </CardTitle>
              <CardDescription>
                Accès restreint - Authentification requise
              </CardDescription>
              <Badge variant="destructive" className="mx-auto mt-2">
                Zone sécurisée
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-600">
                  <Key className="h-5 w-5" />
                  <span className="font-medium">Code d'accès requis</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminCode">Code d'accès administrateur</Label>
                  <div className="relative">
                    <Input
                      id="adminCode"
                      type={adminAuth.showPassword ? 'text' : 'password'}
                      value={adminAuth.accessCode}
                      onChange={(e) => setAdminAuth(prev => ({ 
                        ...prev, 
                        accessCode: e.target.value 
                      }))}
                      placeholder="Entrez le code d'accès"
                      className="pr-10"
                      disabled={adminAuth.isLoading}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !adminAuth.isLoading) {
                          handleAdminAuth();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setAdminAuth(prev => ({ 
                        ...prev, 
                        showPassword: !prev.showPassword 
                      }))}
                      disabled={adminAuth.isLoading}
                    >
                      {adminAuth.showPassword ? (
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
                    disabled={!adminAuth.accessCode || adminAuth.isLoading}
                  >
                    {adminAuth.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Vérification...
                      </>
                    ) : (
                      'Authentifier'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBackToSettings}
                    disabled={adminAuth.isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </div>
              </div>
              
              {/* Informations de sécurité */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Database className="h-4 w-4" />
                  <span>Accès aux données système</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Gestion des utilisateurs</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Activity className="h-4 w-4" />
                  <span>Monitoring système</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Settings className="h-4 w-4" />
                  <span>Configuration avancée</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Cet espace est réservé aux administrateurs autorisés.
                Toutes les actions sont enregistrées et surveillées.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Interface d'administration (une fois authentifié)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête admin avec déconnexion */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Administration Terralys
              </h1>
              <p className="text-sm text-gray-600">
                Panneau de contrôle système
              </p>
            </div>
            <Badge variant="destructive" className="ml-2">
              Admin
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToSettings}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
      
      {/* Contenu du module admin */}
      <div className="p-4">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default AdminPage;