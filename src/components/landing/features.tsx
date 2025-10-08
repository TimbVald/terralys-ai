"use client"

import { motion } from "framer-motion"
import { Brain, Camera, Database, Zap, Users, Settings2, LayoutDashboard, Server, Target, BarChart2, FileJson, ShieldCheck } from "lucide-react"
import SectionBadge from "@/components/ui/section-badge"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Détection instantanée",
    info: "Identifiez maladies, parasites et carences sur vos plantes en temps réel, dès l'envoi d'une image ou d'une vidéo.\nExemple : Recevez un diagnostic immédiat après la prise de photo d'une feuille suspecte.",
    icon: Zap,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Précision et fiabilité IA",
    info: "Nos modèles avancés garantissent une reconnaissance fiable des symptômes et des ravageurs.\nExemple : L'IA distingue le mildiou du stress hydrique avec plus de 95% de précision.",
    icon: Target,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Suivi multi-plantes et multi-parcelles",
    info: "Analysez simultanément plusieurs cultures ou parcelles et suivez leur évolution dans le temps.\nExemple : Visualisez l'historique des analyses pour chaque champ ou serre.",
    icon: Users,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Modèles personnalisables",
    info: "Adaptez l'algorithme à vos besoins : ajoutez vos propres maladies ou configurez la détection selon vos cultures.\nExemple : Ajoutez un modèle pour la rouille du café ou la tache noire du rosier.",
    icon: Settings2,
    gradient: "from-purple-500 to-violet-500",
  },
  {
    title: "Analytique agronomique",
    info: "Suivez les tendances, la fréquence des maladies et l'efficacité des traitements grâce à des tableaux de bord interactifs.\nExemple : Comparez le taux de maladies avant/après application d'un fongicide.",
    icon: BarChart2,
    gradient: "from-red-500 to-rose-500",
  },
  {
    title: "Journalisation et export des données",
    info: "Conservez l'historique complet des analyses et exportez vos résultats au format CSV ou JSON pour vos rapports.\nExemple : Téléchargez le suivi des analyses pour une saison entière.",
    icon: FileJson,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Interface intuitive",
    info: "Profitez d'une interface claire et accessible, adaptée aux agriculteurs comme aux conseillers techniques.\nExemple : Lancez une analyse en 2 clics depuis votre smartphone.",
    icon: LayoutDashboard,
    gradient: "from-orange-500 to-amber-500",
  },
  {
    title: "Architecture évolutive",
    info: "La plateforme s'adapte à vos besoins, du petit jardin à l'exploitation agricole connectée.\nExemple : Ajoutez facilement de nouvelles parcelles ou capteurs au fil du temps.",
    icon: Server,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Sécurité et fiabilité",
    info: "Vos données sont protégées et la plateforme reste performante même en cas de forte affluence.\nExemple : Accédez à vos analyses en toute sécurité, même en déplacement.",
    icon: ShieldCheck,
    gradient: "from-teal-500 to-cyan-400",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function Features() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Fonctionnalités principales de la plateforme IA
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Découvrez comment notre système d'analyse IA végétale vous aide à diagnostiquer, suivre et protéger vos cultures, du diagnostic instantané à l'export des données pour vos rapports.
        </motion.p>
        <SectionBadge title="Fonctionnalités" />
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Points forts pour l'agriculture connectée
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          L'IA végétale vous accompagne dans la gestion quotidienne de vos cultures : exemples concrets, analyses comparatives et conseils personnalisés pour chaque étape.
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={item}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-8",
                "ring-1 ring-foreground/10 backdrop-blur-xl transition-all duration-300 hover:ring-foreground/20",
                "dark:from-muted/30 dark:to-background/80"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                  feature.gradient,
                  "ring-1 ring-foreground/10"
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                {feature.info}
              </p>
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                feature.gradient,
                "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              )} />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  )
} 