// ============================================
// INTERACTIVE TERMINAL
// ============================================
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

const commands = {
    help: () => `<span class="terminal-output">Comandi disponibili:</span>
<span class="terminal-output highlight">  help      </span><span class="terminal-output">- mostra questo messaggio</span>
<span class="terminal-output highlight">  orari     </span><span class="terminal-output">- quando siamo aperti</span>
<span class="terminal-output highlight">  dove      </span><span class="terminal-output">- come raggiungerci</span>
<span class="terminal-output highlight">  social    </span><span class="terminal-output">- i nostri canali</span>
<span class="terminal-output highlight">  projects  </span><span class="terminal-output">- cosa costruiamo</span>
<span class="terminal-output highlight">  whoami    </span><span class="terminal-output">- chi sei?</span>
<span class="terminal-output highlight">  clear     </span><span class="terminal-output">- pulisci terminale</span>`,
    
    orari: () => `<span class="terminal-output highlight">Martedì 18:00 → 23:45</span>
<span class="terminal-output comment"># Vieni quando vuoi, non serve prenotare</span>`,
    
    dove: () => `<span class="terminal-output">Via Valotti 3, Mompiano, Brescia</span>
<span class="terminal-output">Aula Associazioni — CedIsu</span>
<span class="terminal-output comment"># Metro fermata Europa</span>
<a href="https://maps.google.com/?q=45.5656602,10.2340253" target="_blank" class="terminal-output terminal-link">→ Apri su Google Maps</a>`,
    
    social: () => {
        const s = window.MUHACK_SOCIAL || {};
        let output = '';
        if (s.telegram) output += `<a href="https://t.me/${s.telegram}" target="_blank" class="terminal-output terminal-link">Telegram: @${s.telegram}</a>\n`;
        if (s.github) output += `<a href="https://github.com/${s.github}" target="_blank" class="terminal-output terminal-link">GitHub: ${s.github}</a>\n`;
        if (s.twitter) output += `<a href="https://twitter.com/${s.twitter}" target="_blank" class="terminal-output terminal-link">Twitter: @${s.twitter}</a>\n`;
        if (s.instagram) output += `<a href="https://instagram.com/${s.instagram}" target="_blank" class="terminal-output terminal-link">Instagram: @${s.instagram}</a>\n`;
        if (s.youtube) output += `<a href="https://youtube.com/@${s.youtube}" target="_blank" class="terminal-output terminal-link">YouTube: ${s.youtube}</a>\n`;
        if (s.email) output += `<span class="terminal-output">Email: ${s.email}</span>`;
        return output || '<span class="terminal-output">Nessun social configurato</span>';
    },
    
	projects: () => `<span class="terminal-output">I nostri progetti (alcuni) sono documentati sulla wiki:</span>
<a href="https://wiki.muhack.org/view/Category:Projects" target="_blank" class="terminal-output terminal-link">→ wiki.muhack.org/Projects</a>`,
    
    whoami: () => `<span class="terminal-output highlight">guest@muhack</span>
<span class="terminal-output">Non sei ancora un membro?</span>
<span class="terminal-output">Passa in sede, il martedì sera!</span>`,
    
    sudo: () => `<span class="terminal-output error">guest is not in the sudoers file.</span>
<span class="terminal-output error">This incident will be reported.</span>
<span class="terminal-output comment"># Nice try 😏</span>`,
    
    clear: () => 'CLEAR',
    
    ls: () => `<span class="terminal-output">orari.txt  dove.txt  progetti/  .secrets</span>`,
    
    'cat .secrets': () => `<span class="terminal-output error">cat: .secrets: Permission denied</span>
<span class="terminal-output comment"># 👀</span>`,
    
    pwd: () => `<span class="terminal-output">/home/guest</span>`,
    
    date: () => `<span class="terminal-output">${new Date().toLocaleString('it-IT')}</span>`,
    
    echo: (args) => `<span class="terminal-output">${args || ''}</span>`,
    
    cowsay: () => `<pre class="terminal-ascii"> _____________
< Muu...Hack! >
 -------------
\\   ^__^
 \\  (oo)\\_______
    (__)\\       )\\/\\
        ||----w |
        ||     ||</pre>`,
    
    matrix: () => {
        document.body.style.background = '#000';
        setTimeout(() => document.body.style.background = '', 2000);
        return `<span class="terminal-output highlight">Wake up, Neo...</span>`;
    },
    
    '42': () => `<span class="terminal-output">The answer to life, the universe, and everything.</span>`,
    
    hack: () => `<span class="terminal-output error">ACCESS DENIED</span>
<span class="terminal-output comment"># Questo non è quel tipo di hackerspace 😄</span>`,
};

const defaultResponse = (cmd) => `<span class="terminal-output error">comando non trovato: ${cmd}</span>
<span class="terminal-output">Digita <span class="terminal-output highlight">help</span> per la lista comandi</span>`;

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminalInput.value.trim().toLowerCase();
        if (!input) return;
        
        // Add command to output
        const cmdLine = document.createElement('div');
        cmdLine.innerHTML = `<div class="terminal-line" style="margin-top: 0.5rem;">
            <span class="terminal-prompt">➜</span>
            <span class="terminal-path">&nbsp;~</span>
            <span class="terminal-cmd">&nbsp;${terminalInput.value}</span>
        </div>`;
        terminalOutput.appendChild(cmdLine);
        
        // Process command
        const [cmd, ...args] = input.split(' ');
        const fullCmd = input;
        
        let response;
        if (commands[fullCmd]) {
            response = commands[fullCmd](args.join(' '));
        } else if (commands[cmd]) {
            response = commands[cmd](args.join(' '));
        } else {
            response = defaultResponse(cmd);
        }
        
        if (response === 'CLEAR') {
            terminalOutput.innerHTML = `<span class="terminal-output comment"># Terminale pulito</span>`;
        } else {
            const responseEl = document.createElement('div');
            responseEl.innerHTML = response;
            terminalOutput.appendChild(responseEl);
            
            // Limit history to last 20 items to prevent overflow
            const items = terminalOutput.children;
            while (items.length > 25) {
                terminalOutput.removeChild(items[0]);
            }
        }
        
        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});

// ============================================
// NETWORK ANIMATION
// ============================================
const canvas = document.getElementById('networkCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width, height, nodes = [], connections = [];
    let lastTime = 0;
    const frameInterval = 1000 / 30;

    const config = {
        gridSpacingX: 90,
        gridSpacingY: 55,
        nodeRadius: 2,
        maxConnectionDistance: 150,
        moveAmount: 6,
        fadeEdge: 100,
        cycleLength: 12,
        fadeDuration: 2
    };

    function isDarkMode() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    function getColors() {
        const dark = isDarkMode();
        return {
            // In dark mode usa colori più chiari su sfondo void-mid
            nodeActive: dark ? 'rgba(230, 57, 70, 0.8)' : 'rgba(230, 57, 70, 0.5)',
            nodeNormal: dark ? 'rgba(240, 242, 245, 0.25)' : 'rgba(26, 26, 46, 0.12)',
            lineActive: dark ? 'rgba(0, 212, 255, 0.5)' : 'rgba(0, 212, 255, 0.25)',
            lineNormal: dark ? 'rgba(240, 242, 245, 0.12)' : 'rgba(26, 26, 46, 0.06)'
        };
    }

    function resize() {
        const heroLeft = document.querySelector('.hero-left');
        if (!heroLeft) return;
        width = canvas.width = heroLeft.offsetWidth;
        height = canvas.height = heroLeft.offsetHeight;
        initNodes();
    }

    function initNodes() {
        nodes = [];
        connections = [];

        for (let row = 0; row < Math.ceil(height / config.gridSpacingY) + 2; row++) {
            for (let col = 0; col < Math.ceil(width / config.gridSpacingX) + 2; col++) {
                const isoOffset = (row % 2) * (config.gridSpacingX / 2);
                const x = col * config.gridSpacingX + isoOffset + 40 + (Math.random() - 0.5) * 20;
                const y = row * config.gridSpacingY + 60 + (Math.random() - 0.5) * 20;

                nodes.push({
                    baseX: x, baseY: y,
                    phase: Math.random() * Math.PI * 2,
                    phaseY: Math.random() * Math.PI * 2,
                    speed: 0.0004 + Math.random() * 0.0003,
                    pulsePhase: Math.random() * Math.PI * 2,
                    isActive: Math.random() < 0.1,
                    fadeOffset: Math.random() * config.cycleLength
                });
            }
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].baseX - nodes[j].baseX;
                const dy = nodes[i].baseY - nodes[j].baseY;
                if (Math.sqrt(dx*dx + dy*dy) < config.maxConnectionDistance && Math.random() < 0.2) {
                    connections.push({ from: i, to: j, pulsePhase: Math.random() * Math.PI * 2 });
                }
            }
        }
    }

    function getEdgeFade(x, y) {
        return Math.min(
            Math.min(1, x / config.fadeEdge),
            Math.min(1, (width - x) / config.fadeEdge),
            Math.min(1, y / (config.fadeEdge * 0.6)),
            Math.min(1, (height - y) / (config.fadeEdge * 0.6))
        );
    }

    function getNodeFade(offset, time) {
        const t = (time + offset) % config.cycleLength;
        if (t < config.fadeDuration) return t / config.fadeDuration;
        if (t < config.cycleLength - config.fadeDuration) return 1;
        return 1 - (t - (config.cycleLength - config.fadeDuration)) / config.fadeDuration;
    }

    function draw(timestamp) {
        requestAnimationFrame(draw);
        
        // Non consumare CPU se il tab è in background
        if (document.hidden) return;
        
        const delta = timestamp - lastTime;
        if (delta < frameInterval) return;
        lastTime = timestamp - (delta % frameInterval);

        ctx.clearRect(0, 0, width, height);
        const time = timestamp * 0.001;
        const colors = getColors();

        nodes.forEach(node => {
            node.x = node.baseX + Math.sin(timestamp * node.speed + node.phase) * config.moveAmount;
            node.y = node.baseY + Math.cos(timestamp * node.speed * 0.7 + node.phaseY) * config.moveAmount * 0.7;
            node.fade = getNodeFade(node.fadeOffset, time) * getEdgeFade(node.x, node.y);
        });

        ctx.lineWidth = 1;
        connections.forEach(conn => {
            const a = nodes[conn.from], b = nodes[conn.to];
            const fade = Math.min(a.fade, b.fade);
            if (fade < 0.05) return;

            const pulse = (Math.sin(time * 2 + conn.pulsePhase) + 1) * 0.5;
            const isActive = (a.isActive || b.isActive) && pulse > 0.7;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.globalAlpha = fade;
            ctx.strokeStyle = isActive ? colors.lineActive : colors.lineNormal;
            ctx.stroke();
            ctx.globalAlpha = 1;
        });

        nodes.forEach(node => {
            if (node.fade < 0.05) return;

            const pulse = (Math.sin(time * 3 + node.pulsePhase) + 1) * 0.5;
            const radius = node.isActive ? config.nodeRadius + pulse * 1.5 : config.nodeRadius;

            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.globalAlpha = node.fade;
            ctx.fillStyle = node.isActive ? colors.nodeActive : colors.nodeNormal;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
}

// ============================================
// TEXT SCRAMBLE
// ============================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#μ@';
        this.originalText = el.getAttribute('data-text');
        this.isAnimating = false;
        this.update = this.update.bind(this);
    }

    setText(newText) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.queue = [];
        
        for (let i = 0; i < newText.length; i++) {
            const start = Math.floor(Math.random() * 30);
            const end = start + Math.floor(Math.random() * 40) + 20;
            this.queue.push({ from: this.originalText[i] || '', to: newText[i], start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
    }

    update() {
        let output = '', complete = 0;
        
        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += `<span class="char">${to}</span>`;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.15) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="char scrambling">${char}</span>`;
            } else {
                output += `<span class="char">${from}</span>`;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.isAnimating = false;
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

const el = document.querySelector('.scramble-text');
if (el) {
    const fx = new TextScramble(el);
    const text = el.getAttribute('data-text');
    
    setTimeout(() => fx.setText(text), 800);
    setInterval(() => fx.setText(text), 12000);
    el.parentElement.addEventListener('mouseenter', () => fx.setText(text));
}
