import React, { useState } from 'react';

/**
 * HealthBar Component
 */
const HealthBar = ({ value, color }) => {
  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
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

/**
 * Enhanced CourseCard with animations, hover effects, and student-helpful features
 */
export const CourseCard = ({ title, subtitle, progress, emoji, bossName }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate difficulty based on progress (gamification)
  const getDifficultyLevel = () => {
    if (progress === 100) return { text: 'MASTERED', color: 'text-green-400', stars: '⭐⭐⭐' };
    if (progress >= 75) return { text: 'ADVANCED', color: 'text-blue-400', stars: '⭐⭐' };
    if (progress >= 50) return { text: 'INTERMEDIATE', color: 'text-yellow-400', stars: '⭐' };
    return { text: 'BEGINNER', color: 'text-gray-400', stars: '🆕' };
  };

  const difficulty = getDifficultyLevel();

  // Calculate estimated time based on progress
  const getEstimatedTime = () => {
    const remaining = 100 - progress;
    const minutes = Math.ceil(remaining / 10) * 5;
    return minutes;
  };

  return (
    <div 
      className="relative flex flex-col justify-between p-6 bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 rounded-2xl shadow-2xl border-2 border-purple-500/50
                    transform hover:scale-[1.05] hover:shadow-purple-700/70 hover:border-purple-400
                    transition-all duration-300 ease-in-out cursor-pointer h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Animated Background Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
      
      {/* Content Container */}
      <div className="relative z-10">
        
        {/* Header Section with Emoji and Status Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`text-6xl transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
            {emoji}
          </div>
          
          {/* Animated Status Badge */}
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg transform transition-all duration-300 ${
              progress === 100 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white animate-pulse' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            } ${isHovered ? 'scale-110' : ''}`}>
              {progress === 100 ? '✓ COMPLETED' : '⚡ IN PROGRESS'}
            </span>
            
            {/* Difficulty Badge */}
            <span className={`text-xs font-semibold ${difficulty.color}`}>
              {difficulty.stars} {difficulty.text}
            </span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-4">
          <h3 className="text-2xl font-extrabold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-purple-300 italic">{subtitle}</p>
        </div>

        {/* Study Stats - Helpful for Students */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase">Questions</p>
            <p className="text-lg font-bold text-white">{Math.ceil(progress / 20) || 1}-5</p>
          </div>
          <div className="text-center relative">
            <p className="text-xs text-gray-400 uppercase">Time Left</p>
            <p className="text-lg font-bold text-yellow-400">~{getEstimatedTime()}min</p>
          </div>
        </div>

        {/* Boss Challenge Section */}
        {bossName && (
          <div className={`mb-4 p-3 bg-gradient-to-r from-red-900/60 to-orange-900/60 rounded-lg border-2 transition-all duration-300 ${
            isHovered ? 'border-red-400 shadow-lg shadow-red-500/50' : 'border-red-500/70'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-red-300 font-bold uppercase mb-1">⚔️ Boss to Defeat</p>
                <p className="text-base text-white font-extrabold">{bossName}</p>
              </div>
              <div className="text-3xl animate-pulse">
                {progress === 100 ? '✓' : '👹'}
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-300 font-semibold">Progress</p>
            <p className="text-sm text-purple-400 font-bold">{progress}%</p>
          </div>
          <HealthBar value={progress} color={progress === 100 ? 'green' : 'purple'} />
          
          {/* Motivational Messages */}
          <div className="mt-2 text-center">
            {progress === 100 ? (
              <p className="text-xs text-green-400 font-semibold animate-pulse">
                🎉 Excellent work! Review recommended
              </p>
            ) : progress >= 75 ? (
              <p className="text-xs text-blue-400 font-semibold">
                💪 Almost done! Keep going!
              </p>
            ) : progress >= 50 ? (
              <p className="text-xs text-yellow-400 font-semibold">
                🔥 Good pace! Don't give up!
              </p>
            ) : (
              <p className="text-xs text-gray-400 font-semibold">
                🚀 Start your adventure!
              </p>
            )}
          </div>
        </div>

        {/* Quick Tips Tooltip */}
        {isHovered && (
          <div className="absolute -top-2 -right-2 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowTooltip(!showTooltip);
              }}
              className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-purple-500 transition-colors shadow-lg animate-bounce"
            >
              ?
            </button>
            {showTooltip && (
              <div className="absolute top-10 right-0 w-64 bg-gray-800 border-2 border-purple-500 rounded-lg p-4 shadow-2xl">
                <p className="text-xs text-white font-semibold mb-2">💡 Study Tips:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Take notes on mistakes</li>
                  <li>• Review regularly</li>
                  <li>• Challenge the boss gradually</li>
                  <li>• Use the review section</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Floating Action Button on Hover */}
        <div className={`absolute bottom-4 right-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            Start →
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-purple-500/30 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-500/30 rounded-br-2xl" />
    </div>
  );
};

// Demo Component
export default function CourseCardDemo() {
  const courses = [
    {
      title: "Mathematics",
      subtitle: "Calculus and Algebra",
      emoji: "🧮",
      bossName: "The Evil Calculator",
      progress: 60
    },
    {
      title: "History (Morocco)",
      subtitle: "Moroccan Dynasties",
      emoji: "🇲🇦",
      bossName: "The Dynasty Specter",
      progress: 100
    },
    {
      title: "Science",
      subtitle: "The Solar System",
      emoji: "🪐",
      bossName: "The Cosmic Titan",
      progress: 25
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Your Learning Quests
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
}