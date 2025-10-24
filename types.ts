import type React from 'react';

export interface Skill {
  name: string;
  // FIX: Changed icon from a React.ReactElement to a ComponentType.
  // This allows passing props like className in a type-safe way.
  icon: React.ComponentType<{ className?: string }>;
}

export interface SocialLink {
  name: string;
  // FIX: Changed icon from a React.ReactNode to a ComponentType to allow passing props like className.
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

// FIX: Added missing Project interface for Portfolio component.
export interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}
