const terminalOutput = document.getElementById("terminal-output");
const commandInput = document.getElementById("command-input");
const themeToggle = document.getElementById("theme-toggle");
const icon = themeToggle.querySelector("i");

const commands = {
    help: {
        description: "List available commands",
        execute: () => {
            addOutput("Available commands:", "system");
            Object.keys(commands).forEach(cmd => {
                addOutput(`- ${cmd}: ${commands[cmd].description}`, "system");
            });
        }
    },
    about: {
        description: "About this site",
        execute: () => {
            addOutput("TTS3C Terminal - A minimal web-based terminal.", "system");
        }
    },
    contact: {
        description: "Show contact info",
        execute: () => {
            addOutput(`
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
        execute: () => terminalOutput.innerHTML = ""
    },
    theme: {
        description: "Toggle light/dark theme",
        execute: () => toggleTheme(true)
    }
};

commandInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const command = commandInput.value.trim().toLowerCase();
        addOutput(`> ${command}`, "input");

        if (commands[command]) {
            commands[command].execute();
        } else {
            addOutput(`Command not found: ${command}`, "error");
        }

        commandInput.value = "";
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});

commandInput.addEventListener("focus", () => {
    window.scrollTo(0, commandInput.getBoundingClientRect().top);
});


function addOutput(content, type = "system") {
    const div = document.createElement("div");
    div.className = `command-output ${type}-output`;
    div.innerHTML = content;
    terminalOutput.appendChild(div);
}

function initParticles() {
    const styles = getComputedStyle(document.documentElement);
    particlesJS("particles-js", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 }},
            color: { value: [styles.getPropertyValue('--particle-color-1').trim()] },
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

function toggleTheme(showMessage = false) {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    icon.className = next === "dark" ? "fas fa-sun" : "fas fa-moon";

    if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }

    initParticles();

    if (showMessage) addOutput(`Theme switched to ${next}`, "system");
}

window.onload = () => {
    const saved = localStorage.getItem("theme");
    document.documentElement.setAttribute("data-theme", saved || "dark");
    icon.className = saved === "light" ? "fas fa-moon" : "fas fa-sun";
    initParticles();
    addOutput("Welcome to the TTS3C Terminal", "system");
    addOutput("Type 'help' for available commands", "system");

    document.querySelector(".terminal").addEventListener("click", () => commandInput.focus());
    commandInput.focus();
};

themeToggle.addEventListener("click", () => toggleTheme(true));
