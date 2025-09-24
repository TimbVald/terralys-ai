"use client"

import { Github, Heart, Instagram, Linkedin, Twitter, Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Composant Footer modernisé pour TerraLys
 * Présente les liens, informations de contact et réseaux sociaux avec un design cohérent
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
    {/* Background Effects */}
    <div className="absolute inset-0">
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-[120px]"></div>
      <div className="absolute -right-40 -top-20 h-96 w-96 rounded-full bg-primary/15 blur-[140px]"></div>
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]"></div>
    </div>
      
      {/* Grille de points décorative */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full" style={{
          backgroundImage: 'radial-gradient(circle, rgb(59 130 246 / 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Section principale avec logo et description */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary shadow-lg shadow-primary/20 dark:shadow-primary/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>
              <span className="bg-gradient-to-r from-slate-900 via-primary to-primary bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:via-primary dark:to-primary">
                TerraLys
              </span>
            </div>
            
            <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              La plateforme IA révolutionnaire qui combine agriculture intelligente et meetings IA
              pour transformer votre business avec des insights exploitables.
            </p>
            
            {/* Informations de contact */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@terralys.ai</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-primary" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-primary" />
                <span>Paris, France</span>
              </div>
            </div>
            
            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Twitter, href: "https://x.com", label: "Twitter" },
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
              ].map(({ icon: Icon, href, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/50 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 dark:border-slate-700/50 dark:bg-slate-900/50 dark:hover:border-primary/30 dark:hover:bg-primary/10 dark:hover:shadow-primary/20"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5 text-slate-600 transition-colors duration-300 group-hover:text-primary dark:text-slate-400 dark:group-hover:text-primary" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:from-primary/10 group-hover:to-primary/10 group-hover:opacity-100"></div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Colonnes de liens */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Produit</h3>
              <ul className="space-y-4">
                {[
                  { href: "#features", label: "Fonctionnalités IA" },
                  { href: "/about", label: "À propos" },
                  { href: "/docs/introduction", label: "Documentation" },
                  { href: "/pricing", label: "Tarifs" }
                ].map((link, index) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative text-slate-600 transition-all duration-300 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Solutions</h3>
              <ul className="space-y-4">
                {[
                  { href: "/recording", label: "Enregistrement IA" },
                  { href: "/transcription", label: "Transcription" },
                  { href: "/agents", label: "Agents IA" },
                  { href: "/analytics", label: "Analytics" }
                ].map((link, index) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative text-slate-600 transition-all duration-300 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Entreprise</h3>
              <ul className="space-y-4">
                {[
                  { href: "/terms", label: "Conditions" },
                  { href: "/privacy", label: "Confidentialité" },
                  { href: "/license", label: "Licence" },
                  { href: "/security", label: "Sécurité" }
                ].map((link, index) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative text-slate-600 transition-all duration-300 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Support</h3>
              <ul className="space-y-4">
                {[
                  { href: "/contact", label: "Contactez-nous" },
                  { href: "#faq", label: "FAQ" },
                  { href: "/support", label: "Support technique" },
                  { href: "/help", label: "Centre d'aide" }
                ].map((link, index) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative text-slate-600 transition-all duration-300 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        
        {/* Section copyright */}
        <motion.div
          className="relative border-t border-slate-200/50 pt-8 dark:border-slate-700/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p className="text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold text-slate-900 dark:text-white">TerraLys</span>.
              Tous droits réservés.
            </p>
            
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span>Développé avec</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 text-red-500" />
              </motion.div>
              <span>pour l'innovation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
