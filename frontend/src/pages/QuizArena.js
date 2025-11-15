import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HealthBar } from '../components/HealthBar'; 

// UTILITY FUNCTION TO GRANT XP AND CHECK LEVEL
const grantXP = (amount) => {
    const currentXP = parseInt(localStorage.getItem('playerXP') || '0');
    const newXP = currentXP + amount;
    
    const oldLevel = Math.floor(0.1 * Math.sqrt(currentXP)) + 1;
    const newLevel = Math.floor(0.1 * Math.sqrt(newXP)) + 1;

    localStorage.setItem('playerXP', newXP.toString());
    
    let levelUpMessage = "";
    if (newLevel > oldLevel) {
        levelUpMessage = `CONGRATULATIONS! You reached Level ${newLevel}! 🏆`;
    }
    
    return { xpGained: amount, newLevel, levelUpMessage };
};


export const QuizArena = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  // Quiz states
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Game states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [message, setMessage] = useState("A new monster appears!");
  const [isGameOver, setIsGameOver] = useState(false);
  
  // Visual feedback
  const [hitFeedback, setHitFeedback] = useState(false); 
  const [damageFeedback, setDamageFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // AI EXPLAINER
  const [aiExplanation, setAiExplanation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Feedback states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  // Combo system
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // Load Quiz Data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/quiz/${quizId}`);
        if (!response.ok) {
          throw new Error('Quiz not found or server error');
        }
        const data = await response.json();
        setQuizData(data);
        setMessage(`Monster detected: ${data.bossName || data.title}!`);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  // AI EXPLAINER FUNCTION with GEMINI
  const getAIExplanation = async () => {
    setIsLoadingAI(true);
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const correctOption = currentQuestion.options.find(opt => opt.id === currentQuestion.correct);
    
    const GEMINI_API_KEY = "AIzaSyDFuPGy0I6YrI-_eQ3_b4S8vsnirWP-dxs"; 
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a patient and encouraging teacher. Explain this quiz question to a student:

Question: ${currentQuestion.text}

Options:
${currentQuestion.options.map(opt => `${opt.id.toUpperCase()}) ${opt.text}`).join('\n')}

Correct answer: ${correctOption.text}

Give a clear explanation in English of why this is the correct answer. Add a mnemonic tip. Be brief (3-4 sentences) and encouraging! Use emojis.`
            }]
          }]
        })
      });
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
          const explanation = data.candidates[0].content.parts[0].text;
          setAiExplanation(explanation);
      } else {
          throw new Error("Incomplete AI response.");
      }
      
    } catch (error) {
      console.error("AI Error:", error);
      setAiExplanation("❌ Sorry, the explanation is not available at the moment.");
    } finally {
      setIsLoadingAI(false);
    }
  };
  
  // Main function to handle answers
  const handleAnswer = (optionId) => {
    if (isGameOver || selectedAnswer) return;
    
    setSelectedAnswer(optionId);
    
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const questionDamage = currentQuestion.damage || 40; 
    
    if (optionId === currentQuestion.correct) {
      // CORRECT ANSWER
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      
      const bonusDamage = Math.floor(questionDamage * (1 + (newCombo * 0.1)));
      const newMonsterHealth = Math.max(0, monsterHealth - bonusDamage); 
      setMonsterHealth(newMonsterHealth);
      
      setHitFeedback(true); 
      setTimeout(() => setHitFeedback(false), 500);
      
      setAiExplanation(null);
      
      if (newMonsterHealth <= 0) {
        const xpBonus = Math.floor((quizData.baseXP || 100) * (1 + (maxCombo * 0.05)));
        const xpResult = grantXP(xpBonus); 
        setMessage(`🎊 VICTORY! The monster is defeated! (+${xpResult.xpGained} XP) ${xpResult.levelUpMessage}`);
        setIsGameOver(true);
      } else {
        setTimeout(() => {
          setMessage(`⚔️ CRITICAL HIT! (-${bonusDamage} HP) ${newCombo > 1 ? `COMBO x${newCombo}! 🔥` : ''}`);
        }, 1000);
      }
    } else {
      // WRONG ANSWER
      setCombo(0);
      setShowCorrectAnswer(true);
      
      const playerDamage = 25; 
      const newPlayerHealth = Math.max(0, playerHealth - playerDamage);
      setPlayerHealth(newPlayerHealth);

      setDamageFeedback(true); 
      setTimeout(() => setDamageFeedback(false), 500); 
      
      const wrongQuestion = quizData.questions[currentQuestionIndex];
      const existingNotes = JSON.parse(localStorage.getItem('studyList') || '[]');
      
      const isAlreadyAdded = existingNotes.some(note => note.text === wrongQuestion.text);
      
      let noteMessage = "";
      if (!isAlreadyAdded) {
        existingNotes.push(wrongQuestion);
        localStorage.setItem('studyList', JSON.stringify(existingNotes));
        noteMessage = " 📝 (Note saved!)"; 
      }

      if (newPlayerHealth > 0) {
        setTimeout(() => {
          getAIExplanation(); 
          setMessage(`💥 Wrong answer! (-${playerDamage} HP)${noteMessage}`); 
        }, 1000);
      } else {
         setMessage("💀 DEFEAT... You have been defeated.");
         setIsGameOver(true);
      }
    }
  };

  // Function to go to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
      setAiExplanation(null);
    } else {
      const xpBonus = Math.floor((quizData.baseXP || 100) * (1 + (maxCombo * 0.05)));
      const xpResult = grantXP(xpBonus);
      setMessage(`🎊 VICTORY! (+${xpResult.xpGained} XP) ${xpResult.levelUpMessage}`);
      setIsGameOver(true);
    }
  };

  // Function to handle feedback submission
  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      alert("⭐ Please give a rating!");
      return;
    }

    try {
      await fetch(`http://localhost:4000/api/quiz/${quizData.slug}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          comment: comment,
        }),
      });
      setIsFeedbackSubmitted(true);
    } catch (err) {
      console.error("Error sending feedback:", err);
      setIsFeedbackSubmitted(true); 
    }
  };

  // --- RENDER ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚔️</div>
          <h1 className="text-4xl font-bold animate-pulse">Loading battle...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 p-8 text-center">
        <h1 className="text-4xl font-bold">❌ Error: {error}</h1>
      </div>
    );
  }

  if (!quizData) {
    return <div className="min-h-screen bg-gray-900 text-white p-8 text-center">Quiz not found.</div>;
  }
  
  if (!quizData.questions || quizData.questions.length === 0) {
      return (
        <div className="min-h-screen bg-gray-900 text-red-500 p-8 text-center">
          <h1 className="text-4xl font-bold">⚠️ Error: This quiz contains no questions.</h1>
          <button 
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-8 py-4 bg-purple-600 rounded-lg text-2xl font-bold hover:bg-purple-500 transition-all hover:scale-105">
              Back to Dashboard
          </button>
        </div>
      );
  }

  const currentQuestion = !isGameOver ? quizData.questions[currentQuestionIndex] : null;
  
  const alertClass = isGameOver && playerHealth > 0 
    ? 'border-green-400 shadow-green-600/50 shadow-2xl animate-bounce' 
    : isGameOver && playerHealth <= 0
    ? 'border-red-500 shadow-red-600/50 shadow-2xl' 
    : 'border-purple-500/50';

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 text-white p-8">
      
      {/* COMBO COUNTER */}
      {combo > 0 && !isGameOver && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-full shadow-2xl animate-pulse">
          <p className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span className="text-3xl">⚡</span>
            COMBO x{combo}
          </p>
        </div>
      )}

      {/* 1. MONSTER ZONE */}
      <div className={`w-full max-w-3xl text-center p-8 rounded-2xl border-4 ${alertClass} bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm transition-all duration-300`}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-red-400">{quizData.title}</h2>
            <h3 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              {quizData.bossName || 'Monster'}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Question</p>
            <p className="text-2xl font-bold text-purple-400">{currentQuestionIndex + 1}/{quizData.questions.length}</p>
          </div>
        </div>
        
        <div className={`my-6 text-9xl relative ${hitFeedback ? 'animate-bounce scale-125' : ''} transition-all duration-300`}>
            <div className={hitFeedback ? 'animate-ping absolute inset-0 flex items-center justify-center' : 'hidden'}>
              <span className="text-9xl opacity-50">{quizData.emoji || '👾'}</span>
            </div>
            {quizData.emoji || '👾'}
            {hitFeedback && (
                <span className="absolute inset-0 flex items-center justify-center text-red-500 text-7xl font-extrabold opacity-90 animate-bounce">
                    -{currentQuestion?.damage || 40}
                </span>
            )}
        </div>
        
        <div className="space-y-2">
          <HealthBar value={monsterHealth} color="red" />
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-400 font-bold flex items-center gap-1">
              <span className="text-lg">❤️</span>
              Boss HP
            </p>
            <p className="text-red-400 font-bold">{monsterHealth}/100</p>
          </div>
        </div>
      </div>

      {/* 2. MESSAGE ZONE */}
      <div className="my-6 p-5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl text-center w-full max-w-3xl border-l-4 border-yellow-500 shadow-xl">
        <p className="text-xl italic text-yellow-300 font-bold">{message}</p>
      </div>

      {/* 3. GAME ZONE (Question or Feedback) */}
      {!isGameOver ? (
        <div className="w-full max-w-3xl">
          <div className="p-6 bg-gradient-to-br from-purple-900/50 to-gray-800 rounded-2xl shadow-2xl mb-6 border-2 border-purple-500/50">
            <h4 className="text-2xl font-bold text-white text-center">{currentQuestion.text}</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentQuestion.options.map((option) => {
              const isCorrect = option.id === currentQuestion.correct;
              const isSelected = option.id === selectedAnswer;
              const isWrong = isSelected && !isCorrect;
              
              let buttonClass = "p-5 rounded-xl text-lg font-bold text-white uppercase shadow-lg border-b-4 transition-all duration-300";
              
              if (isSelected && isCorrect) {
                buttonClass += " bg-gradient-to-r from-green-600 to-green-500 border-green-800 scale-105 animate-pulse";
              } else if (isWrong) {
                buttonClass += " bg-gradient-to-r from-red-600 to-red-500 border-red-800 animate-shake";
              } else if (showCorrectAnswer && isCorrect) {
                buttonClass += " bg-gradient-to-r from-green-600 to-green-500 border-green-800 animate-pulse ring-4 ring-green-400/50";
              } else {
                buttonClass += " bg-gradient-to-r from-blue-700 to-blue-600 border-blue-900 hover:from-blue-600 hover:to-blue-500 hover:scale-105 active:scale-95";
              }
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  {isSelected && isCorrect && <span className="mr-2">✓</span>}
                  {isWrong && <span className="mr-2">✗</span>}
                  {showCorrectAnswer && isCorrect && !isSelected && <span className="mr-2">✓</span>}
                  {option.text}
                </button>
              );
            })}
          </div>

          {/* ====== AI EXPLAINER SECTION (Improved Design) ====== */}
          {(aiExplanation || isLoadingAI) && selectedAnswer && (
            <div className="mt-6 relative">
              {/* Entry animation with overlay */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-2xl border-2 border-purple-400/50 shadow-2xl overflow-hidden">
                {/* Header with animated icon */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 border-b border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-full">
                        <span className="text-3xl animate-spin-slow">✨</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                        Personal AI Coach
                      </h4>
                      <p className="text-sm text-gray-400">Analyzing your answer</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isLoadingAI ? (
                    <div className="text-center py-8">
                      <div className="inline-block relative">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <span className="text-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">🤖</span>
                      </div>
                      <p className="mt-4 text-lg font-semibold text-purple-300 animate-pulse">
                        AI is analyzing the question...
                      </p>
                      <div className="flex justify-center gap-2 mt-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Alert badge */}
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg w-fit">
                        <span className="text-xl">⚠️</span>
                        <span className="text-sm font-semibold text-red-300">Incorrect answer - Detailed analysis</span>
                      </div>

                      {/* Explanation with improved design */}
                      <div className="relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
                        <div className="pl-6 pr-4 py-4 bg-gray-800/50 rounded-r-xl border border-purple-500/20">
                          <p className="text-white leading-relaxed text-lg whitespace-pre-line">
                            {aiExplanation}
                          </p>
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20">
                        <span className="text-2xl">📈</span>
                        <p className="text-sm text-blue-300">
                          <strong>Keep going!</strong> Every mistake is a learning opportunity 💪
                        </p>
                      </div>

                      {/* Styled close button */}
                      <button
                        onClick={() => setAiExplanation(null)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500 flex items-center justify-center gap-2 group"
                      >
                        <span>Close explanation</span>
                        <span className="text-xl group-hover:scale-125 transition-transform">✕</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Next Question Button */}
          {selectedAnswer && !isGameOver && (
            <div className="mt-6 text-center">
              <button
                onClick={goToNextQuestion}
                className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold text-xl rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all transform hover:scale-105 shadow-lg border-b-4 border-orange-800"
              >
                {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question →' : 'Finish Quiz 🏆'}
              </button>
            </div>
          )}

          {/* Study Tip */}
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm text-center">
              💡 <strong>Tip:</strong> Wrong answers are automatically saved in your notes!
            </p>
          </div>
        </div>
      ) : (
        // --- GAME OVER ---
        <div className="w-full max-w-3xl text-center">
          {/* Victory/Defeat Screen */}
          <div className="mb-8 p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-4 border-purple-500/50 shadow-2xl">
            <div className="text-8xl mb-4">
              {playerHealth > 0 ? '🏆' : '💀'}
            </div>
            <h2 className={`text-4xl font-extrabold mb-4 ${playerHealth > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {playerHealth > 0 ? 'VICTORY!' : 'DEFEAT'}
            </h2>
            
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">Max Combo</p>
                <p className="text-3xl font-bold text-orange-400">🔥 {maxCombo}</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">Questions</p>
                <p className="text-3xl font-bold text-blue-400">{quizData.questions.length}</p>
              </div>
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">HP Remaining</p>
                <p className="text-3xl font-bold text-green-400">{playerHealth}</p>
              </div>
            </div>
          </div>

          {!isFeedbackSubmitted ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border-2 border-green-500/50">
              <h3 className="text-3xl font-bold text-white mb-4">⭐ Share your feedback!</h3>
              <p className="text-gray-400 mb-6">Help us improve this quest.</p>
              
              {/* Star rating system */}
              <div className="flex justify-center text-6xl mb-6 gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer transform transition-all duration-200 ${
                      rating >= star 
                        ? 'text-yellow-400 scale-125' 
                        : 'text-gray-600 hover:scale-110'
                    } hover:text-yellow-300`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 bg-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-500 transition-all"
                rows="4"
                placeholder="Any suggestions? Difficulties? (Optional)"
              ></textarea>
              
              <button 
                onClick={handleFeedbackSubmit}
                className="mt-6 w-full py-4 font-bold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-lg hover:from-green-500 hover:to-green-400 transition-all text-xl transform hover:scale-105">
                Send Feedback
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border-2 border-purple-500/50">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-400 mb-6">Thank you for your feedback!</h2>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl text-2xl font-bold hover:from-purple-500 hover:to-purple-400 transition-all shadow-xl transform hover:scale-105">
                🏠 Back to Dashboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. PLAYER ZONE (Health bar) */}
      <div className={`w-full max-w-3xl mt-8 p-6 rounded-2xl border-2 transition-all duration-300 ${
        damageFeedback 
          ? 'bg-red-900/70 border-red-500 animate-pulse shadow-2xl shadow-red-500/50' 
          : 'bg-gradient-to-b from-gray-800/90 to-gray-900/90 border-green-500/50'
      }`}>
        <div className="space-y-2">
          <HealthBar value={playerHealth} color="green" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-300 font-bold flex items-center gap-1">
              <span className="text-lg">⚔️</span>
              Your Life
            </p>
            <p className="text-sm text-green-400 font-bold">{playerHealth}/100 HP</p>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .animate-spin-slow {
          display: inline-block;
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};