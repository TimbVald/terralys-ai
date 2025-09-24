'use client';
 
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';
 
export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-primary/10 p-1 py-0.5 font-bold text-primary',
        className,
      )}
    >
      {children}
    </span>
  );
}
 
export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}
 
export function TestimonialCard({
  description,
  name,
  img,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4',
        // theme styles
        'border border-border bg-card/50 shadow-sm',
        // hover effect
        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
      {...props}
    >
      <div className="select-none text-sm font-normal text-muted-foreground">
        {description}
        <div className="flex flex-row py-1">
          <Star className="size-4 fill-primary text-primary" />
              <Star className="size-4 fill-primary text-primary" />
              <Star className="size-4 fill-primary text-primary" />
              <Star className="size-4 fill-primary text-primary" />
              <Star className="size-4 fill-primary text-primary" />
        </div>
      </div>
 
      <div className="flex w-full select-none items-center justify-start gap-5">
        <img
          width={40}
          height={40}
          src={img || ''}
          alt={name}
          className="size-10 rounded-full ring-1 ring-primary/20 ring-offset-2"
        />
 
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-xs font-normal text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}
const testimonials = [
  {
    name: 'Pierre Dubois',
    role: 'Agriculteur - Exploitation Céréalière',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    description: (
      <p>
        TerraLys a révolutionné ma gestion des cultures.
        <Highlight>
          J'ai détecté et traité 95% des maladies avant qu'elles ne se propagent.
        </Highlight>{' '}
        L'analyse d'images IA est d'une précision remarquable.
      </p>
    ),
  },
  {
    name: 'Marie Laurent',
    role: 'Directrice Agricole - Coopérative',
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    description: (
      <p>
        J'étais sceptique au début, mais TerraLys m'a convaincue.
        <Highlight>
          Nos meetings sont maintenant 3x plus efficaces grâce aux agents IA.
        </Highlight>{' '}
        Les résumés automatiques nous font gagner un temps précieux.
      </p>
    ),
  },
  {
    name: 'Thomas Moreau',
    role: 'Ingénieur Agronome - Conseil Agricole',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: (
      <p>
        TerraLys a transformé notre façon de conseiller les agriculteurs.
        <Highlight>Nous avons amélioré notre productivité de 35%.</Highlight> Les
        agents IA personnalisés nous aident à analyser chaque situation.
      </p>
    ),
  },
  {
    name: 'Sophie Martin',
    role: 'Responsable Technique - Exploitation Viticole',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: (
      <p>
        La détection précoce des maladies par TerraLys est exceptionnelle.
        <Highlight>
          Nous avons sauvé 90% de notre récolte grâce aux alertes IA.
        </Highlight>{' '}
        L'analyse des images de vignes nous aide à prendre les bonnes décisions.
      </p>
    ),
  },
  {
    name: 'Jean-Claude Bernard',
    role: 'Directeur - Coopérative Agricole',
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    description: (
      <p>
        Notre réseau de 200+ agriculteurs nécessitait une solution robuste.
        <Highlight>
          TerraLys centralise parfaitement toutes nos données agricoles.
        </Highlight>{' '}
        Les meetings avec les agents IA nous font gagner un temps précieux.
      </p>
    ),
  },
  {
    name: 'Isabelle Rousseau',
    role: 'Consultante Agricole - Cabinet Conseil',
    img: 'https://randomuser.me/api/portraits/women/67.jpg',
    description: (
      <p>
        La gestion de mes consultations est maintenant optimale avec TerraLys.
        <Highlight>
          Les agents IA m'aident à préparer mes recommandations.
        </Highlight>{' '}
        Mes clients apprécient la qualité des analyses que je peux leur fournir.
      </p>
    ),
  },
  {
    name: 'Marc Leroy',
    role: 'Agriculteur Bio - Maraîchage',
    img: 'https://randomuser.me/api/portraits/men/78.jpg',
    description: (
      <p>
        TerraLys offre le parfait équilibre entre simplicité et puissance.
        <Highlight>
          Je maintiens mes standards bio tout en optimisant mes rendements.
        </Highlight>{' '}
        L'application mobile est particulièrement pratique dans les champs.
      </p>
    ),
  },
  {
    name: 'Catherine Dubois',
    role: 'Responsable Qualité - Industrie Agroalimentaire',
    img: 'https://randomuser.me/api/portraits/women/89.jpg',
    description: (
      <p>
        Nos contrôles qualité sont plus efficaces depuis l'utilisation de TerraLys.
        <Highlight>
          L'analyse IA des matières premières nous évite les lots défectueux.
        </Highlight>{' '}
        L'intégration avec nos systèmes existants s'est faite sans problème.
      </p>
    ),
  },
  {
    name: 'François Petit',
    role: 'Responsable R&D - Semencier',
    img: 'https://randomuser.me/api/portraits/men/92.jpg',
    description: (
      <p>
        TerraLys respecte parfaitement nos exigences de recherche.
        <Highlight>
          L'analyse des maladies nous aide à développer des variétés résistantes.
        </Highlight>{' '}
        Les données collectées enrichissent considérablement nos études.
      </p>
    ),
  },
  {
    name: 'Nathalie Girard',
    role: 'Directrice - Chambre d\'Agriculture',
    img: 'https://randomuser.me/api/portraits/women/29.jpg',
    description: (
      <p>
        Dans le conseil agricole, la précision des recommandations est cruciale.
        <Highlight>
          TerraLys nous garantit des analyses fiables pour nos agriculteurs.
        </Highlight>{' '}
        Les agents IA nous aident à personnaliser chaque conseil.
      </p>
    ),
  },
];
 
export default function Testimonials() {
  return (
    <section className="container relative py-10">
      {/* Decorative elements */}
      <div className="absolute -left-20 top-20 z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-20 bottom-20 z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-center text-4xl font-bold leading-[1.2] tracking-tighter text-foreground md:text-5xl">
          Ce que disent nos utilisateurs
        </h2>
        <h3 className="mx-auto mb-8 max-w-lg text-balance text-center text-lg font-medium tracking-tight text-muted-foreground">
          Ne nous croyez pas sur parole. Voici ce que{' '}
          <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
            nos clients
          </span>{' '}
          disent de{' '}
          <span className="font-semibold text-primary">TerraLys</span>
        </h3>
      </motion.div>
 
      <div className="relative mt-6 max-h-screen overflow-hidden">
        <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
          {Array(Math.ceil(testimonials.length / 3))
            .fill(0)
            .map((_, i) => (
              <Marquee
                vertical
                key={i}
                className={cn({
                  '[--duration:60s]': i === 1,
                  '[--duration:30s]': i === 2,
                  '[--duration:70s]': i === 3,
                })}
              >
                {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: Math.random() * 0.8,
                      duration: 1.2,
                    }}
                  >
                    <TestimonialCard {...card} />
                  </motion.div>
                ))}
              </Marquee>
            ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-background from-20%"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-background from-20%"></div>
      </div>
    </section>
  );
}
 