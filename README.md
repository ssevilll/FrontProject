# FrontFinal

Static multi-page frontend project for an e-commerce/blog style website.

## Overview

This repository contains a responsive, template-style website built with HTML, CSS, and JavaScript.
The project includes:

- A home page with marketing sections and interactive UI behaviors.
- An about page.
- Multiple blog layouts (left sidebar, right sidebar, no sidebar, and single post).
- Shared styles, scripts, fonts, and image assets under the assets folder.

## Pages

- home.html: Main landing page with hero/collection sections and interactive elements.
- about.html: About Us page.
- blog-left.html: Blog listing with left sidebar layout.
- blog-right.html: Blog listing with right sidebar layout.
- blog-noside.html: Blog listing without sidebar.
- blog-single.html: Single blog article page.

## Project Structure

```text
FrontFinal/
  home.html
  about.html
  blog-left.html
  blog-right.html
  blog-noside.html
  blog-single.html
  assets/
    fonts/
      fonts.css
    img/
    script/
      script.js
    style/
      style.css
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Flowbite (via CDN)
- Font Awesome (via CDN)

## Main Frontend Features

Implemented in assets/script/script.js and assets/style/style.css:

- Responsive multi-level navigation and dropdown/dropend behavior.
- Sticky navbar on scroll.
- Mobile menu toggle behavior.
- Welcome modal with close controls (button, backdrop click, Escape key).
- Scroll-to-top button visibility and smooth scroll.
- Light/dark theme toggle with localStorage persistence.


## Notes

- The project currently uses CDN links for third-party UI/icon libraries.
- For production use, consider pinning and auditing dependency versions.
- Update each page <title> from the default "Document" value for SEO and accessibility quality.

## License

No license file is currently included in this repository.
If you plan to share or publish this project, add a LICENSE file (for example MIT).
