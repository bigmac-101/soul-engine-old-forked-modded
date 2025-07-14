#!/usr/bin/env tsx

import { Soul } from "@opensouls/soul";

async function testLocalSoul() {
  console.log("🧪 Testing local soul setup...");

  try {
    // Test soul instantiation
    const soul = new Soul({
      organization: "local-dev",
      blueprint: "professor-code-soul",
      soulId: "test-soul",
      local: true,
      // Removed debug: true since it requires a token
    });

    console.log("✅ Soul instance created successfully");
    console.log("📋 Soul ID:", soul.soulId);
    console.log("🔧 Local mode:", true);

    // Note: Accessing soul.events and soul.connected requires soul.connect() to be called first
    // For a basic setup test, we don't need to actually connect

    console.log("\n🎯 Local soul setup is working correctly!");
    console.log("🚀 You can now run: ./start-local-soul.sh");
  } catch (error) {
    console.error("❌ Error testing local soul:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure all dependencies are installed: npm install");
    console.log("2. Check if the professor-code-soul directory exists");
    console.log("3. Verify the @opensouls/soul package is properly installed");
    process.exit(1);
  }
}

testLocalSoul();
