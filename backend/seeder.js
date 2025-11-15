import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Quiz from './models/Quiz.js';
import { quizzes } from './data/quizzes.js';

// Configurer dotenv et connecter la BDD
dotenv.config();
await connectDB();

const importData = async () => {
  try {
    // 1. Tout effacer avant d'importer
    await Quiz.deleteMany();

    // 2. Insérer les nouvelles données
    await Quiz.insertMany(quizzes);

    console.log('Données importées avec succès !');
    process.exit();
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
};

// On lance l'importation
importData();