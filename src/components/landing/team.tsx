'use client';
// changes on line 109
import { cn } from '@/lib/utils';
import { GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import Link from 'next/link';
 
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  location?: string;
  socialLinks?: { platform: 'github' | 'twitter' | 'linkedin'; url: string }[];
}
 
interface TeamProps {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  className?: string;
}
 
// Default data
const defaultMembers: TeamMember[] = [
  {
    name: 'Dr. Sarah Chen',
    role: 'CEO & Fondatrice',
    bio: 'Experte en IA conversationnelle avec plus de 12 ans d\'expérience dans le traitement du langage naturel.',
    imageUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'Paris, France',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Alexandre Moreau',
    role: 'CTO & Co-fondateur',
    bio: 'Architecte IA passionné par l\'innovation en machine learning et les systèmes de transcription avancés.',
    imageUrl:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'Lyon, France',
    socialLinks: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Emma Rodriguez',
    role: 'Head of AI Research',
    bio: 'Chercheuse en IA spécialisée dans l\'analyse sémantique et la génération automatique de résumés.',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'Toulouse, France',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Lucas Dubois',
    role: 'Lead AI Engineer',
    bio: 'Ingénieur IA expert en développement d\'agents conversationnels et systèmes de recommandation.',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop',
    location: 'Bordeaux, France',
    socialLinks: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
];
 
export default function Team1({
  title = 'L\'équipe TerraLys',
  subtitle = "Une équipe passionnée d'experts en intelligence artificielle et traitement du langage, dédiée à révolutionner vos meetings.",
  members = defaultMembers,
  className,
}: TeamProps) {
  return (
    <section className={cn('mx-auto max-w-7xl py-16 md:py-24', className)}>
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="container px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </div>
 
        <div className="flex flex-wrap items-center justify-center gap-8">
          {members.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
 
// Team member card component
function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="opacity-100 hover:opacity-75 transition-opacity group h-[420px] w-96 overflow-hidden rounded-xl bg-card shadow-sm">
      <div className="relative h-[200px] w-full overflow-hidden">
        <img
          src={member.imageUrl}
          alt={member.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>
 
      <div className="flex h-[220px] flex-col p-5">
        {member.location && (
          <div className="mb-1 flex items-center text-xs text-muted-foreground">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            {member.location}
          </div>
        )}
 
        <h3 className="mb-1 text-xl font-bold">{member.name}</h3>
        <p className="mb-2 text-sm font-medium text-primary">{member.role}</p>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{member.bio}</p>
        </div>
        <div className="mt-auto">
          {member.socialLinks && (
            <div className="flex space-x-3">
              {member.socialLinks.map((link) => (
                <Link
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  {link.platform === 'github' && (
                    <GithubIcon className="h-4 w-4" />
                  )}
                  {link.platform === 'twitter' && (
                    <TwitterIcon className="h-4 w-4" />
                  )}
                  {link.platform === 'linkedin' && (
                    <LinkedinIcon className="h-4 w-4" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 