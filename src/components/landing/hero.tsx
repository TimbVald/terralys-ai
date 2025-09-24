'use client';
 
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Database,
  Sparkles,
  Zap,
  ArrowUpRight,
  Wrench,
  Users,
  Building,
  Bot,
  Video,
  Leaf,
  Camera,
} from 'lucide-react';
 
// Statistiques adaptées à TerraLys - plateforme IA complète
const stats = [
  { label: 'Analyses de Plantes', value: 1500, suffix: '+' },
  { label: 'Meetings Analysés', value: 250, suffix: '+' },
  { label: 'Agents IA Créés', value: 50, suffix: '+' },
  { label: 'Précision IA', value: 98.5, suffix: '%' },
];

/**
 * Composant Hero adapté pour TerraLys
 * Présente la plateforme de meetings avec IA et ses fonctionnalités principales
 */
export default function AppHero() {
  // State for animated counters
  const [statsState, setStatsState] = useState({
    plants: 0,
    meetings: 0,
    agents: 0,
    precision: 0,
  });
 
  // Animation to count up numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setStatsState((prev) => {
        const newPlants = prev.plants >= 1500 ? 1500 : prev.plants + 25;
        const newMeetings = prev.meetings >= 250 ? 250 : prev.meetings + 10;
        const newAgents = prev.agents >= 50 ? 50 : prev.agents + 3;
        const newPrecision = prev.precision >= 98.5 ? 98.5 : prev.precision + 2.3;
 
        if (
          newPlants === 1500 &&
          newMeetings === 250 &&
          newAgents === 50 &&
          newPrecision === 98.5
        ) {
          clearInterval(interval);
        }
 
        return {
          plants: newPlants,
          meetings: newMeetings,
          agents: newAgents,
          precision: newPrecision,
        };
      });
    }, 50);
 
    return () => clearInterval(interval);
  }, []);
 
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
 
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };
 
  // Floating animation for the cube
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };
 
  // Rotation animation for the orbital ring
  const rotateAnimation = {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  };
 
  // Glowing effect animation
  const glowAnimation = {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };
 
  // Tooltip animation
  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        delay: 1.2,
      },
    },
  };
 
  // Badge pulse animation
  const badgePulse = {
    scale: [1, 1.05, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };
 
  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Fond principal avec gradient moderne */}
      <div className="absolute inset-0 z-0 h-full w-full opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-950/80 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"></div>
      </div>

      {/* Effet de bruit subtil */}
      <svg
        id="noise"
        className="absolute inset-0 z-10 h-full w-full opacity-20"
      >
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          ></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.3"></feFuncR>
            <feFuncG type="linear" slope="0.3"></feFuncG>
            <feFuncB type="linear" slope="0.35"></feFuncB>
            <feFuncA type="linear" slope="0.25"></feFuncA>
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)"></rect>
      </svg>

      {/* Effets de fond améliorés */}
      <div className="absolute inset-0 z-0">
        {/* Grille moderne */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(59,130,246,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:6rem_6rem]"></div>
        </div>
 
        {/* Spots lumineux améliorés */}
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-primary/15 blur-[120px]"></div>
        <motion.div
          animate={glowAnimation}
          className="absolute left-1/4 top-1/3 h-60 w-60 rounded-full bg-primary/8 blur-[100px]"
        ></motion.div>
        <motion.div
          animate={glowAnimation}
          className="absolute bottom-1/3 right-1/4 h-60 w-60 rounded-full bg-primary/8 blur-[100px]"
        ></motion.div>
 
        {/* Particle effects - subtle dots */}
        <div className="absolute inset-0 opacity-20">
          {[
            { top: 15, left: 25, duration: 4, delay: 0.5 },
            { top: 35, left: 75, duration: 3.5, delay: 1 },
            { top: 55, left: 15, duration: 4.5, delay: 0.2 },
            { top: 75, left: 85, duration: 3, delay: 1.5 },
            { top: 25, left: 45, duration: 4.2, delay: 0.8 },
            { top: 65, left: 35, duration: 3.8, delay: 0.3 },
            { top: 85, left: 65, duration: 4.8, delay: 1.2 },
            { top: 45, left: 90, duration: 3.2, delay: 0.7 },
            { top: 10, left: 60, duration: 4.3, delay: 0.1 },
            { top: 90, left: 20, duration: 3.7, delay: 1.8 },
            { top: 30, left: 80, duration: 4.1, delay: 0.4 },
            { top: 70, left: 10, duration: 3.9, delay: 1.3 },
            { top: 50, left: 55, duration: 4.6, delay: 0.6 },
            { top: 20, left: 70, duration: 3.3, delay: 1.7 },
            { top: 80, left: 40, duration: 4.4, delay: 0.9 },
            { top: 40, left: 95, duration: 3.6, delay: 1.1 },
            { top: 60, left: 5, duration: 4.7, delay: 0.15 },
            { top: 95, left: 50, duration: 3.4, delay: 1.6 },
            { top: 5, left: 85, duration: 4.9, delay: 1.4 },
            { top: 85, left: 30, duration: 3.1, delay: 0.25 }
          ].map((particle, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut' as const,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      </div>
 
      <div className="fadein-blur relative z-0 mx-auto mb-10 h-[300px] w-[300px] lg:absolute lg:right-1/2 lg:top-1/2 lg:mx-0 lg:mb-0 lg:h-[500px] lg:w-[500px] lg:-translate-y-2/3 lg:translate-x-1/2">
        <img
          src="https://blocks.mvp-subha.me/AdobeExpress-file(1).png"
          alt="Machine Care GMAO Platform 3D Visualization"
          className="h-full w-full object-contain drop-shadow-[0_0_35px_#3358ea85] transition-all duration-1000 hover:scale-110"
        />
        <motion.div
          variants={tooltipVariants}
          className="absolute -left-4 top-4 rounded-lg border border-green-500/30 bg-black/80 p-2 backdrop-blur-md lg:-left-20 lg:top-1/4"
        >
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-400" />
            <span className="text-xs font-medium text-green-200">
              Détection Maladies
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={tooltipVariants}
          className="absolute -left-4 top-20 rounded-lg border border-blue-500/30 bg-black/80 p-2 backdrop-blur-md lg:-left-20 lg:top-1/2"
        >
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-200">
              Meetings IA
            </span>
          </div>
        </motion.div>
 
        <motion.div
          variants={tooltipVariants}
          className="absolute -right-4 top-1/2 rounded-lg border border-indigo-500/30 bg-black/80 p-2 backdrop-blur-md lg:-right-24"
        >
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-200">
              Agents IA Personnalisés
            </span>
          </div>
        </motion.div>
 
        <motion.div
          variants={tooltipVariants}
          className="absolute bottom-4 left-4 rounded-lg border border-purple-500/30 bg-black/80 p-2 backdrop-blur-md lg:bottom-1/4 lg:left-8"
        >
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-200">
              Analyse d'Images
            </span>
          </div>
        </motion.div>
      </div>
 
      {/* Main Content Area */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mb-10 flex w-full max-w-[1450px] flex-grow flex-col items-center justify-center px-4 text-center sm:px-8 lg:mb-0 lg:items-start lg:justify-end lg:text-left"
      >
        <motion.div className="flex w-full flex-col items-center justify-between lg:flex-row lg:items-start">
          <div className="w-full lg:w-auto">
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/10 px-4 py-2 text-sm text-primary/80 backdrop-blur-sm"
            >
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="mr-2 rounded-full bg-gradient-to-r from-green-500 to-primary px-3 py-1 text-xs font-semibold text-white shadow-lg">
                IA Avancée
              </span>
              Plateforme TerraLys - Agriculture & Meetings Intelligents
            </motion.div>
 
            <motion.h1
              variants={itemVariants}
              className="mb-8 bg-gradient-to-r from-white via-primary/80 to-white bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
            >
              L'IA au service de <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-green-400 via-primary to-primary bg-clip-text text-transparent">
                l'Agriculture & Business
              </span>
            </motion.h1>
 
            {/* Animated Stats Row */}
            <motion.div
              variants={itemVariants}
              className="mb-6 flex flex-wrap justify-center gap-4 md:gap-6 lg:justify-start"
            >
              <div className="rounded-lg border border-green-500/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">
                  {statsState.plants.toLocaleString()}+
                </p>
                <p className="text-xs text-gray-400">Analyses de Plantes</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">
                  {statsState.meetings.toLocaleString()}+
                </p>
                <p className="text-xs text-gray-400">Meetings Analysés</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">
                  {statsState.agents.toLocaleString()}+
                </p>
                <p className="text-xs text-gray-400">Agents IA Créés</p>
              </div>
              <div className="rounded-lg border border-purple-500/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">
                  {statsState.precision.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">Précision IA</p>
              </div>
            </motion.div>
 
            {/* Integration badges */}
            <motion.div
              variants={itemVariants}
              className="mb-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              <span className="text-xs font-medium text-gray-400">
                Modules intégrés:
              </span>
              <div className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm transition-all hover:bg-green-950">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                Détection Maladies
              </div>
              <div className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm transition-all hover:bg-blue-950">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                Meetings IA
              </div>
              <div className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm transition-all hover:bg-indigo-950">
                <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                Agents Personnalisés
              </div>
              <div className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm transition-all hover:bg-purple-950">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                Dashboard & Premium
              </div>
            </motion.div>
          </div>
 
          <div className="mt-6 flex flex-col items-center lg:mt-0 lg:items-end">
            <motion.p
              variants={itemVariants}
              className="mb-8 max-w-md px-6 text-center text-lg leading-relaxed text-slate-300/90 lg:text-end"
            >
              TerraLys révolutionne l'agriculture et le business avec l'IA. 
              Détection des maladies des plantes, meetings intelligents, 
              agents IA personnalisés et analytics avancés.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mb-8 flex flex-col flex-wrap gap-4 sm:flex-row lg:justify-end"
            >
              <Button
                className="group rounded-xl border border-primary/50 bg-gradient-to-r from-primary via-primary to-primary px-8 py-4 text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/40"
                size="lg"
              >
                Démarrer Gratuitement
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
 
              <Button
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:text-white"
                size="lg"
              >
                <Video className="mr-2 h-5 w-5" />
                Voir la Démo
              </Button>
            </motion.div>
 
            {/* Preuve sociale */}
            <motion.div
              variants={itemVariants}
              className="mx-auto flex items-center gap-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/20 to-primary/30 px-4 py-2 backdrop-blur-sm lg:mx-0 lg:ml-auto"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 overflow-hidden rounded-full border-2 border-primary/30 bg-gradient-to-br from-primary to-primary shadow-lg"
                  >
                    <div className="h-full w-full bg-gradient-to-br from-primary/80 to-primary opacity-90"></div>
                  </div>
                ))}
              </div>
              <span className="text-sm text-primary/80">
                <span className="font-bold text-white">1000+</span>{' '}
                entreprises font confiance à TerraLys
              </span>
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </motion.div>
          </div>
        </motion.div>
      </motion.main>
      <div className="absolute -bottom-40 left-1/2 right-auto h-96 w-20 -translate-x-1/2 -rotate-45 rounded-full bg-gray-200/30 blur-[80px] lg:left-auto lg:right-96 lg:translate-x-0"></div>
      <div className="absolute -bottom-52 left-1/2 right-auto h-96 w-20 -translate-x-1/2 -rotate-45 rounded-full bg-gray-300/20 blur-[80px] lg:left-auto lg:right-auto lg:translate-x-0"></div>
      <div className="absolute -bottom-60 left-1/2 right-auto h-96 w-10 -translate-x-20 -rotate-45 rounded-full bg-gray-300/20 blur-[80px] lg:left-auto lg:right-96 lg:-translate-x-40"></div>
    </section>
  );
}
 