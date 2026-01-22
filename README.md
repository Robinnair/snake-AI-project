# 🐍 Snake Game with AI (Auto + Manual Mode)

This is a Snake game built from scratch using vanilla HTML, CSS, and JavaScript, rendered on an HTML5 canvas.  
What started as a basic Snake implementation gradually evolved into an AI-driven version that can play the game on its own using pathfinding and safety checks.

The focus of this project was learning game loops, input handling, collision detection, and practical AI logic — not just making something that “works”.

---

## 🎮 Features

- Classic Snake gameplay
- Manual control using arrow keys
- Auto-play mode powered by BFS pathfinding
- AI avoids unsafe apples and prioritizes survival
- Wrap-around grid (no wall collisions)
- Random apple spawning (never inside the snake)
- Background music and death sound effects
- Live score tracking
- Visually distinct snake head

---

## 🤖 AI Logic Overview

The AI follows a simple but safe decision process:

1. Find the shortest path to the apple using BFS  
2. Simulate eating the apple  
3. Check if a path back to the tail still exists  
4. If safe, move toward the apple  
5. If unsafe, follow the tail instead  
6. If no path exists, choose the safest available move  

This prevents the snake from trapping itself in enclosed spaces.

---

## 🧠 Concepts Used

- HTML5 Canvas rendering
- Grid-based movement
- Keyboard input handling with `preventDefault`
- `requestAnimationFrame` game loop
- Self-collision detection with growth handling
- Breadth-First Search (BFS)
- State simulation for future safety validation
- Direction buffering to prevent instant reversals

---

## 🕹 Controls

- Arrow Keys — Manual movement
- Manual button — Player-controlled mode
- Auto button — AI-controlled mode

Background music starts on first input to comply with browser audio policies.

---

## 📂 Project Structure

snake-game/
├── index.html
├── style.css
├── script.js
├── sound/
│ ├── actually-good-fahhhh-sfx.mp3
│ └── Toby Fox - DELTARUNE OST.mp3
└── README.md


---

## 🚀 Why This Project

This project was built as a learning exercise to go beyond basic tutorials and understand:

- How real-time games manage state
- How AI behaves in a changing environment
- Why naïve pathfinding fails without safety checks
- How small timing and logic decisions affect long-running games

It’s part of a larger goal of building AI-driven browser games from scratch.

---

## 📌 Notes

- No external libraries or frameworks used
- Logic-first approach, visuals kept minimal
- Designed to be extendable and easy to experiment with

---

## 🧪 Possible Improvements

- Fixed-step accumulator for deterministic movement
- Heuristic-based path scoring instead of pure BFS
- Dynamic difficulty scaling
- AI path visualization
