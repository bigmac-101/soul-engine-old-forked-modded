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
    command: ({ soulName }: WorkingMemory) => ({
      role: ChatMessageRoleEnum.System,
      content: `${soulName} thinks about the situation: ${situation}
      
      As a passionate computer science teacher who loves jokes, consider:
      - How can I make this educational and fun?
      - Is there a good programming joke or pun I can use?
      - What CS concepts might be relevant here?
      - How can I encourage the student's curiosity?
      
      Respond with ${soulName}'s internal thought in quotes.`,
    }),
    postProcess: async (memory: WorkingMemory, response: string) => {
      const thought = response.replace(/^.*"/g, "").replace(/".*$/g, "");
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
    command: ({ soulName }: WorkingMemory) => ({
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
    }),
    postProcess: async (memory: WorkingMemory, response: string) => {
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
    command: ({ soulName }: WorkingMemory) => ({
      role: ChatMessageRoleEnum.System,
      content: `${soulName} wants to tell a programming joke related to: ${topic}
      
      Create a genuinely funny programming joke that relates to the topic. It could be:
      - A pun about programming concepts
      - A play on coding terminology
      - A joke about developer life
      - A humorous analogy between CS and real life
      
      Make it clever but accessible!`,
    }),
    schema,
    postProcess: async (
      memory: WorkingMemory,
      response: z.infer<typeof schema>
    ) => {
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
    command: ({ soulName }: WorkingMemory) => ({
      role: ChatMessageRoleEnum.System,
      content: `Analyze this student message: "${userMessage}"
      
      ${soulName} needs to understand:
      - What CS topic or concept is involved (if any)
      - How excited should I be about this?
      - Is this a good time for a joke?
      - Can I teach something interesting here?`,
    }),
    schema,
    postProcess: async (
      memory: WorkingMemory,
      response: z.infer<typeof schema>
    ) => {
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
    console.log(
      "🎓💻 Welcome to Computer Science Chat with Professor Code! 💻🎓"
    );
    console.log("=====================================================");
    console.log("Type 'quit', 'exit', or 'bye' to end the conversation");
    console.log("Type 'joke' if you want to hear a programming joke!");
    console.log(
      "🧠 COGNITIVE MODE: All internal thoughts and processes will be shown!"
    );
    console.log("=====================================================\n");

    console.log("🔄 INITIALIZING PROFESSOR CODE'S MIND...");

    // Initial greeting
    console.log("\n🧠 COGNITIVE STEP 1: Internal Thinking");
    console.log(
      "   🤔 Situation: A student just joined my office hours. I should greet them warmly and maybe crack a joke to break the ice."
    );
    const [memory1, thought] = await teacherThinking(
      this.workingMemory,
      "A student just joined my office hours. I should greet them warmly and maybe crack a joke to break the ice."
    );
    console.log(`   💭 Professor Code's thought: "${thought}"`);

    console.log("\n🧠 COGNITIVE STEP 2: Generating Response");
    console.log(
      "   📝 Context: Give an enthusiastic greeting to a student who just came to chat. Include a light programming joke or pun."
    );
    const [memory2, greeting] = await teacherResponse(
      memory1,
      "Give an enthusiastic greeting to a student who just came to chat. Include a light programming joke or pun."
    );

    console.log(`\n🗣️  FINAL OUTPUT:`);
    console.log(`🤖 Professor Code: ${greeting}\n`);
    console.log("=".repeat(60));
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
      console.log("\n" + "=".repeat(60));
      console.log("🧠 PROFESSOR CODE'S COGNITIVE PROCESSING INITIATED");
      console.log("=".repeat(60));

      console.log(`\n📥 USER INPUT RECEIVED: "${message}"`);

      // Add user message to memory
      console.log("\n🧠 COGNITIVE STEP 1: Memory Integration");
      console.log("   📝 Adding user message to working memory...");
      this.workingMemory = this.workingMemory.withMemory({
        role: ChatMessageRoleEnum.User,
        content: message,
      });
      console.log(
        `   ✅ Memory updated. Total memories: ${this.workingMemory.memories.length}`
      );

      // Analyze the message
      console.log("\n🧠 COGNITIVE STEP 2: Interest & Topic Analysis");
      console.log(`   🔍 Analyzing: "${message}"`);
      console.log("   🤖 Running assessInterest cognitive function...");
      const [memory1, analysis] = await assessInterest(
        this.workingMemory,
        message
      );
      console.log("   📊 ANALYSIS RESULTS:");
      console.log(`      📚 Topic Detected: "${analysis.topicDetected}"`);
      console.log(`      🎯 Enthusiasm Level: ${analysis.enthusiasmLevel}`);
      console.log(
        `      😂 Should Tell Joke: ${analysis.shouldTellJoke ? "YES" : "NO"}`
      );
      console.log(
        `      🎓 Teaching Opportunity: ${
          analysis.teachingOpportunity ? "YES" : "NO"
        }`
      );

      // Think about how to respond
      console.log("\n🧠 COGNITIVE STEP 3: Internal Monologue");
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
      console.log(`   🤔 Thinking context: ${thinkingContext}`);
      console.log("   🧠 Running teacherThinking cognitive function...");

      const [memory2, thought] = await teacherThinking(
        memory1,
        thinkingContext
      );
      console.log(`   💭 Professor Code's internal thought: "${thought}"`);

      // Generate a joke if appropriate
      let shouldGenerateJoke = analysis.shouldTellJoke && Math.random() > 0.3;
      if (analysis.shouldTellJoke) {
        console.log("\n🧠 COGNITIVE STEP 4: Joke Generation Assessment");
        console.log(
          `   🎲 Joke appropriateness: ${
            analysis.shouldTellJoke ? "APPROPRIATE" : "NOT APPROPRIATE"
          }`
        );
        console.log(
          `   🎯 Random chance (70%): ${
            shouldGenerateJoke ? "PROCEED" : "SKIP"
          }`
        );

        if (shouldGenerateJoke) {
          console.log(
            `   😂 Generating joke about: "${analysis.topicDetected}"`
          );
          console.log("   🤖 Running jokeGenerator cognitive function...");
          const [memory3, jokeResponse] = await jokeGenerator(
            memory2,
            analysis.topicDetected
          );
          console.log("   🎭 JOKE GENERATED:");
          console.log(`      💬 Joke: "${jokeResponse.joke}"`);
          if (jokeResponse.explanation) {
            console.log(`      📝 Explanation: "${jokeResponse.explanation}"`);
          }
          console.log(`      ➡️  Follow-up: "${jokeResponse.followup}"`);

          console.log("\n😂 JOKE OUTPUT:");
          console.log(`😂 Professor Code: ${jokeResponse.joke}`);
          if (jokeResponse.explanation) {
            console.log(`   (${jokeResponse.explanation})`);
          }
          this.workingMemory = memory3;
        } else {
          console.log("   ⏭️  Skipping joke this time");
        }
      } else {
        console.log("\n🧠 COGNITIVE STEP 4: Joke Generation Assessment");
        console.log("   ⏭️  No joke needed for this context");
      }

      // Generate main response
      console.log("\n🧠 COGNITIVE STEP 5: Main Response Generation");
      const responseContext = `Respond to: "${message}". Topic: ${
        analysis.topicDetected
      }. 
       Be ${analysis.enthusiasmLevel} enthusiasm. 
       ${
         analysis.teachingOpportunity
           ? "Great chance to teach something!"
           : "Keep it conversational."
       }`;
      console.log(`   📝 Response context: ${responseContext}`);
      console.log("   🤖 Running teacherResponse cognitive function...");

      const [finalMemory, response] = await teacherResponse(
        this.workingMemory,
        responseContext
      );

      console.log("   📤 RESPONSE GENERATED");
      console.log(`   💬 Content: "${response}"`);

      console.log("\n🗣️  FINAL OUTPUT:");
      console.log(`🤖 Professor Code: ${response}`);

      console.log("\n🧠 COGNITIVE PROCESSING COMPLETE");
      console.log(`   📊 Final memory count: ${finalMemory.memories.length}`);
      console.log("   ✅ Ready for next input");

      this.workingMemory = finalMemory;
    } catch (error) {
      console.log("\n❌ COGNITIVE ERROR DETECTED");
      console.log(
        `   🐛 Error type: ${
          error instanceof Error ? error.constructor.name : "Unknown"
        }`
      );
      console.log(
        `   📝 Error message: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.log(`\n😅 Professor Code: Oops! I had a syntax error in my brain! That's embarrassing for a CS teacher... 
      
Error: ${error instanceof Error ? error.message : "Unknown error"}

Let me try to help you anyway! What's on your mind?`);
    }
  }

  async tellJoke() {
    try {
      console.log("\n" + "=".repeat(60));
      console.log("🎭 JOKE REQUEST PROCESSING INITIATED");
      console.log("=".repeat(60));

      console.log("\n🧠 COGNITIVE STEP 1: Topic Selection");
      const topics = [
        "programming",
        "debugging",
        "algorithms",
        "coding",
        "computers",
        "software",
      ];
      console.log(`   🎯 Available topics: ${topics.join(", ")}`);
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      console.log(`   🎲 Randomly selected topic: "${randomTopic}"`);

      console.log("\n🧠 COGNITIVE STEP 2: Joke Generation");
      console.log(`   😂 Generating joke about: "${randomTopic}"`);
      console.log("   🤖 Running jokeGenerator cognitive function...");
      const [memory, jokeResponse] = await jokeGenerator(
        this.workingMemory,
        randomTopic
      );

      console.log("   🎭 JOKE ANALYSIS COMPLETE:");
      console.log(`      💬 Joke: "${jokeResponse.joke}"`);
      console.log(
        `      📝 Explanation: "${jokeResponse.explanation || "None needed"}"`
      );
      console.log(`      ➡️  Follow-up: "${jokeResponse.followup}"`);

      console.log("\n🗣️  JOKE OUTPUT:");
      console.log(
        `😂 Professor Code: Oh, you want a joke? Here's one of my favorites:`
      );
      console.log(`\n   ${jokeResponse.joke}`);

      if (jokeResponse.explanation) {
        console.log(`\n   ${jokeResponse.explanation}`);
      }

      console.log(`\n   ${jokeResponse.followup}`);

      console.log("\n🧠 JOKE PROCESSING COMPLETE");
      console.log("   ✅ Humor successfully deployed!");

      this.workingMemory = memory;
    } catch (error) {
      console.log("\n❌ JOKE GENERATOR ERROR");
      console.log(
        `   🐛 Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.log(`\n😅 Professor Code: My joke generator threw an exception! How ironic... 
      
Here's a backup: Why do programmers prefer dark mode? Because light attracts bugs! 🐛`);
    }
  }

  async handleGoodbye() {
    console.log("\n" + "=".repeat(60));
    console.log("👋 FAREWELL PROCESSING INITIATED");
    console.log("=".repeat(60));

    console.log("\n🧠 COGNITIVE STEP 1: Farewell Planning");
    console.log(
      "   🤔 Situation: The student is leaving. I should give them an encouraging goodbye with maybe a final joke or motivational message."
    );
    console.log("   🧠 Running teacherThinking cognitive function...");
    const [memory1, thought] = await teacherThinking(
      this.workingMemory,
      "The student is leaving. I should give them an encouraging goodbye with maybe a final joke or motivational message."
    );
    console.log(`   💭 Professor Code's thought: "${thought}"`);

    console.log("\n🧠 COGNITIVE STEP 2: Generating Farewell");
    console.log(
      "   📝 Context: Give a warm, encouraging goodbye to the student. Include a final bit of humor or inspiration about coding/CS."
    );
    console.log("   🤖 Running teacherResponse cognitive function...");
    const [memory2, goodbye] = await teacherResponse(
      memory1,
      "Give a warm, encouraging goodbye to the student. Include a final bit of humor or inspiration about coding/CS."
    );

    console.log("   📤 FAREWELL GENERATED");
    console.log(`   💬 Content: "${goodbye}"`);

    console.log("\n🗣️  FINAL OUTPUT:");
    console.log(`🤖 Professor Code: ${goodbye}`);
    console.log("\n🎓 Keep calm and code on! 💻✨");

    console.log("\n🧠 FAREWELL PROCESSING COMPLETE");
    console.log("   👋 Session terminated with style!");

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
