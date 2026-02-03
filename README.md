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

### Admin Panel (admin.html)
- **Password Protection**: Secure login (default password: `admin123`)
- **Content Management**: Edit all portfolio content without touching code
- **Profile Settings**: Update artist name, tagline, and profile image
- **About Section**: Edit biography paragraphs
- **Social Links**: Manage all social media links and icons
- **Gallery Management**: Update artwork titles, categories, and image URLs
- **Commission Control**: Toggle commission status (Open/Closed) and update messages
- **Persistent Storage**: Changes saved to browser localStorage
- **Secure Access**: Admin link only visible when logged in

## File Structure
```
StaticPortfolio/
├── index.html          # Main landing page
├── commissions.html    # Commissions information page
├── admin.html          # Admin panel for content management
├── styles.css          # All styling and responsive design
├── script.js           # Dynamic effects and animations
├── admin.js            # Admin panel functionality
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

#### Using the Admin Panel (Recommended)
The easiest way to customize your portfolio is through the admin panel:

1. Navigate to `admin.html` in your browser
2. Login with the default password (found in `admin.js`)
3. **IMPORTANT**: Immediately change the password by editing `ADMIN_PASSWORD` in `admin.js`
4. Edit any content directly in the admin interface:
   - Artist name and tagline
   - About section text
   - Social media links
   - Gallery artwork details
   - Commission status
5. Click "Save All Changes" to apply updates
6. Changes will immediately appear on the main pages

**Security Warning**: The admin panel uses client-side authentication which is NOT secure for production. Anyone with access to the source code can view the password. For a production website, implement proper server-side authentication with a backend. This admin panel is designed for simple personal portfolios or local use only.

**Note**: Changes are stored in your browser's localStorage. Clearing browser data will reset all customizations.

#### Manual Customization

##### Replace Images
1. Replace `images/profile.jpg` with your profile photo (recommended: 800x800px)
2. Replace `images/art1.jpg` through `images/art6.jpg` with your artwork (recommended: square format)

##### Update Content Manually
- **Artist Name**: Edit the `<h1 class="artist-name">` in `index.html`
- **About Text**: Modify the paragraphs in the `about-section`
- **Social Links**: Update the href attributes in the `links-card` section
- **Commission Prices**: Edit the pricing in `commissions.html`
- **Contact Email**: Update the mailto link in the contact section

##### Customize Colors
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
