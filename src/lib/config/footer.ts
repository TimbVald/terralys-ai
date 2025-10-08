export interface FooterLink {
  href: string
  label: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterConfig {
  brand: {
    title: string
    description: string
  }
  sections: FooterSection[]
  copyright: string
}

export const footerConfig: FooterConfig = {
  brand: {
    title: "TerraLys AI",
    description: "Intelligent Pest & Disease Detection"
  },
  sections: [
    {
      title: "Platform",
      links: [
        { href: "/object-detection", label: "Real-time Detection" },
        { href: "/plant-health", label: "Plant Health Analysis" },
        { href: "/dashboard", label: "Analytics Dashboard" },
        { href: "/history", label: "Detection History" }
      ]
    },
    {
      title: "Company",
      links: [
        { href: "#", label: "About Us" },
        { href: "#", label: "Careers" },
        { href: "#", label: "Contact" },
        { href: "#", label: "Blog" }
      ]
    },
    {
      title: "Legal",
      links: [
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Terms of Service" },
      ]
    }
  ],
  copyright: `© ${new Date().getFullYear()} PlantPatrol. All rights reserved.`
}
