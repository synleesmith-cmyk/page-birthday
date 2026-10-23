
/* ===== 页面元素 ===== */

const pageIds = [
    "homePage",
    "giftPage",
    "albumPage",
    "mapPage",
    "capsulePage",
    "letterPage"
];

const pages = pageIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

const backgroundMusic = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");

const startButton = document.getElementById("startButton");
const giftButton = document.getElementById("giftButton");
const giftInstruction = document.getElementById("giftInstruction");
const giftMessage = document.getElementById("giftMessage");

const memoryModal = document.getElementById("memoryModal");
const modalTitle = document.getElementById("modalTitle");
const modalStory = document.getElementById("modalStory");
const closeModalButton = document.getElementById("closeModalButton");
const modalDoneButton = document.getElementById("modalDoneButton");

const mapProgress = document.getElementById("mapProgress");
const mapStars = [...document.querySelectorAll(".map-star")];

const capsuleMachine = document.querySelector(".capsule-machine");
const turnKnob = document.getElementById("turnKnob");
const capsuleHint = document.getElementById("capsuleHint");
const capsuleReveal = document.getElementById("capsuleReveal");

const openLetterButton = document.getElementById("openLetterButton");
const futureLetter = document.getElementById("futureLetter");
const restartButton = document.getElementById("restartButton");


/* ===== 页面切换 ===== */

function showPage(pageId) {
    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
        console.warn("找不到页面：", pageId);
        return;
    }

    pages.forEach(page => {
        page.hidden = page.id !== pageId;
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// 所有带 data-go 属性的返回按钮统一处理
document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });
});


/* ===== 彩带系统 ===== */

let ribbonLayer = null;

const ribbonColors = [
    "#A9D8F5",
    "#D8EEFF",
    "#FFFFFF",
    "#F3D995",
    "#C5E5FA",
    "#E9D7A6"
];

function createRibbonSystem() {
    if (document.getElementById("birthdayRibbonLayer")) {
        ribbonLayer = document.getElementById("birthdayRibbonLayer");
        return;
    }

    ribbonLayer = document.createElement("div");
    ribbonLayer.id = "birthdayRibbonLayer";
    ribbonLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(ribbonLayer);

    // 初始只生成少量彩带，避免页面一打开就太密集
    for (let i = 0; i < 12; i++) {
        window.setTimeout(createFallingRibbon, i * 220);
    }

    window.setInterval(() => {
        if (document.hidden || !ribbonLayer) return;

        if (ribbonLayer.childElementCount < 24) {
            createFallingRibbon();
        }
    }, 700);
}

function createFallingRibbon() {
    if (!ribbonLayer) return;

    const ribbon = document.createElement("span");
    ribbon.className = "birthday-ribbon";

    const color = ribbonColors[
        Math.floor(Math.random() * ribbonColors.length)
    ];

    const duration = 6 + Math.random() * 6;
    const sway = (Math.random() - 0.5) * 180;
    const endSway = (Math.random() - 0.5) * 240;
    const rotation = 240 + Math.random() * 600;

    ribbon.style.left = Math.random() * 100 + "vw";
    ribbon.style.background = color;
    ribbon.style.height = 14 + Math.random() * 18 + "px";
    ribbon.style.width = 5 + Math.random() * 5 + "px";
    ribbon.style.setProperty("--fall-duration", duration + "s");
    ribbon.style.setProperty("--sway", sway + "px");
    ribbon.style.setProperty("--end-sway", endSway + "px");
    ribbon.style.setProperty("--rotation", rotation + "deg");

    ribbon.addEventListener("animationend", () => ribbon.remove(), {
        once: true
    });

    ribbonLayer.appendChild(ribbon);
}

function celebrateWithRibbons(amount = 35) {
    if (!ribbonLayer) return;

    const available = Math.max(
        0,
        75 - ribbonLayer.childElementCount
    );

    const total = Math.min(amount, available);

    for (let i = 0; i < total; i++) {
        const ribbon = document.createElement("span");
        ribbon.className = "birthday-ribbon burst";

        const color = ribbonColors[
            Math.floor(Math.random() * ribbonColors.length)
        ];

        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 230;

        ribbon.style.left = 35 + Math.random() * 30 + "vw";
        ribbon.style.setProperty(
            "--start-y",
            10 + Math.random() * 30 + "vh"
        );
        ribbon.style.setProperty(
            "--burst-x",
            Math.cos(angle) * distance + "px"
        );
        ribbon.style.setProperty(
            "--burst-y",
            Math.sin(angle) * distance + 100 + "px"
        );
        ribbon.style.setProperty(
            "--rotation",
            180 + Math.random() * 720 + "deg"
        );
        ribbon.style.setProperty(
            "--fall-duration",
            1.5 + Math.random() * 1.3 + "s"
        );

        ribbon.style.background = color;
        ribbon.style.width = 5 + Math.random() * 6 + "px";
        ribbon.style.height = 14 + Math.random() * 18 + "px";

        ribbon.addEventListener("animationend", () => ribbon.remove(), {
            once: true
        });

        ribbonLayer.appendChild(ribbon);
    }
}

createRibbonSystem();


/* ===== 首页：开启惊喜 ===== */

if (startButton) {
    startButton.addEventListener("click", async () => {
        showPage("giftPage");
        celebrateWithRibbons(30);

        // 浏览器通常允许在用户主动点击后启动音乐
        if (backgroundMusic && backgroundMusic.paused) {
            try {
                await backgroundMusic.play();
            } catch (error) {
                // 音乐未能播放时不影响网页其他功能
                console.info("背景音乐暂时无法播放，请检查音乐文件。");
            }

            updateMusicButton();
        }
    });
}


/* ===== 背景音乐 ===== */

function updateMusicButton() {
    if (!backgroundMusic || !musicButton) return;

    const playing = !backgroundMusic.paused;

    musicButton.classList.toggle("is-playing", playing);
    musicIcon.textContent = playing ? "♫" : "♪";

    if (playing) {
        musicLabel.textContent = "暂停音乐";
    } else if (backgroundMusic.error) {
        musicLabel.textContent = "检查音乐文件";
    } else {
        musicLabel.textContent = "播放音乐";
    }
}

if (musicButton && backgroundMusic) {
    musicButton.addEventListener("click", async () => {
        if (backgroundMusic.paused) {
            try {
                await backgroundMusic.play();
            } catch (error) {
                musicLabel.textContent = "检查音乐文件";
            }
        } else {
            backgroundMusic.pause();
        }

        updateMusicButton();
    });

    backgroundMusic.addEventListener("play", updateMusicButton);
    backgroundMusic.addEventListener("pause", updateMusicButton);

    backgroundMusic.addEventListener("error", () => {
        musicButton.classList.remove("is-playing");
        musicIcon.textContent = "♪";
        musicLabel.textContent = "检查音乐文件";
    });
}


/* ===== 生日礼盒 ===== */

if (giftButton && giftMessage) {
    giftButton.addEventListener("click", () => {
        const opened = giftButton.classList.toggle("opened");

        giftMessage.hidden = !opened;
        giftButton.setAttribute("aria-expanded", String(opened));

        giftInstruction.textContent = opened
            ? "生日快乐！愿惊喜一直伴着你 ♡"
            : "点击礼盒，看看里面藏着什么 ♡";

        if (opened) {
            celebrateWithRibbons(45);
        }
    });
}

const toAlbumButton = document.getElementById("toAlbumButton");

if (toAlbumButton) {
    toAlbumButton.addEventListener("click", () => {
        showPage("albumPage");
    });
}


/* ===== 相册回忆弹窗 ===== */

function openMemory(title, story) {
    if (!memoryModal) return;

    modalTitle.textContent = title || "";
    modalStory.textContent = story || "";
    memoryModal.hidden = false;

    if (closeModalButton) {
        closeModalButton.focus();
    }
}

function closeMemory() {
    if (memoryModal) {
        memoryModal.hidden = true;
    }
}

document.querySelectorAll(".photo-card").forEach(card => {
    card.addEventListener("click", () => {
        openMemory(card.dataset.title, card.dataset.story);
    });
});

if (closeModalButton) {
    closeModalButton.addEventListener("click", closeMemory);
}

if (modalDoneButton) {
    modalDoneButton.addEventListener("click", closeMemory);
}

if (memoryModal) {
    memoryModal.addEventListener("click", event => {
        if (event.target === memoryModal) {
            closeMemory();
        }
    });
}


/* ===== 地图：点亮三颗星星 ===== */

const foundStars = new Set();

mapStars.forEach(star => {
    star.addEventListener("click", () => {
        const starName = star.querySelector("small")?.textContent || "";

        if (!foundStars.has(starName)) {
            foundStars.add(starName);
            star.classList.add("found");

            mapProgress.textContent =
                "已经点亮 " + foundStars.size + " / 3 颗星星";

            celebrateWithRibbons(18);

            if (foundStars.size === mapStars.length) {
                mapProgress.textContent =
                    "全部星星都点亮啦！你找到了所有回忆 ♡";

                celebrateWithRibbons(45);
            }
        }

        openMemory(star.dataset.title, star.dataset.story);
    });
});

const toMapButton = document.getElementById("toMapButton");

if (toMapButton) {
    toMapButton.addEventListener("click", () => {
        showPage("mapPage");
    });
    const toCapsuleButton = document.getElementById("toCapsuleButton");

if (toCapsuleButton) {
    toCapsuleButton.addEventListener("click", () => {
        showPage("capsulePage");
    });
}
}


/* ===== 扭蛋机：抽取礼物 ===== */

let capsuleOpened = false;
let capsuleTimer = null;

if (turnKnob) {
    turnKnob.addEventListener("click", () => {
        if (capsuleOpened) {
            capsuleReveal.hidden = false;
            capsuleReveal.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            return;
        }

        capsuleOpened = true;
        turnKnob.disabled = true;
        turnKnob.classList.add("turning");
        capsuleMachine.classList.add("shaking");

        capsuleHint.textContent = "正在为你准备惊喜……";

        capsuleTimer = window.setTimeout(() => {
            capsuleMachine.classList.remove("shaking");
            capsuleReveal.hidden = false;
            capsuleHint.textContent = "惊喜已经揭晓！生日快乐 ♡";

            celebrateWithRibbons(55);

            capsuleReveal.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            turnKnob.disabled = false;
            turnKnob.setAttribute("aria-label", "再次查看生日礼物");
        }, 850);
    });
}

const toLetterButton = document.getElementById("toLetterButton");

if (toLetterButton) {
    toLetterButton.addEventListener("click", () => {
        showPage("letterPage");
    });
}


/* ===== 打开写给未来的信 ===== */

if (openLetterButton && futureLetter) {
    openLetterButton.addEventListener("click", () => {
        futureLetter.hidden = false;
        openLetterButton.hidden = true;

        celebrateWithRibbons(30);

        futureLetter.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}


/* ===== 从头再看一次 ===== */

if (restartButton) {
    restartButton.addEventListener("click", () => {
        // 重置礼盒
        giftButton.classList.remove("opened");
        giftButton.setAttribute("aria-expanded", "false");
        giftMessage.hidden = true;
        giftInstruction.textContent =
            "点击礼盒，看看里面藏着什么 ♡";

        // 重置地图星星
        foundStars.clear();

        mapStars.forEach(star => {
            star.classList.remove("found");
        });

        mapProgress.textContent = "已经点亮 0 / 3 颗星星";

        // 重置扭蛋机
        capsuleOpened = false;

        if (capsuleTimer !== null) {
            window.clearTimeout(capsuleTimer);
            capsuleTimer = null;
        }

        turnKnob.disabled = false;
        turnKnob.classList.remove("turning");
        turnKnob.setAttribute("aria-label", "扭动扭蛋机旋钮");

        capsuleMachine.classList.remove("shaking");
        capsuleReveal.hidden = true;
        capsuleHint.textContent =
            "准备好了吗？点击旋钮，扭出你的生日礼物。";

        // 重置信件
        futureLetter.hidden = true;
        openLetterButton.hidden = false;

        // 关闭弹窗并回到首页
        closeMemory();
        showPage("homePage");
        celebrateWithRibbons(30);
    });
}


/* ===== 弹窗键盘操作 ===== */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMemory();
    }
});
