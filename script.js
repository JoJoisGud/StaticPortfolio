// Load content from localStorage or use defaults
const CONTENT_KEY = 'portfolio_content';
const SESSION_KEY = 'portfolio_admin_session';

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

function loadPortfolioContent() {
    const savedContent = localStorage.getItem(CONTENT_KEY);
    if (!savedContent) return null;
    return JSON.parse(savedContent);
}

// Apply content to the page
function applyContent(content) {
    if (!content) return;
    
    // Update profile section
    const artistName = document.querySelector('.artist-name');
    if (artistName) artistName.textContent = content.artistName;
    
    const artistTagline = document.querySelector('.artist-tagline');
    if (artistTagline) artistTagline.textContent = content.artistTagline;
    
    const profileImg = document.getElementById('profile-img');
    if (profileImg) profileImg.src = escapeAttribute(content.profileImage);
    
    // Update about section
    const aboutSection = document.querySelector('.about-section .container');
    if (aboutSection) {
        const paragraphs = aboutSection.querySelectorAll('p');
        if (paragraphs[0]) paragraphs[0].textContent = content.aboutParagraph1;
        if (paragraphs[1]) paragraphs[1].textContent = content.aboutParagraph2;
    }
    
    // Update social links
    const linksCard = document.querySelector('.links-card');
    if (linksCard) {
        linksCard.innerHTML = content.socialLinks.map(link => `
            <a href="${escapeAttribute(link.url)}" class="social-link" target="_blank">
                <span class="link-icon">${escapeHtml(link.icon)}</span>
                <span class="link-text">${escapeHtml(link.text)}</span>
            </a>
        `).join('');
    }
    
    // Update gallery items
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        galleryGrid.innerHTML = content.galleryItems.map(item => `
            <div class="gallery-item">
                <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title)}">
                <div class="gallery-overlay">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.category)}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Update commission status
    const statusCard = document.querySelector('.status-card');
    if (statusCard) {
        const isOpen = content.commissionStatus === 'open';
        statusCard.className = `status-card ${isOpen ? 'open' : 'closed'}`;
        statusCard.style.borderLeftColor = isOpen ? '#10b981' : '#ef4444';
        statusCard.innerHTML = `
            <h3 style="color: ${isOpen ? '#10b981' : '#ef4444'}">📖 Status: ${isOpen ? 'Open' : 'Closed'}</h3>
            <p>${escapeHtml(content.commissionMessage)}</p>
        `;
    }
}

// Generate dynamic mosaic background from art pieces
document.addEventListener('DOMContentLoaded', function() {
    // Load and apply custom content
    const content = loadPortfolioContent();
    if (content) {
        applyContent(content);
    }
    
    const mosaicBackground = document.querySelector('.background-mosaic');
    
    if (mosaicBackground) {
        // Art pieces for mosaic background
        let artPieces = [
            'images/art1.jpg',
            'images/art2.jpg',
            'images/art3.jpg',
            'images/art4.jpg',
            'images/art5.jpg',
            'images/art6.jpg'
        ];
        
        // Use custom images if available
        if (content && content.galleryItems) {
            artPieces = content.galleryItems.map(item => item.image);
        }
        
        // Create mosaic grid
        const mosaicHtml = artPieces.map(src => 
            `<div class="mosaic-tile" style="background-image: url('${src}')"></div>`
        ).join('');
        
        mosaicBackground.innerHTML = `<div class="mosaic-grid">${mosaicHtml}</div>`;
    }
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation to gallery items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Observe commission cards
    document.querySelectorAll('.commission-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add mosaic grid styles dynamically
const style = document.createElement('style');
style.textContent = `
    .mosaic-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        width: 100%;
        height: 100%;
        gap: 10px;
        padding: 20px;
        filter: blur(15px);
        opacity: 0.3;
    }
    
    .mosaic-tile {
        background-size: cover;
        background-position: center;
        border-radius: 8px;
    }
    
    @media (max-width: 768px) {
        .mosaic-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
        }
    }
`;
document.head.appendChild(style);
