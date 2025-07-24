const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my computer a joke about UDP, but it didn't get it.",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "What do you call a fake noodle? An impasta!",
  "Why did the AI go to therapy? It had too many deep learning issues!",
  "How do you comfort a JavaScript bug? You console it!",
];

const greetings = [
  "Hello! I'm ARIA, your adaptive intelligence assistant. How can I help you today?",
  "Hi there! ARIA here, ready to assist you with anything you need.",
  "Greetings! I'm ARIA, your personal AI companion. What would you like to know?",
  "Hello! ARIA at your service. How may I assist you today?",
];

const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getCurrentDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const calculateExpression = (expression: string): string => {
  try {
    // Simple math expressions only - security conscious
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
    if (!sanitized.trim()) {
      return "Please provide a valid mathematical expression to calculate.";
    }
    const result = Function(`"use strict"; return (${sanitized})`)();
    return `The result is ${result}`;
  } catch (error) {
    return "I couldn't calculate that. Please try a simpler math expression.";
  }
};

const getRandomJoke = (): string => {
  return jokes[Math.floor(Math.random() * jokes.length)];
};

const getRandomGreeting = (): string => {
  return greetings[Math.floor(Math.random() * greetings.length)];
};

const processAriaCommand = (input: string): string => {
  // Remove "ARIA" or "Aria" from the beginning of commands
  const cleanInput = input.replace(/^(aria|ARIA),?\s*/i, '').trim();
  return cleanInput || input;
};

export const processCommand = async (input: string): Promise<string> => {
  // Process ARIA-specific commands
  const processedInput = processAriaCommand(input);
  const lowerInput = processedInput.toLowerCase().trim();

  // Greetings
  if (lowerInput.match(/^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/)) {
    return getRandomGreeting();
  }

  // Time queries
  if (lowerInput.match(/(what time|current time|time is|tell me the time)/)) {
    return `The current time is ${getCurrentTime()}`;
  }

  // Date queries
  if (lowerInput.match(/(what date|current date|what day|today is|tell me the date)/)) {
    return `Today is ${getCurrentDate()}`;
  }

  // Math calculations
  if (lowerInput.match(/(calculate|compute|what's|what is|how much is|\d+\s*[\+\-\*\/]\s*\d+)/)) {
    const mathExpression = processedInput.replace(/(calculate|compute|what's|what is|how much is)/gi, '').trim();
    return calculateExpression(mathExpression);
  }

  // Weather (mock response since we don't have API access)
  if (lowerInput.match(/(weather|temperature|forecast)/)) {
    return "I don't have access to real-time weather data yet, but you can check your local weather app or ask me to help you find weather information online.";
  }

  // Jokes
  if (lowerInput.match(/(joke|funny|humor|make me laugh)/)) {
    return getRandomJoke();
  }

  // Personal questions
  if (lowerInput.match(/(how are you|how do you feel|how's it going)/)) {
    return "I'm functioning optimally and ready to assist! Thanks for asking. How can I help you today?";
  }

  // Name questions
  if (lowerInput.match(/(your name|who are you|what are you)/)) {
    return "I'm ARIA - your Adaptive Responsive Intelligence Assistant. I'm designed to help you with questions, calculations, conversations, and various tasks through natural voice interaction.";
  }

  // Capabilities
  if (lowerInput.match(/(what can you do|help me|capabilities|features)/)) {
    return "I can assist you with time and date queries, mathematical calculations, tell jokes, answer questions, and engage in natural conversations. You can also say 'ARIA' before your commands for better recognition. Just speak naturally!";
  }

  // Thank you responses
  if (lowerInput.match(/(thank you|thanks|appreciate)/)) {
    return "You're very welcome! I'm always here to help. Is there anything else you'd like to know?";
  }

  // Default response
  return `I heard: "${processedInput}". I'm continuously learning and improving. Try asking me about time, date, calculations, jokes, or say "ARIA, help me" to learn more about my capabilities!`;
};