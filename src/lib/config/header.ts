import { LucideIcon } from "lucide-react"

export interface HeaderLink {
  href: string
  label: string
  icon?: LucideIcon
  description?: string
}

export interface HeaderConfig {
  brand: {
    title: string
    icon: string
  }
  navigationLinks: HeaderLink[]
}

export const headerConfig: HeaderConfig = {
  brand: {
    title: "TerraLys AI",
    icon: "/logo.svg"
  },
  navigationLinks: [
    {
      href: "/",
      label: "Home"
    },
    {
      href: "/dashboard",
      label: "Dashboard"
    },
    {
      href: "/plant-health",
      label: "Santé des plantes"
    },
    {
      href: "/plant-detection",
      label: "Real-time Detection"
    },
    {
      href: "/encyclopedia",
      label: "Encyclopedie"
    },
    {
      href: "/meetings",
      label: "Visio-Consultation"
    },
    {
      href: "/about",
      label: "About"
    }
  ]
}