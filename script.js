// ===== MAIN APPLICATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const screens = document.querySelectorAll('.screen');
    const dots = document.querySelectorAll('.dot');
    const startBtn = document.getElementById('startBtn');
    const nextBtns = document.querySelectorAll('.next-btn');
    const voiceBtn = document.getElementById('voiceBtn');
    const talkBtn = document.getElementById('talkBtn');
    const timeBtn = document.getElementById('timeBtn');
    const restartBtn = document.getElementById('restartBtn');
    const musicToggle = document.getElementById('musicToggle');
    const closeResponse = document.getElementById('closeResponse');
    const responseModal = document.getElementById('responseMessage');

    // Audio
    const bgMusic = document.getElementById('bgMusic');
    const voiceNote = document.getElementById('voiceNote');
    let isMusicPlaying = false;

    // Current screen index
    let currentScreen = 0;

    // ===== INITIALIZATION =====
    function init() {
        // Show first screen
        showScreen(0);

        // Start background music (muted)
        bgMusic.volume = 0.3;
        bgMusic.muted = true;

        // Setup apology text reveal
        setupApologyReveal();

        // Setup memory cards animation
        setupMemoryCards();

        // Setup distance animation
        setupDistanceAnimation();
    }

    // ===== SCREEN NAVIGATION =====
    function showScreen(index) {
        // Hide all screens
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show selected screen
        screens[index].classList.add('active');
        currentScreen = index;

        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Special handling for each screen
        switch (index) {
            case 1: // Apology screen
                startApologyReveal();
                break;
            case 2: // Memories screen
                animateMemoryCards();
                break;
            case 3: // Distance screen
                startDistanceAnimation();
                break;
            case 4: // Reasons screen
                animateReasonCards();
                break;
            case 5: // Promises screen
                animateStars();
                break;
        }
    }

    // ===== APOLOGY TEXT REVEAL =====
    function setupApologyReveal() {
        const apologyLines = document.querySelectorAll('.apology-line');
        apologyLines.forEach((line, index) => {
            line.style.transitionDelay = `${index * 800}ms`;
        });
    }

    function startApologyReveal() {
        const apologyLines = document.querySelectorAll('.apology-line');
        apologyLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, index * 1000);
        });
    }

    // ===== MEMORY CARDS =====
    function setupMemoryCards() {
        const memoryCards = document.querySelectorAll('.memory-card');
        memoryCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
        });
    }

    function animateMemoryCards() {
        const memoryCards = document.querySelectorAll('.memory-card');
        memoryCards.forEach(card => {
            const delay = card.style.getPropertyValue('--delay');
            card.style.animation = `slideIn 0.8s ease forwards`;
            card.style.animationDelay = `${delay * 300}ms`;
        });
    }

    // ===== DISTANCE ANIMATION =====
    function setupDistanceAnimation() {
        // Randomize distance slightly for realism
        const milesElement = document.getElementById('miles');
        const baseDistance = 824;
        const randomVariation = Math.floor(Math.random() * 50) - 25;
        milesElement.textContent = baseDistance + randomVariation;
    }

    function startDistanceAnimation() {
        const pulseDot = document.querySelector('.pulse-dot');
        pulseDot.style.animation = 'travel 4s linear infinite';
    }

    // ===== REASON CARDS =====
    function animateReasonCards() {
        const reasonCards = document.querySelectorAll('.reason-card');
        reasonCards.forEach(card => {
            const order = card.style.getPropertyValue('--order');
            card.style.animation = `floatUp 0.8s ease forwards`;
            card.style.animationDelay = `${order * 200}ms`;
        });
    }

    // ===== STAR ANIMATION =====
    function animateStars() {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const top = star.style.getPropertyValue('--top');
            star.style.animation = `starGlow 3s ease-in-out infinite`;
            star.style.animationDelay = `${parseInt(top) * 0.01}s`;
        });
    }

    // ===== EVENT LISTENERS =====
    // Start button
    startBtn.addEventListener('click', () => {
        showScreen(1);
    });

    // Next buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentScreen < screens.length - 1) {
                showScreen(currentScreen + 1);
            }
        });
    });

    // Progress dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const screenIndex = parseInt(dot.dataset.screen);
            showScreen(screenIndex);
        });
    });

    // Voice note
    voiceBtn.addEventListener('click', () => {
        const voicePlaying = document.querySelector('.voice-playing');

        if (voiceNote.paused) {
            voiceNote.play();
            voiceBtn.style.display = 'none';
            voicePlaying.style.display = 'block';

            voiceNote.onended = function() {
                voiceBtn.style.display = 'flex';
                voicePlaying.style.display = 'none';
            };
        } else {
            voiceNote.pause();
            voiceNote.currentTime = 0;
            voiceBtn.style.display = 'flex';
            voicePlaying.style.display = 'none';
        }
    });

    // Music toggle
    // ===== MUSIC PLAYER FUNCTIONALITY =====
    function createMusicPlayer() {
        const musicPlayer = document.createElement('div');
        musicPlayer.className = 'music-player';
        musicPlayer.innerHTML = `
        <button id="playPauseBtn" class="music-control-btn">
            <i class="fas fa-play"></i>
        </button>
        <div class="music-info">
            <span class="music-title">"Love's Reflection"</span>
            <span class="music-composer">Piano for healing hearts</span>
        </div>
        <div class="volume-control">
            <button id="muteBtn" class="mute-btn">
                <i class="fas fa-volume-up"></i>
            </button>
            <input type="range" id="volumeSlider" class="volume-slider" min="0" max="100" value="30">
        </div>
    `;

        document.querySelector('.container').appendChild(musicPlayer);

        // Initialize audio
        const backgroundMusic = document.getElementById('backgroundMusic');
        backgroundMusic.volume = 0.3; // Start at 30% volume

        // Play/Pause button
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = playPauseBtn.querySelector('i');

        // Auto-play with user interaction
        let hasUserInteracted = false;

        function startMusicWithInteraction() {
            if (!hasUserInteracted) {
                backgroundMusic.play().then(() => {
                    playIcon.className = 'fas fa-pause';
                    hasUserInteracted = true;
                }).catch(error => {
                    console.log("Autoplay prevented. User interaction required.");
                });
            }
        }

        // Start music on first user interaction
        document.addEventListener('click', startMusicWithInteraction, { once: true });
        document.addEventListener('touchstart', startMusicWithInteraction, { once: true });

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                playIcon.className = 'fas fa-pause';
            } else {
                backgroundMusic.pause();
                playIcon.className = 'fas fa-play';
            }
        });

        // Volume control
        const volumeSlider = document.getElementById('volumeSlider');
        const muteBtn = document.getElementById('muteBtn');
        const muteIcon = muteBtn.querySelector('i');

        volumeSlider.addEventListener('input', (e) => {
            backgroundMusic.volume = e.target.value / 100;

            // Update mute button icon based on volume
            if (backgroundMusic.volume === 0) {
                muteIcon.className = 'fas fa-volume-mute';
            } else {
                muteIcon.className = 'fas fa-volume-up';
            }
        });

        // Mute button
        let previousVolume = backgroundMusic.volume;

        muteBtn.addEventListener('click', () => {
            if (backgroundMusic.volume > 0) {
                previousVolume = backgroundMusic.volume;
                backgroundMusic.volume = 0;
                volumeSlider.value = 0;
                muteIcon.className = 'fas fa-volume-mute';
            } else {
                backgroundMusic.volume = previousVolume;
                volumeSlider.value = previousVolume * 100;
                muteIcon.className = 'fas fa-volume-up';
            }
        });

        // Update play/pause icon based on audio state
        backgroundMusic.addEventListener('play', () => {
            playIcon.className = 'fas fa-pause';
        });

        backgroundMusic.addEventListener('pause', () => {
            playIcon.className = 'fas fa-play';
        });

        // Handle audio ending (though it's looped)
        backgroundMusic.addEventListener('ended', () => {
            playIcon.className = 'fas fa-play';
        });

        // Crossfade volume between screens
        function fadeOutMusic(duration = 1000) {
            const startVolume = backgroundMusic.volume;
            const fadeOutInterval = 50;
            const steps = duration / fadeOutInterval;
            const volumeStep = startVolume / steps;

            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                backgroundMusic.volume = startVolume - (volumeStep * currentStep);

                if (currentStep >= steps) {
                    backgroundMusic.pause();
                    backgroundMusic.volume = startVolume; // Reset for next play
                    clearInterval(fadeInterval);
                }
            }, fadeOutInterval);
        }

        // Fade in music
        function fadeInMusic(duration = 1000, targetVolume = 0.3) {
            if (backgroundMusic.paused) {
                backgroundMusic.volume = 0;
                backgroundMusic.play();
            }

            const fadeInInterval = 50;
            const steps = duration / fadeInInterval;
            const volumeStep = targetVolume / steps;

            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                backgroundMusic.volume = volumeStep * currentStep;

                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                }
            }, fadeInInterval);
        }

        // Adjust music based on screen
        const screenMusicSettings = {
            0: { volume: 0.2, fade: 1500 }, // Opening - soft
            1: { volume: 0.15, fade: 2000 }, // Apology - very soft
            2: { volume: 0.25, fade: 1500 }, // Memories - gentle
            3: { volume: 0.2, fade: 1500 }, // Distance - ambient
            4: { volume: 0.3, fade: 1500 }, // Reasons - warm
            5: { volume: 0.25, fade: 1500 }, // Promises - hopeful
            6: { volume: 0.15, fade: 2000 } // Choice - quiet
        };

        // Modify the showScreen function to include music
        const originalShowScreen = showScreen;
        showScreen = function(index) {
            originalShowScreen(index);

            // Adjust music for current screen
            if (screenMusicSettings[index]) {
                const settings = screenMusicSettings[index];
                fadeInMusic(settings.fade, settings.volume);

                // Update volume slider
                volumeSlider.value = settings.volume * 100;
            }
        };

        return {
            fadeOutMusic,
            fadeInMusic
        };
    }

    // ===== UPDATE INITIALIZATION =====
    function init() {
        // ... existing init code ...

        // Create music player
        createMusicPlayer();

        // ... rest of init code ...
    }

    // Choice buttons
    talkBtn.addEventListener('click', () => {
        // Open email client
        window.location.href = 'mailto:YOUR_EMAIL_HERE?subject=I%27d%20like%20to%20talk&body=Hi...';
    });

    timeBtn.addEventListener('click', () => {
        responseModal.classList.add('active');
    });

    // Restart
    restartBtn.addEventListener('click', () => {
        showScreen(0);
    });

    // Close response modal
    closeResponse.addEventListener('click', () => {
        responseModal.classList.remove('active');
    });

    // Click outside modal to close
    responseModal.addEventListener('click', (e) => {
        if (e.target === responseModal) {
            responseModal.classList.remove('active');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && currentScreen < screens.length - 1) {
            showScreen(currentScreen + 1);
        } else if (e.key === 'ArrowLeft' && currentScreen > 0) {
            showScreen(currentScreen - 1);
        } else if (e.key === 'Escape') {
            responseModal.classList.remove('active');
        }
    });

    // ===== INITIALIZE =====
    init();

    // ===== ADDITIONAL EFFECTS =====
    // Parallax effect for stars background
    window.addEventListener('mousemove', (e) => {
        const stars = document.querySelector('.stars');
        if (!stars) return;

        const x = (e.clientX / window.innerWidth) * 10;
        const y = (e.clientY / window.innerHeight) * 10;

        stars.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Heartbeat follows cursor on opening screen
    document.addEventListener('mousemove', (e) => {
        if (currentScreen === 0) {
            const heartbeat = document.querySelector('.heartbeat');
            heartbeat.style.left = `${e.clientX}px`;
            heartbeat.style.top = `${e.clientY}px`;
        }
    });

    // Auto-advance after voice note (optional)
    voiceNote.addEventListener('ended', () => {
        // Optional: Auto-advance to next screen after voice note
        // setTimeout(() => {
        //     if (currentScreen === 1) {
        //         showScreen(2);
        //     }
        // }, 2000);
    });
});
// ===== MAIN APPLICATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const screens = document.querySelectorAll('.screen');
    const dots = document.querySelectorAll('.dot');
    const startBtn = document.getElementById('startBtn');
    const nextBtns = document.querySelectorAll('.next-btn');
    const voiceBtn = document.getElementById('voiceBtn');
    const talkBtn = document.getElementById('talkBtn');
    const timeBtn = document.getElementById('timeBtn');
    const restartBtn = document.getElementById('restartBtn');
    const closeResponse = document.getElementById('closeResponse');
    const responseModal = document.getElementById('responseMessage');

    // Audio elements
    const backgroundMusic = document.getElementById('backgroundMusic');
    const voiceNote = document.getElementById('voiceNote');

    // Current screen index
    let currentScreen = 0;

    // ===== MUSIC PLAYER INITIALIZATION =====
    function initMusicPlayer() {
        // Set initial volume
        backgroundMusic.volume = 0.3;

        // Elements
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playIcon = playPauseBtn.querySelector('i');
        const volumeSlider = document.getElementById('volumeSlider');
        const muteBtn = document.getElementById('muteBtn');
        const muteIcon = muteBtn.querySelector('i');

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    playIcon.className = 'fas fa-pause';
                }).catch(error => {
                    console.log("Play failed:", error);
                    // Show play overlay if autoplay is blocked
                    showPlayOverlay();
                });
            } else {
                backgroundMusic.pause();
                playIcon.className = 'fas fa-play';
            }
        });

        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            backgroundMusic.volume = e.target.value / 100;

            // Update mute button icon
            if (backgroundMusic.volume === 0) {
                muteIcon.className = 'fas fa-volume-mute';
            } else {
                muteIcon.className = 'fas fa-volume-up';
            }
        });

        // Mute button
        let previousVolume = backgroundMusic.volume;

        muteBtn.addEventListener('click', () => {
            if (backgroundMusic.volume > 0) {
                previousVolume = backgroundMusic.volume;
                backgroundMusic.volume = 0;
                volumeSlider.value = 0;
                muteIcon.className = 'fas fa-volume-mute';
            } else {
                backgroundMusic.volume = previousVolume;
                volumeSlider.value = previousVolume * 100;
                muteIcon.className = 'fas fa-volume-up';
            }
        });

        // Update play/pause icon based on audio state
        backgroundMusic.addEventListener('play', () => {
            playIcon.className = 'fas fa-pause';
        });

        backgroundMusic.addEventListener('pause', () => {
            playIcon.className = 'fas fa-play';
        });

        // Try to start music with user interaction
        function startMusicOnInteraction() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    playIcon.className = 'fas fa-pause';
                }).catch(() => {
                    // Music will start on button click
                });
            }
        }

        // Start music on first interaction
        document.addEventListener('click', startMusicOnInteraction, { once: true });
        document.addEventListener('touchstart', startMusicOnInteraction, { once: true });

        // Adjust music volume based on screen
        const screenMusicVolumes = {
            0: 0.2, // Opening
            1: 0.15, // Apology
            2: 0.25, // Memories
            3: 0.2, // Gallery
            4: 0.2, // Distance
            5: 0.3, // Reasons
            6: 0.25, // Promises
            7: 0.15 // Choice
        };

        // Return function to adjust volume per screen
        return (screenIndex) => {
            const targetVolume = screenMusicVolumes[screenIndex] || 0.2;
            fadeVolume(backgroundMusic, targetVolume, 1000);
            volumeSlider.value = targetVolume * 100;
        };
    }

    // Fade volume function
    function fadeVolume(audioElement, targetVolume, duration = 1000) {
        const startVolume = audioElement.volume;
        const delta = targetVolume - startVolume;
        const startTime = performance.now();

        function updateVolume() {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth fade
            const easedProgress = progress < 0.5 ?
                2 * progress * progress :
                1 - Math.pow(-2 * progress + 2, 2) / 2;

            audioElement.volume = startVolume + (delta * easedProgress);

            if (progress < 1) {
                requestAnimationFrame(updateVolume);
            }
        }

        requestAnimationFrame(updateVolume);
    }

    // Show play overlay if autoplay is blocked
    function showPlayOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'musicOverlay';
        overlay.innerHTML = `
            <div class="music-overlay-content">
                <h3><i class="fas fa-music"></i> Enable Background Music</h3>
                <p>Click play to enjoy the background music with this experience.</p>
                <button id="enableMusicBtn">
                    <i class="fas fa-play-circle"></i> Play Music
                </button>
                <button id="skipMusicBtn">
                    Continue Without Music
                </button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #musicOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 26, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                backdrop-filter: blur(10px);
            }
            
            .music-overlay-content {
                background: rgba(26, 26, 46, 0.9);
                border: 1px solid rgba(196, 92, 92, 0.3);
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                max-width: 400px;
                width: 90%;
                animation: modalAppear 0.5s ease;
            }
            
            .music-overlay-content h3 {
                color: white;
                font-size: 1.5rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .music-overlay-content p {
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 1.5rem;
                line-height: 1.5;
            }
            
            #enableMusicBtn {
                background: var(--color-heart-red);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 50px;
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 0.5rem auto;
                transition: all 0.3s ease;
            }
            
            #skipMusicBtn {
                background: transparent;
                color: rgba(255, 255, 255, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 0.8rem 1.5rem;
                border-radius: 50px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            #enableMusicBtn:hover, #skipMusicBtn:hover {
                transform: scale(1.05);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Event listeners for overlay buttons
        document.getElementById('enableMusicBtn').addEventListener('click', () => {
            backgroundMusic.play().then(() => {
                document.getElementById('playPauseBtn').querySelector('i').className = 'fas fa-pause';
                document.body.removeChild(overlay);
                document.head.removeChild(style);
            });
        });

        document.getElementById('skipMusicBtn').addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.head.removeChild(style);
        });
    }

    // ===== GALLERY FUNCTIONALITY =====
    function initGallery() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const mediaItems = document.querySelectorAll('.media-item');
        const videoModal = document.getElementById('videoModal');
        const photoModal = document.getElementById('photoModal');
        const modalVideo = document.getElementById('modalVideo');
        const modalPhoto = document.getElementById('modalPhoto');

        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // Show/hide items based on filter
                mediaItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                        // Add animation
                        item.style.animation = 'mediaAppear 0.6s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Video click handlers
        document.querySelectorAll('.media-item.video').forEach(item => {
            item.addEventListener('click', () => {
                const videoSrc = item.dataset.src;
                const poster = item.dataset.poster;
                const title = item.querySelector('.media-title').textContent;
                const date = item.querySelector('.media-date').textContent;

                // Set video source
                modalVideo.src = videoSrc;
                modalVideo.poster = poster;

                // Set video info
                document.getElementById('videoTitle').textContent = title;
                document.getElementById('videoDate').textContent = date;

                // Show modal
                videoModal.classList.add('active');

                // Pause background music while video plays
                const wasPlaying = !backgroundMusic.paused;
                if (wasPlaying) {
                    backgroundMusic.pause();
                }

                // Play video
                modalVideo.play();

                // When video ends or modal closes, resume music if it was playing
                modalVideo.onended = function() {
                    if (wasPlaying) {
                        backgroundMusic.play();
                    }
                };

                // Close button
                videoModal.querySelector('.close-modal').onclick = () => {
                    videoModal.classList.remove('active');
                    modalVideo.pause();
                    modalVideo.currentTime = 0;
                    if (wasPlaying) {
                        backgroundMusic.play();
                    }
                };

                // Close on background click
                videoModal.onclick = (e) => {
                    if (e.target === videoModal) {
                        videoModal.classList.remove('active');
                        modalVideo.pause();
                        modalVideo.currentTime = 0;
                        if (wasPlaying) {
                            backgroundMusic.play();
                        }
                    }
                };
            });
        });

        // Photo click handlers
        document.querySelectorAll('.media-item.photo').forEach(item => {
            item.addEventListener('click', () => {
                const photoSrc = item.dataset.src;
                const title = item.querySelector('.media-title').textContent;
                const date = item.querySelector('.media-date').textContent;

                // Set photo source
                modalPhoto.src = photoSrc;
                modalPhoto.alt = title;

                // Set photo info
                document.getElementById('photoTitle').textContent = title;
                document.getElementById('photoDate').textContent = date;

                // Show modal
                photoModal.classList.add('active');

                // Close button
                photoModal.querySelector('.close-photo').onclick = () => {
                    photoModal.classList.remove('active');
                };

                // Close on background click
                photoModal.onclick = (e) => {
                    if (e.target === photoModal) {
                        photoModal.classList.remove('active');
                    }
                };
            });
        });

        // Keyboard support for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                videoModal.classList.remove('active');
                photoModal.classList.remove('active');
                modalVideo.pause();
            }
        });
    }

    // ===== INITIALIZATION =====
    function init() {
        // Show first screen
        showScreen(0);

        // Setup music player
        const adjustMusicVolume = initMusicPlayer();

        // Setup apology text reveal
        setupApologyReveal();

        // Setup gallery
        initGallery();

        // Setup distance animation
        setupDistanceAnimation();

        // Update showScreen to include music adjustment
        const originalShowScreen = showScreen;
        showScreen = function(index) {
            originalShowScreen(index);

            // Adjust music for current screen
            if (adjustMusicVolume) {
                adjustMusicVolume(index);
            }

            // Special handling for each screen
            switch (index) {
                case 1: // Apology screen
                    startApologyReveal();
                    break;
                case 2: // Memories screen
                    animateMemoryCards();
                    break;
                case 3: // Gallery screen
                    animateGalleryItems();
                    break;
                case 4: // Distance screen
                    startDistanceAnimation();
                    break;
                case 5: // Reasons screen
                    animateReasonCards();
                    break;
                case 6: // Promises screen
                    animateStars();
                    break;
            }
        };
    }

    // ===== SCREEN NAVIGATION =====
    function showScreen(index) {
        // Hide all screens
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show selected screen
        screens[index].classList.add('active');
        currentScreen = index;

        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // ===== APOLOGY TEXT REVEAL =====
    function setupApologyReveal() {
        const apologyLines = document.querySelectorAll('.apology-line');
        apologyLines.forEach((line, index) => {
            line.style.transitionDelay = `${index * 800}ms`;
        });
    }

    function startApologyReveal() {
        const apologyLines = document.querySelectorAll('.apology-line');
        apologyLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, index * 1000);
        });
    }

    // ===== MEMORY CARDS =====
    function setupMemoryCards() {
        const memoryCards = document.querySelectorAll('.memory-card');
        memoryCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
        });
    }

    function animateMemoryCards() {
        const memoryCards = document.querySelectorAll('.memory-card');
        memoryCards.forEach(card => {
            const delay = card.style.getPropertyValue('--delay');
            card.style.animation = `slideIn 0.8s ease forwards`;
            card.style.animationDelay = `${delay * 300}ms`;
        });
    }

    // ===== GALLERY ITEMS =====
    function animateGalleryItems() {
        const mediaItems = document.querySelectorAll('.media-item');
        mediaItems.forEach((item, index) => {
            item.style.animation = `mediaAppear 0.6s ease forwards`;
            item.style.animationDelay = `${(index % 6) * 0.1}s`;
        });
    }

    // ===== DISTANCE ANIMATION =====
    function setupDistanceAnimation() {
        const milesElement = document.getElementById('miles');
        const baseDistance = 824;
        const randomVariation = Math.floor(Math.random() * 50) - 25;
        milesElement.textContent = baseDistance + randomVariation;
    }

    function startDistanceAnimation() {
        const pulseDot = document.querySelector('.pulse-dot');
        pulseDot.style.animation = 'travel 4s linear infinite';
    }

    // ===== REASON CARDS =====
    function animateReasonCards() {
        const reasonCards = document.querySelectorAll('.reason-card');
        reasonCards.forEach(card => {
            const order = card.style.getPropertyValue('--order');
            card.style.animation = `floatUp 0.8s ease forwards`;
            card.style.animationDelay = `${order * 200}ms`;
        });
    }

    // ===== STAR ANIMATION =====
    function animateStars() {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const top = star.style.getPropertyValue('--top');
            star.style.animation = `starGlow 3s ease-in-out infinite`;
            star.style.animationDelay = `${parseInt(top) * 0.01}s`;
        });
    }

    // ===== EVENT LISTENERS =====
    // Start button
    startBtn.addEventListener('click', () => {
        showScreen(1);
    });

    // Next buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentScreen < screens.length - 1) {
                showScreen(currentScreen + 1);
            }
        });
    });

    // Progress dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const screenIndex = parseInt(dot.dataset.screen);
            showScreen(screenIndex);
        });
    });

    // Voice note
    voiceBtn.addEventListener('click', () => {
        const voicePlaying = document.querySelector('.voice-playing');

        if (voiceNote.paused) {
            voiceNote.play();
            voiceBtn.style.display = 'none';
            voicePlaying.style.display = 'block';

            voiceNote.onended = function() {
                voiceBtn.style.display = 'flex';
                voicePlaying.style.display = 'none';
            };
        } else {
            voiceNote.pause();
            voiceNote.currentTime = 0;
            voiceBtn.style.display = 'flex';
            voicePlaying.style.display = 'none';
        }
    });

    // Choice buttons
    talkBtn.addEventListener('click', () => {
        // Open email client - REPLACE WITH YOUR EMAIL
        window.location.href = 'mailto:your.email@example.com?subject=I%27d%20like%20to%20talk&body=Hi...';
    });

    timeBtn.addEventListener('click', () => {
        responseModal.classList.add('active');
    });

    // Restart
    restartBtn.addEventListener('click', () => {
        showScreen(0);
    });

    // Close response modal
    closeResponse.addEventListener('click', () => {
        responseModal.classList.remove('active');
    });

    // Click outside modal to close
    responseModal.addEventListener('click', (e) => {
        if (e.target === responseModal) {
            responseModal.classList.remove('active');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && currentScreen < screens.length - 1) {
            showScreen(currentScreen + 1);
        } else if (e.key === 'ArrowLeft' && currentScreen > 0) {
            showScreen(currentScreen - 1);
        } else if (e.key === 'Escape') {
            responseModal.classList.remove('active');
            document.getElementById('videoModal').classList.remove('active');
            document.getElementById('photoModal').classList.remove('active');
        }
    });

    // ===== ADDITIONAL EFFECTS =====
    // Parallax effect for stars background
    window.addEventListener('mousemove', (e) => {
        const stars = document.querySelector('.stars');
        if (!stars) return;

        const x = (e.clientX / window.innerWidth) * 10;
        const y = (e.clientY / window.innerHeight) * 10;

        stars.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Heartbeat follows cursor on opening screen
    document.addEventListener('mousemove', (e) => {
        if (currentScreen === 0) {
            const heartbeat = document.querySelector('.heartbeat');
            heartbeat.style.left = `${e.clientX}px`;
            heartbeat.style.top = `${e.clientY}px`;
        }
    });

    // ===== INITIALIZE =====
    init();
});