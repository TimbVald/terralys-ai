import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const features = [
  {
    title: "Real-time Pest Detection",
    description: "Connect your cameras or video feeds to our platform. Our system processes live streams in real-time, applying advanced YOLO models to identify and track pests as they appear.",
    image: "/landing/pp-realtime.png",
    darkImage: "/landing/pp-realtime.png",
    alt: "Live video stream processing with pest detection overlays",
  },
  {
    title: "Advanced Plant Health Analysis",
    description: "Upload images of your plants to get an instant health assessment. Our AI-powered system identifies common diseases and provides detailed information, including treatment suggestions.",
    // TODO: Replace with actual image path
    image: "/landing/pp-disease.png",
    // TODO: Replace with actual image path
    darkImage: "/landing/pp-disease.png",
    alt: "Interface showing plant health analysis results with disease information",
  },
  {
    title: "Insightful Analytics Dashboard",
    description: "Visualize detection data through an interactive dashboard. Track key metrics like pest and disease frequency, detection confidence levels, and analyze trends over time to make informed decisions.",
    image: "/landing/pp-dashboard.png",
    darkImage: "/landing/pp-dashboard.png",
    alt: "Dashboard displaying pest and disease detection analytics and performance metrics",
  },
  {
    title: "Comprehensive Detection History",
    description: "Access a detailed log of all past detections. Review images, analysis results, and timestamps for both pest and plant health scans. Filter and export data for reporting and further analysis.",
    // TODO: Replace with actual image path
    image: "/landing/pp-logs.png",
    // TODO: Replace with actual image path
    darkImage: "/landing/pp-logs.png",
    alt: "History page showing a log of past pest and disease detections",
  },
  {
    title: "Customizable Real-time Alerts",
    description: "Set up custom alerts for specific pest or disease detections. Receive instant notifications via email, allowing you to take immediate action and protect your crops.",
    // TODO: Replace with actual image path
    image: "/landing/pp-alerts.png",
    // TODO: Replace with actual image path
    darkImage: "/landing/pp-alerts.png",
    alt: "Alert configuration and a sample email notification for a new detection",
  }
]

export function FeatureDetails() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Core Platform{" "}
          <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Capabilities
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Explore the key functionalities that power our YOLO object detection platform, from real-time video processing to actionable analytics.
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Fonctionnalités clés
          <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            pour l'analyse végétale
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Découvrez les outils qui propulsent notre plateforme d'analyse IA : détection en temps réel, diagnostic de maladies, suivi des parasites et recommandations agronomiques personnalisées.
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-16 sm:gap-24">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col gap-8 lg:items-center ${
              index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <button className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Learn more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Image */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80"
              >
                <div className="block dark:hidden">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    width={600}
                    height={400}
                    quality={100}
                    className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
                  />
                </div>
                <div className="hidden dark:block">
                  <Image
                    src={feature.darkImage}
                    alt={feature.alt}
                    width={600}
                    height={400}
                    quality={100}
                    className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 