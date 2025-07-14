import { WorkingMemory, ChatMessageRoleEnum } from "@opensouls/core";

/**
 * Simple test to verify that OpenSouls is set up correctly
 */
async function testSetup() {
  console.log("🔍 Testing OpenSouls setup...\n");

  // Check if required dependencies are available
  try {
    console.log("✅ @opensouls/core imported successfully");

    // Test WorkingMemory creation
    const workingMemory = new WorkingMemory({
      soulName: "TestSoul",
      memories: [
        {
          role: ChatMessageRoleEnum.System,
          content: "You are a test AI soul.",
        },
      ],
    });

    console.log("✅ WorkingMemory created successfully");
    console.log(`   Soul name: ${workingMemory.soulName}`);
    console.log(`   Initial memories: ${workingMemory.memories.length}`);

    // Check environment variables
    const hasOpenAIKey =
      process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0;

    if (hasOpenAIKey) {
      console.log("✅ OPENAI_API_KEY is set");
    } else {
      console.log("❌ OPENAI_API_KEY is not set");
      console.log("   Please set your OpenAI API key:");
      console.log("   export OPENAI_API_KEY='your-api-key-here'");
    }

    console.log("\n🎉 Setup verification complete!");

    if (hasOpenAIKey) {
      console.log("🚀 You're ready to run the getting started example:");
      console.log("   npm run example");
    } else {
      console.log("⚠️  Set your OpenAI API key first, then run:");
      console.log("   npm run example");
    }
  } catch (error) {
    console.error("❌ Setup test failed:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure you've run: npm run build:all");
    console.log("2. Check that all dependencies are installed: npm install");
    console.log("3. Verify Node.js version is 18 or higher");
  }
}

// Run the test
testSetup();
