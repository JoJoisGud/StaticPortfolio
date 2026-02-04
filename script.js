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

// Show admin link if logged in
function checkAndShowAdminLink() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session === 'authenticated') {
        const adminNavItem = document.getElementById('admin-nav-item');
        if (adminNavItem) {
            adminNavItem.style.display = 'block';
        }
    }
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

// Generate triangular mosaic background
function generateTriangularMosaic() {
    const mosaicBackground = document.querySelector('.background-mosaic');
    if (!mosaicBackground) return;
    
    // Clear existing content
    mosaicBackground.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    
    // Base colors for the mosaic - shades of purple/blue
    const baseColors = [
        { r: 99, g: 102, b: 241 },   // #6366f1
        { r: 139, g: 92, b: 246 },   // #8b5cf6
        { r: 102, g: 126, b: 234 },  // #667eea
        { r: 118, g: 75, b: 162 },   // #764ba2
    ];
    
    // Function to generate a color variant
    function getColorVariant(baseColor) {
        const variance = 30;
        const r = Math.max(0, Math.min(255, baseColor.r + (Math.random() * variance * 2 - variance)));
        const g = Math.max(0, Math.min(255, baseColor.g + (Math.random() * variance * 2 - variance)));
        const b = Math.max(0, Math.min(255, baseColor.b + (Math.random() * variance * 2 - variance)));
        const opacity = 0.15 + Math.random() * 0.1;
        return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${opacity})`;
    }
    
    // Store original colors for light sweep effect
    const mosaicData = [];
    
    // Calculate grid dimensions based on viewport
    // Adjust triangle size based on viewport width for better mobile experience
    const isMobile = window.innerWidth <= 768;
    const triangleSize = isMobile ? 40 : 80; // Smaller on mobile for better visibility
    // Height factor for equilateral triangles (√3/2 ≈ 0.866)
    const EQUILATERAL_TRIANGLE_HEIGHT_FACTOR = Math.sqrt(3) / 2;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cols = Math.ceil(viewportWidth / triangleSize) + 1;
    const rows = Math.ceil(viewportHeight / (triangleSize * EQUILATERAL_TRIANGLE_HEIGHT_FACTOR)) + 1;
    
    // Generate triangular grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * triangleSize;
            const y = row * (triangleSize * EQUILATERAL_TRIANGLE_HEIGHT_FACTOR);
            
            // Determine if this is an upward or downward triangle
            const isUpward = (row + col) % 2 === 0;
            
            // Create triangle polygon
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            
            if (isUpward) {
                // Upward pointing triangle
                const points = `
                    ${x},${y + triangleSize * EQUILATERAL_TRIANGLE_HEIGHT_FACTOR} 
                    ${x + triangleSize / 2},${y} 
                    ${x + triangleSize},${y + triangleSize * EQUILATERAL_TRIANGLE_HEIGHT_FACTOR}
                `;
                polygon.setAttribute('points', points.trim());
            } else {
                // Downward pointing triangle
                const points = `
                    ${x},${y} 
                    ${x + triangleSize},${y} 
                    ${x + triangleSize / 2},${y + triangleSize * EQUILATERAL_TRIANGLE_HEIGHT_FACTOR}
                `;
                polygon.setAttribute('points', points.trim());
            }
            
            // Assign a random color variant
            const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)];
            const colorVariant = getColorVariant(baseColor);
            polygon.setAttribute('fill', colorVariant);
            polygon.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
            polygon.setAttribute('stroke-width', '0.5');
            
            // Parse and store color components for efficient light sweep
            const rgba = colorVariant.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            const colorData = rgba ? {
                r: parseInt(rgba[1]),
                g: parseInt(rgba[2]),
                b: parseInt(rgba[3]),
                a: parseFloat(rgba[4])
            } : { r: 0, g: 0, b: 0, a: 0 };
            
            // Store polygon with its data for light sweep effect
            mosaicData.push({
                polygon: polygon,
                baseColor: baseColor,
                originalColor: colorVariant,
                colorData: colorData,
                diagonal: row + col // Diagonal index for wave effect
            });
            
            svg.appendChild(polygon);
        }
    }
    
    mosaicBackground.appendChild(svg);
    
    // Implement light bar sweep effect
    animateLightSweep(mosaicData, rows + cols);
}

// Animate light sweep across mosaic with tailing effect
function animateLightSweep(mosaicData, maxDiagonal) {
    if (!mosaicData || mosaicData.length === 0) return;
    
    let sweepPosition = 0;
    const sweepWidth = 8; // Number of diagonals affected by the light
    const tailLength = 5; // Length of the tailing effect
    let animationId = null;
    let lastTime = 0;
    const sweepSpeed = 80; // Milliseconds between frames
    
    function sweep(currentTime) {
        // Throttle to sweepSpeed ms between updates
        if (currentTime - lastTime < sweepSpeed) {
            animationId = requestAnimationFrame(sweep);
            return;
        }
        lastTime = currentTime;
        
        mosaicData.forEach(tile => {
            const distance = sweepPosition - tile.diagonal;
            const { r: origR, g: origG, b: origB, a: origA } = tile.colorData;
            
            if (distance >= 0 && distance < sweepWidth) {
                // Main light bar with high brightness
                const intensity = 1 - (distance / sweepWidth);
                const brightnessFactor = 1 + (intensity * 0.8); // Up to 80% brighter
                
                const r = Math.min(255, Math.floor(origR * brightnessFactor));
                const g = Math.min(255, Math.floor(origG * brightnessFactor));
                const b = Math.min(255, Math.floor(origB * brightnessFactor));
                const a = Math.min(1, origA * (1 + intensity * 0.5));
                tile.polygon.setAttribute('fill', `rgba(${r}, ${g}, ${b}, ${a})`);
            } else if (distance >= sweepWidth && distance < sweepWidth + tailLength) {
                // Tailing effect - gradual fade back to original
                const tailDistance = distance - sweepWidth;
                const tailIntensity = 1 - (tailDistance / tailLength);
                
                const baseBrightness = 1 + (tailIntensity * 0.4);
                const r = Math.min(255, Math.floor(origR * baseBrightness));
                const g = Math.min(255, Math.floor(origG * baseBrightness));
                const b = Math.min(255, Math.floor(origB * baseBrightness));
                const a = Math.min(1, origA * (1 + tailIntensity * 0.3));
                tile.polygon.setAttribute('fill', `rgba(${r}, ${g}, ${b}, ${a})`);
            } else {
                // Reset to original color
                tile.polygon.setAttribute('fill', tile.originalColor);
            }
        });
        
        sweepPosition++;
        if (sweepPosition > maxDiagonal + sweepWidth + tailLength) {
            sweepPosition = 0;
        }
        
        animationId = requestAnimationFrame(sweep);
    }
    
    animationId = requestAnimationFrame(sweep);
}

// Generate dynamic mosaic background from art pieces
document.addEventListener('DOMContentLoaded', function() {
    // Generate triangular mosaic background
    generateTriangularMosaic();
    
    // Regenerate mosaic on window resize for responsiveness
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            generateTriangularMosaic();
        }, 500);
    });
    
    // Initialize scroll-based animations observer
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
    
    // Observe gallery items for scroll animations
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Observe commission cards for scroll animations
    document.querySelectorAll('.commission-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Check and show admin link if logged in
    checkAndShowAdminLink();
    
    // Load and apply custom content
    const content = loadPortfolioContent();
    if (content) {
        applyContent(content);
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
});
