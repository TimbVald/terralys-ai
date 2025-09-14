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
        'bg-blue-500/10 p-1 py-0.5 font-bold text-blue-500',
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
          <Star className="size-4 fill-blue-500 text-blue-500" />
          <Star className="size-4 fill-blue-500 text-blue-500" />
          <Star className="size-4 fill-blue-500 text-blue-500" />
          <Star className="size-4 fill-blue-500 text-blue-500" />
          <Star className="size-4 fill-blue-500 text-blue-500" />
        </div>
      </div>
 
      <div className="flex w-full select-none items-center justify-start gap-5">
        <img
          width={40}
          height={40}
          src={img || ''}
          alt={name}
          className="size-10 rounded-full ring-1 ring-blue-500/20 ring-offset-2"
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
    role: 'Responsable Maintenance - Usine Métallurgique',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    description: (
      <p>
        Machine Care a révolutionné notre gestion de maintenance.
        <Highlight>
          Nous avons réduit nos temps d'arrêt de 40% en un an.
        </Highlight>{' '}
        L'interface est intuitive et nos techniciens l'adoptent facilement.
      </p>
    ),
  },
  {
    name: 'Marie Laurent',
    role: 'Directrice Technique - Complexe Industriel',
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    description: (
      <p>
        J'étais sceptique au début, mais Machine Care m'a convaincue.
        <Highlight>
          La gestion des stocks est maintenant optimale et nous évitons les ruptures.
        </Highlight>{' '}
        Les rapports automatisés nous font gagner un temps précieux.
      </p>
    ),
  },
  {
    name: 'Thomas Moreau',
    role: 'Chef d\'équipe - Maintenance Préventive',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: (
      <p>
        Machine Care a transformé notre façon de planifier les interventions.
        <Highlight>Nous avons amélioré notre productivité de 35%.</Highlight> La
        planification des équipes est maintenant optimale et efficace.
      </p>
    ),
  },
  {
    name: 'Sophie Martin',
    role: 'Responsable Qualité - Secteur Pharmaceutique',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: (
      <p>
        La traçabilité offerte par Machine Care est exceptionnelle.
        <Highlight>
          Nous respectons parfaitement les normes de conformité.
        </Highlight>{' '}
        Les audits sont maintenant un jeu d'enfant avec tous les documents centralisés.
      </p>
    ),
  },
  {
    name: 'Jean-Claude Bernard',
    role: 'Directeur Maintenance - Groupe Énergétique',
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    description: (
      <p>
        Notre réseau de centrales électriques nécessitait une solution robuste.
        <Highlight>
          Machine Care gère parfaitement nos 200+ équipements critiques.
        </Highlight>{' '}
        La sécurité et la fiabilité sont au rendez-vous.
      </p>
    ),
  },
  {
    name: 'Isabelle Rousseau',
    role: 'Responsable Logistique - Entreprise de Transport',
    img: 'https://randomuser.me/api/portraits/women/67.jpg',
    description: (
      <p>
        La gestion de notre flotte de véhicules est maintenant optimale.
        <Highlight>
          Nous prévoyons les maintenances avant les pannes.
        </Highlight>{' '}
        Les coûts d'exploitation ont diminué de 25% depuis l'implémentation.
      </p>
    ),
  },
  {
    name: 'Marc Leroy',
    role: 'Technicien Senior - Secteur Aéronautique',
    img: 'https://randomuser.me/api/portraits/men/78.jpg',
    description: (
      <p>
        Machine Care offre le parfait équilibre entre simplicité et puissance.
        <Highlight>
          Nous maintenons nos standards de qualité tout en améliorant l'efficacité.
        </Highlight>{' '}
        L'application mobile est particulièrement pratique sur le terrain.
      </p>
    ),
  },
  {
    name: 'Catherine Dubois',
    role: 'Responsable Production - Usine Automobile',
    img: 'https://randomuser.me/api/portraits/women/89.jpg',
    description: (
      <p>
        Nos temps d'arrêt ont diminué de 30% depuis l'utilisation de Machine Care.
        <Highlight>
          La planification préventive nous évite les arrêts imprévus.
        </Highlight>{' '}
        L'intégration avec nos systèmes existants s'est faite sans problème.
      </p>
    ),
  },
  {
    name: 'François Petit',
    role: 'Responsable Sécurité - Site Chimique',
    img: 'https://randomuser.me/api/portraits/men/92.jpg',
    description: (
      <p>
        Machine Care respecte parfaitement nos exigences de sécurité.
        <Highlight>
          La traçabilité complète nous rassure lors des audits.
        </Highlight>{' '}
        Les procédures de maintenance sont maintenant standardisées et sécurisées.
      </p>
    ),
  },
  {
    name: 'Nathalie Girard',
    role: 'Directrice Opérations - Centre Hospitalier',
    img: 'https://randomuser.me/api/portraits/women/29.jpg',
    description: (
      <p>
        Dans le secteur médical, la fiabilité des équipements est cruciale.
        <Highlight>
          Machine Care nous garantit une maintenance préventive efficace.
        </Highlight>{' '}
        La conformité aux normes médicales est parfaitement respectée.
      </p>
    ),
  },
];
 
export default function Testimonials() {
  return (
    <section className="container relative py-10">
      {/* Decorative elements */}
      <div className="absolute -left-20 top-20 z-10 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute -right-20 bottom-20 z-10 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
 
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
          <span className="bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
            nos clients
          </span>{' '}
          disent de{' '}
          <span className="font-semibold text-blue-500">Machine Care</span>
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
 