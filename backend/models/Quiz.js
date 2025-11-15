import mongoose from 'mongoose';
// Schéma pour les options (a, b, c, d)
const optionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // 'a', 'b', 'c', ...
  text: { type: String, required: true },
});

// Schéma pour les questions
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [optionSchema], // Un tableau d'options
  correct: { type: String, required: true }, // 'a', 'b', ...
});
// --- NOUVEAU SCHÉMA POUR LE FEEDBACK ---
const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

// Schéma principal pour le Quiz (le "monde")
const quizSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // ex: "mathematiques"
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  emoji: { type: String },
  questions: [questionSchema],
  feedback: [feedbackSchema] // Un tableau de questions
});

// Crée le "Modèle" basé sur le schéma
const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;