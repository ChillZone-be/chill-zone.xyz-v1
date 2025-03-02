// Easter Eggs System
class EasterEggSystem {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.konamiIndex = 0;
        this.secretCodes = {
            'nyancat': this.spawnNyanCat.bind(this),
            'kamehameha': this.kamehamehaEffect.bind(this),
            'matrix': this.matrixRain.bind(this),
            'megumin': this.explosionEffect.bind(this)
        };
        this.activeEffects = new Set();
        this.init();
    }

    init() {
        this.setupKonamiCode();
        this.setupSecretWords();
        this.createHiddenElements();
    }

    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.key === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.activateKonamiCode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    }

    setupSecretWords() {
        let typedWord = '';
        let typingTimer;

        document.addEventListener('keypress', (e) => {
            clearTimeout(typingTimer);
            typedWord += e.key.toLowerCase();

            typingTimer = setTimeout(() => {
                Object.keys(this.secretCodes).forEach(code => {
                    if (typedWord.includes(code)) {
                        this.secretCodes[code]();
                    }
                });
                typedWord = '';
            }, 1000);
        });
    }

    createHiddenElements() {
        // Create hidden nyan cat element
        const nyanCat = document.createElement('div');
        nyanCat.id = 'nyan-cat';
        nyanCat.style.display = 'none';
        document.body.appendChild(nyanCat);

        // Create matrix canvas
        const matrixCanvas = document.createElement('canvas');
        matrixCanvas.id = 'matrix-rain';
        matrixCanvas.style.display = 'none';
        document.body.appendChild(matrixCanvas);
    }

    spawnNyanCat() {
        if (this.activeEffects.has('nyancat')) return;
        this.activeEffects.add('nyancat');

        const nyanCat = document.getElementById('nyan-cat');
        nyanCat.style.display = 'block';
        nyanCat.innerHTML = '🐱‍💻';
        nyanCat.style.position = 'fixed';
        nyanCat.style.fontSize = '2rem';
        nyanCat.style.left = '-50px';
        nyanCat.style.top = '50%';
        nyanCat.style.zIndex = '9999';
        nyanCat.style.filter = 'hue-rotate(0deg)';

        let position = -50;
        const animation = setInterval(() => {
            position += 5;
            nyanCat.style.left = position + 'px';
            nyanCat.style.filter = `hue-rotate(${position}deg)`;
            
            if (position > window.innerWidth) {
                clearInterval(animation);
                nyanCat.style.display = 'none';
                this.activeEffects.delete('nyancat');
            }
        }, 50);
    }

    kamehamehaEffect() {
        if (this.activeEffects.has('kamehameha')) return;
        this.activeEffects.add('kamehameha');

        const beam = document.createElement('div');
        beam.style.position = 'fixed';
        beam.style.left = '0';
        beam.style.top = '50%';
        beam.style.width = '0';
        beam.style.height = '50px';
        beam.style.background = 'linear-gradient(90deg, #64B5F6, #2196F3)';
        beam.style.boxShadow = '0 0 20px #2196F3';
        beam.style.zIndex = '9999';
        document.body.appendChild(beam);

        let width = 0;
        const animation = setInterval(() => {
            width += 50;
            beam.style.width = width + 'px';
            
            if (width > window.innerWidth) {
                clearInterval(animation);
                document.body.removeChild(beam);
                this.activeEffects.delete('kamehameha');
            }
        }, 20);
    }

    matrixRain() {
        if (this.activeEffects.has('matrix')) return;
        this.activeEffects.add('matrix');

        const canvas = document.getElementById('matrix-rain');
        canvas.style.display = 'block';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '9998';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        const characters = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
        const drops = [];
        const fontSize = 16;
        const columns = canvas.width / fontSize;

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        let frameCount = 0;
        const matrixAnimation = () => {
            if (!this.activeEffects.has('matrix')) {
                canvas.style.display = 'none';
                return;
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters[Math.floor(Math.random() * characters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            frameCount++;
            if (frameCount < 300) {
                requestAnimationFrame(matrixAnimation);
            } else {
                this.activeEffects.delete('matrix');
                canvas.style.display = 'none';
            }
        };

        matrixAnimation();
    }

    explosionEffect() {
        if (this.activeEffects.has('explosion')) return;
        this.activeEffects.add('explosion');

        const explosion = document.createElement('div');
        explosion.style.position = 'fixed';
        explosion.style.left = '50%';
        explosion.style.top = '50%';
        explosion.style.transform = 'translate(-50%, -50%)';
        explosion.style.fontSize = '5rem';
        explosion.style.zIndex = '9999';
        explosion.textContent = '💥';
        document.body.appendChild(explosion);

        let scale = 0.1;
        const animation = setInterval(() => {
            scale += 0.2;
            explosion.style.transform = `translate(-50%, -50%) scale(${scale})`;
            explosion.style.opacity = 1 - scale/5;
            
            if (scale > 5) {
                clearInterval(animation);
                document.body.removeChild(explosion);
                this.activeEffects.delete('explosion');
            }
        }, 50);
    }

    activateKonamiCode() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
}

// Initialize Easter Eggs
document.addEventListener('DOMContentLoaded', () => {
    window.easterEggs = new EasterEggSystem();
});
