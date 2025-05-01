const terminalOutput = document.getElementById("terminal-output");
const commandInput = document.getElementById("command-input");
const themeToggle = document.getElementById("theme-toggle");
const icon = themeToggle.querySelector("i");

// Constants
const TYPING_SPEED = 1;
const HELP_DELAY = 5000;

const WELCOME_BANNER = [
    { text: "=====================================================================", type: "system", speed: 0 },
    { text: "Welcome to the TTS3C Terminal: a gateway to my Portfolio.", type: "system", speed: 1  },
    { text: "User: Dr. Taimoor Talpur", type: "system", speed: 1 },
    { text: "Title: Security Researcher | Ethical Hacker", type: "system", speed: 1  },
    { text: "Status: [CONNECTED]", type: "status-connected", speed: 1  },
    { text: "=====================================================================", type: "system", speed: 0 },
    { text: "Type <span class='clickable-command'>help</span> for commands", type: "system" }
];

let interactionDetected = false;
let currentTypingQueue = Promise.resolve();

function typeText(element, text, speed = TYPING_SPEED) {
    return new Promise(resolve => {
        if (speed <= 0) {
            // Instant typing
            element.textContent = text;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            return resolve();
        }

        // Otherwise, simulate typing
        let i = 0;
        element.textContent = '';
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i++);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            } else {
                clearInterval(typingInterval);
                resolve();
            }
        }, speed);
    });
}


function addToTypingQueue(callback) {
    currentTypingQueue = currentTypingQueue.then(callback);
    return currentTypingQueue;
}

async function addTypedOutput(content, type = "system", speed = TYPING_SPEED) {
    return addToTypingQueue(async () => {
        const div = document.createElement("div");
        div.className = `command-output ${type}-output`;
        terminalOutput.appendChild(div);

        if (content.includes('<')) {
            div.innerHTML = content;
            div.querySelectorAll('.clickable-command').forEach(el => {
                el.addEventListener('click', handleCommandClick);
            });
        } else {
            await typeText(div, content, speed);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        return div;
    });
}

function handleCommandClick(e) {
    const command = e.target.textContent.trim().toLowerCase();
    runCommand(command);
}

async function runCommand(command) {
    if (!command) return;
    interactionDetected = true;
    await addTypedOutput(`> ${command}`, "input");
    const cmd = commands[command];
    if (cmd) {
        await cmd.execute();
    } else {
        await addTypedOutput(`Command not found: ${command}`, "error");
    }
    commandInput.value = "";
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

const commands = {
    help: {
        description: "List available commands",
        execute: async () => {
            await addTypedOutput("Available commands:");
            for (const [cmd, info] of Object.entries(commands)) {
                await addTypedOutput(`- <span class="clickable-command">${cmd}</span>: ${info.description}`);
            }
        }
    },
    about: {
        description: "About me",
        execute: async () => {
            await addTypedOutput('<span class="warning">Warning: [!!! SYSTEM UNDER CONSTRUCTION !!!]</span>', "warning");
            await addTypedOutput("Dr. Taimoor Talpur");
            await addTypedOutput("Security Researcher | Ethical Hacker");
            await addTypedOutput('Type <span class="clickable-command">contact</span> to get in touch');
        }
    },
    contact: {
        description: "Show contact info",
        execute: async () => {
            await addTypedOutput(`
                <div class="contact-icons">
                    <a href="mailto:contact@ttsec.net"><i class="fas fa-envelope"></i></a>
                    <a href="https://www.linkedin.com/in/taimoortalpur/" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="https://x.com/ttsec_" target="_blank"><i class="fab fa-twitter"></i></a>
                    <a href="https://github.com/tts3c" target="_blank"><i class="fab fa-github"></i></a>
                </div>
            `.trim(), "system");
        }
    },
    clear: {
        description: "Clear the terminal",
        execute: async () => {
            terminalOutput.innerHTML = '';
            for (const line of WELCOME_BANNER) {
                await addTypedOutput(line.text, line.type, line.speed);
            }
        }
    },
    theme: {
        description: "Toggle light/dark theme",
        execute: async () => {
            const newTheme = toggleTheme(true);
            await addTypedOutput(`Theme switched to ${newTheme}`);
        }
    }
};

commandInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const command = commandInput.value.trim().toLowerCase();
        runCommand(command);
    }
});

window.onload = async () => {
    applySavedTheme();
    initParticles();

    for (const line of WELCOME_BANNER) {
        await addTypedOutput(line.text, line.type, line.speed);
    }

    const helpTimeout = setTimeout(async () => {
        if (!interactionDetected) {
            await runCommand("help");
        }
    }, HELP_DELAY);

    const registerInteraction = () => {
        interactionDetected = true;
        clearTimeout(helpTimeout);
    };

    commandInput.addEventListener('keydown', registerInteraction);
    commandInput.addEventListener('click', registerInteraction);
    document.querySelector(".terminal").addEventListener('click', registerInteraction);
    commandInput.focus();
};

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    icon.className = newTheme === "light" ? "fas fa-moon" : "fas fa-sun";

    if (window.pJSDom?.length) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
        initParticles();
    }

    return newTheme;
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
}

function initParticles() {
    const styles = getComputedStyle(document.documentElement);
    particlesJS("particles-js", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 }},
            color: { value: styles.getPropertyValue('--particle-color-1').trim() },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: styles.getPropertyValue('--particle-color-2').trim(),
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out"
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.8 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

themeToggle.addEventListener("click", toggleTheme);