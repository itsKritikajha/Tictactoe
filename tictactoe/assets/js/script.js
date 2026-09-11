/**
 * Audio control and Welcome screen options dynamic rendering
 */

let welcomeAudio = null;
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    // Relative path to audio matching project structure
    const audioPath = document.querySelector('script[src*="assets/js/script.js"]') 
        ? './assets/tune/welcome.mp3' 
        : '../assets/tune/welcome.mp3';

    try {
        welcomeAudio = new Audio(audioPath);
        welcomeAudio.loop = true;
    } catch (e) {
        console.warn('Audio setup error:', e);
    }

    const muteBtn = document.getElementById('mute');
    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMusic);
    }
});

function toggleMusic() {
    const muteIcon = document.querySelector('#mute i');
    if (!welcomeAudio) return;

    if (isPlaying) {
        welcomeAudio.pause();
        isPlaying = false;
        if (muteIcon) {
            muteIcon.className = 'fa fa-volume-mute';
        }
    } else {
        welcomeAudio.play().then(() => {
            isPlaying = true;
            if (muteIcon) {
                muteIcon.className = 'fa fa-volume-up';
            }
        }).catch(err => {
            console.log('Autoplay restricted:', err);
        });
    }
}

function startGame(buttonElement) {
    // Start music on user interaction if not playing
    if (welcomeAudio && !isPlaying) {
        welcomeAudio.play().then(() => {
            isPlaying = true;
            const muteIcon = document.querySelector('#mute i');
            if (muteIcon) muteIcon.className = 'fa fa-volume-up';
        }).catch(() => {});
    }

    const welcomeContainer = document.querySelector('.welcome-container');
    if (!welcomeContainer) return;

    // Remove existing options if present
    let existingOptions = welcomeContainer.querySelector('.options');
    if (existingOptions) {
        existingOptions.remove();
    }

    // Hide or update start button
    if (buttonElement) {
        buttonElement.style.display = 'none';
    }

    // Dynamically create options container
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    const twoPlayerLink = document.createElement('a');
    twoPlayerLink.href = 'twoPlayer.html';
    twoPlayerLink.className = 'option-btn';
    twoPlayerLink.textContent = 'Two Player';

    const aiPlayerLink = document.createElement('a');
    aiPlayerLink.href = 'AIPlayer.html';
    aiPlayerLink.className = 'option-btn';
    aiPlayerLink.textContent = 'AI Player';

    optionsDiv.appendChild(twoPlayerLink);
    optionsDiv.appendChild(aiPlayerLink);

    welcomeContainer.appendChild(optionsDiv);
}
