# StaticPortfolio
Static art portfolio page for artist

## Overview
A modern, responsive static portfolio website designed for visual and digital artists. Features a beautiful landing page with a circular profile photo, art gallery, and a dedicated commissions page.

## Features

### Main Page (index.html)
- **Landing Section**: Large circular profile photo with blurry mosaic background
- **About Section**: Artist biography and description
- **Links Section**: Social media and contact links in card format
- **Gallery Section**: Showcase of artwork with hover effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Commissions Page (commissions.html)
- Commission status indicator
- Four pricing tiers with detailed features
- Step-by-step commission process
- Terms and conditions
- Contact button for inquiries

## File Structure
```
StaticPortfolio/
├── index.html          # Main landing page
├── commissions.html    # Commissions information page
├── styles.css          # All styling and responsive design
├── script.js           # Dynamic effects and animations
├── images/             # Image assets
│   ├── profile.jpg     # Profile photo
│   └── art1-6.jpg      # Artwork samples
└── README.md           # This file
```

## Usage

### Viewing the Site
Simply open `index.html` in a web browser, or serve the directory with any web server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve

# Using PHP
php -S localhost:8080
```

Then navigate to `http://localhost:8080` in your browser.

### Customization

#### Replace Images
1. Replace `images/profile.jpg` with your profile photo (recommended: 800x800px)
2. Replace `images/art1.jpg` through `images/art6.jpg` with your artwork (recommended: square format)

#### Update Content
- **Artist Name**: Edit the `<h1 class="artist-name">` in `index.html`
- **About Text**: Modify the paragraphs in the `about-section`
- **Social Links**: Update the href attributes in the `links-card` section
- **Commission Prices**: Edit the pricing in `commissions.html`
- **Contact Email**: Update the mailto link in the contact section

#### Customize Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;      /* Main brand color */
    --secondary-color: #8b5cf6;    /* Accent color */
    --text-color: #1f2937;         /* Text color */
}
```

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License
All rights reserved.
