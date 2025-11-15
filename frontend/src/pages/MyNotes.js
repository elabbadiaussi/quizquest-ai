import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'mastered', 'studying'
  const [masteredNotes, setMasteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('studyList') || '[]');
    const savedMastered = JSON.parse(localStorage.getItem('masteredNotes') || '[]');
    setNotes(savedNotes);
    setMasteredNotes(savedMastered);
  }, []);

  // Find correct answer
  const getCorrectAnswerText = (question) => {
    if (!question.options) {
      return "N/A";
    }
    const correctOption = question.options.find(opt => opt.id === question.correct);
    return correctOption ? correctOption.text : "Unknown";
  };
  
  // Mark note as mastered
  const markAsMastered = (index) => {
    const noteToMaster = notes[index];
    const newNotes = notes.filter((_, i) => i !== index);
    const newMastered = [...masteredNotes, { ...noteToMaster, masteredAt: new Date().toISOString() }];
    
    setNotes(newNotes);
    setMasteredNotes(newMastered);
    localStorage.setItem('studyList', JSON.stringify(newNotes));
    localStorage.setItem('masteredNotes', JSON.stringify(newMastered));
  };

  // Unmark as mastered
  const unmarkMastered = (index) => {
    const noteToStudy = masteredNotes[index];
    const newMastered = masteredNotes.filter((_, i) => i !== index);
    const newNotes = [...notes, noteToStudy];
    
    setNotes(newNotes);
    setMasteredNotes(newMastered);
    localStorage.setItem('studyList', JSON.stringify(newNotes));
    localStorage.setItem('masteredNotes', JSON.stringify(newMastered));
  };

  // Delete specific note
  const deleteNote = (index, isMastered = false) => {
    if (isMastered) {
      const newMastered = masteredNotes.filter((_, i) => i !== index);
      setMasteredNotes(newMastered);
      localStorage.setItem('masteredNotes', JSON.stringify(newMastered));
    } else {
      const newNotes = notes.filter((_, i) => i !== index);
      setNotes(newNotes);
      localStorage.setItem('studyList', JSON.stringify(newNotes));
    }
  };
  
  // Clear all notes
  const clearAllNotes = () => {
    localStorage.removeItem('studyList');
    localStorage.removeItem('masteredNotes');
    setNotes([]);
    setMasteredNotes([]);
    setShowConfirmDelete(false);
  };

  // Filter notes
  const getFilteredNotes = () => {
    let filtered = filter === 'all' ? notes : [];
    if (filter === 'mastered') {
      filtered = masteredNotes;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCorrectAnswerText(note).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredNotes = getFilteredNotes();
  const totalNotes = notes.length + masteredNotes.length;
  const masteryRate = totalNotes > 0 ? Math.round((masteredNotes.length / totalNotes) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900/20 to-gray-900 text-white p-8">
      
      {/* HEADER */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
              📝 My Study Notes
            </h1>
            <p className="text-lg text-gray-400">Saved questions to improve your mastery</p>
          </div>
          <Link 
            to="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg hover:scale-105 transform"
          >
            🏠 Back to Dashboard
          </Link>
        </div>

        {/* STATISTICS PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl border-2 border-blue-500/30 shadow-lg">
            <p className="text-sm text-blue-300 uppercase mb-1">To Review</p>
            <p className="text-4xl font-extrabold text-blue-400">{notes.length}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl border-2 border-green-500/30 shadow-lg">
            <p className="text-sm text-green-300 uppercase mb-1">Mastered</p>
            <p className="text-4xl font-extrabold text-green-400">{masteredNotes.length}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl border-2 border-purple-500/30 shadow-lg">
            <p className="text-sm text-purple-300 uppercase mb-1">Total Notes</p>
            <p className="text-4xl font-extrabold text-purple-400">{totalNotes}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-900/50 to-orange-800/50 rounded-xl border-2 border-orange-500/30 shadow-lg">
            <p className="text-sm text-orange-300 uppercase mb-1">Mastery Rate</p>
            <p className="text-4xl font-extrabold text-orange-400">{masteryRate}%</p>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search for a question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-bold rounded-xl transition-all transform hover:scale-105 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📚 To Review ({notes.length})
            </button>
            <button
              onClick={() => setFilter('mastered')}
              className={`px-6 py-3 font-bold rounded-xl transition-all transform hover:scale-105 ${
                filter === 'mastered'
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              ✓ Mastered ({masteredNotes.length})
            </button>
          </div>
        </div>
      </header>
      
      {/* CONTENT */}
      {totalNotes === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-6 animate-bounce">📖</div>
          <h2 className="text-3xl font-bold text-gray-400 mb-4">No notes yet</h2>
          <p className="text-xl text-gray-500 mb-8">
            Play a quiz and difficult questions will be automatically saved here!
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg hover:scale-105 transform"
          >
            Start a Quiz
          </Link>
        </div>
      ) : (
        <div>
          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setShowConfirmDelete(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-500 hover:to-red-400 transition-all shadow-lg hover:scale-105 transform"
            >
              🗑️ Delete All
            </button>
            <div className="flex-1 text-right text-gray-400 text-sm pt-3">
              💡 Tip: Mark questions as mastered to track your progress!
            </div>
          </div>

          {/* CONFIRM DELETE MODAL */}
          {showConfirmDelete && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-red-500/50 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">⚠️ Confirm Deletion</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete all your notes? This action is irreversible!
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={clearAllNotes}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-all"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* NOTES LIST */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-2xl border-2 border-gray-700">
              <p className="text-2xl text-gray-400">No notes found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredNotes.map((note, index) => {
                const isMastered = filter === 'mastered';
                return (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border-2 transition-all hover:scale-[1.02] ${
                      isMastered 
                        ? 'border-green-500/50 hover:border-green-400' 
                        : 'border-yellow-500/50 hover:border-yellow-400'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-2xl">{isMastered ? '✅' : '📌'}</span>
                          <h3 className="text-xl font-semibold text-white flex-1">{note.text}</h3>
                        </div>
                        
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-4">
                          <p className="text-sm text-green-300 font-semibold mb-1">✓ Correct Answer:</p>
                          <p className="text-lg text-green-400 font-bold">{getCorrectAnswerText(note)}</p>
                        </div>

                        {/* ALL OPTIONS */}
                        {note.options && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-400 font-semibold">All options:</p>
                            {note.options.map((option) => (
                              <div 
                                key={option.id}
                                className={`p-2 rounded-lg text-sm ${
                                  option.id === note.correct
                                    ? 'bg-green-900/20 border border-green-500/30 text-green-300'
                                    : 'bg-gray-900/50 text-gray-400'
                                }`}
                              >
                                {option.id === note.correct && '✓ '}{option.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-col gap-2">
                        {!isMastered ? (
                          <button
                            onClick={() => markAsMastered(index)}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-green-400 transition-all shadow-lg hover:scale-105 transform text-sm"
                            title="Mark as mastered"
                          >
                            ✓ Mastered
                          </button>
                        ) : (
                          <button
                            onClick={() => unmarkMastered(index)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg hover:scale-105 transform text-sm"
                            title="Move back to review"
                          >
                            ↩️ Review
                          </button>
                        )}
                        <button
                          onClick={() => deleteNote(index, isMastered)}
                          className="px-4 py-2 bg-red-900/50 text-red-400 font-bold rounded-lg hover:bg-red-900 hover:text-red-300 transition-all text-sm border border-red-500/30"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STUDY TIP BANNER */}
      {totalNotes > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-2xl border-2 border-yellow-500/50 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-5xl">💡</div>
            <div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-1">Study Tip</h3>
              <p className="text-gray-300">
                Review your notes regularly! Spaced repetition is the key to long-term memorization.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};