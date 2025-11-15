// /src/data/mathQuiz.js
export const mathQuiz = {
  title: "Le Donjon des Dérivées",
  monsterImage: "👹", // On utilise un emoji pour l'instant
  questions: [
    {
      text: "Quelle est la dérivée de x² ?",
      options: [
        { id: 'a', text: "2x" },
        { id: 'b', text: "x" },
        { id: 'c', text: "x³/3" },
        { id: 'd', text: "2" },
      ],
      correct: 'a'
    },
    {
      text: "Que vaut la dérivée d'une constante (ex: 5) ?",
      options: [
        { id: 'a', text: "1" },
        { id: 'b', text: "0" },
        { id: 'c', text: "5" },
        { id: 'd', text: "Constante" },
      ],
      correct: 'b'
    },
    {
      text: "Quelle est la dérivée de sin(x) ?",
      options: [
        { id: 'a', text: "sin(x)" },
        { id: 'b', text: "-sin(x)" },
        { id: 'c', text: "cos(x)" },
        { id: 'd', text: "-cos(x)" },
      ],
      correct: 'c'
    }
  ]
};