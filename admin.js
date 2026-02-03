// Admin Panel JavaScript

// Default password (in a real application, this would be server-side)
// SECURITY NOTE: This is CLIENT-SIDE authentication and is NOT secure for production.
// For a production site, implement proper server-side authentication.
// Change this password immediately after deployment.
const ADMIN_PASSWORD = 'admin123';
const SESSION_KEY = 'portfolio_admin_session';
const CONTENT_KEY = 'portfolio_content';

// HTML escape function to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Escape HTML attributes
function escapeAttribute(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&#x27;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Default content structure
const defaultContent = {
    artistName: 'Artist Name',
    artistTagline: 'Visual & Digital Artist',
    profileImage: 'images/profile.jpg',
    aboutParagraph1: "Welcome to my creative space! I'm a passionate visual and digital artist dedicated to bringing imagination to life through colors, shapes, and emotions. My work explores the intersection of traditional art and digital media, creating pieces that tell stories and evoke feelings.",
    aboutParagraph2: "With years of experience in various mediums, I specialize in digital illustration, character design, and conceptual art. Each piece is crafted with attention to detail and a commitment to artistic excellence.",
    socialLinks: [
        { icon: '🎨', text: 'ArtStation', url: '#' },
        { icon: '📷', text: 'Instagram', url: '#' },
        { icon: '🐦', text: 'Twitter', url: '#' },
        { icon: '💼', text: 'LinkedIn', url: '#' },
        { icon: '✉️', text: 'Email', url: '#' }
    ],
    galleryItems: [
        { image: 'images/art1.jpg', title: 'Piece Title 1', category: 'Digital Illustration' },
        { image: 'images/art2.jpg', title: 'Piece Title 2', category: 'Character Design' },
        { image: 'images/art3.jpg', title: 'Piece Title 3', category: 'Concept Art' },
        { image: 'images/art4.jpg', title: 'Piece Title 4', category: 'Digital Painting' },
        { image: 'images/art5.jpg', title: 'Piece Title 5', category: 'Mixed Media' },
        { image: 'images/art6.jpg', title: 'Piece Title 6', category: 'Illustration' }
    ],
    commissionStatus: 'open',
    commissionMessage: 'Currently accepting new commission requests'
};

// Check if user is logged in
function checkAuth() {
    const session = localStorage.getItem(SESSION_KEY);
    return session === 'authenticated';
}

// Login form handler
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(SESSION_KEY, 'authenticated');
        showAdminPanel();
    } else {
        showError('Incorrect password. Please try again.');
    }
});

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Logout function
function logout() {
    localStorage.removeItem(SESSION_KEY);
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    loadContent();
}

// Load content from localStorage or use defaults
function loadContent() {
    const savedContent = localStorage.getItem(CONTENT_KEY);
    const content = savedContent ? JSON.parse(savedContent) : defaultContent;
    
    // Load profile settings
    document.getElementById('artist-name').value = content.artistName;
    document.getElementById('artist-tagline').value = content.artistTagline;
    document.getElementById('profile-image').value = content.profileImage;
    
    // Load about section
    document.getElementById('about-paragraph-1').value = content.aboutParagraph1;
    document.getElementById('about-paragraph-2').value = content.aboutParagraph2;
    
    // Load commission status
    document.getElementById('commission-status').value = content.commissionStatus;
    document.getElementById('commission-message').value = content.commissionMessage;
    
    // Load social links
    renderSocialLinks(content.socialLinks);
    
    // Load gallery items
    renderGalleryItems(content.galleryItems);
}

// Render social links
function renderSocialLinks(links) {
    const container = document.getElementById('social-links-container');
    container.innerHTML = '';
    
    links.forEach((link, index) => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'link-item-edit';
        linkDiv.innerHTML = `
            <input type="text" class="small-input" placeholder="Icon" value="${escapeAttribute(link.icon)}" data-link-index="${index}" data-link-field="icon">
            <input type="text" placeholder="Link Text" value="${escapeAttribute(link.text)}" data-link-index="${index}" data-link-field="text">
            <input type="text" placeholder="URL" value="${escapeAttribute(link.url)}" data-link-index="${index}" data-link-field="url">
        `;
        container.appendChild(linkDiv);
    });
}

// Render gallery items
function renderGalleryItems(items) {
    const container = document.getElementById('gallery-items-container');
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item-edit';
        itemDiv.innerHTML = `
            <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title)}">
            <div class="item-fields">
                <div class="form-group" style="margin-bottom: 0.5rem;">
                    <label>Image URL</label>
                    <input type="text" value="${escapeAttribute(item.image)}" data-gallery-index="${index}" data-gallery-field="image">
                </div>
                <div class="form-group" style="margin-bottom: 0.5rem;">
                    <label>Title</label>
                    <input type="text" value="${escapeAttribute(item.title)}" data-gallery-index="${index}" data-gallery-field="title">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label>Category</label>
                    <input type="text" value="${escapeAttribute(item.category)}" data-gallery-index="${index}" data-gallery-field="category">
                </div>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

// Save all changes
function saveChanges() {
    const savedContent = localStorage.getItem(CONTENT_KEY);
    const content = savedContent ? JSON.parse(savedContent) : defaultContent;
    
    // Save profile settings
    content.artistName = document.getElementById('artist-name').value;
    content.artistTagline = document.getElementById('artist-tagline').value;
    content.profileImage = document.getElementById('profile-image').value;
    
    // Save about section
    content.aboutParagraph1 = document.getElementById('about-paragraph-1').value;
    content.aboutParagraph2 = document.getElementById('about-paragraph-2').value;
    
    // Save commission status
    content.commissionStatus = document.getElementById('commission-status').value;
    content.commissionMessage = document.getElementById('commission-message').value;
    
    // Save social links
    const linkInputs = document.querySelectorAll('[data-link-index]');
    linkInputs.forEach(input => {
        const index = parseInt(input.getAttribute('data-link-index'));
        const field = input.getAttribute('data-link-field');
        content.socialLinks[index][field] = input.value;
    });
    
    // Save gallery items
    const galleryInputs = document.querySelectorAll('[data-gallery-index]');
    galleryInputs.forEach(input => {
        const index = parseInt(input.getAttribute('data-gallery-index'));
        const field = input.getAttribute('data-gallery-field');
        content.galleryItems[index][field] = input.value;
    });
    
    // Save to localStorage
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    
    showSuccess('✓ Changes saved successfully! The updates will appear on the main pages.');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuth()) {
        showAdminPanel();
    }
});
