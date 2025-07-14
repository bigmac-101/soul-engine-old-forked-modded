import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

// ==================== TYPES & INTERFACES ====================

interface TextMesh {
  mesh: THREE.Mesh;
  timestamp: number;
  type: string;
  lifespan: number;
}

interface SoulVisualization {
  core: THREE.Mesh;
  energy: THREE.Mesh;
}

// ==================== GLOBAL VARIABLES ====================

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let font: any;
let textMeshes: TextMesh[] = [];
let soulVisualization: SoulVisualization;
let isVoiceEnabled = false;
let currentAudio: HTMLAudioElement | null = null;

// UI Elements
let logContent: HTMLElement;
let memoryCount: HTMLElement;
let processingStatus: HTMLElement;
let voiceStatus: HTMLElement;
let userInput: HTMLInputElement;

// ==================== SHADER MATERIALS ====================

const soulCoreVertexShader = `
    uniform float time;
    uniform float intensity;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
        vPosition = position;
        vNormal = normal;
        
        vec3 pos = position;
        float wave = sin(pos.x * 4.0 + time * 2.0) * 0.1 * intensity;
        pos.y += wave;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const soulCoreFragmentShader = `
    uniform float time;
    uniform float intensity;
    uniform vec3 color;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
        float pulse = sin(time * 3.0) * 0.5 + 0.5;
        vec3 col = color * (0.5 + 0.5 * pulse) * intensity;
        
        // Add some glow effect
        float glow = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        col += vec3(0.2, 0.4, 1.0) * glow * 0.5;
        
        gl_FragColor = vec4(col, 0.8);
    }
`;

// Removed particle shaders - focusing on soul visualization only

// ==================== THREE.JS SETUP ====================

function initThreeJS() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const container = document.getElementById("canvas-container");
  container?.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Point lights for atmosphere
  const pointLight1 = new THREE.PointLight(0x00ff88, 0.8, 20);
  pointLight1.position.set(-5, 0, 0);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xff6b6b, 0.6, 15);
  pointLight2.position.set(5, 0, 0);
  scene.add(pointLight2);

  // Window resize handling
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==================== SOUL VISUALIZATION ====================

function createSoulVisualization() {
  // Core soul sphere
  const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
  const coreMaterial = new THREE.ShaderMaterial({
    vertexShader: soulCoreVertexShader,
    fragmentShader: soulCoreFragmentShader,
    uniforms: {
      time: { value: 0 },
      intensity: { value: 0.5 },
      color: { value: new THREE.Color(0x00ff88) },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(core);

  // Removed particle system - focusing on soul visualization only

  // Energy field
  const energyGeometry = new THREE.TorusGeometry(4, 0.2, 16, 100);
  const energyMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.3,
    wireframe: true,
  });
  const energy = new THREE.Mesh(energyGeometry, energyMaterial);
  scene.add(energy);

  soulVisualization = { core, energy };
}

// ==================== TEXT GEOMETRY SYSTEM ====================

function createTextGeometry(
  text: string,
  color: number,
  position: THREE.Vector3,
  size: number = 0.3
) {
  if (!font) return;

  const textGeometry = new TextGeometry(text, {
    font: font,
    size: size,
    height: 0.02,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 5,
  });

  textGeometry.computeBoundingBox();
  const centerOffsetX =
    -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x);
  const centerOffsetY =
    -0.5 * (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y);

  textGeometry.translate(centerOffsetX, centerOffsetY, 0);

  const textMaterial = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.9,
  });

  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.copy(position);
  textMesh.lookAt(camera.position);

  scene.add(textMesh);

  return textMesh;
}

function addFloatingText(text: string, type: string, lifespan: number = 8000) {
  const colors = {
    thinking: 0xff6b6b, // Red
    assessment: 0xffc107, // Yellow
    joke: 0x9c27b0, // Purple
    response: 0x4caf50, // Green
    memory: 0x00bcd4, // Cyan
    user: 0x00ff88, // Bright green
    error: 0xff5722, // Orange
    log: 0xffffff, // White
  };

  const positions = {
    thinking: new THREE.Vector3(-3, 2, 0),
    assessment: new THREE.Vector3(3, 1, 0),
    joke: new THREE.Vector3(-2, -1, 0),
    response: new THREE.Vector3(0, -3, 0),
    memory: new THREE.Vector3(4, 0, 0),
    user: new THREE.Vector3(0, 4, 0),
    error: new THREE.Vector3(0, 0, 0),
    log: new THREE.Vector3(-4, -2, 0),
  };

  const color = colors[type as keyof typeof colors] || 0xffffff;
  const basePosition =
    positions[type as keyof typeof positions] || new THREE.Vector3(0, 0, 0);

  // Add some randomness to position
  const position = basePosition.clone();
  position.x += (Math.random() - 0.5) * 2;
  position.y += (Math.random() - 0.5) * 2;
  position.z += (Math.random() - 0.5) * 1;

  const mesh = createTextGeometry(text, color, position);
  if (mesh) {
    textMeshes.push({
      mesh,
      timestamp: Date.now(),
      type,
      lifespan,
    });
  }
}

function updateTextMeshes() {
  const now = Date.now();

  textMeshes.forEach((textMesh, index) => {
    const age = now - textMesh.timestamp;
    const alpha = Math.max(0, 1 - age / textMesh.lifespan);

    if (alpha <= 0) {
      scene.remove(textMesh.mesh);
      textMeshes.splice(index, 1);
    } else {
      // Update material opacity
      if (textMesh.mesh.material instanceof THREE.MeshPhongMaterial) {
        textMesh.mesh.material.opacity = alpha;
      }

      // Animate position
      textMesh.mesh.position.y += 0.01;
      textMesh.mesh.lookAt(camera.position);
    }
  });
}

// ==================== VOICE INTEGRATION ====================

async function speakText(text: string) {
  if (!isVoiceEnabled) return;

  try {
    // Stop any current audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    updateVoiceStatus("Generating...");

    // Use Web Speech API for now
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    utterance.onstart = () => updateVoiceStatus("Speaking");
    utterance.onend = () => updateVoiceStatus("Ready");
    utterance.onerror = () => updateVoiceStatus("Error");

    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Voice synthesis error:", error);
    updateVoiceStatus("Error");
  }
}

function updateVoiceStatus(status: string) {
  if (voiceStatus) {
    voiceStatus.textContent = status;
  }
}

// ==================== LOGGING SYSTEM ====================

function addLogEntry(message: string, type: string) {
  if (!logContent) return;

  const entry = document.createElement("div");
  entry.className = `log-entry log-${type}`;
  entry.innerHTML = `<strong>[${type.toUpperCase()}]</strong> ${message}`;

  logContent.appendChild(entry);
  logContent.scrollTop = logContent.scrollHeight;

  // Add floating text for the log entry
  addFloatingText(message.slice(0, 50) + "...", type, 5000);

  // Keep only last 50 entries
  while (logContent.children.length > 50) {
    logContent.removeChild(logContent.firstChild!);
  }
}

function updateProcessingStatus(status: string) {
  if (processingStatus) {
    processingStatus.textContent = status;
  }
}

function updateMemoryCount(count: number) {
  if (memoryCount) {
    memoryCount.textContent = count.toString();
  }
}

// ==================== SOUL SETUP ====================

function setupSoul() {
  // Create direct WebSocket connection to local soul server
  const ws = new WebSocket("ws://localhost:4000");

  ws.onopen = () => {
    addLogEntry("Connected to Professor Code's Local Soul Engine", "log");
    updateProcessingStatus("Connected");
    console.log("✅ Connected to local soul server");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📨 Received from soul:", data);

      switch (data.type) {
        case "connection":
          addLogEntry(`Soul Engine: ${data.data.message}`, "log");
          break;

        case "internal_monologue":
          addLogEntry(`🧠 Thinking: ${data.data.thought}`, "thought");
          addFloatingText(data.data.thought, "thought", 6000);
          break;

        case "response":
          addLogEntry(`🎓 Professor Code: ${data.data.message}`, "response");
          addFloatingText(data.data.message, "response", 10000);

          if (isVoiceEnabled) {
            speakText(data.data.message);
          }
          break;

        case "error":
          addLogEntry(`❌ Error: ${data.data.message}`, "error");
          break;
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      addLogEntry(`Parse error: ${error.message}`, "error");
    }
  };

  ws.onclose = () => {
    addLogEntry("Disconnected from soul engine", "error");
    updateProcessingStatus("Disconnected");
    console.log("🔌 Disconnected from local soul server");
  };

  ws.onerror = (error) => {
    addLogEntry(`WebSocket error: ${error}`, "error");
    updateProcessingStatus("Connection Error");
    console.error("❌ WebSocket error:", error);
  };

  // Store the WebSocket globally for sending messages
  (globalThis as any).soulWebSocket = ws;
}

// ==================== ANIMATION LOOP ====================

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;

  // Update soul visualization
  if (soulVisualization) {
    // Update shader uniforms
    if (soulVisualization.core.material instanceof THREE.ShaderMaterial) {
      soulVisualization.core.material.uniforms.time.value = time;
    }

    // Removed particle animation - focusing on soul visualization only

    // Rotate energy field
    soulVisualization.energy.rotation.z += 0.005;
    soulVisualization.energy.rotation.x += 0.002;

    // Pulsate core
    soulVisualization.core.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
  }

  // Update text meshes
  updateTextMeshes();

  // Render
  renderer.render(scene, camera);
}

// ==================== USER INPUT HANDLING ====================

async function handleUserInput(input: string) {
  if (!input.trim()) return;

  updateProcessingStatus("Processing...");
  addLogEntry(`User input: "${input}"`, "user");
  addFloatingText(`💬 ${input}`, "user", 6000);

  // Clear input
  userInput.value = "";

  try {
    // Send to soul via WebSocket
    const ws = (globalThis as any).soulWebSocket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "chat",
          content: input,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      throw new Error("WebSocket not connected");
    }

    // Update memory count (placeholder - could be enhanced with actual conversation tracking)
    updateMemoryCount(Date.now() % 100); // Simple placeholder
  } catch (error) {
    addLogEntry(`Error processing input: ${error}`, "error");
    addFloatingText("❌ Processing error", "error", 4000);
  } finally {
    updateProcessingStatus("Ready");
  }
}

// ==================== INITIALIZATION ====================

async function init() {
  // Initialize UI elements
  logContent = document.getElementById("log-content")!;
  memoryCount = document.getElementById("memory-count")!;
  processingStatus = document.getElementById("processing-status")!;
  voiceStatus = document.getElementById("voice-status")!;
  userInput = document.getElementById("user-input") as HTMLInputElement;

  // Initialize Three.js
  initThreeJS();

  // Load font
  const fontLoader = new FontLoader();
  try {
    font = await new Promise((resolve, reject) => {
      fontLoader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        resolve,
        undefined,
        reject
      );
    });

    addLogEntry("Font loaded successfully", "log");
  } catch (error) {
    addLogEntry(`Font loading error: ${error}`, "error");
    console.error("Font loading error:", error);
  }

  // Create soul visualization
  createSoulVisualization();

  // Set up soul
  setupSoul();

  // Set up event listeners
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleUserInput(userInput.value);
    }
  });

  // Voice controls
  const toggleVoiceBtn = document.getElementById("toggle-voice");
  const stopVoiceBtn = document.getElementById("stop-voice");

  toggleVoiceBtn?.addEventListener("click", () => {
    isVoiceEnabled = !isVoiceEnabled;
    toggleVoiceBtn.textContent = isVoiceEnabled
      ? "Disable Voice"
      : "Enable Voice";
    updateVoiceStatus(isVoiceEnabled ? "Ready" : "Disabled");
  });

  stopVoiceBtn?.addEventListener("click", () => {
    speechSynthesis.cancel();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    updateVoiceStatus("Stopped");
  });

  // Start animation loop
  animate();

  // Initial messages
  addLogEntry("🚀 Professor Code's soul is awakening...", "log");
  addFloatingText("🌟 Professor Code is here!", "response", 5000);

  // Initial greeting after a short delay
  setTimeout(() => {
    handleUserInput("Hello Professor Code!");
  }, 3000);
}

// Start the application
init().catch(console.error);
