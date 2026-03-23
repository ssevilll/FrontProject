document.addEventListener("DOMContentLoaded", function () {
    const desktopMedia = window.matchMedia("(min-width: 768px)");
    const toggles = document.querySelectorAll("#navbar [data-dropdown-toggle], #navbar [data-dropend-toggle]");
    const navbarNav = document.querySelector("#navbar nav");
    const stickyStartOffset = 300;
    const scrollTopTriggerOffset = 280;
    const scrollToTopButton = document.getElementById("scroll-to-top");
    const welcomeModal = document.getElementById("welcome-modal");
    const welcomeModalClose = document.getElementById("welcome-modal-close");
    const welcomeModalCta = document.getElementById("welcome-modal-cta");

    if (welcomeModal) {
        const closeWelcomeModal = function () {
            welcomeModal.classList.remove("is-open");
            welcomeModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
        };

        const openWelcomeModal = function () {
            welcomeModal.classList.add("is-open");
            welcomeModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        };

        openWelcomeModal();

        if (welcomeModalClose) {
            welcomeModalClose.addEventListener("click", closeWelcomeModal);
        }

        if (welcomeModalCta) {
            welcomeModalCta.addEventListener("click", closeWelcomeModal);
        }

        welcomeModal.addEventListener("click", function (event) {
            if (event.target === welcomeModal) {
                closeWelcomeModal();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && welcomeModal.classList.contains("is-open")) {
                closeWelcomeModal();
            }
        });
    }

    if (scrollToTopButton) {
        const syncScrollTopButton = function () {
            scrollToTopButton.classList.toggle("is-visible", window.scrollY > scrollTopTriggerOffset);
        };

        syncScrollTopButton();
        window.addEventListener("scroll", syncScrollTopButton, { passive: true });

        scrollToTopButton.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (navbarNav) {
        const syncStickyNavbar = function () {
            navbarNav.classList.toggle("is-sticky", window.scrollY > stickyStartOffset);
        };

        syncStickyNavbar();
        window.addEventListener("scroll", syncStickyNavbar, { passive: true });
    }

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
            menu.style.marginLeft = "0";
            menu.style.transform = "none";
        };

        const openMenu = function () {
            if (!desktopMedia.matches) {
                return;
            }
            clearTimeout(closeTimer);
            
            // Set positioning for ALL dropdowns (not just custom dropends)
            if (menu.classList.contains("nav-dropdown-layer")) {
                // Ensure parent has position: relative
                if (parentItem) {
                    parentItem.style.position = "relative";
                }
                
                // Set positioning before revealing
                menu.style.position = "absolute";
                
                // For nested dropdowns (dropends), position to the right
                if (isCustomDropend) {
                    menu.style.left = "100%";
                    menu.style.top = "0";
                    menu.style.marginLeft = "0";
                    menu.style.marginTop = "0";
                } else {
                    // For main dropdowns, use default positioning
                    menu.style.bottom = "auto";
                    menu.style.left = "0";
                }
                menu.style.transform = "none";
            }
            
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

    const sidebarDropItems = document.querySelectorAll("#sidebar-menu li");

    sidebarDropItems.forEach(function (item) {
        const submenu = item.querySelector(":scope > ul");
        if (!submenu) {
            return;
        }

        const isMegaMenu = submenu.classList.contains("sidebar-mega-menu");

        const isTopLevelItem = item.parentElement && item.parentElement.matches("#sidebar-menu > ul");

        item.style.position = "relative";
        submenu.style.position = "absolute";
        submenu.style.left = isTopLevelItem ? "106%" : "100%";
        submenu.style.top = "0";
        submenu.style.marginLeft = "0";
        if (!isMegaMenu) {
            submenu.style.width = "205px";
        }
        submenu.style.zIndex = "60";
        submenu.style.display = "none";

        let closeTimer;

        const openSubmenu = function () {
            clearTimeout(closeTimer);
            submenu.classList.remove("hidden");
            submenu.style.display = isMegaMenu ? "flex" : "block";
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

    const sidebarMenu = document.getElementById("sidebar-menu");
    const sidebarOverlay = document.getElementById("sidebar-overlay");

    // Keep the overlay outside the sidebar stacking context so only the page behind is dimmed.
    if (sidebarMenu && sidebarOverlay && sidebarOverlay.parentElement === sidebarMenu) {
        document.body.appendChild(sidebarOverlay);
    }

    if (sidebarMenu && sidebarOverlay) {
        const syncSidebarOverlay = function () {
            const isOpen = !sidebarMenu.classList.contains("-translate-x-full");
            sidebarOverlay.classList.toggle("is-visible", isOpen);
        };

        const sidebarObserver = new MutationObserver(function () {
            syncSidebarOverlay();
        });

        sidebarObserver.observe(sidebarMenu, {
            attributes: true,
            attributeFilter: ["class"]
        });

        syncSidebarOverlay();
    }

    const initializeCollectionCards = function (scope) {
        if (!scope) {
            return;
        }

        const cards = scope.querySelectorAll(".collection-image-wrap");

        cards.forEach(function (wrap) {
            if (wrap.dataset.cardInitialized === "true") {
                return;
            }

            const card = wrap.closest(".card");
            const mainImage = wrap.querySelector(".collection-main-image");
            const firstThumb = wrap.querySelector(".collection-thumb");

            if (!card || !mainImage || !firstThumb) {
                return;
            }

            const originalSrc = mainImage.getAttribute("src");
            const hoverSrc = firstThumb.getAttribute("src") || originalSrc;

            if (!wrap.querySelector(".collection-actions")) {
                const actions = document.createElement("div");
                actions.className = "collection-actions";
                actions.innerHTML = [
                    '<a href="#" class="collection-action" aria-label="Add to cart"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i></a>',
                    '<a href="#" class="collection-action" aria-label="Add to wishlist"><i class="fa-solid fa-heart" aria-hidden="true"></i></a>',
                    '<a href="#" class="collection-action" aria-label="Quick view"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></a>',
                    '<a href="#" class="collection-action" aria-label="Compare"><i class="fa-solid fa-code-compare" aria-hidden="true"></i></a>'
                ].join("");
                wrap.appendChild(actions);
            }

            card.addEventListener("mouseenter", function () {
                mainImage.setAttribute("src", hoverSrc);
            });

            card.addEventListener("mouseleave", function () {
                mainImage.setAttribute("src", originalSrc);
            });

            card.addEventListener("focusin", function () {
                mainImage.setAttribute("src", hoverSrc);
            });

            card.addEventListener("focusout", function (event) {
                if (!card.contains(event.relatedTarget)) {
                    mainImage.setAttribute("src", originalSrc);
                }
            });

            wrap.dataset.cardInitialized = "true";
        });
    };

    initializeCollectionCards(document.querySelector("#collection"));
    initializeCollectionCards(document.querySelector("#exclusive"));

    const exclusiveItems = document.querySelector("#exclusive .items");
    const exclusiveTabs = document.querySelectorAll("#exclusive [data-exclusive-tab]");

    if (exclusiveItems && exclusiveTabs.length) {
        const tabData = {
            "new-arrival": [
                { title: "belted dress", current: "$111.00", old: "$185.00", main: "./assets/img/16.jpg", thumbs: ["./assets/img/5.jpg", "./assets/img/10.jpg", "./assets/img/11.jpg"], colors: ["bg-purple-500", "bg-blue-900", "bg-red-400"] },
                { title: "city blouse", current: "$108.00", old: "$172.00", main: "./assets/img/11.jpg", thumbs: ["./assets/img/6.jpg", "./assets/img/10.jpg", "./assets/img/11.jpg"] },
                { title: "summer top", current: "$96.00", old: "$149.00", main: "./assets/img/12.jpg", thumbs: ["./assets/img/8.jpg", "./assets/img/10.jpg", "./assets/img/11.jpg"] },
                { title: "party wear", current: "$124.00", old: "$192.00", main: "./assets/img/13.jpg", thumbs: ["./assets/img/1 (1).jpg", "./assets/img/10.jpg", "./assets/img/11.jpg"] },
                { title: "urban look", current: "$112.00", old: "$176.00", main: "./assets/img/9.jpg", thumbs: ["./assets/img/1 (1).jpg", "./assets/img/10.jpg", "./assets/img/11.jpg"] },
                { title: "soft style", current: "$99.00", old: "$154.00", main: "./assets/img/8.jpg", thumbs: ["./assets/img/1 (1).jpg", "./assets/img/10.jpg", "./assets/img/11.jpg"] },
                { title: "new classic", current: "$115.00", old: "$179.00", main: "./assets/img/7.jpg", thumbs: ["./assets/img/1 (1).jpg", "./assets/img/10.jpg", "./assets/img/11.jpg"] },
                { title: "everyday set", current: "$103.00", old: "$165.00", main: "./assets/img/6.jpg", thumbs: ["./assets/img/1 (1).jpg", "./assets/img/10.jpg", "./assets/img/11.jpg"] }
            ],
            "featured": [
                { title: "featured chic", current: "$128.00", old: "$198.00", main: "./assets/img/table1 (1).jpg", thumbs: ["./assets/img/table1 (8).jpg", "./assets/img/table1 (9).jpg", "./assets/img/table1 (10).jpg"] },
                { title: "featured denim", current: "$121.00", old: "$186.00", main: "./assets/img/table1 (2).jpg", thumbs: ["./assets/img/table1 (11).jpg", "./assets/img/table1 (12).jpg", "./assets/img/11.jpg"] },
                { title: "featured linen", current: "$114.00", old: "$170.00", main: "./assets/img/table1 (3).jpg", thumbs: ["./assets/img/table1 (6).jpg", "./assets/img/4.jpg", "./assets/img/10.jpg"] },
                { title: "featured formal", current: "$137.00", old: "$206.00", main: "./assets/img/table1 (4).jpg", thumbs: ["./assets/img/table1 (14).jpg", "./assets/img/12.jpg", "./assets/img/13.jpg"] },
                { title: "featured urban", current: "$118.00", old: "$182.00", main: "./assets/img/table1 (5).jpg", thumbs: ["./assets/img/table1 (9).jpg", "./assets/img/7.jpg", "./assets/img/8.jpg"] },
                { title: "featured soft", current: "$104.00", old: "$159.00", main: "./assets/img/table1 (6).jpg", thumbs: ["./assets/img/table1 (13).jpg", "./assets/img/9.jpg", "./assets/img/10.jpg"] },
                { title: "featured edge", current: "$132.00", old: "$201.00", main: "./assets/img/table1 (7).jpg", thumbs: ["./assets/img/table1 (4).jpg", "./assets/img/3.jpg", "./assets/img/4.jpg"] },
                { title: "featured mix", current: "$111.00", old: "$175.00", main: "./assets/img/table1 (8).jpg", thumbs: ["./assets/img/table1 (10).jpg", "./assets/img/6.jpg", "./assets/img/7.jpg"] }
            ],
            "special": [
                { title: "featured urban", current: "$118.00", old: "$182.00", main: "./assets/img/table1 (5).jpg", thumbs: ["./assets/img/table1 (9).jpg", "./assets/img/7.jpg", "./assets/img/8.jpg"] },
                { title: "featured soft", current: "$104.00", old: "$159.00", main: "./assets/img/table1 (6).jpg", thumbs: ["./assets/img/table1 (13).jpg", "./assets/img/9.jpg", "./assets/img/10.jpg"] },
                { title: "featured edge", current: "$132.00", old: "$201.00", main: "./assets/img/table1 (7).jpg", thumbs: ["./assets/img/table1 (4).jpg", "./assets/img/3.jpg", "./assets/img/4.jpg"] },
                { title: "featured mix", current: "$111.00", old: "$175.00", main: "./assets/img/table1 (8).jpg", thumbs: ["./assets/img/table1 (10).jpg", "./assets/img/6.jpg", "./assets/img/7.jpg"] },
                { title: "featured chic", current: "$128.00", old: "$198.00", main: "./assets/img/table1 (1).jpg", thumbs: ["./assets/img/table1 (8).jpg", "./assets/img/table1 (9).jpg", "./assets/img/table1 (10).jpg"] },
                { title: "featured denim", current: "$121.00", old: "$186.00", main: "./assets/img/table1 (2).jpg", thumbs: ["./assets/img/table1 (11).jpg", "./assets/img/table1 (12).jpg", "./assets/img/11.jpg"] },
                { title: "featured linen", current: "$114.00", old: "$170.00", main: "./assets/img/table1 (3).jpg", thumbs: ["./assets/img/table1 (6).jpg", "./assets/img/4.jpg", "./assets/img/10.jpg"] },
                { title: "featured formal", current: "$137.00", old: "$206.00", main: "./assets/img/table1 (4).jpg", thumbs: ["./assets/img/table1 (14).jpg", "./assets/img/12.jpg", "./assets/img/13.jpg"] }
            ]
        };

        const defaultCardColors = [
            ["#86efac", "#1e3a8a", "#f87171"],
            ["#a855f7", "#4338ca", "#f472b6"],
            ["#a3e635", "#0e7490", "#fb923c"],
            ["#34d399", "#075985", "#fb7185"]
        ];

        const getColorDotsHtml = function (colors) {
            return colors.map(function (colorValue) {
                const isRawColor = /^#|^rgb\(|^hsl\(/i.test(colorValue);

                if (isRawColor) {
                    return '<span class="w-5 h-5 rounded-full cursor-pointer" style="background-color: ' + colorValue + ';"></span>';
                }

                return '<span class="w-5 h-5 rounded-full ' + colorValue + ' cursor-pointer"></span>';
            }).join("");
        };

        const renderExclusiveCards = function (tabKey) {
            const items = tabData[tabKey] || tabData["new-arrival"];

            exclusiveItems.innerHTML = items.map(function (item, index) {
                const colors = item.colors || defaultCardColors[index % defaultCardColors.length];
                return [
                    '<div class="card">',
                    '<div class="w-full max-w-sm bg-white p-4" style="height: 595px; width: 323px;">',
                    '<div class="collection-image-wrap">',
                    '<img id="mainImage" src="' + item.main + '" class="collection-main-image">',
                    '<div class="collection-thumbs">',
                    '<img src="' + item.thumbs[0] + '" class="collection-thumb" alt="thumbnail one">',
                    '<img src="' + item.thumbs[1] + '" class="collection-thumb" alt="thumbnail two">',
                    '<img src="' + item.thumbs[2] + '" class="collection-thumb" alt="thumbnail three">',
                    '</div>',
                    '</div>',
                    '<div class="mt-4">',
                    '<div class="flex items-center gap-1 mb-2 text-yellow-400">★ ★ ★ ★ <span class="text-gray-300">★</span></div>',
                    '<h5 class="text-lg text-gray-700 mb-1"><a href="#" class="collection-title-link">' + item.title + '</a></h5>',
                    '<div class="flex items-center gap-2"><a href="#" class="collection-price-link"><span class="text-xl font-bold">' + item.current + '</span><span class="text-gray-400 line-through">' + item.old + '</span></a></div>',
                    '<div class="flex gap-2 mt-3">',
                    getColorDotsHtml(colors),
                    '</div>',
                    '</div>',
                    '</div>',
                    '</div>'
                ].join("");
            }).join("");

            initializeCollectionCards(exclusiveItems);
        };

        const setActiveTab = function (tabKey) {
            exclusiveTabs.forEach(function (tab) {
                tab.classList.toggle("is-active", tab.getAttribute("data-exclusive-tab") === tabKey);
            });
            renderExclusiveCards(tabKey);
        };

        exclusiveTabs.forEach(function (tab) {
            const tabKey = tab.getAttribute("data-exclusive-tab");

            tab.addEventListener("click", function () {
                setActiveTab(tabKey);
            });

            tab.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveTab(tabKey);
                }
            });
        });

        setActiveTab("new-arrival");
    }

    const collectionCarousel = document.getElementById("collection-carousel");

    if (collectionCarousel) {
        const getFlowbiteCarouselInstance = function () {
            if (window.FlowbiteInstances && typeof window.FlowbiteInstances.getInstance === "function") {
                return (
                    window.FlowbiteInstances.getInstance("Carousel", "collection-carousel") ||
                    window.FlowbiteInstances.getInstance("Carousel", collectionCarousel)
                );
            }

            if (window.flowbiteInstances && typeof window.flowbiteInstances.getInstance === "function") {
                return (
                    window.flowbiteInstances.getInstance("Carousel", "collection-carousel") ||
                    window.flowbiteInstances.getInstance("Carousel", collectionCarousel)
                );
            }

            return collectionCarousel._carousel || null;
        };

        const pauseCarousel = function () {
            const instance = getFlowbiteCarouselInstance();
            if (instance && typeof instance.pause === "function") {
                instance.pause();
            }
        };

        const resumeCarousel = function () {
            const instance = getFlowbiteCarouselInstance();
            if (instance && typeof instance.cycle === "function") {
                instance.cycle();
            }
        };

        collectionCarousel.addEventListener("mouseenter", pauseCarousel);
        collectionCarousel.addEventListener("mouseleave", resumeCarousel);
        collectionCarousel.addEventListener("focusin", pauseCarousel);
        collectionCarousel.addEventListener("focusout", function (event) {
            if (!collectionCarousel.contains(event.relatedTarget)) {
                resumeCarousel();
            }
        });
    }

    const teamCarouselElement = document.getElementById("team-carousel");
    const teamCarouselTrack = document.getElementById("team-carousel-track");

    if (teamCarouselElement && teamCarouselTrack) {
        const teamPrevButton = document.querySelector("#team .carousel-chevron-left");
        const teamNextButton = document.querySelector("#team .carousel-chevron-right");
        const transitionMs = 650;
        let isSliding = false;
        let visibleCards = 4;
        let cardWidth = 0;
        let cardGap = 24;
        let currentIndex = 0;

        const getVisibleCards = function () {
            if (window.innerWidth >= 1024) {
                return 4;
            }
            if (window.innerWidth >= 640) {
                return 2;
            }
            return 1;
        };

        const readGap = function () {
            const computed = window.getComputedStyle(teamCarouselTrack);
            const gapValue = parseFloat(computed.columnGap || computed.gap || "24");
            return Number.isFinite(gapValue) ? gapValue : 24;
        };

        const removeClones = function () {
            const clones = teamCarouselTrack.querySelectorAll("[data-team-clone='true']");
            clones.forEach(function (clone) {
                clone.remove();
            });
        };

        const buildInfiniteTrack = function () {
            removeClones();

            const originalCards = Array.from(teamCarouselTrack.querySelectorAll(":scope > .team-card"));
            if (originalCards.length < 2) {
                return;
            }

            const headClones = originalCards.slice(-visibleCards).map(function (card) {
                const clone = card.cloneNode(true);
                clone.setAttribute("data-team-clone", "true");
                return clone;
            });

            const tailClones = originalCards.slice(0, visibleCards).map(function (card) {
                const clone = card.cloneNode(true);
                clone.setAttribute("data-team-clone", "true");
                return clone;
            });

            headClones.forEach(function (clone) {
                teamCarouselTrack.insertBefore(clone, teamCarouselTrack.firstChild);
            });

            tailClones.forEach(function (clone) {
                teamCarouselTrack.appendChild(clone);
            });

            currentIndex = visibleCards;
        };

        const updateCardWidths = function () {
            visibleCards = getVisibleCards();
            cardGap = readGap();
            cardWidth = (teamCarouselElement.clientWidth - cardGap * (visibleCards - 1)) / visibleCards;

            const allCards = teamCarouselTrack.querySelectorAll(":scope > .team-card");
            allCards.forEach(function (card) {
                card.style.width = cardWidth + "px";
                card.style.minWidth = cardWidth + "px";
            });
        };

        const setTrackPosition = function (index, withTransition) {
            if (withTransition) {
                teamCarouselTrack.style.transition = "transform " + transitionMs + "ms ease";
            } else {
                teamCarouselTrack.style.transition = "none";
            }

            teamCarouselTrack.style.transform = "translateX(-" + index * (cardWidth + cardGap) + "px)";
        };

        const normalizeAfterSlide = function () {
            const originalCount = teamCarouselTrack.querySelectorAll(":scope > .team-card:not([data-team-clone='true'])").length;

            if (currentIndex >= originalCount + visibleCards) {
                currentIndex = visibleCards;
                setTrackPosition(currentIndex, false);
            } else if (currentIndex < visibleCards) {
                currentIndex = originalCount + visibleCards - 1;
                setTrackPosition(currentIndex, false);
            }
        };

        const moveNext = function () {
            if (isSliding) {
                return;
            }

            isSliding = true;
            currentIndex += 1;
            setTrackPosition(currentIndex, true);

            window.setTimeout(function () {
                normalizeAfterSlide();
                isSliding = false;
            }, transitionMs + 30);
        };

        const movePrev = function () {
            if (isSliding) {
                return;
            }

            isSliding = true;
            currentIndex -= 1;
            setTrackPosition(currentIndex, true);

            window.setTimeout(function () {
                normalizeAfterSlide();
                isSliding = false;
            }, transitionMs + 30);
        };

        const initializeTeamCarousel = function () {
            visibleCards = getVisibleCards();
            buildInfiniteTrack();
            updateCardWidths();
            setTrackPosition(currentIndex, false);
        };

        initializeTeamCarousel();

        if (teamNextButton) {
            teamNextButton.addEventListener("click", function (event) {
                event.preventDefault();
                moveNext();
            });
        }

        if (teamPrevButton) {
            teamPrevButton.addEventListener("click", function (event) {
                event.preventDefault();
                movePrev();
            });
        }

        window.addEventListener("resize", function () {
            if (isSliding) {
                return;
            }
            initializeTeamCarousel();
        });
    }

    const ourCollectionTrack = document.getElementById("carousel-track");

    if (ourCollectionTrack && ourCollectionTrack.children.length > 3) {
        let isSliding = false;
        let autoplayTimer = null;
        const slideDurationMs = 500;
        const autoplayDelayMs = 2600;

        const slideOneCard = function () {
            if (isSliding || !ourCollectionTrack.firstElementChild) {
                return;
            }

            const firstCard = ourCollectionTrack.firstElementChild;
            const shiftAmount = firstCard.getBoundingClientRect().width;

            if (!shiftAmount) {
                return;
            }

            isSliding = true;
            ourCollectionTrack.style.transition = "transform " + slideDurationMs + "ms ease";
            ourCollectionTrack.style.transform = "translateX(-" + shiftAmount + "px)";

            window.setTimeout(function () {
                ourCollectionTrack.appendChild(firstCard);
                ourCollectionTrack.style.transition = "none";
                ourCollectionTrack.style.transform = "translateX(0)";

                // Force reflow so next slide transition is applied correctly.
                void ourCollectionTrack.offsetWidth;

                isSliding = false;
            }, slideDurationMs + 30);
        };

        const startOurCollectionAutoplay = function () {
            if (autoplayTimer) {
                return;
            }

            autoplayTimer = window.setInterval(slideOneCard, autoplayDelayMs);
        };

        const stopOurCollectionAutoplay = function () {
            if (!autoplayTimer) {
                return;
            }

            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        };

        startOurCollectionAutoplay();

        ourCollectionTrack.addEventListener("mouseenter", stopOurCollectionAutoplay);
        ourCollectionTrack.addEventListener("mouseleave", startOurCollectionAutoplay);
        ourCollectionTrack.addEventListener("focusin", stopOurCollectionAutoplay);
        ourCollectionTrack.addEventListener("focusout", function (event) {
            if (!ourCollectionTrack.contains(event.relatedTarget)) {
                startOurCollectionAutoplay();
            }
        });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                stopOurCollectionAutoplay();
            } else {
                startOurCollectionAutoplay();
            }
        });
    }

    const ourCollectionCards = document.querySelectorAll("#ourcollection #carousel-track > .w-1\\/3 > div");

    if (ourCollectionCards.length) {
        const tileColumns = 6;
        const tileRows = 5;
        const tileStepMs = 52;

        const ensureImageWrapper = function (cardBody) {
            let wrapper = cardBody.querySelector(".img-wrapper");

            if (wrapper) {
                return wrapper;
            }

            let imageLink = null;
            const directChildren = cardBody.children;

            for (let i = 0; i < directChildren.length; i += 1) {
                const child = directChildren[i];
                if (child.tagName === "A" && child.querySelector("img")) {
                    imageLink = child;
                    break;
                }
            }

            if (!imageLink) {
                imageLink = cardBody.querySelector("a img")?.closest("a") || null;
            }

            if (!imageLink) {
                return null;
            }

            wrapper = document.createElement("div");
            wrapper.className = "img-wrapper";
            imageLink.parentNode.insertBefore(wrapper, imageLink);
            wrapper.appendChild(imageLink);

            return wrapper;
        };

        const ensureOverlayLayer = function (wrapper, className) {
            let layer = wrapper.querySelector(".overlay." + className);

            if (!layer) {
                layer = document.createElement("div");
                layer.className = "overlay " + className;
                wrapper.appendChild(layer);
            }

            return layer;
        };

        const fillOverlayTiles = function (layer) {
            if (layer.dataset.tilesReady === "true") {
                return;
            }

            const cells = document.createDocumentFragment();

            for (let row = 0; row < tileRows; row += 1) {
                for (let column = 0; column < tileColumns; column += 1) {
                    const cell = document.createElement("span");
                    cell.className = "overlay-cell";
                    cell.style.setProperty("--tile-delay", (row + column) * tileStepMs + "ms");
                    cells.appendChild(cell);
                }
            }

            layer.appendChild(cells);
            layer.dataset.tilesReady = "true";
        };

        ourCollectionCards.forEach(function (cardBody) {
            const wrapper = ensureImageWrapper(cardBody);
            if (!wrapper) {
                return;
            }

            const lightLayer = ensureOverlayLayer(wrapper, "overlay-light");
            const darkLayer = ensureOverlayLayer(wrapper, "overlay-dark");

            fillOverlayTiles(lightLayer);
            fillOverlayTiles(darkLayer);
        });
    }

});