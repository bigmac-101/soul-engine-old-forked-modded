const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const path = require("path");

// Create Express app for HTTP endpoints
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server first
const server = require("http").createServer(app);

// Create WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// Professor Code's personality and cognitive system
class ProfessorCodeSoul {
  constructor() {
    this.personality = {
      name: "Professor Code",
      role: "Enthusiastic Computer Science Teacher",
      traits: [
        "Passionate about teaching programming concepts",
        "Uses creative analogies to explain complex topics",
        "Encourages learning through experimentation",
        "Celebrates student progress and breakthroughs",
        "Makes coding fun and accessible",
      ],
      knowledge: [
        "Programming languages (JavaScript, Python, Java, C++)",
        "Data structures and algorithms",
        "Software engineering principles",
        "Web development technologies",
        "Computer science theory",
      ],
    };

    this.conversationHistory = [];
    this.currentThought = "";
  }

  // Internal monologue - the soul's thinking process
  generateInternalMonologue(userMessage) {
    const thoughts = [
      `The student asked: "${userMessage}"`,
      "Let me think about the best way to explain this...",
      "I should use an analogy that makes this concept click!",
      "How can I make this both educational and engaging?",
      "What examples would help them understand better?",
    ];

    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }

  // External dialog - the soul's response to the user
  generateResponse(userMessage) {
    const responses = {
      greeting: [
        "Hello there, brilliant student! 🎓 I'm Professor Code, your enthusiastic programming mentor!",
        "Welcome to the world of code! I'm Professor Code, and I'm absolutely thrilled to help you learn!",
        "Greetings, future programmer! Professor Code here, ready to make coding an adventure!",
      ],

      programming: [
        "Ah, a fantastic programming question! Let me break this down for you...",
        "Excellent question! Programming is like building with digital LEGO blocks...",
        "That's a wonderful topic to explore! Think of it this way...",
      ],

      encouragement: [
        "You're doing amazing! Every coder started exactly where you are now.",
        "That's the spirit! Debugging is just detective work - and you're becoming a great detective!",
        "Remember, every expert was once a beginner. You've got this!",
      ],

      default: [
        "That's an interesting question! Let me think about the best way to explain this...",
        "I love your curiosity! That's the mark of a true programmer.",
        "Great question! Here's how I like to think about it...",
      ],
    };

    // Simple keyword matching for response type
    const message = userMessage.toLowerCase();
    let responseType = "default";

    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      responseType = "greeting";
    } else if (
      message.includes("code") ||
      message.includes("program") ||
      message.includes("javascript") ||
      message.includes("python")
    ) {
      responseType = "programming";
    } else if (
      message.includes("help") ||
      message.includes("stuck") ||
      message.includes("error")
    ) {
      responseType = "encouragement";
    }

    const responseOptions = responses[responseType];
    return responseOptions[Math.floor(Math.random() * responseOptions.length)];
  }

  // Process a message through the soul's cognitive steps
  processMessage(message) {
    // Step 1: Internal monologue
    this.currentThought = this.generateInternalMonologue(message);

    // Step 2: Generate response
    const response = this.generateResponse(message);

    // Step 3: Update conversation history
    this.conversationHistory.push({
      user: message,
      thought: this.currentThought,
      response: response,
      timestamp: new Date().toISOString(),
    });

    return {
      internalMonologue: this.currentThought,
      response: response,
      timestamp: new Date().toISOString(),
    };
  }

  // Get current soul state
  getState() {
    return {
      personality: this.personality,
      currentThought: this.currentThought,
      conversationHistory: this.conversationHistory.slice(-5), // Last 5 exchanges
    };
  }
}

// Create the soul instance
const professorCode = new ProfessorCodeSoul();

// WebSocket connection handling
wss.on("connection", (ws, req) => {
  console.log("🔗 New WebSocket connection established");

  // Send initial connection message
  ws.send(
    JSON.stringify({
      type: "connection",
      data: {
        message: "Connected to Professor Code's Local Soul Engine!",
        personality: professorCode.personality,
        timestamp: new Date().toISOString(),
      },
    })
  );

  // Handle incoming messages
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log("📨 Received message:", message);

      if (message.type === "chat") {
        // Process the message through the soul
        const result = professorCode.processMessage(message.content);

        // Send internal monologue first
        ws.send(
          JSON.stringify({
            type: "internal_monologue",
            data: {
              thought: result.internalMonologue,
              timestamp: result.timestamp,
            },
          })
        );

        // Then send the response
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              type: "response",
              data: {
                message: result.response,
                timestamp: result.timestamp,
              },
            })
          );
        }, 1000); // Small delay to show the thinking process
      }

      if (message.type === "get_state") {
        ws.send(
          JSON.stringify({
            type: "state",
            data: professorCode.getState(),
          })
        );
      }
    } catch (error) {
      console.error("❌ Error processing message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          data: { message: "Error processing message" },
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("🔌 WebSocket connection closed");
  });

  ws.on("error", (error) => {
    console.error("❌ WebSocket error:", error);
  });
});

// HTTP endpoints for additional functionality
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    soul: "Professor Code",
    timestamp: new Date().toISOString(),
  });
});

app.get("/personality", (req, res) => {
  res.json(professorCode.personality);
});

app.get("/history", (req, res) => {
  res.json(professorCode.conversationHistory);
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Professor Code's Local Soul Engine starting...`);
  console.log(`🌐 WebSocket server running on ws://localhost:${PORT}`);
  console.log(`📡 HTTP server running on http://localhost:${PORT}`);
  console.log(`🎓 Professor Code is ready to teach!`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down Professor Code's Soul Engine...");
  wss.close(() => {
    console.log("✅ Soul Engine stopped gracefully");
    process.exit(0);
  });
});
