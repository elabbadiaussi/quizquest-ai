import React from 'react';

// Export NOMMÉ (pour utiliser { HealthBar })
export const HealthBar = ({ value, color }) => {
  const percentage = Math.max(0, Math.min(100, value));
  
  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden border-2 border-gray-600 shadow-inner">
      <div 
        className={`h-full ${colorClasses[color] || 'bg-gray-500'} transition-all duration-500 ease-out rounded-full shadow-lg`}
        style={{ width: `${percentage}%` }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

// OU Export par défaut (si vous préférez utiliser import HealthBar from ...)
// export default HealthBar;