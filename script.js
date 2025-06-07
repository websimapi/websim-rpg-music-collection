document.addEventListener('DOMContentLoaded', function() {
    // Define location/scene data
    const locations = [
        {
            id: 'main_castle',
            name: 'Castle Highspire',
            type: 'Capital City',
            description: 'The magnificent capital of the kingdom, where your epic journey begins. The castle\'s spires reach toward the heavens as if to touch the gods themselves.',
            image: 'scenes/main_castle.jpg',
            music: 'music/main_theme.wav',
            musicName: 'Main Theme',
            mapPosition: { x: 50, y: 50 } // center
        },
        {
            id: 'battle_field',
            name: 'Contested Plains',
            type: 'Battlefield',
            description: 'A once peaceful meadow now turned battleground where the forces of good and evil clash in deadly combat.',
            image: 'scenes/battle_field.jpg',
            music: 'music/battle_intense.wav',
            musicName: 'The Clash of Steel',
            mapPosition: { x: 70, y: 40 }
        },
        {
            id: 'peaceful_town',
            name: 'Willowbrook Village',
            type: 'Settlement',
            description: 'A tranquil village where simple folk live in harmony with nature, untouched by the conflicts of the wider world.',
            image: 'scenes/peaceful_town.jpg',
            music: 'music/town_peaceful.wav',
            musicName: 'Town of Serenity',
            mapPosition: { x: 30, y: 75 }
        },
        {
            id: 'dark_dungeon',
            name: 'Crypts of Dread',
            type: 'Dungeon',
            description: 'Ancient catacombs beneath the earth, filled with forgotten treasures and unspeakable horrors from ages past.',
            image: 'scenes/dark_dungeon.jpg',
            music: 'music/dungeon_mystery.wav',
            musicName: 'Depths of Shadow',
            mapPosition: { x: 80, y: 65 }
        },
        {
            id: 'magical_forest',
            name: 'Whisperwind Forest',
            type: 'Wilderness',
            description: 'An enchanted woodland teeming with magical creatures and ancient mysteries waiting to be discovered.',
            image: 'scenes/magical_forest.jpg',
            music: 'music/forest_exploration.wav',
            musicName: 'Whispers of the Wild',
            mapPosition: { x: 25, y: 40 }
        },
        {
            id: 'boss_lair',
            name: 'Mount Doomforge',
            type: 'Boss Lair',
            description: 'The volcanic fortress of the Dark Overlord, where rivers of molten rock flow and evil schemes are hatched.',
            image: 'scenes/boss_lair.jpg',
            music: 'music/boss_battle.wav',
            musicName: 'Wrath of the Overlord',
            mapPosition: { x: 85, y: 20 }
        },
        {
            id: 'emotional_scene',
            name: 'Warrior\'s Rest',
            type: 'Story Moment',
            description: 'A solemn memorial where fallen heroes are honored and remembered for their ultimate sacrifice.',
            image: 'scenes/emotional_scene.jpg',
            music: 'music/emotional_moment.wav',
            musicName: 'A Hero\'s Sacrifice',
            mapPosition: { x: 60, y: 80 }
        },
        {
            id: 'victory_celebration',
            name: 'Hall of Triumph',
            type: 'Celebration',
            description: 'The grand hall where victories are celebrated with feasting, dancing, and merriment after successful quests.',
            image: 'scenes/victory_celebration.jpg',
            music: 'music/victory_fanfare.wav',
            musicName: 'Triumph',
            mapPosition: { x: 40, y: 20 }
        }
    ];

    // DOM elements
    const worldMap = document.getElementById('world-map');
    const sceneImage = document.getElementById('scene-image');
    const sceneTitle = document.getElementById('scene-title');
    const sceneDescription = document.getElementById('scene-description');
    const sceneAudio = document.getElementById('scene-audio');
    const globalAudioToggle = document.getElementById('global-audio-toggle');
    const locationGrid = document.getElementById('location-grid');
    const panoramicBtn = document.getElementById('panoramic-btn');
    const panoramicViewer = document.getElementById('panoramic-viewer');
    const panoramicContainer = document.getElementById('panoramic-container');
    const closePanoramicBtn = document.getElementById('close-panoramic');
    const panoramicLoading = document.getElementById('panoramic-loading');

    let currentAudio = null;
    let isPlaying = false;
    let audioEnabled = false;
    let hasUserInteracted = false;
    let isTraveling = false;
    let currentLocation = null;

    // Panoramic viewer variables
    let panoramicScene, panoramicCamera, panoramicRenderer;
    let panoramicGeometry, panoramicMaterial, panoramicMesh;
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    let phi = 0, theta = 0;

    // Create the world map with pins
    function createWorldMap() {
        const mapImage = document.createElement('img');
        mapImage.src = 'world-map.jpg';
        mapImage.alt = 'Fantasy World Map';
        mapImage.style.width = '100%';
        mapImage.style.height = 'auto';
        mapImage.style.borderRadius = '8px';
        worldMap.appendChild(mapImage);

        // Create map pins after image loads
        mapImage.onload = function() {
            const mapContainer = document.createElement('div');
            mapContainer.style.position = 'relative';
            mapContainer.style.width = '100%';

            worldMap.appendChild(mapContainer);
            mapContainer.appendChild(mapImage);

            // Add location pins
            locations.forEach(location => {
                const pin = document.createElement('div');
                pin.className = 'map-pin';
                pin.dataset.locationId = location.id;
                pin.style.left = `${location.mapPosition.x}%`;
                pin.style.top = `${location.mapPosition.y}%`;

                const pinLabel = document.createElement('div');
                pinLabel.className = 'map-pin-label';
                pinLabel.textContent = location.name;
                pin.appendChild(pinLabel);

                pin.addEventListener('click', () => {
                    changeScene(location);
                });

                mapContainer.appendChild(pin);
            });
        };
    }

    // Create location cards
    function createLocationCards() {
        locations.forEach(location => {
            const card = document.createElement('div');
            card.className = 'location-card';
            card.dataset.locationId = location.id;

            const thumbnail = document.createElement('div');
            thumbnail.className = 'location-thumbnail';
            thumbnail.style.backgroundImage = `url(${location.image})`;

            const info = document.createElement('div');
            info.className = 'location-info';

            const name = document.createElement('h4');
            name.className = 'location-name';
            name.textContent = location.name;

            const type = document.createElement('span');
            type.className = 'location-type';
            type.textContent = location.type;

            info.appendChild(name);
            info.appendChild(type);

            card.appendChild(thumbnail);
            card.appendChild(info);

            card.addEventListener('click', () => {
                changeScene(location);
            });

            locationGrid.appendChild(card);
        });
    }

    // Change scene function
    function changeScene(location) {
        // Prevent multiple simultaneous travels
        if (isTraveling) return;
        
        // Enable audio on first interaction
        enableAudio();
        
        // If we have a current location and it's different, animate travel
        if (currentLocation && currentLocation.id !== location.id) {
            animateTravel(currentLocation, location);
        } else {
            // Direct scene change for first load or same location
            updateScene(location);
        }
    }

    // Animate travel between locations
    function animateTravel(fromLocation, toLocation) {
        isTraveling = true;
        
        // Create travel path
        createTravelPath(fromLocation, toLocation);
        
        // Start fading out current music immediately
        let fadeOutComplete = Promise.resolve();
        if (audioEnabled && sceneAudio.src && !sceneAudio.paused) {
            fadeOutComplete = fadeOutAudio(sceneAudio, 2000); // 2 second fade out
        }
        
        // Animate travel (4 seconds total)
        setTimeout(() => {
            // Remove path
            document.querySelectorAll('.travel-path').forEach(path => path.remove());
            
            // Update scene
            updateScene(toLocation);
            
            // Wait for fade out to complete, then fade in new music
            fadeOutComplete.then(() => {
                if (audioEnabled && sceneAudio.src) {
                    sceneAudio.volume = 0;
                    sceneAudio.play().then(() => {
                        fadeInAudio(sceneAudio, 2000); // 2 second fade in
                    }).catch(e => console.log('Audio play failed:', e));
                }
            });
            
            isTraveling = false;
        }, 4000); // Increased from 2000 to 4000
    }
    
    // Create visual travel path
    function createTravelPath(fromLocation, toLocation) {
        const mapContainer = worldMap.querySelector('div');
        if (!mapContainer) return;
        
        const pathContainer = document.createElement('div');
        pathContainer.className = 'travel-path';
        pathContainer.style.position = 'absolute';
        pathContainer.style.top = '0';
        pathContainer.style.left = '0';
        pathContainer.style.width = '100%';
        pathContainer.style.height = '100%';
        pathContainer.style.pointerEvents = 'none';
        
        const startX = fromLocation.mapPosition.x;
        const startY = fromLocation.mapPosition.y;
        const endX = toLocation.mapPosition.x;
        const endY = toLocation.mapPosition.y;
        
        // Create dotted sine wave path
        const numDots = 20; // Reduced from 40
        const amplitude = 3; // Wave height in percentage
        for (let i = 0; i <= numDots; i++) {
            const progress = i / numDots;
            const baseX = startX + (endX - startX) * progress;
            const baseY = startY + (endY - startY) * progress;
            
            // Add sine wave offset perpendicular to the path
            const waveOffset = Math.sin(progress * Math.PI * 3) * amplitude;
            const angle = Math.atan2(endY - startY, endX - startX);
            const offsetX = -Math.sin(angle) * waveOffset;
            const offsetY = Math.cos(angle) * waveOffset;
            
            const x = baseX + offsetX;
            const y = baseY + offsetY;
            
            const dot = document.createElement('div');
            dot.className = 'travel-dot';
            dot.style.left = `${x}%`;
            dot.style.top = `${y}%`;
            dot.style.animationDelay = `${i * 0.15}s`; // Increased from 0.05s to 0.15s
            
            pathContainer.appendChild(dot);
        }
        
        mapContainer.appendChild(pathContainer);
    }
    
    // Initialize panoramic viewer
    function initPanoramicViewer() {
        panoramicScene = new THREE.Scene();
        panoramicCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        panoramicRenderer = new THREE.WebGLRenderer();
        panoramicRenderer.setSize(window.innerWidth, window.innerHeight);
        
        // Create sphere geometry for panoramic image
        panoramicGeometry = new THREE.SphereGeometry(500, 60, 40);
        // Flip the geometry inside out
        panoramicGeometry.scale(-1, 1, 1);
        
        panoramicContainer.appendChild(panoramicRenderer.domElement);
        
        // Mouse controls
        panoramicContainer.addEventListener('mousedown', onPanoramicMouseDown);
        panoramicContainer.addEventListener('mousemove', onPanoramicMouseMove);
        panoramicContainer.addEventListener('mouseup', onPanoramicMouseUp);
        panoramicContainer.addEventListener('wheel', onPanoramicWheel);
        
        // Touch controls for mobile
        panoramicContainer.addEventListener('touchstart', onPanoramicTouchStart);
        panoramicContainer.addEventListener('touchmove', onPanoramicTouchMove);
        panoramicContainer.addEventListener('touchend', onPanoramicTouchEnd);
        
        // Handle window resize
        window.addEventListener('resize', onPanoramicResize);
    }

    // Load panoramic image
    function loadPanoramicImage(imagePath) {
        panoramicLoading.style.display = 'block';
        
        const loader = new THREE.TextureLoader();
        loader.load(imagePath, function(texture) {
            panoramicLoading.style.display = 'none';
            
            if (panoramicMaterial) {
                panoramicMaterial.dispose();
            }
            
            panoramicMaterial = new THREE.MeshBasicMaterial({ map: texture });
            
            if (panoramicMesh) {
                panoramicScene.remove(panoramicMesh);
            }
            
            panoramicMesh = new THREE.Mesh(panoramicGeometry, panoramicMaterial);
            panoramicScene.add(panoramicMesh);
            
            // Reset camera position
            phi = 0;
            theta = 0;
            updatePanoramicCamera();
            
            animate();
        }, undefined, function(error) {
            panoramicLoading.textContent = 'Failed to load panoramic view';
            console.error('Error loading panoramic texture:', error);
        });
    }

    // Panoramic mouse controls
    function onPanoramicMouseDown(event) {
        isMouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    function onPanoramicMouseMove(event) {
        if (!isMouseDown) return;
        
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        
        phi += deltaX * 0.01;
        theta = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, theta + deltaY * 0.01));
        
        updatePanoramicCamera();
        
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    function onPanoramicMouseUp() {
        isMouseDown = false;
    }

    function onPanoramicWheel(event) {
        const fov = panoramicCamera.fov + event.deltaY * 0.05;
        panoramicCamera.fov = Math.max(10, Math.min(120, fov));
        panoramicCamera.updateProjectionMatrix();
    }

    // Touch controls
    let touchStartX = 0, touchStartY = 0;

    function onPanoramicTouchStart(event) {
        if (event.touches.length === 1) {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        }
    }

    function onPanoramicTouchMove(event) {
        if (event.touches.length === 1) {
            const deltaX = event.touches[0].clientX - touchStartX;
            const deltaY = event.touches[0].clientY - touchStartY;
            
            phi += deltaX * 0.01;
            theta = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, theta + deltaY * 0.01));
            
            updatePanoramicCamera();
            
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        }
        event.preventDefault();
    }

    function onPanoramicTouchEnd() {
        // Touch ended
    }

    function updatePanoramicCamera() {
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(theta);
        const z = Math.cos(phi) * Math.cos(theta);
        
        panoramicCamera.lookAt(x, y, z);
    }

    function onPanoramicResize() {
        if (panoramicCamera && panoramicRenderer) {
            panoramicCamera.aspect = window.innerWidth / window.innerHeight;
            panoramicCamera.updateProjectionMatrix();
            panoramicRenderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    function animate() {
        if (!panoramicViewer.classList.contains('hidden')) {
            requestAnimationFrame(animate);
            panoramicRenderer.render(panoramicScene, panoramicCamera);
        }
    }

    // Event listeners for panoramic viewer
    panoramicBtn.addEventListener('click', function() {
        if (currentLocation) {
            panoramicViewer.classList.remove('hidden');
            if (!panoramicRenderer) {
                initPanoramicViewer();
            }
            loadPanoramicImage(currentLocation.image);
        }
    });

    closePanoramicBtn.addEventListener('click', function() {
        panoramicViewer.classList.add('hidden');
    });

    // Close panoramic with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !panoramicViewer.classList.contains('hidden')) {
            panoramicViewer.classList.add('hidden');
        }
    });

    // Initialize scene explorer
    createWorldMap();
    createLocationCards();

    // Set initial scene (first location)
    if (locations.length > 0) {
        setTimeout(() => {
            updateScene(locations[0]);
        }, 1000);
    }

    // Audio fade functions
    function fadeOutAudio(audio, duration) {
        return new Promise((resolve) => {
            if (!audio || audio.paused) {
                resolve();
                return;
            }
            
            const startVolume = audio.volume;
            const fadeStep = startVolume / (duration / 50);
            
            const fadeInterval = setInterval(() => {
                if (audio.volume > fadeStep) {
                    audio.volume -= fadeStep;
                } else {
                    audio.volume = 0;
                    audio.pause();
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, 50);
        });
    }

    function fadeInAudio(audio, duration) {
        return new Promise((resolve) => {
            if (!audio) {
                resolve();
                return;
            }
            
            const targetVolume = 0.7;
            const fadeStep = targetVolume / (duration / 50);
            audio.volume = 0;
            
            const fadeInterval = setInterval(() => {
                if (audio.volume < targetVolume - fadeStep) {
                    audio.volume += fadeStep;
                } else {
                    audio.volume = targetVolume;
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, 50);
        });
    }

    // Update scene function
    function updateScene(location) {
        currentLocation = location;
        
        // Update scene display
        sceneImage.style.backgroundImage = `url(${location.image})`;
        sceneTitle.textContent = location.name;
        sceneDescription.textContent = location.description;
        
        // Show panoramic button
        panoramicBtn.style.display = 'block';
        
        // Update active states
        document.querySelectorAll('.location-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.locationId === location.id) {
                card.classList.add('active');
            }
        });
        
        document.querySelectorAll('.map-pin').forEach(pin => {
            pin.classList.remove('active');
            if (pin.dataset.locationId === location.id) {
                pin.classList.add('active');
            }
        });
        
        // Update music
        if (location.music && audioEnabled) {
            sceneAudio.src = location.music;
            sceneAudio.volume = 0.7;
            sceneAudio.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    // Enable audio function
    function enableAudio() {
        if (!hasUserInteracted) {
            hasUserInteracted = true;
            audioEnabled = true;
            globalAudioToggle.classList.remove('hidden');
            globalAudioToggle.textContent = '🔊';
        }
    }

    // Global audio toggle
    globalAudioToggle.addEventListener('click', function() {
        audioEnabled = !audioEnabled;
        globalAudioToggle.textContent = audioEnabled ? '🔊' : '🔇';
        
        if (!audioEnabled && currentAudio) {
            currentAudio.pause();
        } else if (audioEnabled && currentLocation) {
            sceneAudio.src = currentLocation.music;
            sceneAudio.play().catch(e => console.log('Audio play failed:', e));
        }
    });
});