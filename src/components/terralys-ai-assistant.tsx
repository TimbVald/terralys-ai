'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Search, ChevronDown, ChevronRight, Bot, User, Sparkles, BookOpen, Settings, HelpCircle, Zap, Shield, Leaf, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Interface pour définir la structure d'une question-réponse dans la base de connaissances
 */
interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

/**
 * Interface pour définir une catégorie de connaissances
 */
interface KnowledgeCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  items: KnowledgeItem[];
}

/**
 * Interface pour un message de chat
 */
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedItems?: KnowledgeItem[];
  isTyping?: boolean;
}

/**
 * Questions prédéfinies populaires pour la liste déroulante
 */
const popularQuestions: KnowledgeItem[] = [
  {
    id: 'detection-maladies',
    question: 'Comment analyser les maladies de mes plantes ?',
    answer: 'TerraLys propose un système complet d\'analyse des maladies des plantes. Téléchargez une photo de votre plante, ajoutez des données environnementales (température, humidité, pH du sol), et obtenez un diagnostic détaillé avec identification des maladies, parasites, carences nutritionnelles et recommandations de traitement personnalisées.',
    category: 'fonctionnalites',
    tags: ['analyse', 'diagnostic', 'maladies'],
    priority: 'high'
  },
  {
    id: 'agents-ia',
    question: 'Comment créer et utiliser des agents IA ?',
    answer: 'Les agents IA de TerraLys sont des assistants personnalisés que vous pouvez créer avec des instructions spécifiques. Chaque agent peut être configuré pour des tâches particulières (conseil en agriculture, diagnostic spécialisé, etc.) et utilisé dans des réunions virtuelles pour des consultations interactives.',
    category: 'fonctionnalites',
    tags: ['agents', 'IA', 'personnalisation'],
    priority: 'high'
  },
  {
    id: 'reunions-virtuelles',
    question: 'Comment organiser des réunions avec les agents IA ?',
    answer: 'Créez des réunions virtuelles avec vos agents IA pour des consultations en temps réel. Chaque réunion peut inclure des transcriptions automatiques, des enregistrements, et un suivi des recommandations. Parfait pour des sessions de conseil agricole personnalisées.',
    category: 'fonctionnalites',
    tags: ['réunions', 'consultation', 'temps-réel'],
    priority: 'high'
  },
  {
    id: 'historique-analyses',
    question: 'Comment consulter l\'historique de mes analyses ?',
    answer: 'Toutes vos analyses de plantes sont automatiquement sauvegardées avec un historique complet : photos, diagnostics, traitements appliqués, données environnementales, et évolution dans le temps. Vous pouvez imprimer des rapports détaillés et suivre les progrès de vos cultures.',
    category: 'fonctionnalites',
    tags: ['historique', 'suivi', 'rapports'],
    priority: 'medium'
  },
  {
    id: 'services-analyse',
    question: 'Quels services d\'analyse sont disponibles ?',
    answer: 'TerraLys propose trois services d\'analyse : analyse locale (rapide), analyse backend (précise avec IA avancée), et analyse Gemini (intelligence artificielle Google). Chaque service offre différents niveaux de précision et de détail selon vos besoins.',
    category: 'fonctionnalites',
    tags: ['services', 'analyse', 'précision'],
    priority: 'medium'
  },
  {
    id: 'version-premium',
    question: 'Quelles sont les fonctionnalités premium ?',
    answer: 'La version gratuite permet 3 agents IA et 3 réunions. La version premium offre un accès illimité aux agents et réunions, des analyses avancées, un support prioritaire, et des fonctionnalités exclusives pour les professionnels de l\'agriculture.',
    category: 'abonnement',
    tags: ['premium', 'limites', 'avantages'],
    priority: 'medium'
  }
];

/**
 * Base de connaissances complète de TerraLys AI
 */
const knowledgeBase: KnowledgeCategory[] = [
  {
    id: 'fonctionnalites',
    name: 'Fonctionnalités',
    icon: <Zap className="w-4 h-4" />,
    description: 'Fonctionnalités principales et secondaires de TerraLys AI',
    items: popularQuestions.filter(q => q.category === 'fonctionnalites')
  },
  {
    id: 'objectifs',
    name: 'Objectifs',
    icon: <Shield className="w-4 h-4" />,
    description: 'Objectifs stratégiques et opérationnels du projet',
    items: popularQuestions.filter(q => q.category === 'objectifs')
  },
  {
    id: 'cultures',
    name: 'Cultures Africaines',
    icon: <Leaf className="w-4 h-4" />,
    description: 'Informations sur les cultures supportées',
    items: popularQuestions.filter(q => q.category === 'cultures')
  }
];

/**
 * Composant principal de l'assistant TerraLys AI optimisé
 */
export default function TerraLysAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'chat' | 'knowledge'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  /**
   * Fait défiler automatiquement vers le bas des messages
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Recherche dans la base de connaissances
   */
  const searchKnowledge = (query: string): KnowledgeItem[] => {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    const allItems = knowledgeBase.flatMap(category => category.items);
    
    return allItems.filter(item => {
      const searchableText = `${item.question} ${item.answer} ${item.tags.join(' ')}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    }).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  /**
   * Génère une réponse basée sur la base de connaissances
   */
  const generateResponse = (query: string): string => {
    const results = searchKnowledge(query);
    
    if (results.length === 0) {
      return "Je n'ai pas trouvé d'informations spécifiques sur votre question dans ma base de connaissances. Pourriez-vous reformuler votre question ou consulter la section 'Base de Connaissances' pour explorer les sujets disponibles ?";
    }
    
    if (results.length === 1) {
      return results[0].answer;
    }
    
    const mainResult = results[0];
    const additionalCount = results.length - 1;
    
    return `${mainResult.answer}\n\nJ'ai trouvé ${additionalCount} autre${additionalCount > 1 ? 's' : ''} information${additionalCount > 1 ? 's' : ''} pertinente${additionalCount > 1 ? 's' : ''} sur ce sujet. Souhaitez-vous que je vous en dise plus ?`;
  };

  /**
   * Simule l'effet de saisie progressive pour les réponses
   */
  const typeMessage = async (content: string, messageId: string) => {
    setIsTyping(true);
    const words = content.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: currentText, isTyping: true }
          : msg
      ));
      
      // Délai réaliste entre les mots (50-150ms)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    }
    
    // Marquer la fin de la saisie
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isTyping: false }
        : msg
    ));
    setIsTyping(false);
  };

  /**
   * Gère la sélection d'une question prédéfinie
   */
  const handleQuestionSelect = async (item: KnowledgeItem) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: item.question,
      timestamp: new Date()
    };
    
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      relatedItems: [item],
      isTyping: true
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    
    // Démarrer l'effet de saisie progressive
    await typeMessage(item.answer, assistantMessageId);
  };

  /**
   * Navigation dans les questions prédéfinies avec animation fluide
   */
  const navigateQuestions = (direction: 'prev' | 'next') => {
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 1 : 3;
    
    if (direction === 'prev') {
      setCurrentQuestionIndex(prev => {
        const newIndex = prev - step;
        return newIndex < 0 ? Math.max(0, popularQuestions.length - step) : newIndex;
      });
    } else {
      setCurrentQuestionIndex(prev => {
        const newIndex = prev + step;
        return newIndex >= popularQuestions.length ? 0 : newIndex;
      });
    }
  };

  /**
   * Navigation automatique du carrousel (optionnelle)
   */
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    const interval = setInterval(() => {
      if (!isTyping) {
        navigateQuestions('next');
      }
    }, 5000); // Change toutes les 5 secondes
    setAutoPlayInterval(interval);
    setAutoPlay(true);
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    setAutoPlay(false);
  };

  /**
   * Gestion des gestes tactiles pour la navigation
   */
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      navigateQuestions('next');
    } else if (isRightSwipe) {
      navigateQuestions('prev');
    }
  };

  /**
   * Navigation directe vers une question spécifique
   */
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Nettoyage de l'auto-play au démontage du composant
  useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  /**
   * Bascule l'expansion d'une catégorie
   */
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  /**
   * Filtre les catégories selon la recherche
   */
  const filteredCategories = knowledgeBase.filter(category => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return category.name.toLowerCase().includes(searchLower) ||
           category.description.toLowerCase().includes(searchLower) ||
           category.items.some(item => 
             item.question.toLowerCase().includes(searchLower) ||
             item.answer.toLowerCase().includes(searchLower) ||
             item.tags.some(tag => tag.toLowerCase().includes(searchLower))
           );
  });

  /**
   * Questions visibles dans le carrousel (3 questions à la fois sur desktop, 1 sur mobile)
   */
  const getVisibleQuestions = () => {
    const questionsPerPage = isMobile ? 1 : 3;
    const questions = [];
    
    for (let i = 0; i < questionsPerPage; i++) {
      const index = (currentQuestionIndex + i) % popularQuestions.length;
      questions.push(popularQuestions[index]);
    }
    
    return questions;
  };

  return (
    <>
      {/* Bouton flottant optimisé */}
      <motion.div
        className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          aria-label="Ouvrir l'assistant TerraLys AI"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform duration-300" />
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Button>
      </motion.div>

      {/* Interface principale optimisée */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panneau principal */}
            <motion.div
              className="relative w-full max-w-md h-[85vh] md:h-[600px] md:w-96"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                {/* En-tête optimisé */}
                <CardHeader className="pb-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">TerraLys AI</CardTitle>
                        <p className="text-sm text-green-100">Assistant Intelligent</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                      aria-label="Fermer l'assistant"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Onglets optimisés */}
                  <div className="flex bg-white/10 rounded-lg p-1 mt-3">
                    <button
                      onClick={() => setSelectedCategory('chat')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedCategory === 'chat'
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-green-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Chat
                    </button>
                    <button
                      onClick={() => setSelectedCategory('knowledge')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedCategory === 'knowledge'
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-green-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Base de Connaissances
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  {selectedCategory === 'chat' ? (
                    <>
                      {/* Zone de messages optimisée */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-8"
                          >
                            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Sparkles className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Bienvenue sur TerraLys AI !
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Sélectionnez une question ci-dessous pour commencer
                            </p>
                          </motion.div>
                        )}

                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                              <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  message.type === 'user' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {message.type === 'user' ? (
                                    <User className="w-4 h-4" />
                                  ) : (
                                    <Bot className="w-4 h-4" />
                                  )}
                                </div>
                                <div className={`rounded-2xl px-4 py-3 max-w-full ${
                                  message.type === 'user'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {message.content}
                                    {message.isTyping && (
                                      <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="inline-block w-2 h-4 bg-current ml-1"
                                      />
                                    )}
                                  </p>
                                  {message.relatedItems && message.relatedItems.length > 0 && !message.isTyping && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                      {message.relatedItems.map((item) => (
                                        <Badge
                                          key={item.id}
                                          variant="secondary"
                                          className="text-xs cursor-pointer hover:bg-green-100 transition-colors"
                                          onClick={() => handleQuestionSelect(item)}
                                        >
                                          {item.tags[0]}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                  />
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                  />
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Questions populaires - Interface compacte */}
                      <div className="border-t p-2">
                        <div className="space-y-1">
                          {getVisibleQuestions().map((question, index) => (
                            <button
                              key={`${question.id}-${currentQuestionIndex}-${index}`}
                              onClick={() => handleQuestionSelect(question)}
                              disabled={isTyping}
                              className="w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {question.question}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Base de connaissances optimisée */
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4">
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher dans la base de connaissances..."
                            className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>

                        <div className="space-y-3">
                          {filteredCategories.map((category) => (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    {category.icon}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                                      {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{category.description}</p>
                                  </div>
                                </div>
                                <motion.div
                                  animate={{ rotate: expandedCategories.has(category.id) ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                </motion.div>
                              </button>

                              <AnimatePresence>
                                {expandedCategories.has(category.id) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 pt-0 space-y-2 bg-gray-50/50">
                                      {category.items
                                        .filter(item => {
                                          if (!searchQuery) return true;
                                          const searchLower = searchQuery.toLowerCase();
                                          return item.question.toLowerCase().includes(searchLower) ||
                                                 item.answer.toLowerCase().includes(searchLower) ||
                                                 item.tags.some(tag => tag.toLowerCase().includes(searchLower));
                                        })
                                        .map((item) => (
                                          <motion.button
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            onClick={() => {
                                              handleQuestionSelect(item);
                                              setSelectedCategory('chat');
                                            }}
                                            className="w-full p-3 text-left text-sm bg-white hover:bg-green-50 rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-200 group"
                                          >
                                            <div className="font-medium text-gray-900 mb-2 group-hover:text-green-700">
                                              {item.question}
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                              {item.tags.slice(0, 3).map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                  {tag}
                                                </Badge>
                                              ))}
                                            </div>
                                          </motion.button>
                                        ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}