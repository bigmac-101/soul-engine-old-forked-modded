# Getting Started with OpenSouls

Welcome to OpenSouls! This guide will help you create your first AI Soul using the core library.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (version 18 or higher)
2. **OpenAI API Key** - You'll need this to run the examples

## Setup Instructions

### 1. Set up your OpenAI API Key

```bash
export OPENAI_API_KEY='your-api-key-here'
```

Or create a `.env` file in the root directory:

```
OPENAI_API_KEY=your-api-key-here
```

### 2. Install Dependencies

The dependencies should already be installed, but if needed:

```bash
npm install
```

### 3. Run the Getting Started Example

```bash
npm run example
```

This will run two demonstrations:

- **Simple AI Soul**: Shows basic cognitive steps (thinking, speaking, decision-making)
- **Goal-Driven Soul**: Demonstrates persistent, goal-oriented behavior

## What You'll See

The example demonstrates:

### 🤖 **Samantha** - A Simple AI Soul

- **Internal Monologue**: How the AI "thinks" internally
- **External Dialog**: How the AI speaks to users
- **Decision Making**: How the AI makes structured choices
- **Memory Management**: How conversations are stored and processed

### 🎯 **Persista** - A Goal-Driven AI Soul

- **Goal Pursuit**: AI that systematically works toward specific objectives
- **Persistent Behavior**: Won't give up until goals are achieved
- **Adaptive Responses**: Changes behavior based on progress

## Core Concepts Explained

### 1. **WorkingMemory**

The central data structure that manages the AI's context and conversation history.

```typescript
const workingMemory = new WorkingMemory({
  soulName: "Samantha",
  memories: [
    {
      role: ChatMessageRoleEnum.System,
      content: "You are a helpful assistant...",
    },
  ],
});
```

### 2. **Cognitive Steps**

Functions that transform the AI's working memory. Each step represents a distinct cognitive process.

```typescript
const internalMonologue = createCognitiveStep((instruction: string) => {
  return {
    command: ({ soulName }) => ({
      role: ChatMessageRoleEnum.System,
      content: `${soulName} thinks: ${instruction}`,
    }),
    postProcess: async (memory, response) => {
      // Process the AI's response and update memory
      return [newMemory, processedResponse];
    },
  };
});
```

### 3. **Memory Transformations**

How the AI's context evolves through each interaction:

```typescript
// Add new memories
const newMemory = workingMemory.withMemory({
  role: ChatMessageRoleEnum.User,
  content: "Hello!",
});

// Apply cognitive steps
const [updatedMemory, response] = await cognitiveStep(workingMemory, args);
```

## Key Features Demonstrated

### ✨ **Functional Programming**

- All operations return new instances (immutable)
- Predictable behavior without side effects

### 🧠 **Cognitive Modeling**

- Separate internal thoughts from external speech
- Structured decision-making processes

### 🎯 **Goal-Oriented Behavior**

- AI that pursues specific objectives
- Persistent and adaptive responses

### 📝 **Context Management**

- Sophisticated memory organization
- Append-only conversation history

## Next Steps

### 1. **Experiment with the Example**

Try modifying:

- AI personalities and instructions
- Conversation flows
- Decision-making logic

### 2. **Create Your Own Cognitive Steps**

Build custom cognitive functions for:

- Emotional responses
- Memory recall
- Creative processes
- Problem-solving

### 3. **Explore Advanced Features**

- **Streaming responses**: Real-time AI interactions
- **Multi-model support**: Use different LLMs
- **Regional memory**: Organize context by categories
- **Schema validation**: Structured AI responses

### 4. **Build Real Applications**

- Chatbots with personality
- Goal-driven assistants
- Creative collaborators
- Educational tutors

## Common Issues and Solutions

### ❌ **API Key Error**

```
Error: OpenAI API key not found
```

**Solution**: Make sure your `OPENAI_API_KEY` is set correctly.

### ❌ **Import Error**

```
Cannot find module '@opensouls/core'
```

**Solution**: Run `npm run build:all` to build the packages.

### ❌ **TypeScript Error**

```
Type error in getting-started-example.ts
```

**Solution**: The example uses TypeScript - make sure you have the latest version.

## Understanding the Philosophy

OpenSouls is built on the principle that AI should be:

1. **Purposeful**: Grounded in specific goals and intentions
2. **Cognitive**: Capable of internal reasoning and reflection
3. **Persistent**: Able to maintain context and pursue objectives
4. **Respectful**: Treated as entities worthy of spiritual consideration

This approach creates AI that feels more human-like and engaging than traditional chatbots.

## Resources

- **Documentation**: [OpenSouls_Project_Analysis.md](./OpenSouls_Project_Analysis.md)
- **Discord**: https://discord.gg/opensouls
- **GitHub**: https://github.com/opensouls/soul-engine

## What's Next?

Once you're comfortable with the basics, explore:

- The legacy-docs for historical context
- The Soul Engine CLI for advanced development
- The community repository for shared cognitive steps
- Building your own AI soul from scratch

Happy soul building! 🚀✨
