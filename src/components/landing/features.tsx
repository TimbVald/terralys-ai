'use client';
 
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Video, Mic, Bot, FileText, MessageSquare, BarChart3, Sparkles } from 'lucide-react';
 
const features = [
  {
    step: 'Fonctionnalité 1',
    title: 'Enregistrement Automatique',
    content:
      'Enregistrez automatiquement vos meetings avec une qualité HD. Stockage sécurisé et accès instantané à tous vos enregistrements.',
    icon: <Video className="h-6 w-6 text-primary" />,
    image:
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop',
  },
  {
    step: 'Fonctionnalité 2',
    title: 'Transcription IA Avancée',
    content:
      'Transcription en temps réel avec une précision de 98.5%. Support multilingue et reconnaissance des intervenants.',
    icon: <Mic className="h-6 w-6 text-primary" />,
    image:
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop',
  },
  {
    step: 'Fonctionnalité 3',
    title: 'Agents IA Personnalisés',
    content:
      'Créez des agents IA spécialisés pour analyser vos meetings selon vos besoins spécifiques et votre secteur d\'activité.',
    icon: <Bot className="h-6 w-6 text-primary" />,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
  {
    step: 'Fonctionnalité 4',
    title: 'Chat avec vos Meetings',
    content:
      'Posez des questions à vos meetings enregistrés. L\'IA TerraLys répond en se basant sur le contenu de vos réunions.',
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
];
 
/**
 * Composant Features modernisé pour TerraLys
 * Présente les fonctionnalités principales avec des animations et un design cohérent
 */
export default function FeatureSteps() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
 
  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (5000 / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);
 
    return () => clearInterval(timer);
  }, [progress]);
 
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/50">
      {/* Effets de fond */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-400/10 blur-[120px]"></div>
        <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-[120px]"></div>
      </div>
      
      <div className="relative mx-auto w-full max-w-7xl px-8 md:px-12">
        <div className="relative mx-auto mb-16 max-w-3xl text-center">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 inline-flex items-center rounded-full border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-500/20 dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-300"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Fonctionnalités IA Avancées
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:via-blue-200 dark:to-indigo-200 md:text-5xl lg:text-6xl"
            >
              Une Plateforme IA Révolutionnaire
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-relaxed text-slate-600 dark:text-slate-300"
            >
              TerraLys transforme vos réunions en données exploitables grâce à l'intelligence artificielle.
              Découvrez nos fonctionnalités révolutionnaires qui révolutionnent la productivité.
            </motion.p>
          </div>
          
          {/* Effet de lueur de fond */}
          <div className="absolute inset-0 mx-auto h-60 max-w-md blur-[100px] opacity-30">
            <div className="h-full w-full bg-gradient-to-r from-blue-400/20 via-indigo-400/30 to-purple-400/20"></div>
          </div>
        </div>
        
        <div className="mx-auto mb-12 h-px w-1/3 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent dark:via-blue-500/30"></div>
 
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Liste des fonctionnalités */}
          <div className="order-2 space-y-6 lg:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative cursor-pointer"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                onClick={() => setCurrentFeature(index)}
              >
                <div className={cn(
                  "relative flex items-start gap-6 rounded-2xl border p-6 transition-all duration-500",
                  index === currentFeature
                    ? "border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 shadow-lg shadow-blue-100/50 dark:border-blue-500/30 dark:from-blue-950/50 dark:to-indigo-950/50 dark:shadow-blue-900/20"
                    : "border-slate-200/50 bg-white/50 hover:border-blue-200/70 hover:bg-blue-50/30 dark:border-slate-700/50 dark:bg-slate-900/50 dark:hover:border-blue-500/30 dark:hover:bg-blue-950/20"
                )}>
                  {/* Indicateur de progression */}
                  {index === currentFeature && (
                    <motion.div
                      className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-indigo-600"
                      initial={{ height: 0 }}
                      animate={{ height: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                  
                  {/* Icône */}
                  <motion.div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all duration-300",
                      index === currentFeature
                        ? "border-blue-300 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-lg shadow-blue-200/50 dark:border-blue-400/50 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-400"
                        : "border-slate-300 bg-slate-100 text-slate-600 group-hover:border-blue-300/70 group-hover:bg-blue-100/50 group-hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:border-blue-400/50 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400"
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {feature.icon}
                  </motion.div>
 
                  {/* Contenu */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        index === currentFeature
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      )}>
                        {feature.step}
                      </span>
                      {index === currentFeature && (
                        <motion.div
                          className="h-2 w-2 rounded-full bg-blue-500"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    <h3 className={cn(
                      "text-xl font-bold transition-colors duration-300 md:text-2xl",
                      index === currentFeature
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white"
                    )}>
                      {feature.title}
                    </h3>
                    
                    <p className={cn(
                      "text-sm leading-relaxed transition-colors duration-300 md:text-base",
                      index === currentFeature
                        ? "text-slate-600 dark:text-slate-300"
                        : "text-slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300"
                    )}>
                      {feature.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
 
          {/* Affichage des images */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[300px] overflow-hidden rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 shadow-2xl shadow-blue-100/50 backdrop-blur-sm dark:border-blue-500/20 dark:from-blue-950/30 dark:to-indigo-950/30 dark:shadow-blue-900/20 md:h-[400px] lg:h-[500px]">
              {/* Effets de fond */}
              <div className="absolute inset-0">
                <div className="absolute right-4 top-4 h-32 w-32 rounded-full bg-blue-400/10 blur-[60px]"></div>
                <div className="absolute bottom-4 left-4 h-24 w-24 rounded-full bg-indigo-400/10 blur-[40px]"></div>
              </div>
              
              <AnimatePresence mode="wait">
                {features.map(
                  (feature, index) =>
                    index === currentFeature && (
                      <motion.div
                        key={index}
                        className="absolute inset-0 overflow-hidden rounded-3xl"
                        initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        exit={{ scale: 1.1, opacity: 0, rotateY: 15 }}
                        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <div className="relative h-full w-full">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                            width={1000}
                            height={500}
                          />
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                          
                          {/* Badge de fonctionnalité */}
                          <motion.div
                            className="absolute bottom-6 left-6 rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                              <span className="text-sm font-semibold text-white">
                                {feature.step}
                              </span>
                            </div>
                          </motion.div>
                          
                          {/* Indicateur de progression circulaire */}
                          <motion.div
                            className="absolute right-6 top-6 h-12 w-12"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                              <path
                                className="stroke-white/20"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <motion.path
                                className="stroke-blue-400"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: progress / 100 }}
                                transition={{ duration: 0.1 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {Math.round(progress)}%
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 