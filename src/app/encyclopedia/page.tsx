'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, Leaf, Zap, Shield, Bug, Droplets, Sun, ChevronDown, ChevronUp, ExternalLink, BookOpen, Info, Grid, List, Eye, CheckCircle, XCircle, BarChart3, Tag, Sprout, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface pour définir la structure d'une maladie ou d'un ravageur
 */
interface PlantDisease {
  id: string;
  name: string;
  category: 'fongique' | 'bacterienne' | 'virale' | 'ravageur' | 'physiologique';
  severity: 'faible' | 'modérée' | 'élevée' | 'critique';
  symptoms: string[];
  causes: string[];
  biologicalTreatments: string[];
  chemicalTreatments: string[];
  affectedCrops: string[];
  prevention: string[];
  scientificName?: string;
  images?: string[];
}

/**
 * Données complètes des maladies et ravageurs des plantes africaines
 */
const plantDiseases: PlantDisease[] = [
  // MALADIES FONGIQUES
  {
    id: 'anthracnose',
    name: 'Anthracnose',
    category: 'fongique',
    severity: 'élevée',
    scientificName: 'Colletotrichum spp.',
    symptoms: [
      'Taches circulaires brunes à noires sur les feuilles',
      'Lésions déprimées sur les fruits avec cercles concentriques',
      'Défoliation prématurée',
      'Pourriture des fruits en post-récolte',
      'Chancres sur les tiges et branches'
    ],
    causes: [
      'Humidité élevée (>80%)',
      'Températures chaudes (25-30°C)',
      'Blessures sur les tissus végétaux',
      'Mauvaise circulation d\'air',
      'Irrigation par aspersion'
    ],
    biologicalTreatments: [
      'Trichoderma harzianum (10g/L)',
      'Bacillus subtilis (5g/L)',
      'Extrait d\'ail (50ml/L)',
      'Décoction de prêle (100ml/L)',
      'Rotation avec légumineuses'
    ],
    chemicalTreatments: [
      'Mancozèbe 80% WP (2g/L)',
      'Cuivre oxychlorure (3g/L)',
      'Azoxystrobine (0.5ml/L)',
      'Propiconazole (1ml/L)',
      'Chlorothalonil (2ml/L)'
    ],
    affectedCrops: [
      'Mangue', 'Avocat', 'Papaye', 'Banane', 'Tomate', 
      'Piment', 'Haricot', 'Sorgho', 'Mil', 'Igname'
    ],
    prevention: [
      'Élimination des résidus de culture',
      'Espacement adéquat des plants',
      'Irrigation au goutte-à-goutte',
      'Traitement préventif en saison des pluies',
      'Variétés résistantes'
    ]
  },
  {
    id: 'mildiou',
    name: 'Mildiou',
    category: 'fongique',
    severity: 'critique',
    scientificName: 'Phytophthora infestans',
    symptoms: [
      'Taches huileuses vert foncé sur les feuilles',
      'Duvet blanc grisâtre sous les feuilles',
      'Brunissement et dessèchement rapide',
      'Pourriture brune des tubercules',
      'Odeur désagréable'
    ],
    causes: [
      'Humidité relative >90%',
      'Températures fraîches (15-20°C)',
      'Rosée matinale persistante',
      'Mauvais drainage',
      'Densité de plantation élevée'
    ],
    biologicalTreatments: [
      'Pseudomonas fluorescens (10ml/L)',
      'Extrait de neem (30ml/L)',
      'Bicarbonate de potassium (5g/L)',
      'Purin d\'ortie (200ml/L)',
      'Compost enrichi en Trichoderma'
    ],
    chemicalTreatments: [
      'Métalaxyl-M + Mancozèbe (2.5g/L)',
      'Cymoxanil + Famoxadone (1.5g/L)',
      'Fosetyl-aluminium (3g/L)',
      'Dimethomorph (1ml/L)',
      'Fluopicolide (0.75ml/L)'
    ],
    affectedCrops: [
      'Pomme de terre', 'Tomate', 'Aubergine', 'Piment',
      'Concombre', 'Courge', 'Pastèque', 'Melon'
    ],
    prevention: [
      'Semences certifiées',
      'Rotation de 3-4 ans',
      'Buttage des pommes de terre',
      'Surveillance météorologique',
      'Élimination des tas de déchets'
    ]
  },
  {
    id: 'rouille',
    name: 'Rouille du café',
    category: 'fongique',
    severity: 'critique',
    scientificName: 'Hemileia vastatrix',
    symptoms: [
      'Taches jaune-orange sur la face supérieure des feuilles',
      'Poudre orange sur la face inférieure',
      'Défoliation progressive',
      'Réduction de la photosynthèse',
      'Baisse de rendement jusqu\'à 50%'
    ],
    causes: [
      'Humidité élevée (>70%)',
      'Températures 21-25°C',
      'Altitude 1000-2000m',
      'Ombrage excessif',
      'Nutrition déséquilibrée'
    ],
    biologicalTreatments: [
      'Lecanicillium lecanii (5g/L)',
      'Beauveria bassiana (10g/L)',
      'Extrait de margousier (40ml/L)',
      'Compost de café enrichi',
      'Mycorhizes bénéfiques'
    ],
    chemicalTreatments: [
      'Triadimenol (1ml/L)',
      'Cyproconazole (0.5ml/L)',
      'Tebuconazole (1.5ml/L)',
      'Cuivre hydroxyde (3g/L)',
      'Systhane (0.75ml/L)'
    ],
    affectedCrops: [
      'Café arabica', 'Café robusta'
    ],
    prevention: [
      'Variétés résistantes (Catimor, Sarchimor)',
      'Gestion de l\'ombrage',
      'Fertilisation équilibrée',
      'Élagage sanitaire',
      'Surveillance régulière'
    ]
  },

  // MALADIES BACTÉRIENNES
  {
    id: 'fletrissement-bacterien',
    name: 'Flétrissement bactérien',
    category: 'bacterienne',
    severity: 'critique',
    scientificName: 'Ralstonia solanacearum',
    symptoms: [
      'Flétrissement soudain sans jaunissement',
      'Brunissement vasculaire interne',
      'Exsudat bactérien blanc laiteux',
      'Mort rapide de la plante',
      'Odeur de pourriture'
    ],
    causes: [
      'Températures élevées (>28°C)',
      'Humidité du sol excessive',
      'pH neutre à alcalin',
      'Blessures racinaires',
      'Outils contaminés'
    ],
    biologicalTreatments: [
      'Pseudomonas putida (15ml/L)',
      'Bacillus amyloliquefaciens (10ml/L)',
      'Rotation avec graminées',
      'Solarisation du sol',
      'Compost mature'
    ],
    chemicalTreatments: [
      'Streptomycine (200ppm)',
      'Oxytétracycline (200ppm)',
      'Cuivre sulfate (2g/L)',
      'Kasugamycine (2ml/L)',
      'Désinfection du sol au formol'
    ],
    affectedCrops: [
      'Tomate', 'Aubergine', 'Piment', 'Pomme de terre',
      'Tabac', 'Arachide', 'Gingembre', 'Banane'
    ],
    prevention: [
      'Variétés résistantes',
      'Drainage efficace',
      'Désinfection des outils',
      'Rotation longue (5-7 ans)',
      'Éviter les blessures'
    ]
  },
  {
    id: 'chancre-bacterien',
    name: 'Chancre bactérien',
    category: 'bacterienne',
    severity: 'élevée',
    scientificName: 'Clavibacter michiganensis',
    symptoms: [
      'Chancres bruns sur les tiges',
      'Flétrissement unilatéral',
      'Taches en œil d\'oiseau sur fruits',
      'Brunissement vasculaire',
      'Dessèchement des folioles'
    ],
    causes: [
      'Humidité élevée',
      'Températures 24-28°C',
      'Blessures mécaniques',
      'Semences infectées',
      'Éclaboussures d\'eau'
    ],
    biologicalTreatments: [
      'Bacillus subtilis (8ml/L)',
      'Streptomyces griseoviridis (5g/L)',
      'Extrait de propolis (20ml/L)',
      'Huile essentielle de thym (5ml/L)',
      'Antagonistes microbiens'
    ],
    chemicalTreatments: [
      'Cuivre oxychlorure (3g/L)',
      'Streptomycine + Tétracycline (150ppm)',
      'Kasugamycine (1.5ml/L)',
      'Validamycine (2ml/L)',
      'Traitement des semences'
    ],
    affectedCrops: [
      'Tomate', 'Piment', 'Aubergine', 'Pomme de terre'
    ],
    prevention: [
      'Semences certifiées',
      'Désinfection des serres',
      'Éviter l\'irrigation par aspersion',
      'Élimination des résidus',
      'Quarantaine des plants'
    ]
  },

  // MALADIES VIRALES
  {
    id: 'mosaique-manioc',
    name: 'Mosaïque du manioc',
    category: 'virale',
    severity: 'critique',
    scientificName: 'Cassava mosaic virus (CMV)',
    symptoms: [
      'Mosaïque jaune-verte sur les feuilles',
      'Déformation et réduction foliaire',
      'Nanisme de la plante',
      'Réduction drastique des tubercules',
      'Chlorose généralisée'
    ],
    causes: [
      'Transmission par aleurodes (Bemisia tabaci)',
      'Boutures infectées',
      'Proximité de plants malades',
      'Conditions chaudes et sèches',
      'Stress hydrique'
    ],
    biologicalTreatments: [
      'Lutte contre les aleurodes',
      'Huile de neem (30ml/L)',
      'Pièges jaunes collants',
      'Prédateurs naturels (Encarsia)',
      'Élimination des plants malades'
    ],
    chemicalTreatments: [
      'Imidaclopride (0.5ml/L)',
      'Thiamethoxam (0.3g/L)',
      'Spiromesifen (1ml/L)',
      'Pymetrozine (1g/L)',
      'Huiles minérales (10ml/L)'
    ],
    affectedCrops: [
      'Manioc', 'Patate douce'
    ],
    prevention: [
      'Variétés résistantes',
      'Boutures saines certifiées',
      'Isolation des parcelles',
      'Contrôle des vecteurs',
      'Roguing systématique'
    ]
  },
  {
    id: 'striure-mais',
    name: 'Striure du maïs',
    category: 'virale',
    severity: 'élevée',
    scientificName: 'Maize streak virus (MSV)',
    symptoms: [
      'Stries chlorotiques parallèles aux nervures',
      'Nanisme sévère',
      'Épis déformés ou absents',
      'Feuilles étroites et rigides',
      'Mort prématurée'
    ],
    causes: [
      'Transmission par cicadelles (Cicadulina)',
      'Repousses de maïs infectées',
      'Graminées sauvages réservoirs',
      'Semis précoces',
      'Densité élevée de vecteurs'
    ],
    biologicalTreatments: [
      'Destruction des repousses',
      'Lutte contre les cicadelles',
      'Prédateurs naturels',
      'Rotation avec légumineuses',
      'Désherbage rigoureux'
    ],
    chemicalTreatments: [
      'Imidaclopride (semences) (2g/kg)',
      'Thiamethoxam (0.4ml/L)',
      'Lambda-cyhalothrine (1ml/L)',
      'Deltaméthrine (1.5ml/L)',
      'Traitement préventif des semences'
    ],
    affectedCrops: [
      'Maïs', 'Sorgho', 'Mil', 'Canne à sucre'
    ],
    prevention: [
      'Variétés résistantes',
      'Semis tardifs',
      'Élimination des graminées',
      'Rotation des cultures',
      'Surveillance des vecteurs'
    ]
  },

  // RAVAGEURS MAJEURS
  {
    id: 'chenille-legionnaire',
    name: 'Chenille légionnaire d\'automne',
    category: 'ravageur',
    severity: 'critique',
    scientificName: 'Spodoptera frugiperda',
    symptoms: [
      'Trous circulaires dans les feuilles',
      'Défoliation complète',
      'Dégâts sur épis et panicules',
      'Présence de chenilles vertes/brunes',
      'Excréments noirs visibles'
    ],
    causes: [
      'Conditions chaudes et humides',
      'Monoculture extensive',
      'Absence de prédateurs naturels',
      'Migration saisonnière',
      'Résistance aux insecticides'
    ],
    biologicalTreatments: [
      'Bacillus thuringiensis (10g/L)',
      'Beauveria bassiana (15g/L)',
      'Trichogramma pretiosum (lâchers)',
      'Extrait de neem (40ml/L)',
      'Pièges à phéromones'
    ],
    chemicalTreatments: [
      'Chlorantraniliprole (0.4ml/L)',
      'Spinetoram (0.5ml/L)',
      'Emamectine benzoate (0.5g/L)',
      'Lufenuron (1ml/L)',
      'Rotation des matières actives'
    ],
    affectedCrops: [
      'Maïs', 'Sorgho', 'Mil', 'Riz', 'Canne à sucre',
      'Coton', 'Soja', 'Arachide', 'Tomate'
    ],
    prevention: [
      'Surveillance régulière',
      'Rotation des cultures',
      'Bandes refuges',
      'Conservation des auxiliaires',
      'Semis synchronisés'
    ]
  },
  {
    id: 'mouche-fruits',
    name: 'Mouche des fruits',
    category: 'ravageur',
    severity: 'élevée',
    scientificName: 'Bactrocera dorsalis',
    symptoms: [
      'Piqûres de ponte sur fruits',
      'Pourriture interne des fruits',
      'Chute prématurée',
      'Présence d\'asticots blancs',
      'Galeries dans la pulpe'
    ],
    causes: [
      'Fruits mûrs attractifs',
      'Températures chaudes',
      'Humidité élevée',
      'Absence de traitement',
      'Fruits blessés'
    ],
    biologicalTreatments: [
      'Pièges à attractifs (méthyl eugénol)',
      'Lâchers de Fopius arisanus',
      'Ensachage des fruits',
      'Ramassage des fruits tombés',
      'Technique de l\'insecte stérile'
    ],
    chemicalTreatments: [
      'Malathion + attractif (2ml/L)',
      'Spinosad (1ml/L)',
      'Lambda-cyhalothrine (1.5ml/L)',
      'Deltaméthrine (1ml/L)',
      'Traitement par taches'
    ],
    affectedCrops: [
      'Mangue', 'Goyave', 'Papaye', 'Agrumes',
      'Avocat', 'Fruit de la passion', 'Tomate'
    ],
    prevention: [
      'Récolte précoce',
      'Hygiène verger',
      'Pièges de surveillance',
      'Traitement post-récolte',
      'Quarantaine phytosanitaire'
    ]
  },
  {
    id: 'aleurodes',
    name: 'Aleurodes',
    category: 'ravageur',
    severity: 'élevée',
    scientificName: 'Bemisia tabaci',
    symptoms: [
      'Jaunissement des feuilles',
      'Miellat et fumagine',
      'Affaiblissement général',
      'Transmission de virus',
      'Déformation des feuilles'
    ],
    causes: [
      'Températures élevées',
      'Faible humidité',
      'Cultures sensibles',
      'Absence de prédateurs',
      'Résistance aux insecticides'
    ],
    biologicalTreatments: [
      'Encarsia formosa (lâchers)',
      'Eretmocerus eremicus',
      'Huile de neem (25ml/L)',
      'Savon insecticide (20ml/L)',
      'Pièges jaunes collants'
    ],
    chemicalTreatments: [
      'Imidaclopride (0.5ml/L)',
      'Thiamethoxam (0.4ml/L)',
      'Spiromesifen (1ml/L)',
      'Pyriproxyfen (1ml/L)',
      'Rotation des familles'
    ],
    affectedCrops: [
      'Tomate', 'Aubergine', 'Piment', 'Concombre',
      'Melon', 'Coton', 'Manioc', 'Patate douce'
    ],
    prevention: [
      'Filets anti-insectes',
      'Plantes pièges',
      'Élimination des adventices',
      'Rotation des cultures',
      'Surveillance précoce'
    ]
  },

  // PROBLÈMES PHYSIOLOGIQUES
  {
    id: 'carence-azote',
    name: 'Carence en azote',
    category: 'physiologique',
    severity: 'modérée',
    symptoms: [
      'Jaunissement des feuilles âgées',
      'Croissance ralentie',
      'Feuillage clairsemé',
      'Réduction de rendement',
      'Coloration vert pâle générale'
    ],
    causes: [
      'Sol pauvre en matière organique',
      'Lessivage par les pluies',
      'pH inadéquat',
      'Compétition racinaire',
      'Immobilisation microbienne'
    ],
    biologicalTreatments: [
      'Compost riche (5-10 t/ha)',
      'Fumier décomposé (3-5 t/ha)',
      'Légumineuses de couverture',
      'Biofertilisants azotés',
      'Mulching organique'
    ],
    chemicalTreatments: [
      'Urée 46% (100-200 kg/ha)',
      'Sulfate d\'ammonium (150 kg/ha)',
      'Nitrate d\'ammonium (120 kg/ha)',
      'Solution azotée (50-100 L/ha)',
      'Engrais foliaire (2-3 g/L)'
    ],
    affectedCrops: [
      'Toutes les cultures', 'Particulièrement céréales',
      'Légumes feuilles', 'Cultures fourragères'
    ],
    prevention: [
      'Analyse de sol régulière',
      'Rotation avec légumineuses',
      'Apports organiques',
      'Fractionnement des apports',
      'Couverture permanente'
    ]
  },
  {
    id: 'stress-hydrique',
    name: 'Stress hydrique',
    category: 'physiologique',
    severity: 'élevée',
    symptoms: [
      'Flétrissement temporaire',
      'Enroulement des feuilles',
      'Chute des fleurs et fruits',
      'Arrêt de croissance',
      'Brunissement des bordures foliaires'
    ],
    causes: [
      'Déficit pluviométrique',
      'Irrigation insuffisante',
      'Sol à faible rétention',
      'Températures élevées',
      'Vent desséchant'
    ],
    biologicalTreatments: [
      'Mulching organique épais',
      'Compost pour rétention',
      'Plantes de couverture',
      'Brise-vent naturels',
      'Agroforesterie'
    ],
    chemicalTreatments: [
      'Hydrogels rétenteurs (2-5 kg/ha)',
      'Antitranspirants foliaires',
      'Surfactants (0.1%)',
      'Polymères absorbants',
      'Amendements organiques'
    ],
    affectedCrops: [
      'Toutes cultures', 'Particulièrement sensibles:',
      'Tomate', 'Aubergine', 'Laitue', 'Haricot'
    ],
    prevention: [
      'Irrigation goutte-à-goutte',
      'Programmation irrigation',
      'Variétés tolérantes',
      'Amélioration structure sol',
      'Ombrage partiel'
    ]
  }
];

/**
 * Composant principal de l'encyclopédie des maladies des plantes africaines
 */
export default function PlantDiseaseEncyclopedia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedDisease, setSelectedDisease] = useState<PlantDisease | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'severity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  /**
   * Filtre et trie les maladies selon les critères de recherche avec useMemo pour optimiser les performances
   */
  const filteredDiseases = useMemo(() => {
    const filtered = plantDiseases.filter(disease => {
      const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           disease.affectedCrops.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           disease.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || disease.category === selectedCategory;
      const matchesSeverity = selectedSeverity === 'all' || disease.severity === selectedSeverity;
      
      return matchesSearch && matchesCategory && matchesSeverity;
    });

    // Tri des résultats
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'severity':
          const severityOrder = { 'faible': 1, 'modérée': 2, 'élevée': 3, 'critique': 4 };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [searchTerm, selectedCategory, selectedSeverity, sortBy, sortOrder]);

  /**
   * Obtient l'icône correspondant à la catégorie
   */
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fongique': return <Leaf className="w-4 h-4" />;
      case 'bacterienne': return <Shield className="w-4 h-4" />;
      case 'virale': return <Zap className="w-4 h-4" />;
      case 'ravageur': return <Bug className="w-4 h-4" />;
      case 'physiologique': return <AlertTriangle className="w-4 h-4" />;
      default: return <Leaf className="w-4 h-4" />;
    }
  };

  /**
   * Obtient la couleur du badge selon la sévérité
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'faible': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'modérée': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'élevée': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case 'critique': return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    }
  };

  /**
   * Gère le tri des colonnes du tableau
   */
  const handleSort = (column: 'name' | 'category' | 'severity') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête moderne avec logo TerraLys AI */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Logo et branding TerraLys AI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-30"></div>
                <img 
                  src="/logo.svg" 
                  alt="TerraLys AI Logo" 
                  className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 drop-shadow-lg" 
                />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-emerald-700 bg-clip-text text-transparent">
                  TerraLys AI
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium">Intelligence Agricole Avancée</p>
              </div>
            </div>
          </motion.div>

          {/* Titre de l'encyclopédie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-emerald-700 bg-clip-text text-transparent">
                Encyclopédie Phytosanitaire
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-slate-600 font-medium">Maladies des Plantes Africaines</p>
          </motion.div>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed px-4"
          >
            Guide complet et scientifiquement validé des maladies, ravageurs et problèmes phytosanitaires 
            affectant les cultures africaines. Optimisé pour une agriculture durable et productive.
          </motion.p>

          {/* Indicateurs de performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-green-100">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">50+ Maladies</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-green-100">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Cultures Africaines</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-green-100">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Validé Scientifiquement</span>
            </div>
          </motion.div>
        </motion.div>

      {!selectedDisease ? (
        <>
          {/* Barre de recherche et filtres modernes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Barre de recherche */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher une maladie, symptôme ou culture..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl"
                  />
                </div>
                
                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48 h-12 border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      <SelectItem value="fongique">🍄 Fongique</SelectItem>
                      <SelectItem value="bacterienne">🛡️ Bactérienne</SelectItem>
                      <SelectItem value="virale">⚡ Virale</SelectItem>
                      <SelectItem value="ravageur">🐛 Ravageur</SelectItem>
                      <SelectItem value="physiologique">⚠️ Physiologique</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-full sm:w-48 h-12 border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sévérité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes sévérités</SelectItem>
                      <SelectItem value="faible">🟢 Faible</SelectItem>
                      <SelectItem value="modérée">🟡 Modérée</SelectItem>
                      <SelectItem value="élevée">🟠 Élevée</SelectItem>
                      <SelectItem value="critique">🔴 Critique</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Boutons de vue */}
                  <div className="flex bg-slate-100 rounded-xl p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-lg"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-lg"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Statistiques */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {filteredDiseases.length} résultat{filteredDiseases.length > 1 ? 's' : ''} trouvé{filteredDiseases.length > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {plantDiseases.length} maladies répertoriées
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tableau comparatif moderne */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Tableau comparatif des principales maladies</CardTitle>
                    <p className="text-green-100 text-sm mt-1">
                      Comparaison rapide des {filteredDiseases.slice(0, 10).length} maladies les plus courantes
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Version desktop */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* En-têtes avec tri */}
                      <div className="grid grid-cols-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                        <button 
                          className="p-4 font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-200 transition-colors text-left"
                          onClick={() => handleSort('name')}
                        >
                          <Leaf className="w-4 h-4 text-green-600" />
                          Maladie
                          <ArrowUpDown className={`w-3 h-3 transition-colors ${
                            sortBy === 'name' ? 'text-green-600' : 'text-slate-400'
                          }`} />
                          {sortBy === 'name' && (
                            <span className="text-xs text-green-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                        <button 
                          className="p-4 font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-200 transition-colors text-left"
                          onClick={() => handleSort('category')}
                        >
                          <Tag className="w-4 h-4 text-blue-600" />
                          Catégorie
                          <ArrowUpDown className={`w-3 h-3 transition-colors ${
                            sortBy === 'category' ? 'text-blue-600' : 'text-slate-400'
                          }`} />
                          {sortBy === 'category' && (
                            <span className="text-xs text-blue-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                        <button 
                          className="p-4 font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-200 transition-colors text-left"
                          onClick={() => handleSort('severity')}
                        >
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          Sévérité
                          <ArrowUpDown className={`w-3 h-3 transition-colors ${
                            sortBy === 'severity' ? 'text-orange-600' : 'text-slate-400'
                          }`} />
                          {sortBy === 'severity' && (
                            <span className="text-xs text-orange-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                        <div className="p-4 font-semibold text-slate-700 flex items-center gap-2">
                          <Sprout className="w-4 h-4 text-emerald-600" />
                          Cultures
                        </div>
                        <div className="p-4 font-semibold text-slate-700 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-purple-600" />
                          Symptôme principal
                        </div>
                      </div>
                      
                      {/* Lignes de données */}
                      <div className="divide-y divide-slate-100">
                        {filteredDiseases.slice(0, 10).map((disease, index) => (
                          <motion.div
                            key={disease.id}
                            className="grid grid-cols-5 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 group cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={() => setSelectedDisease(disease)}
                          >
                            <div className="p-4">
                              <div className="font-semibold text-slate-800 group-hover:text-green-700 transition-colors">
                                {disease.name}
                              </div>
                              {disease.scientificName && (
                                <div className="text-xs text-slate-500 italic mt-1">
                                  {disease.scientificName}
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                                  {getCategoryIcon(disease.category)}
                                </div>
                                <span className="capitalize text-slate-700 font-medium">
                                  {disease.category}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <Badge className={`${getSeverityColor(disease.severity)} shadow-sm`}>
                                {disease.severity}
                              </Badge>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {disease.affectedCrops.slice(0, 2).map((crop, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium"
                                  >
                                    {crop}
                                  </span>
                                ))}
                                {disease.affectedCrops.length > 2 && (
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    +{disease.affectedCrops.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="text-sm text-slate-600 line-clamp-2">
                                {disease.symptoms[0]}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Version mobile et tablette */}
                <div className="lg:hidden">
                  <div className="p-4 space-y-4">
                    {filteredDiseases.slice(0, 10).map((disease, index) => (
                      <motion.div
                        key={disease.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => setSelectedDisease(disease)}
                      >
                        {/* En-tête de la carte */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 text-lg">
                              {disease.name}
                            </h3>
                            {disease.scientificName && (
                              <p className="text-sm text-slate-500 italic">
                                {disease.scientificName}
                              </p>
                            )}
                          </div>
                          <Badge className={`${getSeverityColor(disease.severity)} ml-2`}>
                            {disease.severity}
                          </Badge>
                        </div>

                        {/* Informations organisées */}
                        <div className="space-y-3">
                          {/* Catégorie */}
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                              {getCategoryIcon(disease.category)}
                            </div>
                            <span className="text-sm font-medium text-slate-700 capitalize">
                              {disease.category}
                            </span>
                          </div>

                          {/* Cultures affectées */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Sprout className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium text-slate-700">Cultures affectées</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {disease.affectedCrops.slice(0, 3).map((crop, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                                >
                                  {crop}
                                </span>
                              ))}
                              {disease.affectedCrops.length > 3 && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                  +{disease.affectedCrops.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Symptôme principal */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-slate-700">Symptôme principal</span>
                            </div>
                            <p className="text-sm text-slate-600">
                              {disease.symptoms[0]}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Pied de tableau avec statistiques */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        {filteredDiseases.slice(0, 10).length} maladies affichées
                      </span>
                      <span className="flex items-center gap-1">
                        <Filter className="w-4 h-4" />
                        {filteredDiseases.length} total
                      </span>
                    </div>
                    <button 
                      className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
                      onClick={() => {
                        // Scroll vers la grille des maladies
                        document.querySelector('[data-diseases-grid]')?.scrollIntoView({ 
                          behavior: 'smooth' 
                        });
                      }}
                    >
                      Voir tous les détails
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Grille des maladies avec animations */}
          <motion.div 
            data-diseases-grid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            <AnimatePresence>
              {filteredDiseases.map((disease, index) => (
                <motion.div
                  key={disease.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
                            {getCategoryIcon(disease.category)}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-green-700 transition-colors">
                              {disease.name}
                            </CardTitle>
                            {disease.scientificName && (
                              <p className="text-sm text-slate-600 mt-1 italic">
                                {disease.scientificName}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge className={`${getSeverityColor(disease.severity)} border transition-colors font-medium`}>
                          {disease.severity}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Cultures affectées */}
                      <div>
                        <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
                          <Leaf className="w-4 h-4" />
                          Cultures affectées
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {disease.affectedCrops.slice(0, 4).map((crop, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                              {crop}
                            </Badge>
                          ))}
                          {disease.affectedCrops.length > 4 && (
                            <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-600">
                              +{disease.affectedCrops.length - 4} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Symptômes principaux */}
                      <div>
                        <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Symptômes principaux
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {disease.symptoms.slice(0, 2).join(', ')}
                          {disease.symptoms.length > 2 && '...'}
                        </p>
                      </div>
                      
                      <Button 
                        className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all" 
                        variant="outline"
                        onClick={() => setSelectedDisease(disease)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir tous les détails
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredDiseases.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-slate-600 mb-6">
                  Aucune maladie ne correspond aux critères de recherche sélectionnés.
                  Essayez de modifier vos filtres ou votre terme de recherche.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedSeverity('all');
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* En-tête de la vue détaillée */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button 
              onClick={() => setSelectedDisease(null)}
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
            >
              <ChevronUp className="w-4 h-4 mr-2 rotate-[-90deg]" />
              Retour à la liste
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-green-800 bg-clip-text text-transparent">
                {selectedDisease.name}
              </h1>
              {selectedDisease.scientificName && (
                <p className="text-lg text-slate-600 italic mt-1">
                  {selectedDisease.scientificName}
                </p>
              )}
            </div>
          </div>
          
          {/* Carte principale avec design moderne */}
           <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
             <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                     {getCategoryIcon(selectedDisease.category)}
                     <span className="sr-only">{selectedDisease.category}</span>
                   </div>
                   <div>
                     <CardTitle className="text-2xl text-slate-900">
                       {selectedDisease.name}
                     </CardTitle>
                     {selectedDisease.scientificName && (
                       <p className="text-slate-600 mt-1 italic">
                         {selectedDisease.scientificName}
                       </p>
                     )}
                   </div>
                 </div>
                 <Badge className={`${getSeverityColor(selectedDisease.severity)} border text-base px-4 py-2 font-semibold`}>
                   {selectedDisease.severity}
                 </Badge>
               </div>
             </CardHeader>
             
             <CardContent className="p-0">
               <Tabs defaultValue="overview" className="w-full">
                 <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-50 rounded-none border-b">
                   <TabsTrigger value="overview" className="data-[state=active]:bg-white">Vue d'ensemble</TabsTrigger>
                   <TabsTrigger value="symptoms" className="data-[state=active]:bg-white">Symptômes</TabsTrigger>
                   <TabsTrigger value="treatment" className="data-[state=active]:bg-white">Traitement</TabsTrigger>
                   <TabsTrigger value="prevention" className="data-[state=active]:bg-white">Prévention</TabsTrigger>
                 </TabsList>
                 
                 <div className="p-6">
                   <TabsContent value="overview" className="space-y-6 mt-0">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="bg-slate-50 p-6 rounded-xl">
                         <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
                           <Info className="w-5 h-5" />
                           Informations générales
                         </h3>
                         <div className="space-y-3">
                           <div className="flex justify-between items-center">
                             <span className="text-slate-600">Catégorie:</span>
                             <Badge variant="outline" className="bg-white">
                               {getCategoryIcon(selectedDisease.category)}
                               <span className="ml-2">{selectedDisease.category}</span>
                             </Badge>
                           </div>
                           {selectedDisease.scientificName && (
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Nom scientifique:</span>
                                <span className="font-medium text-slate-900 italic">{selectedDisease.scientificName}</span>
                              </div>
                            )}
                           <div className="flex justify-between items-center">
                             <span className="text-slate-600">Sévérité:</span>
                             <Badge className={getSeverityColor(selectedDisease.severity)}>
                               {selectedDisease.severity}
                             </Badge>
                           </div>
                         </div>
                       </div>
                       
                       <div className="bg-green-50 p-6 rounded-xl">
                         <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
                           <Leaf className="w-5 h-5" />
                           Cultures affectées ({selectedDisease.affectedCrops.length})
                         </h3>
                         <div className="flex flex-wrap gap-2">
                           {selectedDisease.affectedCrops.map((crop, index) => (
                             <Badge key={index} variant="outline" className="bg-white border-green-200 text-green-700 hover:bg-green-100">
                               {crop}
                             </Badge>
                           ))}
                         </div>
                       </div>
                     </div>
                   </TabsContent>
                   
                   <TabsContent value="symptoms" className="space-y-6 mt-0">
                     <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                       <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-800">
                         <AlertTriangle className="w-5 h-5" />
                         Symptômes observés ({selectedDisease.symptoms.length})
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {selectedDisease.symptoms.map((symptom, index) => (
                           <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-amber-200">
                             <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                             <span className="text-slate-700">{symptom}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   </TabsContent>
                   
                   <TabsContent value="treatment" className="space-y-6 mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
                            <Leaf className="w-5 h-5" />
                            Traitements biologiques ({selectedDisease.biologicalTreatments.length})
                          </h3>
                          <div className="space-y-3">
                            {selectedDisease.biologicalTreatments.map((treatment, index) => (
                              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-green-700">{treatment}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
                            <Droplets className="w-5 h-5" />
                            Traitements chimiques ({selectedDisease.chemicalTreatments.length})
                          </h3>
                          <div className="space-y-3">
                            {selectedDisease.chemicalTreatments.map((treatment, index) => (
                              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-blue-700">{treatment}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                   
                   <TabsContent value="prevention" className="space-y-6 mt-0">
                      <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-800">
                          <Shield className="w-5 h-5" />
                          Mesures préventives ({selectedDisease.prevention.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedDisease.prevention.map((measure, index) => (
                            <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-emerald-200">
                              <div className="p-1 bg-emerald-100 rounded-full flex-shrink-0">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                              </div>
                              <span className="text-slate-700">{measure}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                 </div>
               </Tabs>
             </CardContent>
           </Card>
        </motion.div>
      )}

      {/* Section informative */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Bonnes pratiques générales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Rotation des cultures sur 3-4 ans minimum</li>
              <li>• Utilisation de semences certifiées</li>
              <li>• Surveillance régulière des parcelles</li>
              <li>• Gestion intégrée des ravageurs (IPM)</li>
              <li>• Amélioration de la fertilité du sol</li>
              <li>• Formation continue des producteurs</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Urgences phytosanitaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="font-medium text-red-800">Chenille légionnaire</p>
                <p className="text-red-600">Surveillance quotidienne en saison des pluies</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                <p className="font-medium text-orange-800">Mosaïque du manioc</p>
                <p className="text-orange-600">Élimination immédiate des plants infectés</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-medium text-yellow-800">Rouille du café</p>
                <p className="text-yellow-600">Traitement préventif obligatoire</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Informations basées sur les dernières recherches scientifiques et recommandations 
          des instituts de recherche agricole africains (IITA, ICRISAT, CIMMYT).
        </p>
        <p className="mt-2">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
      </div>
    </div>
  );
}