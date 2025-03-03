class MusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.initPlayer();
    }

    initPlayer() {
        // Wait for YouTube IFrame API to be ready
        window.onYouTubeIframeAPIReady = () => {
            this.player = new YT.Player('youtube-player', {
                events: {
                    'onStateChange': this.onPlayerStateChange.bind(this),
                    'onReady': this.onPlayerReady.bind(this)
                }
            });
        };

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const playPauseBtn = document.querySelector('.play-pause');
        const volumeSlider = document.querySelector('.volume-slider');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlay());
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                if (this.player && this.player.setVolume) {
                    const volume = e.target.value;
                    this.player.setVolume(volume);
                    this.updateVisualizerOpacity(volume / 100);
                }
            });
        }

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.togglePlay();
            }
        });
    }

    onPlayerReady(event) {
        // Set initial volume
        if (event.target.setVolume) {
            event.target.setVolume(50);
            this.updateVisualizerOpacity(0.5);
        }
        
        // Add debug logging
        console.log('YouTube player is ready');
    }

    updateVisualizerOpacity(volume) {
        const bars = document.querySelectorAll('.visualizer .bar');
        bars.forEach(bar => {
            bar.style.opacity = 0.3 + (volume * 0.7);
        });
    }

    togglePlay() {
        if (!this.player || !this.player.getPlayerState) {
            console.log('Player not ready');
            return;
        }
        
        if (this.isPlaying) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
        
        // Add debug logging
        console.log('Toggle play, current state:', this.isPlaying);
    }

    onPlayerStateChange(event) {
        // Add debug logging
        console.log('Player state changed:', event.data);
        
        // YT.PlayerState.PLAYING = 1
        // YT.PlayerState.PAUSED = 2
        this.isPlaying = event.data === YT.PlayerState.PLAYING;
        this.updatePlayerUI();
    }

    updatePlayerUI() {
        const playPauseBtn = document.querySelector('.play-pause i');
        const visualizer = document.querySelector('.visualizer');
        
        if (!playPauseBtn || !visualizer) return;
        
        if (this.isPlaying) {
            playPauseBtn.className = 'fas fa-pause';
            visualizer.classList.add('active');
        } else {
            playPauseBtn.className = 'fas fa-play';
            visualizer.classList.remove('active');
        }
        
        // Add debug logging
        console.log('UI updated, playing:', this.isPlaying);
    }
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});
