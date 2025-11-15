// /backend/data/quizzes.js
// Our rich question "bank" for the hackathon.
// Corrected version with GAMIFICATION FIELDS ADDED.

export const quizzes = [
  // --- SUBJECT 1: MATHEMATICS ---
  {
    slug: "mathematics",
    title: "Mathematics",
    subtitle: "Calculus and Algebra",
    emoji: "🧮",
    bossName: "The Evil Calculator", 
    baseXP: 100, 
    questions: [
      {
        text: "What is the value of 2 + 2 * 3?",
        options: [ { id: 'a', text: "8" }, { id: 'b', text: "6" }, { id: 'c', text: "12" } ],
        correct: 'a',
        damage: 35,
      },
      {
        text: "What is the derivative of x²?",
        options: [ { id: 'a', text: "2x" }, { id: 'b', text: "x" }, { id: 'c', text: "x³/3" } ],
        correct: 'a',
        damage: 40,
      },
      {
        text: "What is the square root of 144?",
        options: [ { id: 'a', text: "11" }, { id: 'b', text: "12" }, { id: 'c', text: "13" } ],
        correct: 'b',
        damage: 25,
      },
      {
        text: "What is the value of 5! (Factorial 5)?",
        options: [ { id: 'a', text: "25" }, { id: 'b', text: "120" }, { id: 'c', text: "50" } ],
        correct: 'b',
        damage: 30,
      },
      {
        text: "What is the derivative of a constant (e.g.: 5)?",
        options: [ { id: 'a', text: "1" }, { id: 'b', text: "0" }, { id: 'c', text: "5" } ],
        correct: 'b',
        damage: 20,
      }
    ]
  },
  // --- SUBJECT 2: HISTORY (MOROCCO) ---
  {
    slug: "morocco-history",
    title: "History (Morocco)",
    subtitle: "The Dynasties of Morocco",
    emoji: "🇲🇦",
    bossName: "The Dynasty Spectre",
    baseXP: 120,
    questions: [
      {
        text: "Which dynasty founded the city of Marrakech?",
        options: [ { id: 'a', text: "The Almoravids" }, { id: 'b', text: "The Saadi Dynasty" }, { id: 'c', text: "The Alaouite Dynasty" } ],
        correct: 'a',
        damage: 30,
      },
      {
        text: "Who is the founder of the Idrisid dynasty?",
        options: [ { id: 'a', text: "Yusuf ibn Tashfin" }, { id: 'b', text: "Moulay Ismail" }, { id: 'c', text: "Idris I" } ],
        correct: 'c',
        damage: 25,
      },
      {
        text: "In which year did Morocco gain its independence?",
        options: [ { id: 'a', text: "1945" }, { id: 'b', text: "1956" }, { id: 'c', text: "1960" } ],
        correct: 'b',
        damage: 45,
      },
      {
        text: "Which city was the capital under the Almohads?",
        options: [ { id: 'a', text: "Fes" }, { id: 'b', text: "Rabat" }, { id: 'c', text: "Marrakech" } ],
        correct: 'c',
        damage: 30,
      },
      {
        text: "Where are the Saadian Tombs located?",
        options: [ { id: 'a', text: "Fes" }, { id: 'b', text: "Meknes" }, { id: 'c', text: "Marrakech" } ],
        correct: 'c',
        damage: 20,
      }
    ]
  },
  // --- SUBJECT 3: SCIENCE ---
  {
    slug: "science",
    title: "Science",
    subtitle: "The Solar System",
    emoji: "🪐",
    bossName: "The Cosmic Titan",
    baseXP: 110,
    questions: [
      {
        text: "What is the closest planet to the Sun?",
        options: [ { id: 'a', text: "Venus" }, { id: 'b', text: "Earth" }, { id: 'c', text: "Mercury" } ],
        correct: 'c',
        damage: 25,
      },
      {
        text: "What is the largest planet in the solar system?",
        options: [ { id: 'a', text: "Saturn" }, { id: 'b', text: "Jupiter" }, { id: 'c', text: "Uranus" } ],
        correct: 'b',
        damage: 35,
      },
      {
        text: "Which planet is nicknamed the 'Red Planet'?",
        options: [ { id: 'a', text: "Mars" }, { id: 'b', text: "Venus" }, { id: 'c', text: "Jupiter" } ],
        correct: 'a',
        damage: 30,
      },
      {
        text: "What are Saturn's rings mainly composed of?",
        options: [ { id: 'a', text: "Gas" }, { id: 'b', text: "Rocks" }, { id: 'c', text: "Ice and dust" } ],
        correct: 'c',
        damage: 40,
      },
      {
        text: "How many moons does Earth have?",
        options: [ { id: 'a', text: "1" }, { id: 'b', text: "2" }, { id: 'c', text: "0" } ],
        correct: 'a',
        damage: 20,
      }
    ]
  },
  // --- SUBJECT 4: CODING (PYTHON) ---
  {
    slug: "python-code",
    title: "Code (Python)",
    subtitle: "Python Fundamentals",
    emoji: "🐍",
    bossName: "The Serpentine Bug",
    baseXP: 140,
    questions: [
      {
        text: "How do you display 'Hello' in the console in Python?",
        options: [ { id: 'a', text: "console.log('Hello')" }, { id: 'b', text: "print('Hello')" }, { id: 'c', text: "echo 'Hello'" } ],
        correct: 'b',
        damage: 20,
      },
      {
        text: "Which keyword is used to define a function?",
        options: [ { id: 'a', text: "function" }, { id: 'b', text: "def" }, { id: 'c', text: "fun" } ],
        correct: 'b',
        damage: 25,
      },
      {
        text: "What is the name of the modifiable list in Python?",
        options: [ { id: 'a', text: "Array" }, { id: 'b', text: "List" }, { id: 'c', text: "Tuple" } ],
        correct: 'b',
        damage: 30,
      },
      {
        text: "What is the name of the non-modifiable (immutable) list?",
        options: [ { id: 'a', text: "List" }, { id: 'b', text: "Array" }, { id: 'c', text: "Tuple" } ],
        correct: 'c',
        damage: 45,
      },
      {
        text: "What is the symbol for a comment in Python?",
        options: [ { id: 'a', text: "//" }, { id: 'b', text: "/* */" }, { id: 'c', text: "#" } ],
        correct: 'c',
        damage: 20,
      }
    ]
  },
  // --- SUBJECT 5: GEOGRAPHY ---
  {
    slug: "geography",
    title: "Geography",
    subtitle: "World Capitals",
    emoji: "🌍",
    bossName: "The Deceitful Cartographer",
    baseXP: 90,
    questions: [
      {
        text: "What is the capital of France?",
        options: [ { id: 'a', text: "Lyon" }, { id: 'b', text: "Marseille" }, { id: 'c', text: "Paris" } ],
        correct: 'c',
        damage: 20,
      },
      {
        text: "What is the capital of Japan?",
        options: [ { id: 'a', text: "Kyoto" }, { id: 'b', text: "Tokyo" }, { id: 'c', text: "Osaka" } ],
        correct: 'b',
        damage: 30,
      },
      {
        text: "What is the capital of Canada?",
        options: [ { id: 'a', text: "Toronto" }, { id: 'b', text: "Vancouver" }, { id: 'c', text: "Ottawa" } ],
        correct: 'c',
        damage: 30,
      },
      {
        text: "What is the capital of Australia?",
        options: [ { id: 'a', text: "Sydney" }, { id: 'b', text: "Melbourne" }, { id: 'c', text: "Canberra" } ],
        correct: 'c',
        damage: 35,
      },
      {
        text: "What is the capital of Egypt?",
        options: [ { id: 'a', text: "Alexandria" }, { id: 'b', text: "Cairo" }, { id: 'c', text: "Giza" } ],
        correct: 'b',
        damage: 25,
      }
    ]
  },
  // --- SUBJECT 6: ART ---
  {
    slug: "art",
    title: "Art",
    subtitle: "The Italian Renaissance",
    emoji: "🎨",
    bossName: "The Merciless Critic",
    baseXP: 100,
    questions: [
      {
        text: "Who painted 'The Mona Lisa'?",
        options: [ { id: 'a', text: "Michelangelo" }, { id: 'b', text: "Leonardo da Vinci" }, { id: 'c', text: "Raphael" } ],
        correct: 'b',
        damage: 30,
      },
      {
        text: "Who sculpted the statue of 'David'?",
        options: [ { id: 'a', text: "Michelangelo" }, { id: 'b', text: "Donatello" }, { id: 'c', text: "Leonardo da Vinci" } ],
        correct: 'a',
        damage: 35,
      },
      {
        text: "In which city is the Uffizi Gallery located?",
        options: [ { id: 'a', text: "Rome" }, { id: 'b', text: "Venice" }, { id: 'c', text: "Florence" } ],
        correct: 'c',
        damage: 25,
      },
      {
        text: "Who painted 'The School of Athens'?",
        options: [ { id: 'a', text: "Titian" }, { id: 'b', text: "Raphael" }, { id: 'c', text: "Caravaggio" } ],
        correct: 'b',
        damage: 30,
      },
      {
        text: "Which famous dome was designed by Brunelleschi?",
        options: [ { id: 'a', text: "Milan Cathedral" }, { id: 'b', text: "Florence Cathedral" }, { id: 'c', text: "St. Peter's Basilica" } ],
        correct: 'b',
        damage: 20,
      }
    ]
  },
  // --- SUBJECT 7: BIOLOGY ---
  {
    slug: "biology",
    title: "Biology",
    subtitle: "The Human Body",
    emoji: "🧬",
    bossName: "The Organic Patient",
    baseXP: 110,
    questions: [
      {
        text: "Which organ pumps blood throughout the body?",
        options: [ { id: 'a', text: "The lung" }, { id: 'b', text: "The liver" }, { id: 'c', text: "The heart" } ],
        correct: 'c',
        damage: 25,
      },
      {
        text: "What is the largest organ in the human body?",
        options: [ { id: 'a', text: "The liver" }, { id: 'b', text: "The skin" }, { id: 'c', text: "The brain" } ],
        correct: 'b',
        damage: 35,
      },
      {
        text: "What do the lungs produce?",
        options: [ { id: 'a', text: "They filter blood" }, { id: 'b', text: "They digest food" }, { id: 'c', text: "They exchange oxygen and CO2" } ],
        correct: 'c',
        damage: 30,
      },
      {
        text: "How many bones are there in an adult human body?",
        options: [ { id: 'a', text: "206" }, { id: 'b', text: "301" }, { id: 'c', text: "152" } ],
        correct: 'a',
        damage: 40,
      },
      {
        text: "What is the cell's 'power plant'?",
        options: [ { id: 'a', text: "The nucleus" }, { id: 'b', text: "The mitochondrion" }, { id: 'c', text: "The ribosome" } ],
        correct: 'b',
        damage: 20,
      }
    ]
  },
  // --- SUBJECT 8: ENGLISH ---
  {
    slug: "english",
    title: "English",
    subtitle: "Basic Grammar",
    emoji: "🇬🇧",
    bossName: "The Wild Syntax",
    baseXP: 100,
    questions: [
      {
        text: "What is the past tense of 'go'?",
        options: [ { id: 'a', text: "Gone" }, { id: 'b', text: "Went" }, { id: 'c', text: "Goed" } ],
        correct: 'b',
        damage: 25,
      },
      {
        text: "Which is correct? 'There', 'Their', or 'They're'",
        options: [ { id: 'a', text: "'They're' going to the park." }, { id: 'b', text: "'There' going to the park." }, { id: 'c', text: "'Their' going to the park." } ],
        correct: 'a',
        damage: 35,
      },
      {
        text: "What is the plural of 'mouse'?",
        options: [ { id: 'a', text: "Mouses" }, { id: 'b', text: "Mice" }, { id: 'c', text: "Mouse" } ],
        correct: 'b',
        damage: 30,
      },
      {
        text: "A person who teaches is a ...",
        options: [ { id: 'a', text: "Teacher" }, { id: 'b', text: "Teached" }, { id: 'c', text: "Teachen" } ],
        correct: 'a',
        damage: 20,
      },
      {
        text: "I have ___ apple.",
        options: [ { id: 'a', text: "a" }, { id: 'b', text: "an" }, { id: 'c', text: "the" } ],
        correct: 'b',
        damage: 25,
      }
    ]
  },
  // --- SUBJECT 9: ECONOMICS ---
  {
    slug: "economics",
    title: "Economics",
    subtitle: "Basic Concepts",
    emoji: "📈",
    bossName: "The Market Monster",
    baseXP: 130,
    questions: [
      {
        text: "What is inflation?",
        options: [ { id: 'a', text: "A drop in prices" }, { id: 'b', text: "An increase in prices" }, { id: 'c', text: "Stable prices" } ],
        correct: 'b',
        damage: 30,
      },
      {
        text: "Supply and Demand determine...",
        options: [ { id: 'a', text: "The price" }, { id: 'b', text: "The quality" }, { id: 'c', text: "The government" } ],
        correct: 'a',
        damage: 25,
      },
      {
        text: "What is GDP (Gross Domestic Product)?",
        options: [ { id: 'a', text: "A company's profit" }, { id: 'b', text: "The total value of everything produced in a country" }, { id: 'c', text: "The total tax collected" } ],
        correct: 'b',
        damage: 40,
      },
      {
        text: "What is a monopoly?",
        options: [ { id: 'a', text: "A single seller" }, { id: 'b', text: "Many sellers" }, { id: 'c', text: "A single buyer" } ],
        correct: 'a',
        damage: 35,
      },
      {
        text: "What is Adam Smith's 'Invisible Hand'?",
        options: [ { id: 'a', text: "Government intervention" }, { id: 'b', text: "A hidden tax" }, { id: 'c', text: "Self-regulating market forces" } ],
        correct: 'c',
        damage: 30,
      }
    ]
  },
  // --- SUBJECT 10: SPORT ---
  {
    slug: "sport",
    title: "Sport",
    subtitle: "World Cup (Football)",
    emoji: "⚽",
    bossName: "The Score Demon",
    baseXP: 80,
    questions: [
      {
        text: "Which country won the 2022 World Cup?",
        options: [ { id: 'a', text: "France" }, { id: 'b', text: "Brazil" }, { id: 'c', text: "Argentina" } ],
        correct: 'c',
        damage: 20,
      },
      {
        text: "In which year did Morocco reach the semi-finals?",
        options: [ { id: 'a', text: "2018" }, { id: 'b', text: "2022" }, { id: 'c', text: "2014" } ],
        correct: 'b',
        damage: 30,
      },
      {
        text: "Which country has won the most World Cups?",
        options: [ { id: 'a', text: "Germany" }, { id: 'b', text: "Brazil" }, { id: 'c', text: "Italy" } ],
        correct: 'b',
        damage: 25,
      },
      {
        text: "Where was the 2010 World Cup held?",
        options: [ { id: 'a', text: "South Africa" }, { id: 'b', text: "Germany" }, { id: 'c', text: "Brazil" } ],
        correct: 'a',
        damage: 35,
      },
      {
        text: "Who won the first World Cup in 1930?",
        options: [ { id: 'a', text: "Brazil" }, { id: 'b', text: "Argentina" }, { id: 'c', text: "Uruguay" } ],
        correct: 'c',
        damage: 40,
      }
    ]
  }
];