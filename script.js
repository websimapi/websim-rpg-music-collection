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

    let currentAudio = null;
    let isPlaying = false;
    let audioEnabled = false;
    let hasUserInteracted = false;
    let isTraveling = false;
    let currentLocation = null;

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
        
        // Fade out current music (slower fade)
        if (audioEnabled && sceneAudio.src) {
            fadeOutAudio(sceneAudio, 3000);
        }
        
        // Animate travel (2 seconds) - removed overlay
        setTimeout(() => {
            // Remove path
            document.querySelectorAll('.travel-path').forEach(path => path.remove());
            
            // Update scene
            updateScene(toLocation);
            
            // Fade in new music after a short delay (slower fade)
            setTimeout(() => {
                if (audioEnabled && sceneAudio.src) {
                    sceneAudio.volume = 0;
                    sceneAudio.play().catch(e => console.log('Audio play failed:', e));
                    fadeInAudio(sceneAudio, 3000);
                }
            }, 500);
            
            isTraveling = false;
        }, 2000);
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
        const numDots = 40;
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
            dot.style.animationDelay = `${i * 0.05}s`;
            
            pathContainer.appendChild(dot);
        }
        
        mapContainer.appendChild(pathContainer);
    }
    
    // Extract scene update logic
    function updateScene(location) {
        currentLocation = location;
        
        // Update active location highlights
        document.querySelectorAll('.location-card').forEach(card => card.classList.remove('active'));
        document.querySelector(`.location-card[data-location-id="${location.id}"]`).classList.add('active');

        document.querySelectorAll('.map-pin').forEach(pin => pin.classList.remove('active'));
        document.querySelector(`.map-pin[data-location-id="${location.id}"]`).classList.add('active');

        // Update scene content
        sceneImage.style.backgroundImage = `url(${location.image})`;
        sceneTitle.textContent = location.name;
        sceneDescription.textContent = location.description;

        // Update audio source
        sceneAudio.src = location.music;
        sceneAudio.load();
        currentAudio = location.music;
    }
    
    // Audio fade functions
    function fadeOutAudio(audio, duration) {
        const startVolume = audio.volume;
        const step = startVolume / (duration / 50);
        
        const fadeOut = setInterval(() => {
            if (audio.volume > 0.05) {
                audio.volume = Math.max(0, audio.volume - step);
            } else {
                audio.volume = 0;
                audio.pause();
                clearInterval(fadeOut);
            }
        }, 50);
    }
    
    function fadeInAudio(audio, duration) {
        audio.volume = 0;
        const targetVolume = 1;
        const step = targetVolume / (duration / 50);
        
        const fadeIn = setInterval(() => {
            if (audio.volume < targetVolume - 0.05) {
                audio.volume = Math.min(targetVolume, audio.volume + step);
            } else {
                audio.volume = targetVolume;
                clearInterval(fadeIn);
            }
        }, 50);
    }
    
    // Enable audio after first user interaction
    function enableAudio() {
        if (!hasUserInteracted) {
            hasUserInteracted = true;
            audioEnabled = true;
            globalAudioToggle.classList.remove('hidden');
            // Auto-play current scene music if available
            if (sceneAudio.src) {
                sceneAudio.play().catch(e => console.log('Audio play failed:', e));
            }
        }
    }

    // Toggle audio playback
    globalAudioToggle.addEventListener('click', function() {
        if (audioEnabled) {
            sceneAudio.pause();
            audioEnabled = false;
            globalAudioToggle.textContent = '🔇';
        } else {
            audioEnabled = true;
            globalAudioToggle.textContent = '🔊';
            if (sceneAudio.src) {
                sceneAudio.play().catch(e => console.log('Audio play failed:', e));
            }
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
});