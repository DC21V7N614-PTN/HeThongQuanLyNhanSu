// Quản lý giao diện chung
export class UI {
    constructor() {
        this.setupMobileMenu();
        this.setupNavigation();
    }

    setupNavigation() {
        document.querySelectorAll(".nav-item").forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.showPage(page);

                document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
                item.classList.add("active");
            });
        });
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById("menuToggle");
        const sidebar = document.getElementById("sidebar");

        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });

        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = "inline-flex";
            } else {
                menuToggle.style.display = "none";
                sidebar.classList.remove("open");
            }
        };
        window.addEventListener("resize", checkScreenSize);
        checkScreenSize();
    }

    showPage(pageId) {
        document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
        const target = document.getElementById(`${pageId}-page`);
        if (target) target.classList.remove("hidden");
        document.getElementById("sidebar").classList.remove("open");

        window.dispatchEvent(new CustomEvent('pageChanged', { detail: { pageId } }));
    }

    showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
            background-color: ${type === "success" ? "var(--color-accent)" : type === "error" ? "var(--color-destructive)" : "var(--color-primary)"};
            color: white; border-radius: var(--radius); z-index: 1001; animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.remove("hidden");
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add("hidden");
    }
}