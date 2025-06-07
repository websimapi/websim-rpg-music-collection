document.addEventListener('DOMContentLoaded', function() {
    // Music track information
    const tracks = [
        {
            id: 'main_theme',
            name: 'Main Theme',
            file: 'music/main_theme.wav',
            description: 'The epic main theme for your RPG adventure. A heroic and memorable melody that captures the spirit of the journey ahead.',
            category: 'Theme'
        },
        {
            id: 'battle_intense',
            name: 'Battle - The Clash of Steel',
            file: 'music/battle_intense.wav',
            description: 'Intense combat music for regular enemy encounters. Driving percussion and urgent melodies to fuel the heat of battle.',
            category: 'Combat'
        },
        {
            id: 'town_peaceful',
            name: 'Town of Serenity',
            file: 'music/town_peaceful.wav',
            description: 'A peaceful melody that plays while exploring friendly villages and towns. Creates a warm, welcoming atmosphere.',
            category: 'Location'
        },
        {
            id: 'dungeon_mystery',
            name: 'Depths of Shadow',
            file: 'music/dungeon_mystery.wav',
            description: 'Eerie and atmospheric music for exploring dangerous dungeons and forgotten ruins. Builds tension and mystery.',
            category: 'Location'
        },
        {
            id: 'forest_exploration',
            name: 'Whispers of the Wild',
            file: 'music/forest_exploration.wav',
            description: 'Adventurous music for exploring forests and wilderness. Evokes a sense of wonder and discovery.',
            category: 'Exploration'
        },
        {
            id: 'boss_battle',
            name: 'Wrath of the Overlord',
            file: 'music/boss_battle.wav',
            description: 'Epic and intense music for major boss battles. Conveys the gravity and danger of facing a powerful enemy.',
            category: 'Combat'
        },
        {
            id: 'emotional_moment',
            name: 'A Hero\'s Sacrifice',
            file: 'music/emotional_moment.wav',
            description: 'Emotional and moving piece for sad story moments, character deaths, or touching scenes.',
            category: 'Story'
        },
        {
            id: 'victory_fanfare',
            name: 'Triumph',
            file: 'music/victory_fanfare.wav',
            description: 'A short celebratory fanfare that plays after winning a battle or achieving a significant goal.',
            category: 'Event'
        }
    ];
    
    // DOM elements
    const audioPlayer = document.getElementById('audio-player');
    const trackTitle = document.getElementById('track-title');
    const trackDescription = document.getElementById('track-description');
    const tracksList = document.getElementById('tracks');
    
    // Populate track list
    function populateTrackList() {
        tracks.forEach(track => {
            const li = document.createElement('li');
            li.className = 'track-item';
            li.dataset.trackId = track.id;
            
            li.innerHTML = `
                <span class="track-name">${track.name}</span>
                <span class="track-category">${track.category}</span>
            `;
            
            li.addEventListener('click', () => playTrack(track));
            tracksList.appendChild(li);
        });
    }
    
    // Play a track
    function playTrack(track) {
        // Update active track highlighting
        const allTracks = document.querySelectorAll('.track-item');
        allTracks.forEach(item => item.classList.remove('active'));
        document.querySelector(`.track-item[data-track-id="${track.id}"]`).classList.add('active');
        
        // Update player
        audioPlayer.src = track.file;
        trackTitle.textContent = track.name;
        trackDescription.textContent = track.description;
        
        // Play audio
        audioPlayer.play();
    }
    
    // Initialize player
    populateTrackList();
    
    // Auto-play the first track
    if (tracks.length > 0) {
        setTimeout(() => {
            playTrack(tracks[0]);
        }, 1000);
    }
});