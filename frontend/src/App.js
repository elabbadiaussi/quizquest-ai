import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// ✅ IMPORTS CORRECTS selon TES noms de fichiers
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { QuizArena } from './pages/QuizArena';
import { CreateQuiz } from './pages/CreateQuiz';
import { MyNotes } from './pages/MyNotes';
import { CreateAIQuiz } from './pages/CreateAIQuiz';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Page de connexion */}
          <Route path="/" element={<Login />} />
          
          {/* Dashboard - Liste des quiz */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Jouer à un quiz */}
          <Route path="/quiz/:quizId" element={<QuizArena />} />
          
          {/* Créer un quiz avec l'IA */}
          <Route path="/create-ai" element={<CreateAIQuiz />} />
          
          {/* Créer un quiz manuellement */}
          <Route path="/create" element={<CreateQuiz />} />
          
          {/* Notes de révision */}
          <Route path="/notes" element={<MyNotes />} />
          
          {/* 404 - Page non trouvée */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl text-gray-400 mb-6">Page non trouvée</p>
                <a 
                  href="/dashboard" 
                  className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500 transition-all inline-block"
                >
                  Retour au Dashboard
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;