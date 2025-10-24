
import React, { useState } from 'react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import FadeIn from './FadeIn';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 group h-full flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-400/10">
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
        <div className="overflow-hidden">
           <img src={project.image} alt={project.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" loading="lazy" decoding="async" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">{project.title}</h3>
          <p className="text-slate-400 mb-4 flex-grow">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag) => (
              <span key={tag} className="bg-cyan-900/50 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
};

const filterCategories = [
    { name: 'الكل', tags: [] },
    { name: 'الذكاء الاصطناعي', tags: ['AI', 'Gemini API', 'Data Science'] },
    { name: 'تطوير الويب', tags: ['React', 'TypeScript', 'Web Dev', 'Node.js'] },
    { name: 'السحابة و DevOps', tags: ['Cloud', 'DevOps', 'Infrastructure'] },
    { name: 'التصميم و UX', tags: ['UI/UX', 'Figma', 'Design'] },
    { name: 'الأمان والمحتوى', tags: ['Security', 'Content', 'Best Practices'] },
];

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');

  const displayedProjects = activeCategory === 'الكل'
    ? PROJECTS
    : PROJECTS.filter(project => {
        const categoryObject = filterCategories.find(c => c.name === activeCategory);
        return categoryObject && project.tags.some(tag => categoryObject.tags.includes(tag));
    });

  return (
    <section id="portfolio" className="py-20 bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-6">
        <FadeIn>
            <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white">أبرز أعمالي</h2>
            <p className="text-slate-400 mt-2">نظرة على بعض المشاريع والمحتوى الذي قمت بإنشائه.</p>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mt-4"></div>
            </div>
        </FadeIn>
        
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-3 mb-12">
          {filterCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                activeCategory === category.name
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <FadeIn key={project.title} delay={index * 150}>
                <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;