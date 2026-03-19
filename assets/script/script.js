document.addEventListener("DOMContentLoaded", function () {
    const desktopMedia = window.matchMedia("(min-width: 768px)");
    const toggles = document.querySelectorAll("#navbar [data-dropdown-toggle], #navbar [data-dropend-toggle]");

    function getMenuId(toggle) {
        return toggle.getAttribute("data-dropend-toggle") || toggle.getAttribute("data-dropdown-toggle");
    }

    function closeAll() {
        toggles.forEach(function (toggle) {
            const menuId = getMenuId(toggle);
            const menu = document.getElementById(menuId);
            if (!menu) {
                return;
            }
            menu.classList.add("hidden");
            toggle.setAttribute("aria-expanded", "false");
        });
    }

    toggles.forEach(function (toggle) {
        const menuId = getMenuId(toggle);
        const menu = document.getElementById(menuId);
        const parentItem = toggle.closest("li");
        const isCustomDropend = toggle.hasAttribute("data-dropend-toggle");

        if (!menu || !parentItem) {
            return;
        }

        let closeTimer;

        const enforceDropendPosition = function () {
            if (!isCustomDropend) return;

            menu.style.position = "absolute";
            menu.style.top = "0";
            menu.style.left = "100%";   // push to the right
            menu.style.marginLeft = "4px"; // small gap
            menu.style.transform = "none";
        };

        const openMenu = function () {
            if (!desktopMedia.matches) {
                return;
            }
            clearTimeout(closeTimer);
            enforceDropendPosition();
            menu.classList.remove("hidden");
            toggle.setAttribute("aria-expanded", "true");
        };

        const closeMenu = function () {
            if (!desktopMedia.matches) {
                return;
            }
            closeTimer = setTimeout(function () {
                menu.classList.add("hidden");
                toggle.setAttribute("aria-expanded", "false");
            }, 120);
        };

        parentItem.addEventListener("mouseenter", openMenu);
        parentItem.addEventListener("mouseleave", closeMenu);

        toggle.addEventListener("click", function (event) {
            if (desktopMedia.matches) {
                event.preventDefault();
                return;
            }

            if (isCustomDropend) {
                event.preventDefault();
                event.stopPropagation();
                enforceDropendPosition();
                const isHidden = menu.classList.contains("hidden");
                menu.classList.toggle("hidden", !isHidden);
                toggle.setAttribute("aria-expanded", String(isHidden));
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (!desktopMedia.matches) {
            return;
        }

        if (!event.target.closest("#navbar")) {
            closeAll();
        }
    });

    desktopMedia.addEventListener("change", function () {
        closeAll();
    });

    const sidebarDropItems = document.querySelectorAll("#sidebar-menu > ul > li");

    sidebarDropItems.forEach(function (item) {
        const submenu = item.querySelector(":scope > ul");
        if (!submenu) {
            return;
        }

        item.style.position = "relative";
        submenu.style.position = "absolute";
        submenu.style.left = "100%";
        submenu.style.top = "0";
        submenu.style.marginLeft = "8px";
        submenu.style.zIndex = "60";
        submenu.style.display = "none";

        let closeTimer;

        const openSubmenu = function () {
            clearTimeout(closeTimer);
            submenu.classList.remove("hidden");
            submenu.style.display = "block";
        };

        const closeSubmenu = function () {
            closeTimer = setTimeout(function () {
                submenu.classList.add("hidden");
                submenu.style.display = "none";
            }, 120);
        };

        item.addEventListener("mouseenter", openSubmenu);
        item.addEventListener("mouseleave", closeSubmenu);
    });
});