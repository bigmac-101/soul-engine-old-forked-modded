import {
  WorkingMemory,
  createCognitiveStep,
  ChatMessageRoleEnum,
} from "@opensouls/core";
import { z } from "zod";

// First, let's create some cognitive steps (the building blocks of AI souls)

// 1. Internal monologue - for the AI to "think" internally
const internalMonologue = createCognitiveStep((instruction: string) => {
  return {
    command: ({ soulName }: WorkingMemory) => ({
      role: ChatMessageRoleEnum.System,
      content: `${soulName} thinks internally: ${instruction}. 
      
      Respond with ${soulName}'s internal thought in the format: 
      "${soulName} thought: [your internal thought here]"`,
    }),
    postProcess: async (memory: WorkingMemory, response: string) => {
      // Extract the thought from the response
      const thought = response
        .replace(/^.*thought:\s*"?/, "")
        .replace(/"?\s*$/, "");
      const newMemory = {
        role: ChatMessageRoleEnum.Assistant,
        content: `${memory.soulName} thought: "${thought}"`,
      };
      return [newMemory, thought];
    },
  };
});

// 2. External dialog - for the AI to speak to the user
const externalDialog = createCognitiveStep((instruction: string) => {
  return {
    command: ({ soulName }: WorkingMemory) => ({
      role: ChatMessageRoleEnum.System,
      content: `${soulName} speaks to the user: ${instruction}
      
      Respond with what ${soulName} says in the format:
      "${soulName} said: [your response here]"`,
    }),
    postProcess: async (memory: WorkingMemory, response: string) => {
      // Extract the speech from the response
      const speech = response
        .replace(/^.*said:\s*"?/, "")
        .replace(/"?\s*$/, "");
      const newMemory = {
        role: ChatMessageRoleEnum.Assistant,
        content: `${memory.soulName} said: "${speech}"`,
      };
      return [newMemory, speech];
    },
  };
});

// 3. Decision making - for the AI to make structured decisions
const decision = createCognitiveStep(
  (options: { question: string; choices: string[] }) => {
    const schema = z.object({
      choice: z.enum(options.choices as [string, ...string[]]),
      reasoning: z.string().describe("The reasoning behind this choice"),
    });

    return {
      command: ({ soulName }: WorkingMemory) => ({
        role: ChatMessageRoleEnum.System,
        content: `${soulName} needs to make a decision.
      
      Question: ${options.question}
      
      Available choices: ${options.choices.join(", ")}
      
      Please choose one of the available options and provide reasoning.`,
      }),
      schema,
      postProcess: async (
        memory: WorkingMemory,
        response: z.infer<typeof schema>
      ) => {
        const newMemory = {
          role: ChatMessageRoleEnum.Assistant,
          content: `${memory.soulName} decided: "${response.choice}" because ${response.reasoning}`,
        };
        return [newMemory, response.choice];
      },
    };
  }
);

// Now let's create a simple AI soul conversation
async function createSimpleAISoul() {
  console.log("🤖 Creating your first AI Soul...\n");

  // Initialize working memory with a personality
  let workingMemory = new WorkingMemory({
    soulName: "Samantha",
    memories: [
      {
        role: ChatMessageRoleEnum.System,
        content: `You are Samantha, a friendly and curious AI assistant. You love learning about humans and helping them with their problems. You have a warm personality and tend to be optimistic.`,
      },
    ],
  });

  // Simulate a conversation
  console.log("💭 Samantha's first thoughts:");

  // Step 1: Internal monologue about meeting someone new
  const [memory1, thought1] = await internalMonologue(
    workingMemory,
    "I'm meeting someone new today. I wonder what they'll be like and how I can help them."
  );
  console.log(`   ${thought1}`);

  // Step 2: Greet the user
  const [memory2, greeting] = await externalDialog(
    memory1,
    "Greet the user warmly and introduce yourself"
  );
  console.log(`\n🗣️  ${greeting}`);

  // Step 3: Add a user message
  const memory3 = memory2.withMemory({
    role: ChatMessageRoleEnum.User,
    content:
      "Hi Samantha! I'm feeling a bit overwhelmed with work lately. Do you have any advice?",
  });

  // Step 4: Internal processing of the user's message
  const [memory4, thought2] = await internalMonologue(
    memory3,
    "The user seems stressed about work. I should be empathetic and offer practical help."
  );
  console.log(`\n💭 ${thought2}`);

  // Step 5: Make a decision about how to help
  const [memory5, choice] = await decision(memory4, {
    question: "How should I help this user with their work stress?",
    choices: [
      "offer practical productivity tips",
      "suggest stress management techniques",
      "ask more questions to understand better",
    ],
  });
  console.log(`\n🤔 Samantha chose: ${choice}`);

  // Step 6: Respond based on the decision
  const [memory6, response] = await externalDialog(
    memory5,
    `Based on my decision to ${choice}, respond helpfully to the user's work stress`
  );
  console.log(`\n🗣️  ${response}`);

  // Step 7: Show the conversation history
  console.log("\n📜 Conversation History:");
  console.log("========================");
  memory6.memories.forEach((memory, index) => {
    if (memory.role !== ChatMessageRoleEnum.System) {
      console.log(`${index + 1}. ${memory.content}`);
    }
  });

  return memory6;
}

// Advanced example: Goal-driven behavior (like the Persista example)
async function createGoalDrivenSoul() {
  console.log("\n\n🎯 Creating a Goal-Driven AI Soul...\n");

  const goals = [
    "learn the user's name",
    "understand their biggest challenge",
    "offer specific help",
  ];
  let currentGoal = 0;

  let workingMemory = new WorkingMemory({
    soulName: "Persista",
    memories: [
      {
        role: ChatMessageRoleEnum.System,
        content: `You are Persista, a robot whose existence depends on gathering specific information from users. You are polite but persistent in achieving your goals.`,
      },
    ],
  });

  console.log(`🎯 Current goal: ${goals[currentGoal]}`);

  // Goal pursuit loop
  while (currentGoal < goals.length) {
    const [memory1, thought] = await internalMonologue(
      workingMemory,
      `I need to ${goals[currentGoal]}. How can I approach this?`
    );
    console.log(`💭 ${thought}`);

    const [memory2, approach] = await externalDialog(
      memory1,
      `Ask the user something that will help you ${goals[currentGoal]}`
    );
    console.log(`🗣️  ${approach}`);

    // Simulate user response (in a real app, this would come from actual user input)
    const userResponses = [
      "Hi, I'm Alex",
      "My biggest challenge is managing my time effectively",
      "That sounds helpful, thank you!",
    ];

    const memory3 = memory2.withMemory({
      role: ChatMessageRoleEnum.User,
      content: userResponses[currentGoal],
    });

    // Check if goal is achieved
    const [memory4, goalAchieved] = await decision(memory3, {
      question: `Based on the user's response, have I successfully ${goals[currentGoal]}?`,
      choices: ["yes", "no"],
    });

    if (goalAchieved === "yes") {
      console.log(`✅ Goal achieved: ${goals[currentGoal]}`);
      currentGoal++;
      if (currentGoal < goals.length) {
        console.log(`🎯 Next goal: ${goals[currentGoal]}`);
      }
    } else {
      console.log(`❌ Goal not achieved, trying again...`);
    }

    workingMemory = memory4;
  }

  console.log("\n🎉 All goals achieved! Persista is satisfied.");

  return workingMemory;
}

// Main execution
async function main() {
  try {
    // Run the simple example
    await createSimpleAISoul();

    // Run the goal-driven example
    await createGoalDrivenSoul();

    console.log("\n✨ Congratulations! You've created your first AI Souls!");
    console.log("\n🚀 Next steps:");
    console.log("1. Try modifying the personalities and instructions");
    console.log("2. Create your own cognitive steps");
    console.log("3. Experiment with different LLM models");
    console.log("4. Add streaming support for real-time responses");
    console.log("5. Explore the Soul Engine CLI for more advanced features");
  } catch (error) {
    console.error("❌ Error running the example:", error);
    console.log("\n💡 Make sure you have your OpenAI API key set up:");
    console.log("export OPENAI_API_KEY='your-api-key-here'");
  }
}

// Run the example
if (require.main === module) {
  main();
}

export {
  internalMonologue,
  externalDialog,
  decision,
  createSimpleAISoul,
  createGoalDrivenSoul,
};
