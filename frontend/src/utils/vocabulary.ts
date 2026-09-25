export interface VocabWord {
  id: string;
  spanish: string;
  english: string;
  category: "Basics" | "Greetings" | "Food & Drink" | "Café & Dining" | "Travel & Places" | "Animals & Nature" | "Family & Life";
  type: "noun (m)" | "noun (f)" | "verb" | "phrase" | "adjective" | "pronoun";
  example: string;
  exampleEn: string;
}

export const VOCABULARY_LIST: VocabWord[] = [
  // Basics & Pronouns
  { id: "v1", spanish: "el hombre", english: "the man", category: "Basics", type: "noun (m)", example: "El hombre come pan.", exampleEn: "The man eats bread." },
  { id: "v2", spanish: "la mujer", english: "the woman", category: "Basics", type: "noun (f)", example: "La mujer bebe agua.", exampleEn: "The woman drinks water." },
  { id: "v3", spanish: "el niño", english: "the boy", category: "Basics", type: "noun (m)", example: "El niño es Alex.", exampleEn: "The boy is Alex." },
  { id: "v4", spanish: "la niña", english: "the girl", category: "Basics", type: "noun (f)", example: "La niña come una manzana.", exampleEn: "The girl eats an apple." },
  { id: "v5", spanish: "yo", english: "I", category: "Basics", type: "pronoun", example: "Yo soy estudiante.", exampleEn: "I am a student." },
  { id: "v6", spanish: "tú", english: "you (informal)", category: "Basics", type: "pronoun", example: "Tú eres mi amigo.", exampleEn: "You are my friend." },
  { id: "v7", spanish: "él", english: "he", category: "Basics", type: "pronoun", example: "Él come pan.", exampleEn: "He eats bread." },
  { id: "v8", spanish: "ella", english: "she", category: "Basics", type: "pronoun", example: "Ella bebe leche.", exampleEn: "She drinks milk." },
  { id: "v9", spanish: "nosotros", english: "we", category: "Basics", type: "pronoun", example: "Nosotros hablamos español.", exampleEn: "We speak Spanish." },
  { id: "v10", spanish: "ellos", english: "they", category: "Basics", type: "pronoun", example: "Ellos comen manzanas.", exampleEn: "They eat apples." },
  { id: "v11", spanish: "ser / soy / eres / es", english: "to be / am / are / is", category: "Basics", type: "verb", example: "Yo soy feliz.", exampleEn: "I am happy." },
  { id: "v12", spanish: "un / una", english: "a, an, one", category: "Basics", type: "adjective", example: "Una manzana roja.", exampleEn: "A red apple." },

  // Greetings & Courtesy
  { id: "v13", spanish: "¡Hola!", english: "Hello! / Hi!", category: "Greetings", type: "phrase", example: "¡Hola! ¿Cómo estás?", exampleEn: "Hello! How are you?" },
  { id: "v14", spanish: "Buenos días", english: "Good morning", category: "Greetings", type: "phrase", example: "Buenos días, señor.", exampleEn: "Good morning, sir." },
  { id: "v15", spanish: "Buenas tardes", english: "Good afternoon", category: "Greetings", type: "phrase", example: "Buenas tardes a todos.", exampleEn: "Good afternoon everyone." },
  { id: "v16", spanish: "Buenas noches", english: "Good evening / Good night", category: "Greetings", type: "phrase", example: "Buenas noches, hasta mañana.", exampleEn: "Good night, see you tomorrow." },
  { id: "v17", spanish: "Por favor", english: "Please", category: "Greetings", type: "phrase", example: "Un agua, por favor.", exampleEn: "A water, please." },
  { id: "v18", spanish: "Gracias", english: "Thank you / Thanks", category: "Greetings", type: "phrase", example: "Muchas gracias por tu ayuda.", exampleEn: "Thank you very much for your help." },
  { id: "v19", spanish: "De nada", english: "You're welcome", category: "Greetings", type: "phrase", example: "—Gracias. —De nada.", exampleEn: "—Thanks. —You're welcome." },
  { id: "v20", spanish: "Mucho gusto", english: "Nice to meet you", category: "Greetings", type: "phrase", example: "Mucho gusto, Juan.", exampleEn: "Nice to meet you, Juan." },
  { id: "v21", spanish: "¿Cómo estás?", english: "How are you?", category: "Greetings", type: "phrase", example: "Hola Alex, ¿cómo estás?", exampleEn: "Hi Alex, how are you?" },
  { id: "v22", spanish: "Muy bien", english: "Very well", category: "Greetings", type: "phrase", example: "Estoy muy bien, gracias.", exampleEn: "I am very well, thanks." },
  { id: "v23", spanish: "Adiós", english: "Goodbye", category: "Greetings", type: "phrase", example: "Adiós, amigo.", exampleEn: "Goodbye, friend." },
  { id: "v24", spanish: "Hasta luego", english: "See you later", category: "Greetings", type: "phrase", example: "Hasta luego, nos vemos.", exampleEn: "See you later, see you." },
  { id: "v25", spanish: "Disculpe / Perdón", english: "Excuse me / Sorry", category: "Greetings", type: "phrase", example: "Disculpe, ¿dónde está el baño?", exampleEn: "Excuse me, where is the restroom?" },
  { id: "v26", spanish: "Sí / No", english: "Yes / No", category: "Greetings", type: "phrase", example: "Sí, por favor.", exampleEn: "Yes, please." },

  // Food & Drink
  { id: "v27", spanish: "el agua", english: "the water", category: "Food & Drink", type: "noun (f)", example: "Yo bebo agua fría.", exampleEn: "I drink cold water." },
  { id: "v28", spanish: "el pan", english: "the bread", category: "Food & Drink", type: "noun (m)", example: "El pan está caliente.", exampleEn: "The bread is warm." },
  { id: "v29", spanish: "la leche", english: "the milk", category: "Food & Drink", type: "noun (f)", example: "El gato bebe leche.", exampleEn: "The cat drinks milk." },
  { id: "v30", spanish: "la manzana", english: "the apple", category: "Food & Drink", type: "noun (f)", example: "La manzana es dulce.", exampleEn: "The apple is sweet." },
  { id: "v31", spanish: "el café", english: "the coffee", category: "Food & Drink", type: "noun (m)", example: "Quiero un café solo.", exampleEn: "I want a black coffee." },
  { id: "v32", spanish: "el té", english: "the tea", category: "Food & Drink", type: "noun (m)", example: "Un té verde, por favor.", exampleEn: "A green tea, please." },
  { id: "v33", spanish: "el queso", english: "the cheese", category: "Food & Drink", type: "noun (m)", example: "Pan con queso delicioso.", exampleEn: "Bread with delicious cheese." },
  { id: "v34", spanish: "el arroz", english: "the rice", category: "Food & Drink", type: "noun (m)", example: "El arroz con pollo.", exampleEn: "Rice with chicken." },
  { id: "v35", spanish: "el azúcar", english: "the sugar", category: "Food & Drink", type: "noun (m)", example: "Café sin azúcar.", exampleEn: "Coffee without sugar." },
  { id: "v36", spanish: "la comida", english: "the food / meal", category: "Food & Drink", type: "noun (f)", example: "La comida mexicana.", exampleEn: "Mexican food." },
  { id: "v37", spanish: "comer / come / como", english: "to eat / eats / eat", category: "Food & Drink", type: "verb", example: "Ella come fruta.", exampleEn: "She eats fruit." },
  { id: "v38", spanish: "beber / bebe / bebo", english: "to drink / drinks / drink", category: "Food & Drink", type: "verb", example: "El hombre bebe jugo.", exampleEn: "The man drinks juice." },

  // Café & Dining
  { id: "v39", spanish: "la cuenta", english: "the bill / check", category: "Café & Dining", type: "noun (f)", example: "La cuenta, por favor.", exampleEn: "The check, please." },
  { id: "v40", spanish: "la mesa", english: "the table", category: "Café & Dining", type: "noun (f)", example: "Una mesa para dos personas.", exampleEn: "A table for two people." },
  { id: "v41", spanish: "el restaurante", english: "the restaurant", category: "Café & Dining", type: "noun (m)", example: "Un restaurante excelente.", exampleEn: "An excellent restaurant." },
  { id: "v42", spanish: "el menú", english: "the menu", category: "Café & Dining", type: "noun (m)", example: "¿Tiene el menú en inglés?", exampleEn: "Do you have the menu in English?" },
  { id: "v43", spanish: "la taza", english: "the cup / mug", category: "Café & Dining", type: "noun (f)", example: "Una taza de café caliente.", exampleEn: "A cup of hot coffee." },
  { id: "v44", spanish: "el vaso", english: "the glass", category: "Café & Dining", type: "noun (m)", example: "Un vaso de agua, por favor.", exampleEn: "A glass of water, please." },
  { id: "v45", spanish: "quiero / quisiera", english: "I want / I would like", category: "Café & Dining", type: "verb", example: "Quisiera pedir la sopa.", exampleEn: "I would like to order the soup." },
  { id: "v46", spanish: "delicioso", english: "delicious", category: "Café & Dining", type: "adjective", example: "Este plato está muy delicioso.", exampleEn: "This dish is very delicious." },

  // Travel & Places
  { id: "v47", spanish: "la maleta", english: "the suitcase / luggage", category: "Travel & Places", type: "noun (f)", example: "Mi maleta es azul.", exampleEn: "My suitcase is blue." },
  { id: "v48", spanish: "el pasaporte", english: "the passport", category: "Travel & Places", type: "noun (m)", example: "Tengo mi pasaporte listo.", exampleEn: "I have my passport ready." },
  { id: "v49", spanish: "el taxi", english: "the taxi", category: "Travel & Places", type: "noun (m)", example: "Necesito un taxi al hotel.", exampleEn: "I need a taxi to the hotel." },
  { id: "v50", spanish: "el hotel", english: "the hotel", category: "Travel & Places", type: "noun (m)", example: "El hotel está cerca del centro.", exampleEn: "The hotel is near downtown." },
  { id: "v51", spanish: "el aeropuerto", english: "the airport", category: "Travel & Places", type: "noun (m)", example: "Vamos al aeropuerto ahora.", exampleEn: "We are going to the airport now." },
  { id: "v52", spanish: "el boleto", english: "the ticket", category: "Travel & Places", type: "noun (m)", example: "Compré un boleto de avión.", exampleEn: "I bought a plane ticket." },
  { id: "v53", spanish: "la calle", english: "the street", category: "Travel & Places", type: "noun (f)", example: "Camino por la calle principal.", exampleEn: "I walk down main street." },
  { id: "v54", spanish: "la ciudad", english: "the city", category: "Travel & Places", type: "noun (f)", example: "Madrid es una hermosa ciudad.", exampleEn: "Madrid is a beautiful city." },
  { id: "v55", spanish: "la casa", english: "the house / home", category: "Travel & Places", type: "noun (f)", example: "Mi casa es tu casa.", exampleEn: "My house is your house." },
  { id: "v56", spanish: "el carro / auto", english: "the car", category: "Travel & Places", type: "noun (m)", example: "El carro rojo es nuevo.", exampleEn: "The red car is new." },

  // Animals & Nature
  { id: "v57", spanish: "el perro", english: "the dog", category: "Animals & Nature", type: "noun (m)", example: "El perro juega en el parque.", exampleEn: "The dog plays in the park." },
  { id: "v58", spanish: "el gato", english: "the cat", category: "Animals & Nature", type: "noun (m)", example: "El gato duerme mucho.", exampleEn: "The cat sleeps a lot." },
  { id: "v59", spanish: "el caballo", english: "the horse", category: "Animals & Nature", type: "noun (m)", example: "El caballo corre rápido.", exampleEn: "The horse runs fast." },
  { id: "v60", spanish: "el pájaro", english: "the bird", category: "Animals & Nature", type: "noun (m)", example: "El pájaro canta en el árbol.", exampleEn: "The bird sings in the tree." },
  { id: "v61", spanish: "el pescado / pez", english: "the fish", category: "Animals & Nature", type: "noun (m)", example: "El pez nada en el agua.", exampleEn: "The fish swims in the water." },
  { id: "v62", spanish: "el libro", english: "the book", category: "Family & Life", type: "noun (m)", example: "Leo un libro interesante.", exampleEn: "I read an interesting book." },
  { id: "v63", spanish: "la mamá", english: "the mom / mother", category: "Family & Life", type: "noun (f)", example: "Mi mamá cocina muy rico.", exampleEn: "My mom cooks very well." },
  { id: "v64", spanish: "el papá", english: "the dad / father", category: "Family & Life", type: "noun (m)", example: "Mi papá trabaja hoy.", exampleEn: "My dad works today." },
  { id: "v65", spanish: "el amigo / la amiga", english: "the friend", category: "Family & Life", type: "noun (m)", example: "Alex es un buen amigo.", exampleEn: "Alex is a good friend." },
  { id: "v66", spanish: "la familia", english: "the family", category: "Family & Life", type: "noun (f)", example: "Mi familia vive en España.", exampleEn: "My family lives in Spain." }
];
