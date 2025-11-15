import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateAIQuiz = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [error, setError] = useState(null);

  const generateQuiz = async () => {
    if (!topic.trim()) {
      setError('🚨 Entre un sujet pour le quiz!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // L'URL reste la même car la route du backend est inchangée
      const response = await fetch("http://localhost:4000/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          numQuestions,
          difficulty
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const quizData = await response.json();
      
      console.log('✅ Quiz reçu du backend:', quizData);
      setGeneratedQuiz(quizData);
      
    } catch (error) {
      console.error("🔴 Erreur complète:", error);
      
      let errorMessage = '❌ Erreur lors de la génération. ';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Le backend n\'est pas accessible. Vérifie que le serveur tourne sur le port 4000.';
      } 
      // Mise à jour du message d'erreur pour faire référence à Gemini/Google
      else if (error.message.includes('API') || error.message.includes('Gemini') || error.message.includes('Claude')) {
        errorMessage += 'Problème avec l\'API IA. Vérifie ta clé API dans le fichier .env (GEMINI_API_KEY) et les logs du backend.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const goToQuiz = () => {
    if (generatedQuiz && generatedQuiz.slug) {
      navigate(`/quiz/${generatedQuiz.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-white mb-4">
             Générateur de Quiz IA
          </h1>
         
        </div>

        {!generatedQuiz ? (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-500/50 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2 text-lg">
                  📚 Sujet du Quiz
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setError(null);
                  }}
                  placeholder="Ex: Les planètes du système solaire"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-4 focus:ring-purple-500 focus:outline-none text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && generateQuiz()}
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2 text-lg">
                  🔢 Nombre de questions: {numQuestions}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-gray-400 text-sm mt-1">
                  <span>3</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-bold mb-2 text-lg">
                  ⚡ Difficulté
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white scale-105 shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {level === 'easy' ? '🟢 Facile' : level === 'medium' ? '🟡 Moyen' : '🔴 Difficile'}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border-2 border-red-500 p-4 rounded-lg">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              <button
                onClick={generateQuiz}
                disabled={isGenerating || !topic.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-3 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    Génération en cours...
                  </div>
                ) : (
                  '✨ Générer le Quiz avec l\'IA'
                )}
              </button>

              <p className="text-gray-400 text-sm text-center">
                💡 Astuce: Sois spécifique dans ton sujet pour un meilleur quiz
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-green-500/50 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-bounce">{generatedQuiz.emoji}</div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  {generatedQuiz.title}
                </h2>
                <p className="text-xl text-gray-300">{generatedQuiz.subtitle}</p>
                <p className="text-lg text-purple-300 mt-2">
                  🎯 Boss: {generatedQuiz.bossName}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/50 p-4 rounded-lg text-center transform hover:scale-105 transition-all">
                  <p className="text-gray-400 text-sm">Questions</p>
                  <p className="text-3xl font-bold text-white">
                    {generatedQuiz.questions.length}
                  </p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center transform hover:scale-105 transition-all">
                  <p className="text-gray-400 text-sm">XP de base</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {generatedQuiz.baseXP || 100}
                  </p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center transform hover:scale-105 transition-all">
                  <p className="text-gray-400 text-sm">Difficulté</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => { setGeneratedQuiz(null); setError(null); }}
                  className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
                >
                  🔄 Régénérer
                </button>
                <button
                  onClick={goToQuiz}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-green-400 transition-all shadow-lg"
                >
                  ⚔️ Commencer le Quiz !
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-500/50">
              <h3 className="text-2xl font-bold text-white mb-4">
                📋 Aperçu des questions
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {generatedQuiz.questions.map((q, idx) => (
                  <div key={idx} className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-900/70 transition-all">
                    <p className="text-white font-bold mb-2">
                      {idx + 1}. {q.text}
                    </p>
                    <div className="space-y-1 ml-4">
                      {q.options.map((opt) => (
                        <p
                          key={opt.id}
                          // CORRECTION: Toutes les options ont le même style (gris) pour masquer la réponse
                          className="text-sm text-gray-400"
                        >
                          {opt.id.toUpperCase()}) {opt.text}
                          {/* Suppression de l'affichage du '✓' */}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💥 Dégâts: {q.damage || 30} HP
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
        >
          ← Retour au Dashboard
        </button>
      </div>
    </div>
  );
};