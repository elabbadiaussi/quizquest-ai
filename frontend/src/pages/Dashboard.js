import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CourseCard } from '../components/CourseCard.js'; 

// UTILITY FUNCTION TO MANAGE PLAYER XP AND LEVEL
const getPlayerStats = () => {
    const xp = parseInt(localStorage.getItem('playerXP') || '0');
    const level = Math.floor(0.1 * Math.sqrt(xp)) + 1; 
    
    // Calculate XP needed for next level
    const nextLevel = level + 1;
    const xpForNextLevel = Math.pow((nextLevel - 1) / 0.1, 2);
    const xpForCurrentLevel = Math.pow((level - 1) / 0.1, 2);
    
    // Calculate progress percentage
    const xpProgress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    
    return { xp, level, xpProgress: Math.min(100, Math.max(0, xpProgress)), xpForNextLevel: Math.ceil(xpForNextLevel) };
};

// HealthBar Component
const HealthBar = ({ value, color }) => {
    const colorClasses = {
        red: 'bg-red-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        yellow: 'bg-yellow-500',
        gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    };

    return (
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
            <div
                className={`h-full ${colorClasses[color] || 'bg-blue-500'} transition-all duration-500 ease-out rounded-full shadow-lg`}
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
            />
        </div>
    );
};

export const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showStats, setShowStats] = useState(false);
    
    const { xp, level, xpProgress, xpForNextLevel } = getPlayerStats();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/dashboard');
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Calculate overall stats
    const totalProgress = courses.length > 0 
        ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
        : 0;
    const completedCourses = courses.filter(c => c.progress === 100).length;
    const totalCourses = courses.length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">⚔️</div>
                    <h1 className="text-4xl font-bold animate-pulse">Loading Quests...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-red-500 p-8 text-center">
                <h1 className="text-4xl font-bold">Error: {error}</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white p-8">
            
            {/* ANIMATED HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div className="flex-1">
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2">
                        Welcome, Adventurer! 🎮
                    </h1>
                    <p className="text-xl text-gray-400">Choose your next quest and become a master.</p>
                </div>

                <div className="grid grid-cols-3 gap-4 h-full">
                    {/* 1. Statistics (Statistiques) */}
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg hover:scale-105 transform min-h-[200px]"
                    >
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-xl">Statistics</p>
                    </button>

                    {/* 2. Magic AI Quiz (RÉDUIT) */}
                    <Link to="/create-ai" className="group">
                        <div className="flex flex-col items-center justify-center p-6 
                                        bg-gradient-to-br from-purple-800 to-pink-900
                                        rounded-xl shadow-lg text-white border-4 
                                        border-purple-500 hover:border-pink-500
                                        transition-all duration-300 cursor-pointer min-h-[200px] 
                                        group-hover:scale-105 transform">
                            <div className="text-center">
                                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300 animate-bounce">🤖</div>
                                <p className="text-xl font-bold mb-1">Magic AI Quiz</p>
                                <p className="text-sm text-purple-200">Generate a quiz in seconds!</p>
                            </div>
                        </div>
                    </Link>
                    
                    {/* 3. Revision Notes (Notes de Révision) */}
                    <Link 
                        to="/notes" 
                        className="flex flex-col items-center justify-center p-6 bg-yellow-500 text-gray-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:scale-105 transform min-h-[200px]"
                    >
                        <div className="text-4xl mb-2">📝</div>
                        <p className="text-xl">Revision Notes</p>
                    </Link>
                </div>
            </header>

            {/* ENHANCED PLAYER STATS CARD */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-800 via-purple-900/30 to-gray-800 rounded-2xl shadow-2xl border-2 border-yellow-500/50 hover:border-yellow-400 transition-all">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    
                    {/* Level & Avatar Section */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-xl animate-pulse">
                                🛡️
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-gray-900">
                                {level}
                            </div>
                        </div>
                        
                        <div>
                            <h2 className="text-3xl font-extrabold text-yellow-400">Level {level}</h2>
                            <p className="text-gray-400 text-sm">Hero in Training</p>
                        </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-300">Progress towards Level {level + 1}</span>
                            <span className="text-sm font-bold text-yellow-400">{xp} / {xpForNextLevel} XP</span>
                        </div>
                        <HealthBar value={xpProgress} color="gold" />
                        <p className="text-xs text-gray-400 mt-1">
                            {xpForNextLevel - xp} XP remaining to level up!
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4">
                        <div className="text-center p-3 bg-gray-900/50 rounded-lg border border-green-500/30">
                            <p className="text-2xl font-bold text-green-400">{completedCourses}</p>
                            <p className="text-xs text-gray-400 uppercase">Completed</p>
                        </div>
                        <div className="text-center p-3 bg-gray-900/50 rounded-lg border border-blue-500/30">
                            <p className="text-2xl font-bold text-blue-400">{totalCourses}</p>
                            <p className="text-xs text-gray-400 uppercase">Total Quests</p>
                        </div>
                        <div className="text-center p-3 bg-gray-900/50 rounded-lg border border-purple-500/30">
                            <p className="text-2xl font-bold text-purple-400">{totalProgress}%</p>
                            <p className="text-xs text-gray-400 uppercase">Progress</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* EXPANDED STATS PANEL */}
            {showStats && (
                <div className="mb-8 p-6 bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-500/50 animate-slideDown">
                    <h3 className="text-2xl font-bold text-blue-400 mb-4">📈 Detailed Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-900/50 rounded-lg">
                            <p className="text-gray-400 text-sm mb-1">Average Success Rate</p>
                            <p className="text-3xl font-bold text-green-400">{totalProgress}%</p>
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-lg">
                            <p className="text-gray-400 text-sm mb-1">Questions Answered Correctly</p>
                            <p className="text-3xl font-bold text-blue-400">{completedCourses * 5}</p>
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-lg">
                            <p className="text-gray-400 text-sm mb-1">Daily Streak</p>
                            <p className="text-3xl font-bold text-orange-400">🔥 3 days</p>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-400 font-semibold">💡 Tip of the Day:</p>
                        <p className="text-gray-300 text-sm mt-1">Review completed subjects to keep your knowledge fresh!</p>
                    </div>
                </div>
            )}

            {/* COURSES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {courses.map((course) => (
                    <Link 
                        key={course.slug} 
                        to={`/quiz/${course.slug}`}
                    >
                        {/* CourseCard component is assumed to be already English or uses props */}
                        <CourseCard
                            title={course.title}
                            subtitle={course.subtitle}
                            progress={course.progress}
                            emoji={course.emoji}
                            bossName={course.bossName}
                        />
                    </Link>
                ))}

                {/* CREATE NEW QUIZ CARD */}
                <Link to="/create">
                    <div className="flex items-center justify-center h-full p-6 bg-gradient-to-br from-gray-800 to-gray-900
                                     rounded-2xl shadow-lg text-gray-500 border-4 
                                     border-dashed border-gray-700 hover:text-white 
                                     hover:border-blue-500 hover:shadow-blue-500/50
                                     transition-all duration-300 cursor-pointer min-h-[400px] group">
                        <div className="text-center">
                            <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">➕</div>
                            <p className="text-xl font-bold mb-2">Create a Quiz</p>
                            <p className="text-sm text-gray-400">Customize your learning</p>
                        </div>
                    </div>
                </Link>

            </div>

            {/* DAILY CHALLENGE BANNER */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl border-2 border-purple-500/50 shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl animate-bounce">🏆</div>
                        <div>
                            <h3 className="text-2xl font-bold text-purple-300">Daily Challenge</h3>
                            <p className="text-gray-400">Complete 3 quizzes today and earn +50 bonus XP!</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg">
                        Accept Challenge
                    </button>
                </div>
            </div>

        </div>
    );
};