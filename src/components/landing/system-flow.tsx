import { motion } from "framer-motion"
import { Video, Cpu, ScanSearch, MousePointer, BarChartHorizontal, BellRing, DatabaseZap } from "lucide-react"
import Image from "next/image"

const flowSteps = [
  {
    title: "Entrée vidéo & prétraitement",
    description: "Connectez des flux vidéo en direct ou importez des fichiers vidéo. Les images sont capturées et prétraitées pour optimiser les performances du modèle.",
    icon: Video,
    gradient: "from-sky-500 via-cyan-500 to-blue-500",
    shadowColor: "shadow-sky-500/25",
  },
  {
    title: "Inférence du modèle YOLO",
    description: "Le modèle YOLO sélectionné traite chaque image, effectuant une inférence rapide pour localiser et classifier les objets.",
    icon: Cpu,
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    shadowColor: "shadow-blue-500/25",
  },
  {
    title: "Détection et classification d’objets",
    description: "Des boîtes englobantes sont dessinées autour des objets détectés, chacun étant classifié avec un score de confiance.",
    icon: ScanSearch,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    shadowColor: "shadow-green-500/25",
  },
  {
    title: "Suivi & association des données",
    description: "Les objets sont suivis d’une image à l’autre, avec des identifiants uniques pour un suivi et une analyse continus.",
    icon: MousePointer,
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    shadowColor: "shadow-purple-500/25",
  },
  {
    title: "Analytique & visualisation",
    description: "Les données de détection sont agrégées et affichées sur des tableaux de bord, montrant les comptages, tendances et indicateurs de performance.",
    icon: BarChartHorizontal,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    shadowColor: "shadow-orange-500/25",
  },
  {
    title: "Journalisation & alertes",
    description: "Tous les événements de détection sont enregistrés pour audit et revue. Des alertes personnalisables notifient les utilisateurs en cas de détections critiques.",
    icon: DatabaseZap, // Ou BellRing si l’accent est mis sur les alertes
    gradient: "from-red-500 via-rose-500 to-pink-500",
    shadowColor: "shadow-red-500/25",
  },
]

export function SystemFlow() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Parcours d'analyse IA
          <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            pour vos cultures
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Découvrez comment vos données sont transformées en diagnostics et recommandations agronomiques grâce à notre pipeline IA optimisé pour l'analyse végétale.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {flowSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative group"
          >
            <div 
              className={`
                h-full rounded-2xl p-1 transition-all duration-300 
                bg-gradient-to-br ${step.gradient} opacity-75 hover:opacity-100
                hover:scale-[1.02] hover:-translate-y-1
              `}
            >
              <div className="h-full rounded-xl bg-background/90 p-6 backdrop-blur-xl">
                <div className={`
                  size-14 rounded-lg bg-gradient-to-br ${step.gradient}
                  flex items-center justify-center ${step.shadowColor}
                  shadow-lg transition-shadow duration-300 group-hover:shadow-xl
                `}>
                  <step.icon className="size-7 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative mx-auto mt-16 sm:mt-20 lg:mt-24"
      >
        <div className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80">
          {/* TODO: Replace with an image illustrating the YOLO detection system architecture */}
          <Image
            src="/landing/pp-realtime.png"
            alt="PlantPatrol Real-time Pest Detection System Architecture"
            width={1200}
            height={800}
            quality={100}
            className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
          />
        </div>
      </motion.div>
    </section>
  )
}