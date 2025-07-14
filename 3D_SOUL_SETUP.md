# 3D Soul Visualization - Local Setup

## Overview

This is a Three.js-based 3D visualization of Professor Code's soul that runs entirely locally using a standalone soul server. No hosted API keys or external services required!

**Features:**

- Real-time cognitive process visualization
- Floating text geometry for different message types
- Shader-based soul energy visualization
- Voice synthesis integration (Web Speech API)
- Complete cognitive transparency showing all internal processes
- **100% Local** - No external API dependencies

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A modern browser with WebGL support

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Local Soul System

```bash
./start-local-soul.sh
```

This script will:

- Start the local soul engine development server
- Launch the 3D visualization
- Open your browser to `http://localhost:3000`

### 3. Interact with Professor Code

- Type messages in the floating input at the bottom
- Watch the 3D visualization respond to conversation
- Enable voice synthesis for spoken responses
- Observe all cognitive processes in real-time

## Manual Setup (Alternative)

If you prefer to run components separately:

### 1. Start the Standalone Soul Server

```bash
npm install --no-save ws express cors
node local-soul-server.js
```

### 2. Start the 3D Visualization (in another terminal)

```bash
npm run soul-3d:dev
```

### 3. Open Browser

Navigate to `http://localhost:3000`

## Project Structure

```
soul-engine-old-forked-modded/
├── src/main.ts                    # 3D visualization application
├── index.html                     # Main HTML interface
├── local-soul-server.js           # Standalone soul server
├── package-local-soul.json        # Soul server dependencies
├── professor-code-soul/           # Legacy soul blueprint (reference)
│   ├── soul/
│   │   ├── ProfessorCode.md      # Soul personality definition
│   │   ├── initialProcess.ts     # Main process orchestration
│   │   └── cognitiveSteps/       # Individual cognitive steps
│   │       ├── externalDialog.ts # Response generation
│   │       └── internalMonologue.ts # Internal thinking
│   └── package.json              # Soul dependencies
├── start-local-soul.sh           # Startup script
└── 3D_SOUL_SETUP.md              # This documentation
```

## Usage

### Interface Elements

- **Floating Text Input**: Bottom center - enter your messages here
- **Cognitive Log**: Top left - shows all internal processes in real-time
- **Soul Status**: Top right - displays memory count, processing status, voice status
- **Voice Controls**: Bottom right - enable/disable voice synthesis

### Text Colors & Meanings

- **🔴 Red (Thinking)**: Internal monologue and thought processes
- **🟡 Yellow (Assessment)**: Interest analysis and topic detection
- **🟣 Purple (Joke)**: Joke generation and humor processes
- **🟢 Green (Response)**: Final response generation
- **🔵 Cyan (Memory)**: Memory operations and storage
- **🟢 Bright Green (User)**: Your input messages
- **🟠 Orange (Error)**: Error states and debugging
- **⚪ White (Log)**: System logs and events

### 3D Visualization

- **Central Sphere**: Professor Code's soul core with pulsating energy
- **Particle System**: Represents cognitive activity and processing
- **Energy Field**: Torus showing overall soul energy
- **Floating Text**: Real-time display of all cognitive processes

## Features

### Local Soul Architecture

The system uses a local soul blueprint with:

1. **Personality Definition** (`ProfessorCode.md`) - Character traits and goals
2. **Initial Process** (`initialProcess.ts`) - Main conversation flow
3. **Cognitive Steps** - Individual thinking processes:
   - `internalMonologue.ts` - Internal reflection
   - `externalDialog.ts` - Response generation

### Complete Transparency

Unlike traditional chatbots, you see everything:

- Real-time cognitive processing
- Internal thought processes
- Memory operations
- Response generation steps
- System logs and events

### 3D Visualization Features

- **Shader Effects**: Dynamic soul core with wave animations
- **Particle System**: Custom colors and movement patterns
- **Energy Field**: Rotating torus visualization
- **Text Geometry**: Floating 3D text for all processes
- **Responsive Design**: Adapts to different screen sizes

### Voice Integration

- Uses Web Speech API for text-to-speech
- Real-time voice status updates
- Stop/start voice controls
- Configurable voice parameters

## Technical Architecture

### Standalone Soul Server

- Runs on `ws://localhost:4000/` and `http://localhost:4000/`
- Built with Node.js WebSocket server and Express
- Direct WebSocket communication with frontend
- Complete cognitive processing with internal monologue
- No external API dependencies or authentication required

### 3D Visualization

- Three.js for 3D graphics
- Vite for development server
- WebGL shaders for effects
- Real-time text geometry generation

### Soul Cognitive Steps

1. **Internal Monologue** - Reflection and planning
2. **External Dialog** - Response generation with personality
3. **Process Orchestration** - Coordinating thinking steps

## Troubleshooting

### Common Issues

**Soul Server Won't Start:**

- Check if port 4000 is available
- Ensure dependencies are installed: `npm install --no-save ws express cors`
- Check `soul-engine.log` for errors
- Verify `local-soul-server.js` exists and is executable

**3D Visualization Issues:**

- Ensure WebGL is supported in your browser
- Check browser console for errors
- Try refreshing the page

**Connection Issues:**

- Verify soul engine is running on port 4000
- Check network connectivity
- Restart both components

### Performance Tips

- Use Chrome or Firefox for best WebGL performance
- Close resource-intensive applications
- Reduce browser zoom if experiencing lag

## Development

### Modifying the Soul

1. Edit files in `professor-code-soul/soul/`
2. The soul engine will hot-reload changes
3. Refresh the browser to see updates

### Customizing the 3D Visualization

1. Edit `src/main.ts` for core functionality
2. Modify shaders for visual effects
3. Update `index.html` for UI changes

### Adding New Cognitive Steps

1. Create new `.ts` files in `professor-code-soul/soul/cognitiveSteps/`
2. Import and use in `initialProcess.ts`
3. Add corresponding visualization in `main.ts`

## Advantages of Local Setup

✅ **No API Keys Required** - Everything runs locally
✅ **Complete Privacy** - No data sent to external servers
✅ **Full Control** - Modify and extend as needed
✅ **Fast Development** - Hot reload for rapid iteration
✅ **No Rate Limits** - Process as many messages as you want
✅ **Offline Capable** - Works without internet (after initial setup)

## What's Different from Hosted Version

- **No external service dependencies** - Uses standalone local soul server
- **Simplified cognitive architecture** - Focus on core teaching functions
- **Direct WebSocket communication** - No complex API layer
- **Real-time transparency** - All processes visible immediately
- **Customizable personality** - Easy to modify Professor Code's traits
- **No authentication required** - Complete local control

This setup demonstrates a completely self-contained AI soul with genuine cognitive modeling, complete transparency, and local control!
