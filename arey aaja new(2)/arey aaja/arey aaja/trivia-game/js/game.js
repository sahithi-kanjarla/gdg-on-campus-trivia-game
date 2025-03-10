class TriviaGame {
    constructor() {
        this.currentLevel = 0;
        this.score = 0;
        this.maxLevel = gameData.levels.length;
        this.unlockedLevels = 1; // Start with only first level unlocked
        this.completedLevels = new Set();
        this.feedbackState = 'initial'; // States: initial, meme, fact, reward
        this.timer = null;
        this.timeLeft = 10; // 10 seconds for each question
        this.sounds = {
            correct: document.getElementById('correct-sound'),
            wrong: document.getElementById('wrong-sound'),
            timer: document.getElementById('timer-sound')
        };
        this.initializeGame();
    }

    initializeGame() {
        this.levelSelection = document.querySelector('.level-selection');
        this.gameScreen = document.querySelector('.game-screen');
        this.modal = document.getElementById('completion-modal');
        this.scoreElement = document.getElementById('score');
        this.createLevelButtons();
        this.setupEventListeners();
        this.loadProgress();
        this.createResetButton();
        this.createTimerElement();
    }

    createLevelButtons() {
        const levelsGrid = document.querySelector('.levels-grid');
        levelsGrid.innerHTML = '';

        for (let i = 0; i < this.maxLevel; i++) {
            const levelBtn = document.createElement('button');
            // A level is unlocked only if it's the first level or the previous level is completed
            const isUnlocked = i === 0 || this.completedLevels.has(i - 1);
            const isCompleted = this.completedLevels.has(i);
            
            levelBtn.className = `level-btn ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`;
            levelBtn.dataset.level = i;

            // Add level number
            const levelNum = document.createElement('div');
            levelNum.className = 'level-number';
            levelNum.textContent = i + 1;
            levelBtn.appendChild(levelNum);

            // Add level type label
            const levelType = document.createElement('div');
            levelType.className = 'level-type';
            levelType.textContent = this.getLevelTypeLabel(gameData.levels[i].type);
            levelBtn.appendChild(levelType);

            // Add stars container
            const stars = document.createElement('div');
            stars.className = 'stars';
            stars.innerHTML = this.completedLevels.has(i) ? '⭐'.repeat(3) : '';
            levelBtn.appendChild(stars);

            if (!isUnlocked) {
                const lockIcon = document.createElement('div');
                lockIcon.className = 'lock-icon';
                lockIcon.textContent = '🔒';
                levelBtn.appendChild(lockIcon);
            }

            // Add hover effect elements
            const hoverEffect = document.createElement('div');
            hoverEffect.className = 'level-hover-effect';
            levelBtn.appendChild(hoverEffect);

            levelsGrid.appendChild(levelBtn);
        }
    }

    getLevelTypeLabel(type) {
        const types = {
            'college_trivia': '📚',
            'word_puzzle': '🔄',
            'odd_one_out': '🎯',
            'riddle': '🤔',
            'quote_guess': '💭'
        };
        return types[type] || '❓';
    }

    setupEventListeners() {
        // Level selection
        document.querySelector('.levels-grid').addEventListener('click', (e) => {
            const levelBtn = e.target.closest('.level-btn');
            if (levelBtn && !levelBtn.classList.contains('locked')) {
                this.startLevel(parseInt(levelBtn.dataset.level));
            }
        });

        // Option selection
        document.getElementById('options-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.checkAnswer(parseInt(e.target.dataset.index));
            }
        });

        // Modal buttons
        document.getElementById('next-level-btn').addEventListener('click', this.handleNextButtonClick);

        document.getElementById('return-menu-btn').addEventListener('click', () => {
            this.hideModal();
            
            // Handle reset cancellation
            if (this.feedbackState === 'reset-confirm') {
                this.feedbackState = this.tempState.feedbackState;
                return;
            }
            
            this.feedbackState = 'initial';
            this.showLevelSelection();
        });
    }

    startLevel(levelIndex) {
        // Only allow starting a level if it's the first level or previous level is completed
        if (levelIndex === 0 || this.completedLevels.has(levelIndex - 1)) {
            this.currentLevel = levelIndex;
            this.levelSelection.classList.add('hidden');
            this.gameScreen.classList.remove('hidden');

            const level = gameData.levels[levelIndex];
            document.getElementById('question-text').textContent = level.question;

            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';

            level.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option;
                button.dataset.index = index;
                optionsContainer.appendChild(button);
            });
            
            // Start the timer
            this.startTimer();
        }
    }
    
    startTimer() {
        // Reset timer
        this.clearTimer();
        this.timeLeft = 10;
        
        // Update timer display
        this.updateTimerDisplay();
        
        // Start countdown
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            // Play timer sound when time is running low (3 seconds or less)
            if (this.timeLeft <= 3 && this.sounds.timer) {
                this.sounds.timer.currentTime = 0;
                this.sounds.timer.play().catch(e => console.log("Audio play failed:", e));
            }
            
            if (this.timeLeft <= 0) {
                this.clearTimer();
                this.handleTimeUp();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const timerText = document.getElementById('timer-text');
        const timerProgress = document.getElementById('timer-progress');
        
        if (timerText && timerProgress) {
            timerText.textContent = `${this.timeLeft}s`;
            const progressWidth = (this.timeLeft / 10) * 100;
            timerProgress.style.width = `${progressWidth}%`;
            
            // Change color based on time left
            if (this.timeLeft <= 3) {
                timerProgress.style.backgroundColor = 'var(--google-red)';
            } else if (this.timeLeft <= 5) {
                timerProgress.style.backgroundColor = 'var(--google-yellow)';
            } else {
                timerProgress.style.backgroundColor = 'var(--google-green)';
            }
        }
    }
    
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    handleTimeUp() {
        // Show time up modal
        const modalMessage = document.getElementById('modal-message');
        const nextButton = document.getElementById('next-level-btn');
        const returnButton = document.getElementById('return-menu-btn');
        
        modalMessage.innerHTML = `
            <div class="time-up-container">
                <h3>Time's Up!</h3>
                <p>You ran out of time for this question.</p>
                <img src="https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif" alt="Time's up" class="meme-gif">
            </div>
        `;
        
        nextButton.textContent = "Try Again";
        nextButton.style.display = 'block';
        returnButton.textContent = "Return to Menu";
        returnButton.style.display = 'block';
        
        this.feedbackState = 'time-up';
        this.modal.style.display = 'flex';
    }

    checkAnswer(selectedIndex) {
        // Clear the timer when an answer is selected
        this.clearTimer();
        
        const level = gameData.levels[this.currentLevel];
        const isCorrect = selectedIndex === level.correct;

        // Play sound based on answer correctness
        if (isCorrect && this.sounds.correct) {
            this.sounds.correct.currentTime = 0;
            this.sounds.correct.play().catch(e => console.log("Audio play failed:", e));
            
            this.score += 100;
            this.scoreElement.textContent = this.score;
            
            // Mark the current level as completed
            this.completedLevels.add(this.currentLevel);
            this.saveProgress();
            this.createLevelButtons();
        } else if (this.sounds.wrong) {
            this.sounds.wrong.currentTime = 0;
            this.sounds.wrong.play().catch(e => console.log("Audio play failed:", e));
        }

        this.showCompletionModal(isCorrect, selectedIndex);
    }

    showCompletionModal(success, selectedIndex) {
        const level = gameData.levels[this.currentLevel];
        const modalMessage = document.getElementById('modal-message');
        const nextButton = document.getElementById('next-level-btn');
        const returnButton = document.getElementById('return-menu-btn');

        if (success) {
            // For correct answer, start with meme
            this.feedbackState = 'meme';
            modalMessage.innerHTML = `
                <div class="meme-container">
                    <h3>Correct Answer! 🎉</h3>
                    <img src="${level.correctMeme}" alt="Reaction Meme" class="meme-gif">
                </div>
            `;
            nextButton.textContent = "GDG Fun Fact";
            nextButton.style.display = 'block';
            returnButton.style.display = 'block';
        } else {
            // For wrong answer, don't show the correct option
            const selectedOption = level.options[selectedIndex];
            
            modalMessage.innerHTML = `
                <div class="wrong-answer-container">
                    <h3>Wrong Answer! 😕</h3>
                    <p>You selected: <span class="wrong-option">${selectedOption}</span></p>
                    <img src="${level.wrongMeme}" alt="Reaction Meme" class="meme-gif">
                </div>
            `;
            nextButton.textContent = "Try Again";
            nextButton.style.display = 'block';
            returnButton.textContent = "Return to Menu";
            returnButton.style.display = 'block';
            this.feedbackState = 'wrong-answer';
        }

        this.modal.style.display = 'flex';
    }

    handleNextButtonClick = () => {
        const level = gameData.levels[this.currentLevel];
        const modalMessage = document.getElementById('modal-message');
        const nextButton = document.getElementById('next-level-btn');
        const returnButton = document.getElementById('return-menu-btn');

        switch (this.feedbackState) {
            case 'meme':
                // Show club info
                this.feedbackState = 'fact';
                modalMessage.innerHTML = `
                    <div class="fact-container">
                        <div class="fact-icon">💡</div>
                        <h3 class="fact-title">Did You Know?</h3>
                        <p class="gdsc-fact">${level.fact}</p>
                    </div>
                `;
                nextButton.textContent = "Claim Reward";
                break;

            case 'fact':
                // Show reward animation and update score
                this.feedbackState = 'reward';
                this.score += 100;
                this.scoreElement.textContent = this.score;
                
                // Mark level as completed and update UI
                this.completedLevels.add(this.currentLevel);
                this.saveProgress();
                this.createLevelButtons();

                // Trigger confetti celebration
                this.triggerConfetti();

                modalMessage.innerHTML = `
                    <div class="reward-container">
                        <div class="score-animation">+100</div>
                        <p>Level Complete! 🎉</p>
                        <div class="motivational-quote">${this.getRandomQuote()}</div>
                    </div>
                `;
                nextButton.textContent = "Next Level";
                returnButton.style.display = 'block';
                break;

            case 'reward':
                // Move to next level or return to menu
                this.hideModal();
                this.feedbackState = 'initial';
                if (this.currentLevel + 1 < this.maxLevel) {
                    this.startLevel(this.currentLevel + 1);
                } else {
                    this.showLevelSelection();
                }
                break;
                
            case 'wrong-answer':
                // Try the question again
                this.hideModal();
                this.startLevel(this.currentLevel);
                break;
                
            case 'time-up':
                // Try the question again
                this.hideModal();
                this.startLevel(this.currentLevel);
                break;
                
            case 'reset-confirm':
                // Confirm reset
                this.resetGame();
                this.hideModal();
                break;
        }
    }

    hideModal() {
        this.modal.style.display = 'none';
    }

    showLevelSelection() {
        this.gameScreen.classList.add('hidden');
        this.levelSelection.classList.remove('hidden');
        // Clear any active timers when returning to level selection
        this.clearTimer();
    }

    saveProgress() {
        localStorage.setItem('triviaGameProgress', JSON.stringify({
            completedLevels: Array.from(this.completedLevels),
            score: this.score
        }));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('triviaGameProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.completedLevels = new Set(progress.completedLevels);
            this.score = progress.score;
            this.scoreElement.textContent = this.score;
            this.createLevelButtons();
        }
    }

    createResetButton() {
        // Create reset button if it doesn't exist
        if (!document.getElementById('reset-button')) {
            const resetButton = document.createElement('button');
            resetButton.id = 'reset-button';
            resetButton.className = 'reset-button';
            resetButton.innerHTML = '🔄 Reset Game';
            
            // Add it to the header
            const header = document.querySelector('header');
            header.appendChild(resetButton);
            
            // Add event listener
            resetButton.addEventListener('click', () => this.confirmReset());
        }
    }

    confirmReset() {
        // Show confirmation modal
        const modalMessage = document.getElementById('modal-message');
        const nextButton = document.getElementById('next-level-btn');
        const returnButton = document.getElementById('return-menu-btn');
        
        modalMessage.innerHTML = `
            <div class="reset-confirmation">
                <p>Are you sure you want to reset all progress?</p>
                <p>This will clear your score and unlock status.</p>
            </div>
        `;
        
        nextButton.textContent = "Yes, Reset";
        nextButton.style.display = 'block';
        returnButton.textContent = "Cancel";
        returnButton.style.display = 'block';
        
        // Store current state
        this.tempState = {
            feedbackState: this.feedbackState
        };
        
        // Set special state for reset confirmation
        this.feedbackState = 'reset-confirm';
        
        this.modal.style.display = 'flex';
    }

    resetGame() {
        // Reset all game progress
        this.score = 0;
        this.completedLevels = new Set();
        this.unlockedLevels = 1;
        this.scoreElement.textContent = this.score;
        
        // Clear localStorage
        localStorage.removeItem('triviaGameProgress');
        
        // Update UI
        this.createLevelButtons();
        this.showLevelSelection();
        
        // Show reset success message
        this.showResetSuccessMessage();
    }

    showResetSuccessMessage() {
        const modalMessage = document.getElementById('modal-message');
        const nextButton = document.getElementById('next-level-btn');
        const returnButton = document.getElementById('return-menu-btn');
        
        modalMessage.innerHTML = `
            <div class="reset-success">
                <p>Game has been reset successfully!</p>
                <p>Your score is now 0 and only the first level is unlocked.</p>
            </div>
        `;
        
        nextButton.style.display = 'none';
        returnButton.textContent = "OK";
        returnButton.style.display = 'block';
        
        this.feedbackState = 'reset-success';
        this.modal.style.display = 'flex';
    }

    createTimerElement() {
        // Create timer element if it doesn't exist
        if (!document.getElementById('timer-container')) {
            const timerContainer = document.createElement('div');
            timerContainer.id = 'timer-container';
            timerContainer.innerHTML = `
                <div class="timer-bar">
                    <div id="timer-progress"></div>
                </div>
                <div id="timer-text">10s</div>
            `;
            this.gameScreen.insertBefore(timerContainer, this.gameScreen.firstChild);
        }
    }

    getRandomQuote() {
        const quotes = gameData.motivationalQuotes;
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    triggerConfetti() {
        if (typeof confetti !== 'undefined') {
            // Fire confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58']
            });
            
            // Fire another round of confetti after a short delay
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58']
                });
            }, 500);
            
            // And another from the other side
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58']
                });
            }, 900);
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new TriviaGame();
}); 