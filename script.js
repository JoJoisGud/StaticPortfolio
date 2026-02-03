// Generate dynamic mosaic background from art pieces
document.addEventListener('DOMContentLoaded', function() {
    const mosaicBackground = document.querySelector('.background-mosaic');
    
    if (mosaicBackground) {
        // Art pieces for mosaic background
        const artPieces = [
            'images/art1.jpg',
            'images/art2.jpg',
            'images/art3.jpg',
            'images/art4.jpg',
            'images/art5.jpg',
            'images/art6.jpg'
        ];
        
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
