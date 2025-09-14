import { Github, Heart, Instagram, Linkedin, Twitter, Wrench, Users, Building, Package } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden rounded-t-3xl border-t bg-muted/30 md:rounded-t-[4rem]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/30 blur-3xl dark:bg-primary/10"></div>
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl dark:bg-blue-500/10"></div>
      </div>
      <div className="container mx-auto max-w-6xl px-5 pb-8 pt-16">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <div className="mb-4 flex items-center justify-start gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg">
                <img src="/images/logo/logo.jpg" alt="TerraLys Logo" className="h-4 w-4 object-contain" />
              </div>
              <span className="bg-primary from-foreground via-blue-200 to-primary bg-clip-text text-2xl font-semibold text-transparent dark:bg-gradient-to-b">
                TerraLys
              </span>
            </div>
            <p className="mb-4 text-muted-foreground">
              La plateforme IA qui transforme vos meetings en données exploitables
              pour une productivité maximale.
            </p>
            <div className="flex space-x-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-background p-2 transition-colors hover:bg-muted"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-background p-2 transition-colors hover:bg-muted"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-background p-2 transition-colors hover:bg-muted"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-background p-2 transition-colors hover:bg-muted"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="mb-4 font-semibold">Produit</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Fonctionnalités IA
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/introduction"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="mb-4 font-semibold">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/recording"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Enregistrement IA
                </Link>
              </li>
              <li>
                <Link
                  href="/transcription"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Transcription
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Agents IA
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="mb-4 font-semibold">Entreprise</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/license"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Licence
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Support technique
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="relative border-t border-muted/50 pt-8">
          <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/70 to-transparent"></div>
          <div className="flex flex-col items-center justify-between text-sm text-muted-foreground md:flex-row">
            <p>
              ©{new Date().getFullYear()}{' '}
              <span className="font-medium text-foreground">TerraLys</span>.
              Tous droits réservés.
            </p>
            <div className="mt-4 flex items-center space-x-1 md:mt-0">
              <span>
                Développé avec
                <Heart className="ml-1 inline h-4 w-4 text-red-500" />
                pour l'industrie
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
