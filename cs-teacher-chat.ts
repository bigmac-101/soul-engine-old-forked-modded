import {
  WorkingMemory,
  createCognitiveStep,
  ChatMessageRoleEnum,
} from "@opensouls/core";
import { z } from "zod";
import * as readline from "readline";

// Cognitive steps for our CS Teacher soul
const teacherThinking = createCognitiveStep((situation: string) => {
  return {
    command: ({ soulName }: WorkingMemory) => {
      console.log(`🧠 Framework executing: teacherThinking("${situation}")`);
      return {
        role: ChatMessageRoleEnum.System,
        content: `${soulName} thinks about the situation: ${situation}
        
        As a passionate computer science teacher who loves jokes, consider:
        - How can I make this educational and fun?
        - Is there a good programming joke or pun I can use?
        - What CS concepts might be relevant here?
        - How can I encourage the student's curiosity?
        
        Respond with ${soulName}'s internal thought in quotes.`,
      };
    },
    postProcess: async (memory: WorkingMemory, response: string) => {
      const thought = response.replace(/^.*"/g, "").replace(/".*$/g, "");
      console.log(`💭 Framework returned thought: "${thought}"`);

      const newMemory = {
        role: ChatMessageRoleEnum.Assistant,
        content: `${memory.soulName} thought: "${thought}"`,
      };
      return [newMemory, thought];
    },
  };
});

const teacherResponse = createCognitiveStep((context: string) => {
  return {
    command: ({ soulName }: WorkingMemory) => {
      console.log(`🧠 Framework executing: teacherResponse("${context}")`);
      return {
        role: ChatMessageRoleEnum.System,
        content: `${soulName} responds to the student. Context: ${context}
        
        You are Professor Code, a passionate computer science teacher who:
        - LOVES programming jokes, puns, and tech humor
        - Makes everything relatable with coding analogies
        - Is genuinely excited about CS concepts
        - Encourages students with enthusiasm
        - Sometimes gets carried away explaining cool CS topics
        - Uses emojis and expressive language
        - Occasionally breaks into "dad jokes" about programming
        
        Be conversational, funny, and educational. Include a joke or pun when appropriate!
        
        Respond naturally as Professor Code speaking to the student.`,
      };
    },
    postProcess: async (memory: WorkingMemory, response: string) => {
      console.log(`💬 Framework returned response: "${response}"`);

      const newMemory = {
        role: ChatMessageRoleEnum.Assistant,
        content: `${memory.soulName}: ${response}`,
      };
      return [newMemory, response];
    },
  };
});

const jokeGenerator = createCognitiveStep((topic: string) => {
  const schema = z.object({
    joke: z.string().describe("A programming or CS-related joke"),
    explanation: z
      .string()
      .describe("Brief explanation of why it's funny (if needed)"),
    followup: z.string().describe("A natural way to continue the conversation"),
  });

  return {
    command: ({ soulName }: WorkingMemory) => {
      console.log(`🧠 Framework executing: jokeGenerator("${topic}")`);
      return {
        role: ChatMessageRoleEnum.System,
        content: `${soulName} wants to tell a programming joke related to: ${topic}
        
        Create a genuinely funny programming joke that relates to the topic. It could be:
        - A pun about programming concepts
        - A play on coding terminology
        - A joke about developer life
        - A humorous analogy between CS and real life
        
        Make it clever but accessible!`,
      };
    },
    schema,
    postProcess: async (
      memory: WorkingMemory,
      response: z.infer<typeof schema>
    ) => {
      console.log(`😂 Framework returned joke: "${response.joke}"`);

      const newMemory = {
        role: ChatMessageRoleEnum.Assistant,
        content: `${memory.soulName} told a joke: "${response.joke}" ${
          response.explanation ? `(${response.explanation})` : ""
        }`,
      };
      return [newMemory, response];
    },
  };
});

const assessInterest = createCognitiveStep((userMessage: string) => {
  const schema = z.object({
    topicDetected: z
      .string()
      .describe("Main topic or concept the user is asking about"),
    enthusiasmLevel: z
      .enum(["low", "medium", "high"])
      .describe("How excited should Professor Code be about this topic"),
    shouldTellJoke: z
      .boolean()
      .describe("Whether this is a good moment for a programming joke"),
    teachingOpportunity: z
      .boolean()
      .describe("Whether there's a good chance to explain a CS concept"),
  });

  return {
    command: ({ soulName }: WorkingMemory) => {
      console.log(`🧠 Framework executing: assessInterest("${userMessage}")`);
      return {
        role: ChatMessageRoleEnum.System,
        content: `Analyze this student message: "${userMessage}"
        
        ${soulName} needs to understand:
        - What CS topic or concept is involved (if any)
        - How excited should I be about this?
        - Is this a good time for a joke?
        - Can I teach something interesting here?`,
      };
    },
    schema,
    postProcess: async (
      memory: WorkingMemory,
      response: z.infer<typeof schema>
    ) => {
      console.log(`📊 Framework returned analysis:`, response);

      const newMemory = {
        role: ChatMessageRoleEnum.Assistant,
        content: `${memory.soulName} analyzed: Topic="${response.topicDetected}", Enthusiasm=${response.enthusiasmLevel}, Joke=${response.shouldTellJoke}, Teaching=${response.teachingOpportunity}`,
      };
      return [newMemory, response];
    },
  };
});

class CSTeacherChat {
  private workingMemory: WorkingMemory;
  private rl: readline.Interface;

  constructor() {
    this.workingMemory = new WorkingMemory({
      soulName: "Professor Code",
      memories: [
        {
          role: ChatMessageRoleEnum.System,
          content: `You are Professor Code, a passionate computer science teacher who absolutely loves programming jokes and puns. You have:
          
          🎓 PERSONALITY:
          - Infectious enthusiasm for CS concepts
          - Dad-joke level humor about programming
          - Tendency to use coding analogies for everything
          - Gets genuinely excited when students ask good questions
          - Sometimes rambles about cool CS topics
          
          💻 EXPERTISE:
          - All areas of computer science
          - Programming languages (especially loves Python puns)
          - Algorithms and data structures
          - Software engineering
          - Tech industry insights
          
          😂 HUMOR STYLE:
          - Programming puns ("Why do programmers prefer dark mode? Because light attracts bugs!")
          - Coding jokes ("How many programmers does it take to change a light bulb? None, that's a hardware problem!")
          - Tech industry humor
          - Playful analogies
          
          🎯 TEACHING STYLE:
          - Make complex concepts simple and fun
          - Use analogies and real-world examples
          - Encourage questions and curiosity
          - Celebrate "aha!" moments
          - Never make students feel stupid
          
          You're chatting with a student in a casual setting. Be yourself - enthusiastic, funny, and helpful!`,
        },
      ],
    });

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "\n💬 You: ",
    });
  }

  async start() {
    console.log("🎓 CS Teacher Chat - Framework Operations Only");
    console.log("=============================================");
    console.log(
      "Only showing actual soul engine framework operations and responses"
    );
    console.log("Type 'quit', 'exit', or 'bye' to end the conversation");
    console.log("Type 'joke' if you want to hear a programming joke!");
    console.log("=============================================\n");

    // Initial greeting - only framework operations shown
    const [memory1, thought] = await teacherThinking(
      this.workingMemory,
      "A student just joined my office hours. I should greet them warmly and maybe crack a joke to break the ice."
    );

    const [memory2, greeting] = await teacherResponse(
      memory1,
      "Give an enthusiastic greeting to a student who just came to chat. Include a light programming joke or pun."
    );

    console.log(`\n🤖 Professor Code: ${greeting}\n`);
    this.workingMemory = memory2;

    this.rl.prompt();
    this.rl.on("line", async (input) => {
      const userMessage = input.trim();

      if (
        userMessage.toLowerCase() === "quit" ||
        userMessage.toLowerCase() === "exit" ||
        userMessage.toLowerCase() === "bye"
      ) {
        await this.handleGoodbye();
        return;
      }

      if (userMessage.toLowerCase() === "joke") {
        await this.tellJoke();
        this.rl.prompt();
        return;
      }

      if (userMessage === "") {
        this.rl.prompt();
        return;
      }

      await this.handleUserMessage(userMessage);
      this.rl.prompt();
    });

    this.rl.on("close", () => {
      console.log("\n👋 Thanks for chatting! Keep coding and stay curious! 🚀");
      process.exit(0);
    });
  }

  async handleUserMessage(message: string) {
    try {
      console.log(`\n📥 User: ${message}`);

      // Add user message to memory - this is a framework operation
      console.log(
        `🧠 Framework operation: Adding user message to WorkingMemory`
      );
      this.workingMemory = this.workingMemory.withMemory({
        role: ChatMessageRoleEnum.User,
        content: message,
      });
      console.log(
        `📊 Framework state: ${this.workingMemory.memories.length} memories`
      );

      // Framework cognitive steps - only their actual operations are logged
      const [memory1, analysis] = await assessInterest(
        this.workingMemory,
        message
      );

      const thinkingContext = `The student said: "${message}". They're asking about ${
        analysis.topicDetected
      }. 
       Enthusiasm level should be ${analysis.enthusiasmLevel}. 
       ${
         analysis.shouldTellJoke
           ? "This is a good time for a joke!"
           : "Focus on being helpful."
       }
       ${
         analysis.teachingOpportunity ? "Great teaching opportunity here!" : ""
       }`;

      const [memory2, thought] = await teacherThinking(
        memory1,
        thinkingContext
      );

      // Generate a joke if appropriate
      let shouldGenerateJoke = analysis.shouldTellJoke && Math.random() > 0.3;
      if (shouldGenerateJoke) {
        const [memory3, jokeResponse] = await jokeGenerator(
          memory2,
          analysis.topicDetected
        );

        console.log(`😂 Professor Code: ${jokeResponse.joke}`);
        if (jokeResponse.explanation) {
          console.log(`   (${jokeResponse.explanation})`);
        }
        this.workingMemory = memory3;
      }

      // Generate main response
      const responseContext = `Respond to: "${message}". Topic: ${
        analysis.topicDetected
      }. 
       Be ${analysis.enthusiasmLevel} enthusiasm. 
       ${
         analysis.teachingOpportunity
           ? "Great chance to teach something!"
           : "Keep it conversational."
       }`;

      const [finalMemory, response] = await teacherResponse(
        this.workingMemory,
        responseContext
      );

      console.log(`\n🤖 Professor Code: ${response}\n`);
      this.workingMemory = finalMemory;
    } catch (error) {
      console.log(
        `❌ Framework error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.log(`\n🤖 Professor Code: Oops! I had a syntax error in my brain! That's embarrassing for a CS teacher... 
      
Error: ${error instanceof Error ? error.message : "Unknown error"}

Let me try to help you anyway! What's on your mind?\n`);
    }
  }

  async tellJoke() {
    try {
      const topics = [
        "programming",
        "debugging",
        "algorithms",
        "coding",
        "computers",
        "software",
      ];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      const [memory, jokeResponse] = await jokeGenerator(
        this.workingMemory,
        randomTopic
      );

      console.log(
        `😂 Professor Code: Oh, you want a joke? Here's one of my favorites:`
      );
      console.log(`\n   ${jokeResponse.joke}`);

      if (jokeResponse.explanation) {
        console.log(`\n   ${jokeResponse.explanation}`);
      }

      console.log(`\n   ${jokeResponse.followup}\n`);

      this.workingMemory = memory;
    } catch (error) {
      console.log(
        `❌ Framework error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.log(`\n😅 Professor Code: My joke generator threw an exception! How ironic... 
      
Here's a backup: Why do programmers prefer dark mode? Because light attracts bugs! 🐛\n`);
    }
  }

  async handleGoodbye() {
    const [memory1, thought] = await teacherThinking(
      this.workingMemory,
      "The student is leaving. I should give them an encouraging goodbye with maybe a final joke or motivational message."
    );

    const [memory2, goodbye] = await teacherResponse(
      memory1,
      "Give a warm, encouraging goodbye to the student. Include a final bit of humor or inspiration about coding/CS."
    );

    console.log(`\n🤖 Professor Code: ${goodbye}`);
    console.log("\n🎓 Keep calm and code on! 💻✨");

    this.rl.close();
  }
}

// Start the chat
async function main() {
  const chat = new CSTeacherChat();
  await chat.start();
}

if (require.main === module) {
  main().catch(console.error);
}
