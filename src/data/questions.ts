import { Question } from "../types";

export const BUILT_IN_QUESTIONS: Question[] = [
  // LOGIC & RIDDLES
  {
    id: "log-1",
    question: "You have 12 identical-looking coins, one of which is counterfeit and has a different weight (you don't know if heavier or lighter). What is the minimum number of weighings on a two-pan balance scale guaranteed to identify the counterfeit coin and whether it is heavier or lighter?",
    options: ["2 weighings", "3 weighings", "4 weighings", "5 weighings"],
    correctAnswerIndex: 1,
    explanation: "With 3 weighings on a balance scale, there are 3^3 = 27 possible outcome sequences (Left heavy, Right heavy, Balanced). Since there are 12 coins and 2 possibilities per coin (heavy or light), there are 24 states to distinguish. 3 weighings are both theoretically sufficient (27 ≥ 24) and practically achievable using an 8-coin first split.",
    hint: "Think about the ternary decision tree: each weighing gives 3 possible outcomes (<, =, >).",
    didYouKnow: "This is a classic problem in information theory and combinatorial search dating back to Howard Grossman in 1945.",
    category: "Logic & Riddles",
    difficulty: "Master"
  },
  {
    id: "log-2",
    question: "In the famous Monty Hall problem, after you pick Door 1 out of 3, the host (who knows what's behind the doors) opens Door 3 to reveal a goat. What is your probability of winning the car if you switch to Door 2?",
    options: ["1/3", "1/2 (50-50)", "2/3", "3/4"],
    correctAnswerIndex: 2,
    explanation: "When you initially picked Door 1, there was a 1/3 chance the car was there and a 2/3 chance it was behind one of the other two doors. Because Monty must always reveal a goat among the remaining doors, all 2/3 of that unchosen probability concentrates onto the single unopened Door 2.",
    hint: "Remember that the host's action is not random—he deliberately avoids showing the prize.",
    didYouKnow: "When Marilyn vos Savant published the correct 2/3 answer in Parade magazine, thousands of PhD mathematicians wrote in insisting she was wrong!",
    category: "Logic & Riddles",
    difficulty: "Scholar"
  },
  {
    id: "log-3",
    question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
    options: ["$0.10", "$0.05", "$0.15", "$0.01"],
    correctAnswerIndex: 1,
    explanation: "Let the ball cost $x. The bat costs $x + $1.00. Together: x + (x + 1.00) = 1.10 => 2x = 0.10 => x = $0.05. The bat is $1.05 and the ball is $0.05.",
    hint: "If the ball were 10 cents, the bat would be $1.10, making the total $1.20.",
    didYouKnow: "This is the most famous question from Shane Frederick's Cognitive Reflection Test (CRT), testing intuitive vs. analytical thinking.",
    category: "Logic & Riddles",
    difficulty: "Novice"
  },
  {
    id: "log-4",
    question: "Consider the paradox of the unexpected hanging: A judge tells a prisoner he will be hanged at noon on a weekday next week, but the day will be a surprise. The prisoner reasons he cannot be hanged on Friday (not a surprise by Thursday night), nor Thursday, and so on. Why does his logic fail in reality?",
    options: [
      "Because the judge can choose a weekend",
      "Because self-referential epistemic statements cannot eliminate the empirical possibility of being surprised on Wednesday",
      "Because the prisoner forgot about leap years",
      "Because inductive reasoning only works backwards in finite arithmetic"
    ],
    correctAnswerIndex: 1,
    explanation: "The prisoner deduces that hanging is impossible under the judge's premises. When the hangman arrives on Wednesday, the prisoner is genuinely surprised precisely because his own deductive chain led him to believe it could never happen.",
    hint: "Believing that an event is impossible makes that event's occurrence an utter surprise.",
    didYouKnow: "First formulated by Swedish mathematician Lennart Ekbom in 1943 during wartime blackout announcements.",
    category: "Logic & Riddles",
    difficulty: "Polymath"
  },
  {
    id: "log-5",
    question: "Three logicians walk into a café. The barista asks, 'Does everyone want coffee?' The first logician says, 'I don't know.' The second says, 'I don't know.' What does the third logician say?",
    options: [
      "'I don't know'",
      "'No'",
      "'Yes' (if they want coffee)",
      "'Only if the barista has milk'"
    ],
    correctAnswerIndex: 2,
    explanation: "If either the 1st or 2nd logician did NOT want coffee, they would know the answer to 'does EVERYONE want coffee?' is 'No'. Because they said 'I don't know', they both MUST want coffee. Thus the 3rd logician knows the first two want it, and if they also want it, they can answer 'Yes!'",
    hint: "Each logician has private knowledge of their own desire, but common knowledge of logical deduction.",
    didYouKnow: "This is a quintessential demonstration of epistemic logic and common knowledge updates.",
    category: "Logic & Riddles",
    difficulty: "Scholar"
  },

  // SCIENCE & COSMOS
  {
    id: "sci-1",
    question: "Why does hot water sometimes freeze faster than cold water under certain conditions, a counter-intuitive thermal phenomenon?",
    options: [
      "The Peltier Convection Effect",
      "The Mpemba Effect",
      "The Casimir Cooldown",
      "The Joule-Thomson Inversion"
    ],
    correctAnswerIndex: 1,
    explanation: "The Mpemba Effect is named after Tanzanian student Erasto Mpemba, who noticed warm ice cream mix froze faster in 1963. Mechanisms include rapid evaporation reducing mass, convection currents, dissolved gas degassing, and hydrogen bonding anomalies.",
    hint: "Named after an observant high school student in Tanzania in the 1960s.",
    didYouKnow: "Aristotle, Francis Bacon, and René Descartes all recorded noticing this oddity centuries before Mpemba republished it.",
    category: "Science & Cosmos",
    difficulty: "Scholar"
  },
  {
    id: "sci-2",
    question: "What is the theoretical boundary around a black hole beyond which nothing—not even light—can escape called?",
    options: [
      "Ergosphere",
      "Photon Sphere",
      "Event Horizon",
      "Schwarzschild Singularity"
    ],
    correctAnswerIndex: 2,
    explanation: "The event horizon marks the boundary of spacetime where the escape velocity equals the speed of light (c). For a non-rotating black hole, its radius is given by the Schwarzschild radius r_s = 2GM/c^2.",
    hint: "It represents the literal horizon of events visible to an outside observer.",
    didYouKnow: "If you fell into a supermassive black hole, tidal forces at the event horizon would be so gentle you wouldn't even notice passing it until you approached the singularity!",
    category: "Science & Cosmos",
    difficulty: "Novice"
  },
  {
    id: "sci-3",
    question: "In quantum mechanics, what is the term for the phenomenon where two or more particles become intrinsically linked such that the quantum state of one instantaneously determines the other, regardless of spatial distance?",
    options: [
      "Quantum Decoherence",
      "Quantum Entanglement",
      "Quantum Tunneling",
      "Superluminal Dispersion"
    ],
    correctAnswerIndex: 1,
    explanation: "Quantum Entanglement was famously described by Einstein as 'spooky action at a distance' (spukhafte Fernwirkung). Bell's Theorem and Alain Aspect's 1982 experiments proved that local hidden variable theories cannot explain these correlations.",
    hint: "Einstein, Podolsky, and Rosen (EPR) formulated a paradox around this in 1935.",
    didYouKnow: "The 2022 Nobel Prize in Physics was awarded to Alain Aspect, John Clauser, and Anton Zeilinger for ground-breaking entanglement experiments.",
    category: "Science & Cosmos",
    difficulty: "Scholar"
  },
  {
    id: "sci-4",
    question: "What is the only known fundamental particle with zero electric charge, half-integer spin, and such minuscule mass that trillions pass through your fingernail every second without interacting?",
    options: ["Neutrino", "Neutron", "Higgs Boson", "Gluon"],
    correctAnswerIndex: 0,
    explanation: "Neutrinos are neutral leptons with three flavor states (electron, muon, tau) that oscillate between flavors as they travel. They interact almost exclusively via the weak nuclear force and gravity.",
    hint: "Wolfgang Pauli postulated its existence in 1930 to explain missing energy in beta decay.",
    didYouKnow: "About 65 billion solar neutrinos pass through every square centimeter of Earth facing the Sun every single second.",
    category: "Science & Cosmos",
    difficulty: "Scholar"
  },
  {
    id: "sci-5",
    question: "Which organelle in eukaryotic cells contains its own distinct circular DNA, encodes 13 proteins involved in oxidative phosphorylation, and is inherited almost exclusively maternally?",
    options: ["Endoplasmic Reticulum", "Mitochondria", "Golgi Apparatus", "Peroxisome"],
    correctAnswerIndex: 1,
    explanation: "Mitochondria evolved through endosymbiosis from an ancestral alpha-proteobacterium engulfed by an early archaeal host over 1.5 billion years ago, retaining their own circular mtDNA.",
    hint: "Often called the powerhouse of the cell, but biologically an ancient captured bacterium.",
    didYouKnow: "Mitochondrial Eve is the matrilineal most recent common ancestor of all living humans, estimated to have lived roughly 150,000 years ago in Africa.",
    category: "Science & Cosmos",
    difficulty: "Novice"
  },
  {
    id: "sci-6",
    question: "At absolute zero (-273.15 °C or 0 Kelvin), what quantum property prevents all atomic motion from completely ceasing?",
    options: [
      "Zero-point Energy (Heisenberg Uncertainty Principle)",
      "Bose-Einstein Condensation",
      "Cooper Pair Electron Screening",
      "Pauli Repulsion Wave"
    ],
    correctAnswerIndex: 0,
    explanation: "According to the Heisenberg Uncertainty Principle (Δx·Δp ≥ ℏ/2), if a particle were completely motionless at an exact location, its momentum would be exactly zero with zero uncertainty, violating quantum mechanics. Thus, zero-point kinetic energy remains.",
    hint: "A fundamental limit on simultaneous knowledge of position and momentum.",
    didYouKnow: "Liquid Helium-4 remains liquid even at absolute zero under normal atmospheric pressure due to its immense zero-point vibrational energy.",
    category: "Science & Cosmos",
    difficulty: "Master"
  },

  // HISTORY & CIVILIZATION
  {
    id: "hist-1",
    question: "The Rosetta Stone, deciphered by Jean-François Champollion in 1822, contained the same royal decree of Ptolemy V inscribed in which three distinct scripts?",
    options: [
      "Ancient Greek, Latin, and Cuneiform",
      "Hieroglyphic, Demotic, and Ancient Greek",
      "Hieroglyphic, Aramaic, and Coptic",
      "Phoenician, Demotic, and Classical Greek"
    ],
    correctAnswerIndex: 1,
    explanation: "The decree of Memphis (196 BC) was written in Egyptian Hieroglyphic (the script of the gods/priests), Demotic (the daily administrative cursive script of Egypt), and Ancient Greek (the language of the Ptolemaic rulers).",
    hint: "One was sacred pictorial, one was vernacular script, and one was the Mediterranean lingua franca.",
    didYouKnow: "It was discovered by French military engineer Pierre-François Bouchard during Napoleon's Egyptian expedition in 1799.",
    category: "History & Civilization",
    difficulty: "Scholar"
  },
  {
    id: "hist-2",
    question: "Which ancient Bronze Age civilization flourished on the island of Crete, constructed the palace complex of Knossos, and used the undeciphered Linear A script?",
    options: ["Mycenaean", "Minoan", "Cycladic", "Hittite"],
    correctAnswerIndex: 1,
    explanation: "The Minoan civilization (c. 2700 to 1450 BC) was a sea-faring culture named after the mythical King Minos. Their vibrant frescoes, unfortified palaces, and bull-leaping rituals were unmatched.",
    hint: "Associated with the legend of the labyrinth and the Minotaur.",
    didYouKnow: "Arthur Evans excavated Knossos in 1900 and coined the term 'Minoan' after King Minos.",
    category: "History & Civilization",
    difficulty: "Novice"
  },
  {
    id: "hist-3",
    question: "In 1453, which monumental siege marked the definitive fall of the Byzantine (Eastern Roman) Empire and the end of European Middle Ages?",
    options: [
      "Siege of Vienna",
      "Fall of Constantinople",
      "Siege of Baghdad",
      "Battle of Lepanto"
    ],
    correctAnswerIndex: 1,
    explanation: "On May 29, 1453, Ottoman Sultan Mehmed II ('The Conqueror') breached the massive Theodosian Walls of Constantinople using massive super-cannons (the Basilica gun), ending over 1,000 years of the Eastern Roman Empire.",
    hint: "The city was renamed Istanbul and transformed into the Ottoman capital.",
    didYouKnow: "Byzantine scholars fleeing to Italy with ancient Greek manuscripts played a pivotal catalyst role in igniting the Italian Renaissance.",
    category: "History & Civilization",
    difficulty: "Novice"
  },
  {
    id: "hist-4",
    question: "Who was the legendary general who crossed the Alps in 218 BC with war elephants and inflicted the devastating defeat on Rome at the Battle of Cannae?",
    options: ["Pyrrhus of Epirus", "Hannibal Barca", "Scipio Africanus", "Mithridates VI"],
    correctAnswerIndex: 1,
    explanation: "Hannibal Barca of Carthage executed the double-envelopment tactic at Cannae (216 BC), wiping out roughly 70,000 Roman legionaries in a single afternoon—one of the deadliest battles in human history.",
    hint: "Carthaginian tactical mastermind of the Second Punic War.",
    didYouKnow: "Military academies worldwide still study Cannae as the quintessential masterclass in flanking encirclement.",
    category: "History & Civilization",
    difficulty: "Scholar"
  },
  {
    id: "hist-5",
    question: "The 'Library of Alexandria' was not destroyed in a single Hollywood-style fireball. Instead, its decline occurred over centuries across multiple episodes. Which Roman leader accidentally set fire to part of its dockside scroll stores during the Alexandrian War in 48 BC?",
    options: ["Julius Caesar", "Mark Antony", "Augustus", "Nero"],
    correctAnswerIndex: 0,
    explanation: "When besieged in Alexandria in 48 BC, Julius Caesar ordered his fleet burned to prevent it falling into Egyptian hands. The fire spread to warehouses along the docks where thousands of books were stored.",
    hint: "Crossed the Rubicon and declared dictator perpetuo.",
    didYouKnow: "Scholars estimate the daughter library at the Serapeum survived until at least AD 391 under decree of Patriarch Theophilus.",
    category: "History & Civilization",
    difficulty: "Scholar"
  },
  {
    id: "hist-6",
    question: "Which 1648 treaty ended the Thirty Years' War in the Holy Roman Empire, establishing the principle of national sovereignty and the modern international relations framework?",
    options: [
      "Treaty of Utrecht",
      "Peace of Westphalia",
      "Treaty of Versailles",
      "Congress of Vienna"
    ],
    correctAnswerIndex: 1,
    explanation: "The Peace of Westphalia (1648) established 'Westphalian sovereignty'—the doctrine that each state has exclusive sovereignty over its domestic affairs, religious practices, and borders without foreign interference.",
    hint: "Signed in the German cities of Münster and Osnabrück.",
    didYouKnow: "It recognized the independence of the Swiss Confederacy and the Dutch Republic from Spanish Habsburg rule.",
    category: "History & Civilization",
    difficulty: "Master"
  },

  // PHILOSOPHY & IDEAS
  {
    id: "phil-1",
    question: "In Plato's Republic (Book VII), what does the famous Allegory of the Cave illustrate about human perception and knowledge?",
    options: [
      "That language is an imperfect representation of emotional feeling",
      "That ordinary sensory experience is like shadows on a wall, while true understanding requires ascending to the Forms (Ideals)",
      "That society should be ruled by democratic referendums of common laborers",
      "That material wealth is the only objective metric of a city's virtue"
    ],
    correctAnswerIndex: 1,
    explanation: "Plato describes prisoners chained in a cave seeing only shadows cast by puppets in front of a fire. The philosopher is the prisoner who escapes the cave, experiences the blinding sunlight of true reality (the Form of the Good), and returns to enlighten others.",
    hint: "Shadows represent appearances (doxa), while the sun represents the Form of the Good (episteme).",
    didYouKnow: "The allegory inspired modern cinematic philosophical allegories like The Matrix and The Truman Show.",
    category: "Philosophy & Ideas",
    difficulty: "Scholar"
  },
  {
    id: "phil-2",
    question: "Which 17th-century philosopher famously wrote 'Cogito, ergo sum' ('I think, therefore I am') as the foundational bedrock of his method of radical skepticism?",
    options: ["Baruch Spinoza", "René Descartes", "John Locke", "Thomas Hobbes"],
    correctAnswerIndex: 1,
    explanation: "In 'Discourse on the Method' (1637) and 'Meditations on First Philosophy', Descartes systematically doubted all sensory inputs and even mathematical axioms (entertaining an 'evil demon' deceiver) until he realized that the act of doubting itself proves the existence of a thinking entity.",
    hint: "French rationalist who also invented Cartesian coordinate geometry.",
    didYouKnow: "Descartes originally wrote the phrase in French: 'Je pense, donc je suis'.",
    category: "Philosophy & Ideas",
    difficulty: "Novice"
  },
  {
    id: "phil-3",
    question: "What is the philosophical principle that states: 'Entities should not be multiplied beyond necessity' (the simplest explanation that fits the data is usually best)?",
    options: [
      "Pascal's Wager",
      "Occam's Razor",
      "Hume's Guillotine",
      "Hanlon's Razor"
    ],
    correctAnswerIndex: 1,
    explanation: "Occam's Razor (lex parsimoniae) is attributed to 14th-century Franciscan friar William of Ockham. It advises that among competing hypotheses, one should select the one that makes the fewest assumptions.",
    hint: "Named after a Franciscan logician and a cutting instrument.",
    didYouKnow: "Hanlon's Razor is a modern counterpart: 'Never attribute to malice that which is adequately explained by stupidity.'",
    category: "Philosophy & Ideas",
    difficulty: "Novice"
  },
  {
    id: "phil-4",
    question: "In moral philosophy, what is the core tenet of Immanuel Kant's 'Categorical Imperative'?",
    options: [
      "Act so as to maximize total pleasure and minimize total pain for all sentient beings",
      "Act only according to that maxim whereby you can at the same time will that it should become a universal law",
      "Whatever is natural is fundamentally virtuous and moral",
      "Morality is purely relative to the customs and laws of one's polis"
    ],
    correctAnswerIndex: 1,
    explanation: "Kant's deontological ethics asserts that moral duties are unconditional commands of reason. If an action (such as lying or breaking promises) cannot be consistently willed as a universal law without generating a logical contradiction, it is morally forbidden.",
    hint: "Formulated in 'Groundwork of the Metaphysics of Morals' (1785).",
    didYouKnow: "Kant's second formulation instructs: 'Never treat humanity solely as a means to an end, but always also as an end in itself.'",
    category: "Philosophy & Ideas",
    difficulty: "Master"
  },
  {
    id: "phil-5",
    question: "Which ancient Greek philosophical school, founded by Zeno of Citium around 300 BC, taught that virtue is the only good, emotional resilience comes from accepting what is outside our control, and was practiced by Roman Emperor Marcus Aurelius?",
    options: ["Epicureanism", "Stoicism", "Cynicism", "Skepticism"],
    correctAnswerIndex: 1,
    explanation: "Stoicism emphasizes the dichotomy of control (epictetan prohairesis): distinguishing between things in our power (beliefs, desires, choices) and things outside our power (fame, health, external fortune), responding to adversity with equanimity.",
    hint: "Named after the Stoa Poikile (Painted Porch) in the Agora of Athens where they gathered.",
    didYouKnow: "Marcus Aurelius wrote his 'Meditations' as private self-reminders while campaigning on the northern frontier against Germanic tribes.",
    category: "Philosophy & Ideas",
    difficulty: "Novice"
  },

  // MATHEMATICS & PATTERNS
  {
    id: "math-1",
    question: "What is Euler's Identity, celebrated by mathematicians as the most beautiful formula in mathematics for linking five fundamental constants?",
    options: [
      "e^(iπ) + 1 = 0",
      "a^2 + b^2 = c^2",
      "E = mc^2",
      "F - E + V = 2"
    ],
    correctAnswerIndex: 0,
    explanation: "Euler's Identity connects e (base of natural logarithms), i (imaginary unit), π (ratio of circumference to diameter), 1 (multiplicative identity), and 0 (additive identity) in a single equation: e^(iπ) + 1 = 0.",
    hint: "It derives directly from Euler's formula: e^(ix) = cos(x) + i·sin(x) evaluated at x = π.",
    didYouKnow: "Physicist Richard Feynman called it 'our jewel' and 'the most remarkable formula in mathematics.'",
    category: "Mathematics & Patterns",
    difficulty: "Scholar"
  },
  {
    id: "math-2",
    question: "In the Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...), as n approaches infinity, what mathematical constant does the ratio of consecutive terms F(n+1)/F(n) converge toward?",
    options: [
      "Euler's number e (≈ 2.718)",
      "The Golden Ratio φ (≈ 1.618)",
      "Pi π (≈ 3.14159)",
      "The Silver Ratio δ_S (≈ 2.414)"
    ],
    correctAnswerIndex: 1,
    explanation: "The ratio F(n+1)/F(n) approaches φ = (1 + √5)/2 ≈ 1.6180339887... which satisfies the characteristic quadratic equation x^2 - x - 1 = 0.",
    hint: "Found in phyllotaxis patterns of sunflower seeds, pinecones, and nautilus shells.",
    didYouKnow: "Leonardo of Pisa (Fibonacci) introduced the sequence to Western Europe in his 1202 book Liber Abaci to model rabbit population growth.",
    category: "Mathematics & Patterns",
    difficulty: "Novice"
  },
  {
    id: "math-3",
    question: "What is the only even prime number in all of arithmetic?",
    options: ["0", "2", "4", "6"],
    correctAnswerIndex: 1,
    explanation: "2 is the only even prime number. Any other even number greater than 2 is divisible by 2 and therefore composite by definition.",
    hint: "It is also the smallest prime number.",
    didYouKnow: "Mathematicians sometimes joke that 2 is the 'oddest prime' because it is the only even one.",
    category: "Mathematics & Patterns",
    difficulty: "Novice"
  },
  {
    id: "math-4",
    question: "What unsolved Millennium Prize Problem asks whether every algorithm whose solution can be verified in polynomial time can also be solved in polynomial time?",
    options: [
      "Riemann Hypothesis",
      "P vs NP Problem",
      "Navier-Stokes Existence",
      "Birch and Swinnerton-Dyer Conjecture"
    ],
    correctAnswerIndex: 1,
    explanation: "The P versus NP problem, formulated by Stephen Cook in 1971, asks whether P (problems solvable in polynomial time) equals NP (problems verifiable in polynomial time). The Clay Mathematics Institute offers a $1,000,000 prize for its proof or disproof.",
    hint: "Contrasts polynomial time search with polynomial time verification.",
    didYouKnow: "If P = NP were proven constructively, it could potentially crack all modern public-key cryptography (RSA, ECC) overnight.",
    category: "Mathematics & Patterns",
    difficulty: "Master"
  },
  {
    id: "math-5",
    question: "In probability theory, what is the expected number of coin flips needed on a fair coin to get two heads in a row (HH)?",
    options: ["4 flips", "6 flips", "8 flips", "10 flips"],
    correctAnswerIndex: 1,
    explanation: "Let E be the expected flips from start. E = (1/2)(1 + E_H) + (1/2)(1 + E). From state H: E_H = (1/2)(1) + (1/2)(1 + E). Substituting gives E_H = 1 + E/2, then E = 1 + (1/2)(1 + E/2) + E/2 = 3/2 + 3E/4 => E/4 = 3/2 => E = 6 flips.",
    hint: "Notice that failing on the second flip resets you all the way back to the initial state!",
    didYouKnow: "Curiously, the expected flips for HT (Head followed by Tail) is only 4 flips, because a T doesn't reset a streak if an H was already in progress!",
    category: "Mathematics & Patterns",
    difficulty: "Polymath"
  },

  // LITERATURE, WORDS & ETYMOLOGY
  {
    id: "lit-1",
    question: "What is an 'oxymoron' in literary rhetoric?",
    options: [
      "A word that imitates the sound it describes",
      "A figure of speech that juxtaposes contradictory terms (e.g., 'deafening silence')",
      "A grammatical repetition of vowel sounds",
      "A story that operates on both literal and allegorical levels"
    ],
    correctAnswerIndex: 1,
    explanation: "From Greek oxus ('sharp/clever') and moros ('dull/foolish'), an oxymoron unites two seemingly contradictory concepts to create a rhetorical tension or poetic insight (e.g. 'cruel kindness', 'living dead').",
    hint: "The word itself is self-referential: oxus (sharp) + moros (foolish).",
    didYouKnow: "Shakespeare is famous for oxymorons, as in Romeo and Juliet: 'O brawling love! O loving hate!'",
    category: "Literature & Words",
    difficulty: "Novice"
  },
  {
    id: "lit-2",
    question: "Which monumental 1851 novel opens with the iconic sentence: 'Call me Ishmael'?",
    options: [
      "The Great Gatsby by F. Scott Fitzgerald",
      "Moby-Dick by Herman Melville",
      "Heart of Darkness by Joseph Conrad",
      "Robinson Crusoe by Daniel Defoe"
    ],
    correctAnswerIndex: 1,
    explanation: "Herman Melville's 'Moby-Dick; or, The Whale' chronicles Captain Ahab's obsessive pursuit of the albino sperm whale aboard the Pequod.",
    hint: "The narrator ships out on a whaling voyage from Nantucket.",
    didYouKnow: "In the biblical Book of Genesis, Ishmael was the wandering outcast son of Abraham and Hagar.",
    category: "Literature & Words",
    difficulty: "Novice"
  },
  {
    id: "lit-3",
    question: "What is a 'portmanteau' word in linguistics?",
    options: [
      "A word that has no rhymes in the English language",
      "A word that blends the sounds and meanings of two distinct words (e.g., 'brunch' from breakfast + lunch)",
      "A word borrowed from French without spelling alteration",
      "A word that reads the same forwards and backwards"
    ],
    correctAnswerIndex: 1,
    explanation: "Coined in this linguistic sense by Lewis Carroll in 'Through the Looking-Glass' (1871), Humpty Dumpty explains to Alice that 'slithy' means 'lithe and slimy'—like a portmanteau suitcase with two compartments.",
    hint: "Examples include motel (motor + hotel), smog (smoke + fog), and podcast (iPod + broadcast).",
    didYouKnow: "The word 'chortle' was invented by Lewis Carroll as a portmanteau of 'chuckle' and 'snort'.",
    category: "Literature & Words",
    difficulty: "Scholar"
  },
  {
    id: "lit-4",
    question: "Which Greek epic poem attributes its authorship to Homer and details Odysseus's turbulent 10-year journey home to Ithaca following the Trojan War?",
    options: ["The Iliad", "The Odyssey", "The Aeneid", "The Argonautica"],
    correctAnswerIndex: 1,
    explanation: "The Odyssey focuses on Odysseus (Ulysses in Latin) overcoming encounters with the Cyclops Polyphemus, Circe, the Sirens, Scylla and Charybdis, and reclaiming his throne and wife Penelope.",
    hint: "His son Telemachus and wife Penelope await him in Ithaca.",
    didYouKnow: "James Joyce's modernist masterpiece 'Ulysses' is structured around the parallel chapters and motifs of Homer's Odyssey.",
    category: "Literature & Words",
    difficulty: "Novice"
  },
  {
    id: "lit-5",
    question: "What is the term for a word, phrase, or number that reads the same backward as forward (e.g., 'racecar', 'madam', or '10801')?",
    options: ["Anagram", "Palindrome", "Tautology", "Heteronym"],
    correctAnswerIndex: 1,
    explanation: "From Greek palin ('again') and dromos ('way/direction'), palindromes are symmetrical sequences that preserve identical order when reversed.",
    hint: "Aibohphobia is the humorous, mock-psychological fear of palindromes (itself a palindrome!).",
    didYouKnow: "The Sator Square is an ancient Latin 2D palindromic word square found in the ruins of Pompeii (79 AD).",
    category: "Literature & Words",
    difficulty: "Novice"
  },

  // GEOGRAPHY & NATURE
  {
    id: "geo-1",
    question: "Which is the deepest known oceanic trench on Earth, plunging nearly 11,000 meters (36,000 feet) below sea level at Challenger Deep?",
    options: [
      "Puerto Rico Trench",
      "Mariana Trench",
      "Java Trench",
      "Tonga Trench"
    ],
    correctAnswerIndex: 1,
    explanation: "Located in the western Pacific Ocean east of the Mariana Islands, the Mariana Trench is formed by the subduction of the Pacific tectonic plate beneath the smaller Mariana plate.",
    hint: "Mount Everest could be dropped into Challenger Deep and its summit would still be under 2 km of water!",
    didYouKnow: "Swiss oceanographer Jacques Piccard and US Navy Lt. Don Walsh were the first humans to dive to Challenger Deep in the bathyscaphe Trieste in 1960.",
    category: "Geography & Nature",
    difficulty: "Novice"
  },
  {
    id: "geo-2",
    question: "Which country in the world spans the largest number of consecutive terrestrial time zones without counting overseas territories?",
    options: ["Canada", "United States", "Russia", "China"],
    correctAnswerIndex: 2,
    explanation: "Russia spans 11 contiguous time zones across northern Eurasia, stretching from Kaliningrad (UTC+2) to Kamchatka and Chukotka (UTC+12).",
    hint: "Stretches across both Eastern Europe and northern Asia across 17 million square kilometers.",
    didYouKnow: "China, despite being roughly the width of the continental United States, observes only a single official time zone (Beijing Time, UTC+8).",
    category: "Geography & Nature",
    difficulty: "Scholar"
  },
  {
    id: "geo-3",
    question: "Which is the only sea in the world that has no terrestrial land borders, being defined entirely by ocean currents (the North Atlantic Gyre)?",
    options: ["Sargasso Sea", "Weddell Sea", "Coral Sea", "Barents Sea"],
    correctAnswerIndex: 0,
    explanation: "The Sargasso Sea is an elliptical body of water in the middle of the North Atlantic Ocean bounded by the Gulf Stream, North Atlantic Current, Canary Current, and North Atlantic Equatorial Current. It is named for the free-floating Sargassum seaweed.",
    hint: "American and European freshwater eels migrate thousands of miles here to breed and spawn.",
    didYouKnow: "Jules Verne vividly depicted the Sargasso Sea in 'Twenty Thousand Leagues Under the Sea'.",
    category: "Geography & Nature",
    difficulty: "Master"
  },
  {
    id: "geo-4",
    question: "Which African lake is the world's longest freshwater lake and the second deepest after Lake Baikal?",
    options: ["Lake Victoria", "Lake Tanganyika", "Lake Malawi", "Lake Chad"],
    correctAnswerIndex: 1,
    explanation: "Lake Tanganyika sits in the Albertine Rift branch of the East African Rift. It is 676 km long and reaches a depth of 1,470 meters, holding approximately 16% of the world's available surface freshwater.",
    hint: "Shared by Tanzania, the DRC, Burundi, and Zambia.",
    didYouKnow: "Due to extreme depth and lack of seasonal turnover, below 200 meters the water is completely anoxic (lacks oxygen).",
    category: "Geography & Nature",
    difficulty: "Scholar"
  },

  // ART & CULTURE
  {
    id: "art-1",
    question: "Which artistic movement, pioneered by Pablo Picasso and Georges Braque around 1907–1914, revolutionized European painting by deconstructing three-dimensional objects into multi-angled geometric facets?",
    options: ["Surrealism", "Cubism", "Fauvism", "Impressionism"],
    correctAnswerIndex: 1,
    explanation: "Cubism abandoned single-point linear perspective in favor of depicting subjects simultaneously from multiple viewpoints, reflecting modern concepts of relativity, dynamism, and non-Western tribal art influences.",
    hint: "Picasso's 'Les Demoiselles d'Avignon' (1907) is considered the proto-manifesto painting of this movement.",
    didYouKnow: "Art critic Louis Vauxcelles coined the term after describing Braque's 1908 landscape paintings as full of 'little cubes'.",
    category: "Art & Culture",
    difficulty: "Novice"
  },
  {
    id: "art-2",
    question: "Who painted the famous ceiling frescoes of the Sistine Chapel in the Vatican between 1508 and 1512, including 'The Creation of Adam'?",
    options: ["Leonardo da Vinci", "Raphael", "Michelangelo Buonarroti", "Sandro Botticelli"],
    correctAnswerIndex: 2,
    explanation: "Commissioned by Pope Julius II, Michelangelo spent 4 years painting over 500 square meters of ceiling fresco while standing upright on custom wooden scaffolding, depicting Genesis narratives and prophets.",
    hint: "He also sculpted the marble masterpieces 'David' and 'Pietà'.",
    didYouKnow: "Michelangelo considered himself primarily a sculptor and initially tried to turn down the painting commission.",
    category: "Art & Culture",
    difficulty: "Novice"
  },
  {
    id: "art-3",
    question: "In classical music, what is the musical term for gradually speeding up the tempo of a piece?",
    options: ["Ritardando", "Accelerando", "Crescendo", "Staccato"],
    correctAnswerIndex: 1,
    explanation: "Accelerando (often abbreviated accel.) is the Italian musical direction to increase speed and tempo. Ritardando means slowing down, while crescendo refers to volume.",
    hint: "Shares the same Latin root as 'accelerator'.",
    didYouKnow: "Italian musical notation terms spread throughout Europe during the Renaissance when Italian composers dominated court music.",
    category: "Art & Culture",
    difficulty: "Novice"
  },
  {
    id: "art-4",
    question: "Which architectural movement, founded by Walter Gropius in Weimar Germany in 1919, synthesized fine arts with crafts and technology under the principle 'Form follows function'?",
    options: ["Art Nouveau", "Bauhaus", "Brutalism", "Constructivism"],
    correctAnswerIndex: 1,
    explanation: "The Staatliches Bauhaus school operated in Weimar, Dessau, and Berlin until forced shut by the Nazi regime in 1933. Its teachers included Wassily Kandinsky, Paul Klee, and Mies van der Rohe.",
    hint: "German literal translation means 'building house'.",
    didYouKnow: "Bauhaus typography, tubular steel furniture (Wassily chair), and minimalist glass-curtain wall architecture shaped modern industrial design.",
    category: "Art & Culture",
    difficulty: "Scholar"
  }
];

export const CATEGORIES = [
  "All",
  "Logic & Riddles",
  "Science & Cosmos",
  "History & Civilization",
  "Philosophy & Ideas",
  "Literature & Words",
  "Mathematics & Patterns",
  "Geography & Nature",
  "Art & Culture",
];

export const DIFFICULTIES = ["All", "Novice", "Scholar", "Master", "Polymath"] as const;
