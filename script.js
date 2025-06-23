// Game state
let gameState = {
    pet: {
        name: "Sparkle",
        hunger: 100,
        happiness: 100,
        cleanliness: 100,
        emoji: "🐶"
    },
    score: 0,
    lastUpdate: Date.now()
};

// Pet emotions based on stats
const petEmotions = {
    happy: "😊🐶",
    sad: "😢🐶", 
    hungry: "🤤🐶",
    dirty: "🤢🐶",
    sleeping: "😴🐶"
};

// Initialize game
function initGame() {
    updateDisplay();
    startGameLoop();
    
    // Load saved game if exists
    const savedGame = localStorage.getItem('barbiePetGame');
    if (savedGame) {
        gameState = JSON.parse(savedGame);
        updateDisplay();
    }
}

// Game loop - stats decay over time
function startGameLoop() {
    setInterval(() => {
        const now = Date.now();
        const timePassed = (now - gameState.lastUpdate) / 1000; // seconds
        
        // Gradual stat decay (slower for demo)
        gameState.pet.hunger = Math.max(0, gameState.pet.hunger - timePassed * 0.1);
        gameState.pet.happiness = Math.max(0, gameState.pet.happiness - timePassed * 0.05);
        gameState.pet.cleanliness = Math.max(0, gameState.pet.cleanliness - timePassed * 0.03);
        
        gameState.lastUpdate = now;
        
        updateDisplay();
        updatePetEmotion();
        saveGame();
    }, 1000);
}

// Update all display elements
function updateDisplay() {
    // Update stats
    document.getElementById('hunger-value').textContent = Math.round(gameState.pet.hunger);
    document.getElementById('happiness-value').textContent = Math.round(gameState.pet.happiness);
    document.getElementById('cleanliness-value').textContent = Math.round(gameState.pet.cleanliness);
    
    // Update stat bars
    document.getElementById('hunger-bar').style.width = gameState.pet.hunger + '%';
    document.getElementById('happiness-bar').style.width = gameState.pet.happiness + '%';
    document.getElementById('cleanliness-bar').style.width = gameState.pet.cleanliness + '%';
    
    // Update score
    document.getElementById('score').textContent = gameState.score;
    
    // Change bar colors based on levels
    updateStatBarColors();
}

function updateStatBarColors() {
    const bars = ['hunger-bar', 'happiness-bar', 'cleanliness-bar'];
    const stats = [gameState.pet.hunger, gameState.pet.happiness, gameState.pet.cleanliness];
    
    bars.forEach((barId, index) => {
        const bar = document.getElementById(barId);
        const value = stats[index];
        
        if (value > 70) {
            bar.style.background = 'linear-gradient(90deg, #32cd32, #228b22)';
        } else if (value > 30) {
            bar.style.background = 'linear-gradient(90deg, #ffa500, #ff8c00)';
        } else {
            bar.style.background = 'linear-gradient(90deg, #ff6347, #ff4500)';
        }
    });
}

function updatePetEmotion() {
    const petElement = document.querySelector('.pet-emoji');
    const avgStats = (gameState.pet.hunger + gameState.pet.happiness + gameState.pet.cleanliness) / 3;
    
    if (avgStats > 80) {
        petElement.textContent = '😊🐶';
    } else if (avgStats > 50) {
        petElement.textContent = '😐🐶';
    } else if (gameState.pet.hunger < 30) {
        petElement.textContent = '🤤🐶';
    } else if (gameState.pet.cleanliness < 30) {
        petElement.textContent = '🤢🐶';
    } else {
        petElement.textContent = '😢🐶';
    }
}

// Action functions
function feedPet() {
    if (gameState.pet.hunger < 100) {
        gameState.pet.hunger = Math.min(100, gameState.pet.hunger + 25);
        gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 5);
        gameState.score += 10;
        
        showActionFeedback("Fed Sparkle! 🍖", "feed");
        updateDisplay();
        updatePetEmotion();
    }
}

function playWithPet() {
    if (gameState.pet.happiness < 100) {
        gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 30);
        gameState.pet.hunger = Math.max(0, gameState.pet.hunger - 5);
        gameState.score += 15;
        
        showActionFeedback("Played with Sparkle! 🎾", "play");
        updateDisplay();
        updatePetEmotion();
    }
}

function cleanPet() {
    if (gameState.pet.cleanliness < 100) {
        gameState.pet.cleanliness = Math.min(100, gameState.pet.cleanliness + 35);
        gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 10);
        gameState.score += 12;
        
        showActionFeedback("Cleaned Sparkle! 🛁", "clean");
        updateDisplay();
        updatePetEmotion();
    }
}

function petSleep() {
    gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 20);
    gameState.pet.hunger = Math.max(0, gameState.pet.hunger - 10);
    gameState.score += 8;
    
    showActionFeedback("Sparkle is resting! 😴", "sleep");
    
    // Temporary sleep animation
    const petElement = document.querySelector('.pet-emoji');
    petElement.textContent = '😴🐶';
    
    setTimeout(() => {
        updatePetEmotion();
    }, 2000);
    
    updateDisplay();
}

// Show action feedback
function showActionFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = 'action-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 105, 180, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 1000;
        animation: fadeInOut 2s ease-in-out;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 2000);
}

// Add CSS animation for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Save game to localStorage
function saveGame() {
    localStorage.setItem('barbiePetGame', JSON.stringify(gameState));
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);
