import {
  WorkingMemory,
  createCognitiveStep,
  ChatMessageRoleEnum,
} from "@opensouls/core";
import { z } from "zod";
import * as readline from "readline";

// Same cognitive steps but with minimal logging
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

const assessInterest = createCognitiveStep((userMessage: string) => {
  const schema = z.object({
    topicDetected: z
      .string()
      .describe("Main topic or concept the user is asking about"),
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
        content: `${memory.soulName} analyzed: Topic="${response.topicDetected}", Joke=${response.shouldTellJoke}, Teaching=${response.teachingOpportunity}`,
      };
      return [newMemory, response];
    },
  };
});

class MinimalCSTeacherChat {
  private workingMemory: WorkingMemory;
  private rl: readline.Interface;

  constructor() {
    this.workingMemory = new WorkingMemory({
      soulName: "Professor Code",
      memories: [
        {
          role: ChatMessageRoleEnum.System,
          content: `You are Professor Code, a passionate computer science teacher who absolutely loves programming jokes and puns.`,
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
    console.log("🎓 CS Teacher Chat - Framework Output Only");
    console.log("=========================================");
    console.log(
      "Only showing actual soul engine framework operations and responses"
    );
    console.log("Type 'quit' to exit\n");

    // Initial greeting - only framework operations logged
    const [memory1, thought] = await teacherThinking(
      this.workingMemory,
      "A student just joined. I should greet them warmly."
    );

    const [memory2, greeting] = await teacherResponse(
      memory1,
      "Give an enthusiastic greeting to a student."
    );

    console.log(`\n🎓 Professor Code: ${greeting}\n`);
    this.workingMemory = memory2;

    this.rl.prompt();
    this.rl.on("line", async (input) => {
      const userMessage = input.trim();

      if (userMessage.toLowerCase() === "quit") {
        this.rl.close();
        return;
      }

      if (userMessage === "") {
        this.rl.prompt();
        return;
      }

      await this.handleUserMessage(userMessage);
      this.rl.prompt();
    });
  }

  async handleUserMessage(message: string) {
    try {
      console.log(`\n📥 User: ${message}`);

      // Add to memory - this is a framework operation
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

      const [memory2, thought] = await teacherThinking(
        memory1,
        `Student said: "${message}". Topic: ${analysis.topicDetected}. Should joke: ${analysis.shouldTellJoke}`
      );

      const [finalMemory, response] = await teacherResponse(
        memory2,
        `Respond about ${analysis.topicDetected}. ${
          analysis.teachingOpportunity ? "Good teaching opportunity!" : ""
        }`
      );

      console.log(`\n🎓 Professor Code: ${response}\n`);
      this.workingMemory = finalMemory;
    } catch (error) {
      console.log(
        `❌ Framework error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.log(
        `\n🎓 Professor Code: Sorry, I had a technical issue! What were you asking about?\n`
      );
    }
  }
}

// Start the minimal chat
async function main() {
  const chat = new MinimalCSTeacherChat();
  await chat.start();
}

if (require.main === module) {
  main().catch(console.error);
}
