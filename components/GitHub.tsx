import React, { useState, useEffect } from 'react';
import type { GitHubRepo } from '../types';
import FadeIn from './FadeIn';
import Spinner from './Spinner';
import { StarIcon, ForkIcon, GITHUB_USERNAME } from '../constants';

const RepoCard: React.FC<{ repo: GitHubRepo }> = ({ repo }) => {
    const langColor: { [key: string]: string } = {
        TypeScript: 'bg-blue-500',
        JavaScript: 'bg-yellow-500',
        HTML: 'bg-orange-500',
        CSS: 'bg-purple-500',
        Python: 'bg-green-500',
    };
    const color = repo.language ? langColor[repo.language] || 'bg-gray-500' : 'bg-gray-500';

    return (
        <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-slate-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:bg-slate-700 hover:shadow-cyan-500/20 group hover:-translate-y-1 h-full flex flex-col"
        >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">{repo.name}</h3>
            <p className="text-slate-400 mb-4 text-sm flex-grow">{repo.description || 'لا يوجد وصف.'}</p>
            <div className="flex items-center text-slate-400 text-sm mt-auto">
                {repo.language && (
                    <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-1.5 rtl:ml-1.5 rtl:mr-0 ${color}`}></span>
                        <span>{repo.language}</span>
                    </div>
                )}
                <div className="flex-grow"></div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center">
                        <StarIcon />
                        <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center">
                        <ForkIcon />
                        <span>{repo.forks_count}</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

const GitHub: React.FC = () => {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
                if (!response.ok) {
                    throw new Error('فشل في جلب البيانات من GitHub.');
                }
                const data = await response.json();
                setRepos(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepos();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                    <p className="mr-4 text-slate-300">جاري تحميل المشاريع...</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-center text-red-400">{error}</p>;
        }

        return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo, index) => (
                    <FadeIn key={repo.id} delay={index * 100}>
                        <RepoCard repo={repo} />
                    </FadeIn>
                ))}
            </div>
        );
    }

    return (
        <section id="github" className="py-20 bg-slate-800/50 overflow-hidden">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-white">مشاريعي على GitHub</h2>
                        <p className="text-slate-400 mt-2">أحدث 6 مستودعات قمت بالعمل عليها مؤخراً.</p>
                        <div className="w-24 h-1 bg-cyan-400 mx-auto mt-4"></div>
                    </div>
                </FadeIn>
                
                {renderContent()}

                {!isLoading && !error && repos.length > 0 && (
                    <FadeIn delay={300}>
                        <div className="text-center mt-12">
                            <a
                                href={`https://github.com/${GITHUB_USERNAME}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-700 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-600 transition-all duration-300 inline-block transform hover:scale-105"
                            >
                                شاهد المزيد على GitHub
                            </a>
                        </div>
                    </FadeIn>
                )}
            </div>
        </section>
    );
};

export default GitHub;