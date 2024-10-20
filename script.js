const chaser = document.getElementById('chaser');
const player = document.getElementById('player');
const scoreItem = document.getElementById('score-item');
const scoreDisplay = document.getElementById('score');
const container = document.querySelector('#container');
const startButton = document.getElementById('startButton');
const overlay = document.getElementById('overlay');

let chaserSpeed = 1.5; // Chaser speed set to 0.3
let playerSpeed = 25;
let score = 0;

// Create an audio object for the sound
const scoreSound = new Audio('assets/ting.mp3'); // Replace with the actual path to your sound file

// Function to start the game
const startGame = () => {
    // Hide the overlay
    overlay.style.display = 'none';
    
    // Start moving the chaser and place the score item
    moveChaser();
    placeScoreItemRandomly();

    // Add keyboard controls
    document.addEventListener('keydown', handleKeyboardControls);
};

// Player Movement
const movePlayer = (deltaX, deltaY) => {
    const playerRect = player.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Move player within the bounds of the container
    let newX = playerRect.left + deltaX;
    let newY = playerRect.top + deltaY;

    if (newX >= containerRect.left && newX + playerRect.width <= containerRect.right) {
        player.style.left = `${player.offsetLeft + deltaX}px`;
    }

    if (newY >= containerRect.top && newY + playerRect.height <= containerRect.bottom) {
        player.style.top = `${player.offsetTop + deltaY}px`;
    }

    checkCollision();
    checkScoreItemCollision();
};

// Chaser Movement
const moveChaser = () => {
    const chaserRect = chaser.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    let deltaX = playerRect.left - chaserRect.left;
    let deltaY = playerRect.top - chaserRect.top;

    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 1) {
        chaser.style.left = `${chaser.offsetLeft + (deltaX / distance) * chaserSpeed}px`;
        chaser.style.top = `${chaser.offsetTop + (deltaY / distance) * chaserSpeed}px`;
    }

    checkCollision();
    requestAnimationFrame(moveChaser);
};

// Keyboard Control
const handleKeyboardControls = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -playerSpeed);
            break;
        case 'ArrowDown':
            movePlayer(0, playerSpeed);
            break;
        case 'ArrowLeft':
            movePlayer(-playerSpeed, 0);
            break;
        case 'ArrowRight':
            movePlayer(playerSpeed, 0);
            break;
    }
};

// Collision Detection with Chaser
const checkCollision = () => {
    const chaserRect = chaser.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
        chaserRect.left < playerRect.left + playerRect.width &&
        chaserRect.left + chaserRect.width > playerRect.left &&
        chaserRect.top < playerRect.top + playerRect.height &&
        chaserRect.top + chaserRect.height > playerRect.top
    ) {
        alert('You died!');
        resetGame();
    }
};

// Score Item Collision Detection
const checkScoreItemCollision = () => {
    const playerRect = player.getBoundingClientRect();
    const scoreItemRect = scoreItem.getBoundingClientRect();

    if (
        scoreItemRect.left < playerRect.left + playerRect.width &&
        scoreItemRect.left + scoreItemRect.width > playerRect.left &&
        scoreItemRect.top < playerRect.top + playerRect.height &&
        scoreItemRect.top + scoreItemRect.height > playerRect.top
    ) {
        increaseScore();
        scoreSound.play(); // Play the sound when a score item is touched
        hideScoreItem();
    }
};

// Increase Score
const increaseScore = () => {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
};

// Hide Score Item and Reappear in 5 Seconds
const hideScoreItem = () => {
    scoreItem.style.display = 'none';
    setTimeout(() => {
        placeScoreItemRandomly();
        scoreItem.style.display = 'block';
    }, 5000);
};

// Randomly Place Score Item within the Container
const placeScoreItemRandomly = () => {
    const containerRect = container.getBoundingClientRect();
    const randomX = Math.random() * (containerRect.width - scoreItem.offsetWidth);
    const randomY = Math.random() * (containerRect.height - scoreItem.offsetHeight);

    scoreItem.style.left = `${randomX}px`;
    scoreItem.style.top = `${randomY}px`;
};

// Reset Game
const resetGame = () => {
    // Reset positions
    player.style.top = '50%';
    player.style.left = '50%';
    player.style.transform = 'translate(-50%, -50%)';
    
    chaser.style.top = '0px';
    chaser.style.left = '0px';

    score = 0;
    scoreDisplay.textContent = 'Score: 0';

    placeScoreItemRandomly();
    scoreItem.style.display = 'block';
};

// Event listener for the start button
startButton.addEventListener('click', startGame);
