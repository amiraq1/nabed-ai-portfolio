import React from 'react';
// FIX: Added Project to the import list.
import type { Skill, SocialLink, Project } from './types';

// Helper component for SVG Icons
const Icon: React.FC<{ path: string, className?: string }> = ({ path, className="w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

const YoutubeIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2ZM10,16.5V7.5L16,12L10,16.5Z" className={className} />;
const TwitterIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" className={className} />;
const LinkedInIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.43 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,6 7.78,5.22 6.88,5.22C6,5.22 5.22,6 5.22,6.88A1.68,1.68 0 0,0 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z" className={className} />;
const GitHubIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.83,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" className={className} />;
const CodeIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6Z" className={className} />;
const AIIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2ZM11,6H13V11H11V6ZM11,13H13V18H11V13Z" className={className} />;
const CloudIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M6.5,20Q4.22,20 2.61,18.43Q1,16.85 1,14.58Q1,12.63 2.18,11.1Q3.35,9.57 5.25,9.15Q5.88,6.85 7.75,5.43Q9.63,4 12,4Q14.93,4 16.96,6.04Q19,8.07 19,11Q20.73,11.2 21.86,12.5Q23,13.78 23,15.5Q23,17.38 21.69,18.69Q20.38,20 18.5,20H6.5Z" className={className} />;
const DataIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M13,3H11V5H13V3M13,7H11V9H13V7M13,11H11V13H13V11M21,5V19C21,20.1 20.1,21 19,21H5C3.9,21 3,20.1 3,19V5C3,3.9 3.9,3 5,3H19C20.1,3 21,3.9 21,5M19,5H5V19H19V5M17,17H7V15H17V17M17,13H7V11H17V13M17,9H7V7H17V9Z" className={className} />;
export const WalletIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4M20 18H4V8H20V18M18 12C18 10.9 17.1 10 16 10C14.9 10 14 10.9 14 12C14 13.1 14.9 14 16 14C17.1 14 18 13.1 18 12Z" className={className} />;
export const CardIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V12H20V18M20,8H4V6H20V8Z" className={className} />;
export const QrCodeIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M10 10h4v4h-4v-4m-6 0h4v4H4v-4m0-6h4v4H4V4m6 0h4v4h-4V4m6 12h4v4h-4v-4m-6 6h4v4h-4v-4m0-6h4v4h-4v-4m-6 0h4v4H4v-4m16-4h-4v4h4v-4m-4-6h4v4h-4V4M3 21V3h18v18H3Z" className={className || "w-full h-full"} />;
export const CopyIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" className={className || "w-6 h-6"} />;
export const CheckIcon: React.FC<{className?: string}> = ({className}) => <Icon path="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" className={className || "w-6 h-6 text-green-400"} />;
export const StarIcon = () => <Icon path="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />;
export const ForkIcon = () => <Icon path="M12.5,2.5L15.3,5.3L12.5,8.1V6.2C8.9,6.2 6.2,8.9 6.2,12.5C6.2,14.5 7.1,16.3 8.5,17.5L7.4,18.6C5.8,17.2 4.8,15 4.8,12.5C4.8,7.8 8.2,4.8 12.5,4.8V2.5M19.2,11.5C19.2,16.2 15.8,19.2 11.5,19.2V21.5L8.7,18.7L11.5,15.9V17.8C15.1,17.8 17.8,15.1 17.8,11.5C17.8,9.5 16.9,7.7 15.5,6.5L16.6,5.4C18.2,6.8 19.2,9 19.2,11.5Z" className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />;

export const GITHUB_USERNAME = 'amiraq';

// FIX: Added PROJECTS constant to be used by the Portfolio component.
export const PROJECTS: Project[] = [
  {
    title: 'مولد الفيديو بالذكاء الاصطناعي',
    description: 'مشروع يستخدم Gemini API لتحويل الصور الثابتة إلى مقاطع فيديو قصيرة مع وصف نصي.',
    image: 'https://picsum.photos/seed/project1/400/300',
    link: '#video-generator',
    tags: ['AI', 'Gemini API', 'React', 'TypeScript'],
  },
  {
    title: 'لوحة تحكم سحابية',
    description: 'واجهة لإدارة ومراقبة الخدمات السحابية، مبنية باستخدام React وتصميم حديث.',
    image: 'https://picsum.photos/seed/project2/400/300',
    link: '#',
    tags: ['Web Dev', 'React', 'Cloud', 'UI/UX'],
  },
  {
    title: 'نظام تحليل البيانات',
    description: 'منصة لتحليل وتصوير البيانات الضخمة، مما يساعد على استخلاص رؤى قابلة للتنفيذ.',
    image: 'https://picsum.photos/seed/project3/400/300',
    link: '#',
    tags: ['Data Science', 'Python', 'AI'],
  },
];

// FIX: Icons are now component references, not rendered elements, to match the updated Skill type.
export const SKILLS: Skill[] = [
  { name: 'تطوير الويب', icon: CodeIcon },
  { name: 'الحوسبة السحابية', icon: CloudIcon },
  { name: 'تحليل البيانات', icon: DataIcon },
  { name: 'React & TypeScript', icon: CodeIcon },
  { name: 'Python', icon: CodeIcon },
];

// FIX: Icons are now component references to match the updated SocialLink type.
export const SOCIAL_LINKS: SocialLink[] = [
    { name: 'YouTube', icon: YoutubeIcon, url: 'https://youtube.com' },
    { name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: LinkedInIcon, url: 'https://linkedin.com' },
    { name: 'GitHub', icon: GitHubIcon, url: `https://github.com/${GITHUB_USERNAME}` },
];
