import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- États pour le constructeur ---

  // 1. La "Banque" de tous les quiz/questions, chargée depuis l'API
  const [sourceQuizzes, setSourceQuizzes] = useState([]);
  
  // 2. Les infos du nouveau quiz que l'utilisateur est en train de créer
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizSlug, setNewQuizSlug] = useState('');
  
  // 3. La liste des questions que l'utilisateur a cochées
  // On va stocker les objets questions complets
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // --- Chargement des données ---
  useEffect(() => {
    // Affiche un message de chargement de la banque de questions
    const fetchQuestionBank = async () => {
      try {
        // On appelle notre nouvelle ROUTE 4
        const response = await fetch('http://localhost:4000/api/all-quizzes-with-questions');
        if (!response.ok) {
          throw new Error('Réponse non OK du serveur');
        }
        const data = await response.json();
        setSourceQuizzes(data);
      } catch (err) {
        setError('Impossible de charger la banque de questions.');
        console.error(err);
      }
    };
    fetchQuestionBank();
  }, []); // Se lance une seule fois

  // --- Fonctions de gestion ---

  // Gère le cochage/décochage d'une question
  const handleSelectQuestion = (e, questionObject, sourceQuizTitle) => {
    // On ajoute la catégorie (titre du quiz source) à l'objet pour s'en souvenir
    const questionWithCategory = { ...questionObject, category: sourceQuizTitle };

    if (e.target.checked) {
      // Ajoute la question à la liste des sélections
      setSelectedQuestions(prev => [...prev, questionWithCategory]);
    } else {
      // Retire la question de la liste
      setSelectedQuestions(prev => prev.filter(q => q.text !== questionObject.text));
    }
  };

  // Gère la soumission du quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      setError('Vous devez sélectionner au moins une question.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // Prépare l'objet à envoyer à l'API (ROUTE 5)
    const customQuizData = {
      title: newQuizTitle,
      slug: newQuizSlug.toLowerCase().replace(/\s+/g, '-'), // Nettoyage du slug
      emoji: '🧑‍🏫', // Emoji par défaut pour les quiz perso
      questions: selectedQuestions.map(q => ({ // On nettoie la "category" temporaire
        text: q.text,
        options: q.options,
        correct: q.correct
      }))
    };

    try {
      const response = await fetch('http://localhost:4000/api/create-custom-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customQuizData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'La création a échoué.');
      }

      navigate('/dashboard'); // Succès !

    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Constructeur de Quiz</h1>
        
        {/* Étape 1: Infos du Quiz */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Infos de votre Quiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              value={newQuizTitle} 
              onChange={(e) => setNewQuizTitle(e.target.value)} 
              placeholder="Titre (ex: Ma Révision Lundi)" 
              className="p-3 bg-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
            <input 
              value={newQuizSlug} 
              onChange={(e) => setNewQuizSlug(e.target.value)} 
              placeholder="Identifiant (ex: revision-lundi)" 
              className="p-3 bg-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
        </div>

        {/* Étape 2: Banque de Questions */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Choisissez vos questions ({selectedQuestions.length} sélectionnées)</h2>
          
          {/* Si la banque est vide ou en chargement */}
          {sourceQuizzes.length === 0 && !error && (
            <p className="text-gray-400">Chargement de la banque de questions...</p>
          )}

          {/* On groupe les questions par leur quiz d'origine */}
          {sourceQuizzes.map(quiz => (
            <div key={quiz.slug} className="mb-4">
              <h3 className="font-bold text-lg text-blue-300 mb-2 border-b border-gray-600 pb-1">{quiz.title}</h3>
              {quiz.questions.map((q, qIndex) => (
                <div key={`${quiz.slug}-${qIndex}`} className="flex items-center p-2 bg-gray-600 rounded mb-2 transition-colors hover:bg-gray-500">
                  <input
                    type="checkbox"
                    id={`${quiz.slug}-${qIndex}`}
                    onChange={(e) => handleSelectQuestion(e, q, quiz.title)}
                    className="h-5 w-5 mr-3 text-blue-400 bg-gray-700 border-gray-500 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`${quiz.slug}-${qIndex}`} className="flex-1 cursor-pointer">{q.text}</label>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Bouton de soumission */}
        <button type="submit" disabled={isLoading} className="w-full py-3 font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder mon Quiz'}
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
};