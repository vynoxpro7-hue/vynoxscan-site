// 🔧 SHU YERLARNI O'ZINGGA MOSLAB O'ZGARTIRASAN
const TELEGRAM_BOT_USERNAME = "@Vortnyx_bot"; // masalan: "VynoxBot"
const TELEGRAM_DEEP_LINK_BASE = "https/@Vortnyx_bot/t.me";

// LocalStorage kaliti
const STORAGE_KEY = "vynox_506";

document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const registerForm = document.getElementById("register-form");
    const authMessage = document.getElementById("auth-message");
    const userPanel = document.getElementById("user-panel");
    const userEmailSpan = document.getElementById("user-email");
    const logoutBtn = document.getElementById("logout-btn");
    const missionButtons = document.querySelectorAll(".mission-btn");

    // ✅ Avval ro'yxatdan o'tgan foydalanuvchini tekshiramiz
    let currentUser = loadUser();
    updateUI();

    // Ro'yxatdan o'tish formasi
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!authMessage) return;

            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                authMessage.textContent = "Email va parolni to'liq kiriting.";
                authMessage.classList.add("error");
                return;
            }

            if (password.length < 6) {
                authMessage.textContent = "Parol kamida 6 ta belgidan iborat bo'lishi kerak.";
                authMessage.classList.add("error");
                return;
            }

            // ⚠ Diqqat: bu faqat demo – haqiqiy xavfsizlik uchun backend kerak.
            const user = { email, password };
            saveUser(user);
            currentUser = user;

            authMessage.textContent = "Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi missiyalarni olishingiz mumkin.";
            authMessage.classList.remove("error");

            emailInput.value = "";
            passwordInput.value = "";

            updateUI();
        });
    }

    // Chiqish tugmasi
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            clearUser();
            currentUser = null;
            if (authMessage) {
                authMessage.textContent = "Siz tizimdan chiqdingiz. Qaytadan ro'yxatdan o'tishingiz yoki login qilishingiz mumkin.";
                authMessage.classList.remove("error");
            }
            updateUI();
        });
    }

    // Missiya tugmalari
    missionButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const missionCode = btn.getAttribute("data-mission");

            if (!currentUser) {
                alert("Avval Vynox saytida ro'yxatdan o'ting. Email va parolni kiriting.");
                return;
            }

            if (!TELEGRAM_BOT_USERNAME || TELEGRAM_BOT_USERNAME === "YourBotUsername") {
                alert("Dasturchi uchun eslatma: script.js ichida TELEGRAM_BOT_USERNAME ni o'zgartiring.");
                return;
            }

            // Telegram deep link: https://t.me/BOT_USERNAME?start=mission1
            const url = `${TELEGRAM_DEEP_LINK_BASE}/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(missionCode)}`;
            window.location.href = url;
        });
    });

    // UI ni yangilash
    function updateUI() {
        const authSection = document.getElementById("auth-section");

        if (currentUser) {
            if (userPanel) userPanel.classList.remove("hidden");
            if (authSection) authSection.classList.add("hidden");
            if (userEmailSpan) userEmailSpan.textContent = currentUser.email;
        } else {
            if (userPanel) userPanel.classList.add("hidden");
            if (authSection) authSection.classList.remove("hidden");
        }
    }
});

// LocalStorage funksiyalar
function saveUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function loadUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function clearUser() {
    localStorage.removeItem(STORAGE_KEY);
}