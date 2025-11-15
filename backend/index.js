import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Quiz from './models/Quiz.js'; // Importer notre modèle
// NOUVEL IMPORT: Utiliser le SDK Google/Gemini
import { GoogleGenAI } from '@google/genai'; 

// 1. Charger les variables d'environnement
dotenv.config();

// 2. Connexion à la BDD
connectDB();

const app = express();
const PORT = process.env.PORT || 4000; // Utiliser la variable d'environnement si elle existe (5000 dans votre .env)

// 3. Initialiser l'IA Google Gemini
// Utilise la clé API définie dans process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({}); 
const modelName = "gemini-2.5-flash"; // Excellent modèle pour les tâches de formatage JSON

// Middlewares
app.use(cors());
app.use(express.json());

// --- ROUTES API ---

app.get('/', (req, res) => {
  res.send('API Quiz Quest fonctionne avec Gemini !');
});

// ROUTE 1: Récupérer tous les quiz pour le Dashboard
app.get('/api/dashboard', async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'title subtitle slug emoji');
    
    // Simuler la progression
    const dataWithProgress = quizzes.map(quiz => ({
      ...quiz.toObject(),
      progress: Math.floor(Math.random() * 80) + 10 
    }));
    
    res.json(dataWithProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 2: Récupérer UN quiz spécifique pour l'Arène
app.get('/api/quiz/:slug', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.slug });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz non trouvé' });
    }
    
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 4: (Constructeur de Quiz) Récupérer TOUS les quiz et leurs questions
app.get('/api/all-quizzes-with-questions', async (req, res) => {
  try {
    // On ne prend que les quiz qui ont des questions
    const quizzes = await Quiz.find({ 'questions.0': { $exists: true } });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 5: (Constructeur de Quiz) Créer un nouveau quiz personnalisé
app.post('/api/create-custom-quiz', async (req, res) => {
  try {
    const { title, slug, emoji, questions } = req.body;

    // Validation simple
    if (!title || !slug || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Données manquantes ou incorrectes.' });
    }
    
    // Vérifier si le slug existe déjà
    const existingQuiz = await Quiz.findOne({ slug: slug });
    if (existingQuiz) {
      return res.status(400).json({ error: 'Cet identifiant (slug) existe déjà.' });
    }

    const newQuiz = new Quiz({
      title,
      slug,
      subtitle: "Un quiz personnalisé",
      emoji: emoji || '🧑‍🏫',
      questions: questions,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NOUVELLE ROUTE 6: Ajouter un Feedback ---
app.post('/api/quiz/:slug/feedback', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const quizSlug = req.params.slug;

    if (!rating) {
      return res.status(400).json({ error: 'La note (rating) est requise.' });
    }

    const quiz = await Quiz.findOne({ slug: quizSlug });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz non trouvé.' });
    }

    // Ajoute le feedback au tableau
    quiz.feedback.push({
      rating: rating,
      comment: comment
    });

    // Sauvegarde la modification
    await quiz.save();

    res.status(201).json({ message: 'Feedback ajouté avec succès.' });

  } catch (err) {
    console.error("Erreur lors de l'ajout du feedback:", err);
    res.status(500).json({ error: err.message });
  }
});

// ROUTE d'Explication (AI) - Mise à jour pour Gemini
app.post('/api/ai/explain', async (req, res) => {
  const { question, options, correctAnswer } = req.body;
  
  try {
    const prompt = `Tu es un professeur patient et clair. Explique en détail pourquoi la bonne réponse à la question suivante est ${correctAnswer}.
    
    Question: ${question}
    Options: ${options.map(opt => `${opt.id}: ${opt.text}`).join(', ')}
    Bonne réponse ID: ${correctAnswer}`;
    
    // Appel à l'API Gemini
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });

    res.json({ explanation: response.text });
  } catch (error) {
    console.error("❌ Erreur API Gemini (Explication):", error);
    res.status(500).json({ error: 'Échec de la génération de l\'explication par l\'IA.' });
  }
});

// ROUTE 3: Générer un quiz avec l'API Gemini
app.post('/api/generate-quiz', async (req, res) => {
  const { topic, numQuestions, difficulty } = req.body;

  console.log(`✨ Génération IA Gemini pour: ${topic} (${numQuestions} questions, ${difficulty})`);

  // Le modèle Gemini 2.5 Flash est excellent pour retourner du JSON structuré
  const prompt = `Tu es un créateur de quiz éducatif expert et créatif. Génère un quiz de ${numQuestions} questions sur le sujet: "${topic}"

Niveau de difficulté: ${
    difficulty === 'easy' 
      ? 'Facile (pour débutants)' 
      : difficulty === 'medium' 
      ? 'Moyen (niveau intermédiaire)' 
      : 'Difficile (niveau avancé)'
  }

INSTRUCTION STRICTE: Tu DOIS retourner UNIQUEMENT un objet JSON valide.

Structure EXACTE requise (Schema JSON):
{
  "type": "object",
  "properties": {
    "title": {"type": "string", "description": "Nom attractif du quiz"},
    "subtitle": {"type": "string", "description": "Description courte et motivante"},
    "bossName": {"type": "string", "description": "Nom créatif d'un boss en rapport avec le sujet"},
    "emoji": {"type": "string", "description": "emoji thématique unique, exemple '💻'"},
    "baseXP": {"type": "number", "description": "Valeur fixe de 100"},
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "text": {"type": "string", "description": "Question claire et précise"},
          "options": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {"type": "string", "description": "ID: 'a', 'b', ou 'c'"},
                "text": {"type": "string", "description": "Option détaillée"}
              },
              "required": ["id", "text"]
            },
            "minItems": 3,
            "maxItems": 3
          },
          "correct": {"type": "string", "description": "ID de la bonne réponse ('a', 'b', ou 'c')"},
          "damage": {"type": "number", "description": "Dégâts pour le 'Boss', varie entre 20 et 50 selon la difficulté"}
        },
        "required": ["text", "options", "correct", "damage"]
      },
      "minItems": ${numQuestions},
      "maxItems": ${numQuestions}
    }
  },
  "required": ["title", "subtitle", "bossName", "emoji", "baseXP", "questions"]
}`;

  try {
    // Appel à l'API Gemini en mode JSON
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let quizText = response.text.trim();
    console.log("📝 JSON reçu de Gemini:", quizText);

    let quizData;
    try {
      quizData = JSON.parse(quizText);
    } catch (parseError) {
      console.error("❌ Erreur parsing JSON:", parseError);
      // Fallback si le JSON est invalide
      return res.status(500).json({ 
        error: 'Format JSON invalide de l\'IA',
        rawResponse: quizText.substring(0, 200)
      });
    }

    // Ajout du slug (identique à votre logique précédente)
    quizData.slug = quizData.title.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Retirer accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Vérifier si le slug existe déjà
    const existingQuiz = await Quiz.findOne({ slug: quizData.slug });
    if (existingQuiz) {
      quizData.slug = `${quizData.slug}-${Date.now()}`;
    }

    // Sauvegarder en base de données
    const newQuiz = new Quiz(quizData);
    await newQuiz.save();

    console.log("✅ Quiz IA sauvegardé:", newQuiz.slug);
    res.status(201).json(newQuiz);

  } catch (err) {
    console.error("🔴 Erreur génération quiz Gemini:", err);
    res.status(500).json({ 
      error: "Échec de la génération du quiz par Gemini",
      details: err.message 
    });
  }
});
// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});