document.addEventListener("DOMContentLoaded", function () {
	var nestedToggles = document.querySelectorAll("#navbar .dropdown-menu .dropdown-toggle");

	function closeSiblingSubmenus(currentToggle) {
		var parentList = currentToggle.closest("ul");
		if (!parentList) {
			return;
		}

		var openSubmenus = parentList.querySelectorAll(":scope > .dropend > .dropdown-menu.show");
		openSubmenus.forEach(function (submenu) {
			if (submenu !== currentToggle.nextElementSibling) {
				submenu.classList.remove("show");
				var toggle = submenu.previousElementSibling;
				if (toggle) {
					toggle.setAttribute("aria-expanded", "false");
				}
			}
		});
	}

	nestedToggles.forEach(function (toggle) {
		toggle.addEventListener("click", function (event) {
			event.preventDefault();
			event.stopPropagation();

			var submenu = this.nextElementSibling;
			if (!submenu) {
				return;
			}

			closeSiblingSubmenus(this);

			var isOpen = submenu.classList.contains("show");
			submenu.classList.toggle("show", !isOpen);
			this.setAttribute("aria-expanded", String(!isOpen));
		});
	});

	var topDropdowns = document.querySelectorAll("#navbar .nav-item.dropdown");
	topDropdowns.forEach(function (dropdown) {
		dropdown.addEventListener("hide.bs.dropdown", function () {
			var childMenus = dropdown.querySelectorAll(".dropend .dropdown-menu.show");
			childMenus.forEach(function (menu) {
				menu.classList.remove("show");
				var toggle = menu.previousElementSibling;
				if (toggle) {
					toggle.setAttribute("aria-expanded", "false");
				}
			});
		});
	});
});
