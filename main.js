// === TOAST NOTIFICATION SYSTEM ===
class ToastNotification {
    constructor() {
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.id = 'toastContainer';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.setProperty('--toast-duration', `${duration}ms`);
        
        const icons = {
            success: 'fa-solid fa-check-circle',
            error: 'fa-solid fa-exclamation-circle',
            warning: 'fa-solid fa-exclamation-triangle',
            info: 'fa-solid fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <i class="${icons[type] || icons.info}"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="toast-progress"></div>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('toast-hide');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);

        // Manual close
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.classList.add('toast-hide');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            });
        }
    }

    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

// Global toast instance
let toast;

// Initialize toast when DOM is loaded (moved to main event listener)

document.addEventListener('DOMContentLoaded', function() {
    if (!toast) {
        toast = new ToastNotification();
    }
});

// Global function to replace alert()
function showToast(message, type = 'info', duration = 3000) {
    if (toast) {
        toast.show(message, type, duration);
    } else {
        // Fallback to alert if toast not initialized
        console.log(`Toast (${type}): ${message}`);
    }
}

// Convenience functions
function showSuccess(message, duration = 3000) {
    if (toast) toast.success(message, duration);
}

function showError(message, duration = 5000) {
    if (toast) toast.error(message, duration);
}

function showWarning(message, duration = 4000) {
    if (toast) toast.warning(message, duration);
}

function showInfo(message, duration = 3000) {
    if (toast) toast.info(message, duration);
}

// === BANNER SLIDER ===
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.banner-slide');
const dots = document.querySelectorAll('.dot');

function changeSlide(direction) {
    if (!slides || slides.length === 0) return;
    if (direction > 0) {
        nextSlide();
    } else {
        prevSlide();
    }
    // Reset interval for better UX when user interacts
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    }
}

function prevSlide() {
    if (!slides || slides.length === 0) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Reset animations
    const bannerContent = slides[index].querySelector('.banner-content');
    if (bannerContent) {
        const title = bannerContent.querySelector('.banner-title');
        const desc = bannerContent.querySelector('.banner-desc');
        
        if (title) {
            title.style.animation = 'none';
            setTimeout(() => {
                title.style.animation = 'slideInDown 1s ease-out';
            }, 200);
        }
        
        if (desc) {
            desc.style.animation = 'none';
            setTimeout(() => {
                desc.style.animation = 'slideInUp 1s ease-out';
            }, 400);
        }
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    createSnowfall();
    
    // Initialize banner
    if (slides.length > 0) {
        showSlide(0);
        
        // Start auto-play
        slideInterval = setInterval(nextSlide, 4000);
        
        // Pause on hover
        const bannerSection = document.querySelector('.banner-section');
        if (bannerSection) {
            bannerSection.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            bannerSection.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 4000);
            });
        }
        
        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                // Reset interval
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 4000);
            });
        });
    }

    // Welcome Notification (hide for 1 hour)
    initWelcomeNotification();
});

// === WELCOME NOTIFICATION ===
const WELCOME_HIDE_UNTIL_KEY = 'welcome_hide_until';

function initWelcomeNotification() {
    const modal = document.getElementById('welcomeNotification');
    if (!modal) return;

    const hideUntil = parseInt(localStorage.getItem(WELCOME_HIDE_UNTIL_KEY) || '0', 10);
    if (hideUntil && Date.now() < hideUntil) {
        modal.classList.remove('show');
        return;
    }

    // Show by default on entry
    modal.classList.add('show');

    // Close when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeWelcomeNotification();
        }
    });
}

function closeWelcomeNotification() {
    const modal = document.getElementById('welcomeNotification');
    if (!modal) return;
    modal.classList.remove('show');
}

function dontShowWelcomeAgain() {
    const checkbox = document.getElementById('dontShowAgain');
    if (!checkbox) return;
    if (checkbox.checked) {
        localStorage.setItem(WELCOME_HIDE_UNTIL_KEY, (Date.now() + 60 * 60 * 1000).toString());
        closeWelcomeNotification();
        showToast('Đã tắt thông báo trong 1 giờ.', 'success', 2000);
    } else {
        localStorage.removeItem(WELCOME_HIDE_UNTIL_KEY);
    }
}

function showTourGuide() {
    closeWelcomeNotification();
    scrollToSection('hot-categories');
    showToast('Kéo xuống để xem danh mục HOT, nền tảng và cách inbox nhận báo giá.', 'info', 3500);
}

// === SNOWFALL EFFECT ===
function createSnowfall() {
    const snowfall = document.getElementById('snowfall');
    if (!snowfall) return;
    
    // Multiple snowflake types with different characters
    const snowflakeTypes = [
        { chars: ['❄', '❅', '❆'], type: 'type-1', weight: 40 },      // Light snow
        { chars: ['✻', '✼', '❉'], type: 'type-2', weight: 25 },      // Medium snow  
        { chars: ['🌨️', '❄️', '🌨'], type: 'type-3', weight: 20 },      // Heavy snow
        { chars: ['✨', '💫', '⭐'], type: 'type-4', weight: 10 },      // Sparkle snow
        { chars: ['🌟', '⚡', '💎'], type: 'type-4 glow', weight: 5 }  // Special glow
    ];
    
    const totalSnowflakes = 80; // Increased count for better effect
    
    for (let i = 0; i < totalSnowflakes; i++) {
        createSnowflake(snowflakeTypes, snowfall);
    }
}

function createSnowflake(snowflakeTypes, container) {
    // Select random type based on weight
    const randomType = getRandomWeightedType(snowflakeTypes);
    const chars = randomType.chars;
    const type = randomType.type;
    
    const snowflake = document.createElement('div');
    snowflake.className = `snowflake ${type}`;
    snowflake.innerHTML = chars[Math.floor(Math.random() * chars.length)];
    
    // Random position
    snowflake.style.left = Math.random() * 100 + '%';
    
    // Random animation duration based on type
    let duration;
    if (type.includes('type-1')) {
        duration = Math.random() * 4 + 6; // 6-10s for light snow
    } else if (type.includes('type-2')) {
        duration = Math.random() * 3 + 5; // 5-8s for medium snow
    } else if (type.includes('type-3')) {
        duration = Math.random() * 2 + 4; // 4-6s for heavy snow
    } else {
        duration = Math.random() * 3 + 7; // 7-10s for sparkle snow
    }
    snowflake.style.animationDuration = duration + 's';
    
    // Random animation delay
    const delay = Math.random() * 8;
    snowflake.style.animationDelay = delay + 's';
    
    // Random size based on type
    let size;
    if (type.includes('type-1')) {
        size = Math.random() * 8 + 8; // 8-16px for light snow
    } else if (type.includes('type-2')) {
        size = Math.random() * 10 + 12; // 12-22px for medium snow
    } else if (type.includes('type-3')) {
        size = Math.random() * 12 + 16; // 16-28px for heavy snow
    } else {
        size = Math.random() * 6 + 10; // 10-16px for sparkle snow
    }
    snowflake.style.fontSize = size + 'px';
    
    // Random opacity based on type
    let opacity;
    if (type.includes('glow')) {
        opacity = Math.random() * 0.3 + 0.7; // 0.7-1.0 for glow snow
    } else if (type.includes('type-4')) {
        opacity = Math.random() * 0.4 + 0.6; // 0.6-1.0 for sparkle snow
    } else {
        opacity = Math.random() * 0.5 + 0.4; // 0.4-0.9 for regular snow
    }
    snowflake.style.opacity = opacity;
    
    // Add sparkle effect to some snowflakes
    if (Math.random() < 0.1 && !type.includes('glow')) {
        snowflake.classList.add('sparkle');
    }
    
    // Add glow effect to special snowflakes
    if (type.includes('glow')) {
        snowflake.classList.add('glow');
    }
    
    container.appendChild(snowflake);
    
    // Remove snowflake after animation and create new one
    setTimeout(() => {
        if (snowflake.parentNode) {
            snowflake.parentNode.removeChild(snowflake);
        }
        // Create new snowflake to maintain continuous effect
        createSnowflake(snowflakeTypes, container);
    }, (duration + delay) * 1000);
}

function getRandomWeightedType(types) {
    const totalWeight = types.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const type of types) {
        random -= type.weight;
        if (random <= 0) {
            return type;
        }
    }
    
    return types[0]; // Fallback
}

// Enhanced snowfall control functions
function toggleSnowfall() {
    const snowfall = document.getElementById('snowfall');
    if (snowfall) {
        snowfall.style.display = snowfall.style.display === 'none' ? 'block' : 'none';
    }
}

function increaseSnowfall() {
    const snowfall = document.getElementById('snowfall');
    if (snowfall) {
        for (let i = 0; i < 20; i++) {
            createSnowflake([
                { chars: ['❄', '❅', '❆'], type: 'type-1', weight: 40 },
                { chars: ['✻', '✼', '❉'], type: 'type-2', weight: 25 },
                { chars: ['🌨️', '❄️', '🌨'], type: 'type-3', weight: 20 },
                { chars: ['✨', '💫', '⭐'], type: 'type-4', weight: 10 },
                { chars: ['🌟', '⚡', '💎'], type: 'type-4 glow', weight: 5 }
            ], snowfall);
        }
    }
}

function decreaseSnowfall() {
    const snowflakes = document.querySelectorAll('.snowflake');
    const toRemove = Math.min(20, snowflakes.length);
    
    for (let i = 0; i < toRemove; i++) {
        if (snowflakes[i] && snowflakes[i].parentNode) {
            snowflakes[i].parentNode.removeChild(snowflakes[i]);
        }
    }
}

// === DATABASE & DOWNLOAD FUNCTIONS ===

// === TOPUP DATA SECTION ===
function renderTopupData() {
    const topupGrid = document.getElementById('topupGrid');
    if (!topupGrid) return;

    const topupData = [
        {
            id: 'topup001',
            title: 'Garena Shell',
            game: 'Garena',
            category: 'mobile',
            image: 'https://i.ibb.co/3sL8tXQ/garena-shell.jpg',
            description: 'Nạp Shell Garena cho Liên Quân, Free Fire, FIFA Online 4',
            badge: 'Hot',
            discount: '20%',
            options: [
                { name: 'Shell 100', price: '95.000đ', original: '120.000đ' },
                { name: 'Shell 200', price: '185.000đ', original: '240.000đ' },
                { name: 'Shell 500', price: '450.000đ', original: '600.000đ' },
                { name: 'Shell 1000', price: '880.000đ', original: '1.200.000đ' }
            ]
        },
        {
            id: 'topup002',
            title: 'Zing Xu',
            game: 'VNG',
            category: 'mobile',
            image: 'https://i.ibb.co/5tL9mXk/zing-xu.jpg',
            description: 'Nạp Zing Xu cho Đột Kích, Liên Minh, Audition',
            badge: 'Best Seller',
            discount: '15%',
            options: [
                { name: 'Xu 100', price: '85.000đ', original: '100.000đ' },
                { name: 'Xu 200', price: '165.000đ', original: '200.000đ' },
                { name: 'Xu 500', price: '400.000đ', original: '500.000đ' },
                { name: 'Xu 1000', price: '750.000đ', original: '1.000.000đ' }
            ]
        },
        {
            id: 'topup003',
            title: 'Steam Wallet',
            game: 'Steam',
            category: 'pc',
            image: 'https://i.ibb.co/6nK8tYr/steam-wallet.jpg',
            description: 'Nạp Steam Wallet để mua game trên Steam',
            badge: 'Popular',
            discount: '10%',
            options: [
                { name: 'Wallet $5', price: '115.000đ', original: '130.000đ' },
                { name: 'Wallet $10', price: '225.000đ', original: '260.000đ' },
                { name: 'Wallet $25', price: '550.000đ', original: '650.000đ' },
                { name: 'Wallet $50', price: '1.050.000đ', original: '1.300.000đ' }
            ]
        },
        {
            id: 'topup004',
            title: 'Google Play Gift Card',
            game: 'Google Play',
            category: 'mobile',
            image: 'https://i.ibb.co/7mL9tZp/google-play.jpg',
            description: 'Gift card Google Play cho Android',
            badge: 'Hot',
            discount: '12%',
            options: [
                { name: 'Card 100.000đ', price: '88.000đ', original: '100.000đ' },
                { name: 'Card 200.000đ', price: '175.000đ', original: '200.000đ' },
                { name: 'Card 500.000đ', price: '435.000đ', original: '500.000đ' },
                { name: 'Card 1.000.000đ', price: '850.000đ', original: '1.000.000đ' }
            ]
        },
        {
            id: 'topup005',
            title: 'App Store iTunes',
            game: 'Apple',
            category: 'mobile',
            image: 'https://i.ibb.co/8nK9tXq/app-store.jpg',
            description: 'Gift card App Store cho iPhone, iPad',
            badge: 'Premium',
            discount: '8%',
            options: [
                { name: 'Card $10', price: '230.000đ', original: '250.000đ' },
                { name: 'Card $25', price: '560.000đ', original: '625.000đ' },
                { name: 'Card $50', price: '1.100.000đ', original: '1.250.000đ' },
                { name: 'Card $100', price: '2.150.000đ', original: '2.500.000đ' }
            ]
        },
        {
            id: 'topup006',
            title: 'Riot Points (RP)',
            game: 'Riot Games',
            category: 'pc',
            image: 'https://i.ibb.co/9pL4kRf/riot-points.jpg',
            description: 'Nạp RP cho Liên Minh Huyền Thoại, Valorant',
            badge: 'Gaming',
            discount: '18%',
            options: [
                { name: 'RP 100', price: '82.000đ', original: '100.000đ' },
                { name: 'RP 280', price: '220.000đ', original: '280.000đ' },
                { name: 'RP 580', price: '450.000đ', original: '580.000đ' },
                { name: 'RP 1375', price: '1.050.000đ', original: '1.375.000đ' }
            ]
        },
        {
            id: 'topup007',
            title: 'PlayStation Network',
            game: 'Sony',
            category: 'console',
            image: 'https://i.ibb.co/4mK8tWs/psn.jpg',
            description: 'Nạp PSN Wallet cho PlayStation Store',
            badge: 'Console',
            discount: '5%',
            options: [
                { name: 'Wallet $10', price: '235.000đ', original: '250.000đ' },
                { name: 'Wallet $25', price: '580.000đ', original: '625.000đ' },
                { name: 'Wallet $50', price: '1.150.000đ', original: '1.250.000đ' },
                { name: 'Wallet $100', price: '2.250.000đ', original: '2.500.000đ' }
            ]
        },
        {
            id: 'topup008',
            title: 'Xbox Gift Card',
            game: 'Microsoft',
            category: 'console',
            image: 'https://i.ibb.co/7nK9mTq/xbox.jpg',
            description: 'Gift card Xbox cho Xbox Store',
            badge: 'Gaming',
            discount: '7%',
            options: [
                { name: 'Card $10', price: '230.000đ', original: '250.000đ' },
                { name: 'Card $25', price: '570.000đ', original: '625.000đ' },
                { name: 'Card $50', price: '1.130.000đ', original: '1.250.000đ' },
                { name: 'Card $100', price: '2.200.000đ', original: '2.500.000đ' }
            ]
        },
        {
            id: 'topup009',
            title: 'VNG Card',
            game: 'VNG',
            category: 'mobile',
            image: 'https://i.ibb.co/5tL9mXk/vng-card.jpg',
            description: 'Thẻ VNG cho game VNG: Đột Kích, Liệt Hỏa, Thu Thuật',
            badge: 'Local',
            discount: '25%',
            options: [
                { name: 'Card 50.000đ', price: '37.500đ', original: '50.000đ' },
                { name: 'Card 100.000đ', price: '75.000đ', original: '100.000đ' },
                { name: 'Card 200.000đ', price: '150.000đ', original: '200.000đ' },
                { name: 'Card 500.000đ', price: '375.000đ', original: '500.000đ' }
            ]
        },
        {
            id: 'topup010',
            title: 'Gate Card',
            game: 'Gate',
            category: 'mobile',
            image: 'https://i.ibb.co/6nK8tYr/gate-card.jpg',
            description: 'Thẻ Gate cho game: Võ Lâm, Kiếm Thế, Phong Thần',
            badge: 'Classic',
            discount: '20%',
            options: [
                { name: 'Card 50.000đ', price: '40.000đ', original: '50.000đ' },
                { name: 'Card 100.000đ', price: '80.000đ', original: '100.000đ' },
                { name: 'Card 200.000đ', price: '160.000đ', original: '200.000đ' },
                { name: 'Card 500.000đ', price: '400.000đ', original: '500.000đ' }
            ]
        },
        {
            id: 'topup011',
            title: 'Vcoin VTC',
            game: 'VTC',
            category: 'mobile',
            image: 'https://i.ibb.co/7mL9tZp/vcoin.jpg',
            description: 'Nạp Vcoin cho game VTC: Audition, Zing Speed, Đột Kích 3D',
            badge: 'Popular',
            discount: '15%',
            options: [
                { name: 'Vcoin 100', price: '85.000đ', original: '100.000đ' },
                { name: 'Vcoin 200', price: '170.000đ', original: '200.000đ' },
                { name: 'Vcoin 500', price: '425.000đ', original: '500.000đ' },
                { name: 'Vcoin 1000', price: '850.000đ', original: '1.000.000đ' }
            ]
        },
        {
            id: 'topup012',
            title: 'Netflix Gift Card',
            game: 'Netflix',
            category: 'giftcard',
            image: 'https://i.ibb.co/8nK9tXq/netflix.jpg',
            description: 'Gift card Netflix xem phim chất lượng cao',
            badge: 'Streaming',
            discount: '10%',
            options: [
                { name: 'Card 200.000đ', price: '180.000đ', original: '200.000đ' },
                { name: 'Card 500.000đ', price: '450.000đ', original: '500.000đ' },
                { name: 'Card 1.000.000đ', price: '900.000đ', original: '1.000.000đ' }
            ]
        }
    ];

    topupGrid.innerHTML = topupData.map(item => `
        <article class="topup-card ${item.category}">
            <div class="topup-header">
                <img src="${item.image}" alt="${item.title}" class="topup-image" onerror="this.src='https://via.placeholder.com/280x160/222/fff?text=${item.title}'">
                ${item.badge ? `<div class="topup-badge">${item.badge}</div>` : ''}
                ${item.discount ? `<div class="topup-discount">-${item.discount}</div>` : ''}
            </div>
            <div class="topup-info">
                <h3 class="topup-title">${item.title}</h3>
                <div class="topup-game">${item.game}</div>
                <p class="topup-description">${item.description}</p>
                
                <div class="topup-options">
                    ${item.options.map(option => `
                        <div class="topup-option">
                            <span class="option-name">${option.name}</span>
                            <span class="option-price">
                                ${option.original ? `<span class="option-price original">${option.original}</span>` : ''}
                                ${option.price}
                            </span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="topup-actions">
                    <button class="btn-topup" onclick="purchaseTopup('${item.id}')">
                        <i class="fa-solid fa-shopping-cart"></i> Nạp ngay
                    </button>
                    <button class="btn-details" onclick="viewTopupDetails('${item.id}')">
                        <i class="fa-solid fa-info-circle"></i> Chi tiết
                    </button>
                </div>
            </div>
            ${item.badge === 'Hot' ? '<div class="topup-hot">🔥</div>' : ''}
        </article>
    `).join('');

    // Initialize tab functionality
    initTopupTabs();
}

function initTopupTabs() {
    const tabs = document.querySelectorAll('.topup-tab');
    const cards = document.querySelectorAll('.topup-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const game = tab.dataset.game;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter cards
            cards.forEach(card => {
                if (game === 'all' || card.classList.contains(game)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function purchaseTopup(itemId) {
    showToast(`Bắt đầu mua DATA ${itemId}...`, 'success');
    // TODO: Open purchase modal
}

function viewTopupDetails(itemId) {
    showToast(`Xem chi tiết DATA ${itemId}`, 'info');
    // TODO: Open details modal
}

// === MONSTERS SECTION ===
function renderMonsters() {
    const monstersGrid = document.getElementById('monstersGrid');
    if (!monstersGrid) return;

    const monsters = [
        {
            id: 'monster001',
            name: 'Ancient Dragon',
            type: 'Dragon',
            level: 99,
            rarity: 'legendary',
            image: 'https://i.ibb.co/3sL8tXQ/ancient-dragon.jpg',
            description: 'Rồng cổ đại huyền thoại với sức mạnh hủy diệt thế giới',
            stats: {
                hp: 15000,
                attack: 850,
                defense: 600,
                speed: 450
            },
            abilities: ['Fire Breath', 'Tail Sweep', 'Wing Attack', 'Ancient Rage']
        },
        {
            id: 'monster002',
            name: 'Shadow Assassin',
            type: 'Assassin',
            level: 85,
            rarity: 'epic',
            image: 'https://i.ibb.co/5tL9mXk/shadow-assassin.jpg',
            description: 'Sát thủ bóng tối với tốc độ và sự tinh xảo vượt trội',
            stats: {
                hp: 4500,
                attack: 920,
                defense: 320,
                speed: 890
            },
            abilities: ['Shadow Strike', 'Vanish', 'Poison Blade', 'Critical Hit']
        },
        {
            id: 'monster003',
            name: 'Ice Titan',
            type: 'Titan',
            level: 92,
            rarity: 'epic',
            image: 'https://i.ibb.co/6nK8tYr/ice-titan.jpg',
            description: 'Khổng lồ băng với khả năng đóng băng cả chiến trường',
            stats: {
                hp: 12000,
                attack: 680,
                defense: 950,
                speed: 280
            },
            abilities: ['Ice Storm', 'Frost Armor', 'Glacial Prison', 'Blizzard']
        },
        {
            id: 'monster004',
            name: 'Thunder Wolf',
            type: 'Beast',
            level: 75,
            rarity: 'rare',
            image: 'https://i.ibb.co/7mL9tZp/thunder-wolf.jpg',
            description: 'Sói sét với sức mạnh điện tử và tốc độ ánh sáng',
            stats: {
                hp: 6800,
                attack: 750,
                defense: 480,
                speed: 720
            },
            abilities: ['Lightning Strike', 'Thunder Roar', 'Speed Boost', 'Chain Lightning']
        },
        {
            id: 'monster005',
            name: 'Forest Guardian',
            type: 'Nature',
            level: 68,
            rarity: 'rare',
            image: 'https://i.ibb.co/8nK9tXq/forest-guardian.jpg',
            description: 'Thần hộ mệnh rừng xanh với khả năng chữa trị và bảo vệ',
            stats: {
                hp: 8500,
                attack: 520,
                defense: 780,
                speed: 350
            },
            abilities: ['Nature Heal', 'Vine Bind', 'Forest Shield', 'Life Bloom']
        },
        {
            id: 'monster006',
            name: 'Fire Elemental',
            type: 'Elemental',
            level: 72,
            rarity: 'rare',
            image: 'https://i.ibb.co/9pL4kRf/fire-elemental.jpg',
            description: 'Yếu tố lửa nguyên thủy với sức mạnh hủy diệt',
            stats: {
                hp: 5800,
                attack: 820,
                defense: 420,
                speed: 550
            },
            abilities: ['Inferno', 'Fire Shield', 'Meteor Strike', 'Burn']
        },
        {
            id: 'monster007',
            name: 'Dark Knight',
            type: 'Warrior',
            level: 80,
            rarity: 'epic',
            image: 'https://i.ibb.co/4mK8tWs/dark-knight.jpg',
            description: 'Hiệp sĩ bóng tối với kỹ năng chiến đấu bậc thầy',
            stats: {
                hp: 9200,
                attack: 780,
                defense: 850,
                speed: 420
            },
            abilities: ['Dark Slash', 'Iron Defense', 'Soul Drain', 'Berserk']
        },
        {
            id: 'monster008',
            name: 'Wind Sprite',
            type: 'Elemental',
            level: 55,
            rarity: 'common',
            image: 'https://i.ibb.co/7nK9mTq/wind-sprite.jpg',
            description: 'Tinh thể gió nhỏ bé nhưng nhanh nhẹn và khó bắt',
            stats: {
                hp: 3200,
                attack: 480,
                defense: 280,
                speed: 950
            },
            abilities: ['Gust', 'Tornado', 'Speed Boost', 'Evasion']
        },
        {
            id: 'monster009',
            name: 'Earth Golem',
            type: 'Earth',
            level: 78,
            rarity: 'rare',
            image: 'https://i.ibb.co/5tL9mXk/earth-golem.jpg',
            description: 'Golem đất với phòng thủ gần như bất khả xâm phạm',
            stats: {
                hp: 11000,
                attack: 550,
                defense: 980,
                speed: 180
            },
            abilities: ['Rock Shield', 'Earthquake', 'Stone Skin', 'Ground Slam']
        }
    ];

    monstersGrid.innerHTML = monsters.map(monster => `
        <article class="monster-card">
            <div class="monster-header">
                <img src="${monster.image}" alt="${monster.name}" class="monster-image" onerror="this.src='https://via.placeholder.com/300x200/222/fff?text=${monster.name}'">
                <div class="monster-level">Lv.${monster.level}</div>
                <div class="monster-rarity rarity-${monster.rarity}">${getRarityText(monster.rarity)}</div>
            </div>
            <div class="monster-info">
                <h3 class="monster-name">${monster.name}</h3>
                <div class="monster-type">${monster.type}</div>
                
                <div class="monster-stats">
                    <div class="stat-item">
                        <i class="fa-solid fa-heart"></i>
                        <span>HP</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${(monster.stats.hp / 15000) * 100}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fa-solid fa-sword"></i>
                        <span>ATK</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${(monster.stats.attack / 1000) * 100}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fa-solid fa-shield"></i>
                        <span>DEF</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${(monster.stats.defense / 1000) * 100}%"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fa-solid fa-bolt"></i>
                        <span>SPD</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${(monster.stats.speed / 1000) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <p class="monster-desc">${monster.description}</p>
                
                <div class="monster-abilities">
                    ${monster.abilities.map(ability => `<span class="ability-tag">${ability}</span>`).join('')}
                </div>
                
                <div class="monster-actions">
                    <button class="btn-view-details" onclick="viewMonsterDetails('${monster.id}')">
                        <i class="fa-solid fa-eye"></i> Chi tiết
                    </button>
                    <button class="btn-capture" onclick="captureMonster('${monster.id}')">
                        <i class="fa-solid fa-net"></i> Thu phục
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function getRarityText(rarity) {
    const rarityMap = {
        'legendary': 'Huyền Thoại',
        'epic': 'Sử Thi',
        'rare': 'Hiếm',
        'common': 'Phổ Thông'
    };
    return rarityMap[rarity] || rarity;
}

function viewMonsterDetails(monsterId) {
    showToast(`Xem chi tiết bạo vật ${monsterId}`, 'info');
    // TODO: Open modal with detailed monster information
}

function captureMonster(monsterId) {
    showToast(`Bắt đầu thu phục bạo vật ${monsterId}...`, 'success');
    // TODO: Implement capture mini-game or logic
}

// Initialize sample data if empty
function initializeSampleData() {
    const files = JSON.parse(localStorage.getItem(DB_FILES)) || [];
    
    console.log('initializeSampleData: Current files count:', files.length);
    
    // Chỉ thêm sample data nếu hoàn toàn trống
    if (files.length === 0) {
        const sampleFiles = [
            {
                id: 'FILE001',
                name: 'Adobe Photoshop 2024',
                category: 'soft-design',
                size: '4.2 GB',
                downloads: 15420,
                viewCount: 45320,
                link: 'https://example.com/photoshop-2024',
                desc: 'Phần mềm chỉnh sửa ảnh chuyên nghiệp hàng đầu thế giới',
                image: 'https://i.ibb.co/6y2kF2Q/photoshop-2024.jpg'
            },
            {
                id: 'FILE002',
                name: 'Microsoft Office 2024 Pro Plus',
                category: 'soft-office',
                size: '2.8 GB',
                downloads: 28950,
                viewCount: 67890,
                link: 'https://example.com/office-2024',
                desc: 'Bộ văn phòng hoàn chỉnh với Word, Excel, PowerPoint',
                image: 'https://i.ibb.co/mGvFpQJ/office-2024.jpg'
            },
            {
                id: 'FILE003',
                name: 'Grand Theft Auto VI',
                category: 'game-pc',
                size: '125 GB',
                downloads: 89320,
                viewCount: 234560,
                link: 'https://example.com/gta-vi',
                desc: 'Game hành động thế giới mở cực kỳ hấp dẫn',
                image: 'https://i.ibb.co/3sL8tXQ/gta-vi.jpg'
            },
            {
                id: 'FILE004',
                name: 'Windows 11 Pro',
                category: 'tools-system',
                size: '5.1 GB',
                downloads: 45670,
                viewCount: 123450,
                link: 'https://example.com/windows-11',
                desc: 'Hệ điều hành Windows 11 Pro bản quyền',
                image: 'https://i.ibb.co/2W8tKdQ/windows-11.jpg'
            },
            {
                id: 'FILE005',
                name: 'Adobe Premiere Pro 2024',
                category: 'soft-design',
                size: '3.5 GB',
                downloads: 12340,
                viewCount: 34560,
                link: 'https://example.com/premiere-pro',
                desc: 'Phần mềm dựng video chuyên nghiệp',
                image: 'https://i.ibb.co/8Xk4tYp/premiere-pro.jpg'
            },
            {
                id: 'FILE006',
                name: 'Visual Studio 2024',
                category: 'soft-dev',
                size: '8.7 GB',
                downloads: 8760,
                viewCount: 23450,
                link: 'https://example.com/vs-2024',
                desc: 'Môi trường phát triển .NET và C++',
                image: 'https://i.ibb.co/7nK9mTq/vs-2024.jpg'
            },
            {
                id: 'FILE007',
                name: 'FIFA 2024',
                category: 'game-pc',
                size: '52 GB',
                downloads: 65430,
                viewCount: 187650,
                link: 'https://example.com/fifa-2024',
                desc: 'Game bóng đá FIFA mới nhất',
                image: 'https://i.ibb.co/9pL4kRf/fifa-2024.jpg'
            },
            {
                id: 'FILE008',
                name: 'Adobe Illustrator 2024',
                category: 'soft-design',
                size: '2.9 GB',
                downloads: 9870,
                viewCount: 28900,
                link: 'https://example.com/illustrator',
                desc: 'Phần mềm thiết kế đồ họa vector',
                image: 'https://i.ibb.co/4mK8tWs/illustrator.jpg'
            },
            {
                id: 'FILE009',
                name: 'KMSpico Activator',
                category: 'tools-security',
                size: '2.1 MB',
                downloads: 156780,
                viewCount: 456780,
                link: 'https://example.com/kmspico',
                desc: 'Công cụ kích hoạt Windows và Office',
                image: 'https://i.ibb.co/5tL9mXk/kmspico.jpg'
            },
            {
                id: 'FILE010',
                name: 'Adobe After Effects 2024',
                category: 'soft-design',
                size: '3.8 GB',
                downloads: 7650,
                viewCount: 19870,
                link: 'https://example.com/after-effects',
                desc: 'Phần mềm hiệu ứng hình ảnh chuyên nghiệp',
                image: 'https://i.ibb.co/6nK8tYr/after-effects.jpg'
            },
            {
                id: 'FILE011',
                name: 'CCleaner Professional',
                category: 'tools-system',
                size: '25 MB',
                downloads: 34560,
                viewCount: 87650,
                link: 'https://example.com/ccleaner',
                desc: 'Phần mềm dọn rác và tối ưu hệ thống',
                image: 'https://i.ibb.co/7mL9tZp/ccleaner.jpg'
            },
            {
                id: 'FILE012',
                name: 'Adobe Acrobat Pro DC 2024',
                category: 'soft-office',
                size: '1.2 GB',
                downloads: 18970,
                viewCount: 45680,
                link: 'https://example.com/acrobat',
                desc: 'Phần mềm làm việc với file PDF chuyên nghiệp',
                image: 'https://i.ibb.co/8nK9tXq/acrobat.jpg'
            },
            {
                id: 'FILE013',
                name: 'Lập trình Python từ A-Z',
                category: 'doc-education',
                size: '125 MB',
                downloads: 23450,
                viewCount: 67890,
                link: 'https://example.com/python-course',
                desc: 'Khóa học lập trình Python đầy đủ',
                image: 'https://i.ibb.co/9pL4kRf/python-course.jpg'
            },
            {
                id: 'FILE014',
                name: 'Adobe Dreamweaver 2024',
                category: 'soft-dev',
                size: '1.8 GB',
                downloads: 4560,
                viewCount: 12340,
                link: 'https://example.com/dreamweaver',
                desc: 'Phần mềm thiết kế web chuyên nghiệp',
                image: 'https://i.ibb.co/5tL9mXk/dreamweaver.jpg'
            },
            {
                id: 'FILE015',
                name: 'Tài liệu ôn thi Đại học',
                category: 'doc-ebook',
                size: '450 MB',
                downloads: 56780,
                viewCount: 123450,
                link: 'https://example.com/tailieu-daihoc',
                desc: 'Tổng hợp tài liệu ôn thi đại học các môn',
                image: 'https://i.ibb.co/6nK8tYr/tailieu-daihoc.jpg'
            }
        ];
        
        localStorage.setItem(DB_FILES, JSON.stringify(sampleFiles));
        showToast('Đã thêm dữ liệu mẫu!', 'success');
    }
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            console.log('New version available, refreshing...');
                            window.location.reload();
                        }
                    });
                });
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

function showPullIndicator(distance) {
    let indicator = document.querySelector('.pull-to-refresh');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'pull-to-refresh';
        indicator.innerHTML = '<i class="fa-solid fa-arrow-down"></i> Kéo để làm mới';
        document.body.appendChild(indicator);
    }
    
    const opacity = Math.min(distance / 100, 1);
    indicator.style.top = `${Math.min(distance - 60, 20)}px`;
    indicator.style.opacity = opacity;
}

function hidePullIndicator() {
    const indicator = document.querySelector('.pull-to-refresh');
    if (indicator) {
        indicator.remove();
    }
}

function refreshContent() {
    // Show loading state
    const indicator = document.querySelector('.pull-to-refresh');
    if (indicator) {
        indicator.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang làm mới...';
        indicator.classList.add('active');
    }
    
    // Refresh content
    setTimeout(() => {
        renderFiles();
        renderHotFiles();
        hidePullIndicator();
        showToast('Nội dung đã được làm mới!');
    }, 1000);
}

// App-like toast notifications
function showAppToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--card-bg);
        color: var(--text-color);
        padding: 12px 24px;
        border-radius: 25px;
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: toastSlideIn 0.3s ease;
        max-width: 80%;
        text-align: center;
        border: 1px solid var(--border-color);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes toastSlideIn {
        from { transform: translate(-50%, 100px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes toastSlideOut {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, 100px); opacity: 0; }
    }
    
    .update-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .update-content button {
        background: #000;
        color: var(--primary-color);
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
        font-size: 0.8rem;
    }
    
    .update-content button:hover {
        background: #333;
    }
`;
document.head.appendChild(style);

// Install app prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    setTimeout(() => {
        showInstallButton();
    }, 3000);
});

function showInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.className = 'install-app-btn';
    installBtn.innerHTML = '<i class="fa-solid fa-download"></i> Cài đặt ứng dụng';
    
    installBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: #000;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow);
    `;
    
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                showToast('Ứng dụng đã được cài đặt thành công!');
            }
            deferredPrompt = null;
        }
        installBtn.remove();
    });
    
    document.body.appendChild(installBtn);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (installBtn.parentElement) {
            installBtn.remove();
        }
    }, 10000);
}

// Enhanced download function with offline support
function downloadFile(id, name) {
    // Check if online
    if (!navigator.onLine) {
        showToast('Bạn đang offline. File sẽ được tải khi có kết nối.');
        // Store download request for later
        const offlineDownloads = JSON.parse(localStorage.getItem('offline_downloads') || '[]');
        offlineDownloads.push({ id, name, timestamp: Date.now() });
        localStorage.setItem('offline_downloads', JSON.stringify(offlineDownloads));
        return;
    }
    
    const files = JSON.parse(localStorage.getItem(DB_FILES)) || [];
    const file = files.find(f => f.id === id);

    if (file) {
        // Add to history
        const downloads = JSON.parse(localStorage.getItem(DB_DOWNLOADS)) || [];
        const downloadItem = {
            id: Date.now(),
            fileId: file.id,
            fileName: file.name,
            timestamp: new Date().toISOString()
        };
        downloads.push(downloadItem);
        localStorage.setItem(DB_DOWNLOADS, JSON.stringify(downloads));
        
        // Update download count
        file.downloads = (file.downloads || 0) + 1;
        localStorage.setItem(DB_FILES, JSON.stringify(files));
        
        // Update UI
        updateDownloadsBadge();
        renderFiles();
        renderHotFiles();
        
        // Show success message
        showToast(`Đã thêm "${name}" vào lịch sử tải!`);
        
        // Trigger download
        const link = document.createElement('a');
        link.href = file.link;
        link.download = file.name;
        link.target = '_blank';
        link.click();
    }
}

// Sync offline downloads when back online
window.addEventListener('online', () => {
    const offlineDownloads = JSON.parse(localStorage.getItem('offline_downloads') || '[]');
    if (offlineDownloads.length > 0) {
        showToast('Đang đồng bộ các tải xuống offline...');
        offlineDownloads.forEach(item => {
            downloadFile(item.id, item.name);
        });
        localStorage.removeItem('offline_downloads');
    }
});

// === 1. DATABASE ===
const DB_FILES = 'download_files';
const DB_DOWNLOADS = 'download_history';

 const supabaseUrl = 'https://ptotukjsupfsjwzrxkky.supabase.co';
 const supabaseKey = 'DÁN_MÃ_ANON_CỦA_TRIẾT_VÀO_ĐÂY';
 const USE_CLOUD = typeof supabase !== 'undefined' && typeof supabaseKey === 'string' && !supabaseKey.includes('DÁN_MÃ_ANON_CỦA_TRIẾT_VÀO_ĐÂY');
 const _supabase = (typeof supabase !== 'undefined') ? supabase.createClient(supabaseUrl, supabaseKey) : null;

 async function loadProductsFromCloud() {
     if (!USE_CLOUD || !_supabase) {
         return;
     }

     const { data: products, error } = await _supabase
         .from('products')
         .select('*')
         .order('id', { ascending: false });

     if (error) {
         console.error("Lỗi:", error.message);
         return;
     }

     const grid = document.getElementById('filesGrid');
     if (!grid) return;

     if (!products || products.length === 0) {
         grid.innerHTML = '<p style="text-align:center; width:100%;">Chưa có sản phẩm nào.</p>';
         return;
     }

     grid.innerHTML = products.map(p => `
         <div class="product-card">
             <div class="product-badge">${p.category || ''}</div>
             <img src="${p.image || 'https://via.placeholder.com/150'}" alt="${p.name || ''}" onerror="this.src='https://via.placeholder.com/150'">
             <div class="product-info">
                 <h3>${p.name || ''}</h3>
                 <p><i class="fa-solid fa-file"></i> ${p.size || ''}</p>
                 <a href="${p.link || '#'}" class="btn-primary" target="_blank">Tải về / Inbox</a>
             </div>
         </div>
     `).join('');
 }

// Khởi tạo dữ liệu mẫu nếu trống
if (!USE_CLOUD && !localStorage.getItem(DB_FILES)) {
    const samples = [
        { id: '1', name: 'CS2 Full', category: 'game-pc', size: '25 GB', link: 'https://example.com/cs2.zip', desc: 'Counter-Strike 2 Full Crack', downloads: 1234, viewCount: 200, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNkIzNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q1MyIEZ1bGw8L3RleHQ+PC9zdmc+' },
        { id: '2', name: 'Office 2024', category: 'soft-office', size: '3.2 GB', link: 'https://example.com/office2024.zip', desc: 'Microsoft Office 2024 Full', downloads: 856, viewCount: 150, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwNzhENCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+T2ZmaWNlIDIwMjQ8L3RleHQ+PC9zdmc+' },
        { id: '3', name: 'Tool Mod APK', category: 'game-mod', size: '150 MB', link: 'https://example.com/toolmod.zip', desc: 'Tool Mod Android Pro', downloads: 2341, viewCount: 350, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwRDQ4NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VG9vbCBNb2Q8L3RleHQ+PC9zdmc+' },
        { id: '4', name: 'Source Code Web', category: 'soft-dev', size: '2.5 MB', link: 'https://example.com/source.zip', desc: 'Source Code Web Full', downloads: 567, viewCount: 120, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMwM0Y5RiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U291cmNlIENvZGU8L3RleHQ+PC9zdmc+' },
        { id: '5', name: 'GTA 5', category: 'game-pc', size: '65 GB', link: 'https://example.com/gta5.zip', desc: 'Grand Theft Auto V Full', downloads: 1500, viewCount: 250, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNDQ0NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R1RBIDU8L3RleHQ+PC9zdmc+' },
        { id: '6', name: 'Windows 11', category: 'soft-os', size: '5.1 GB', link: 'https://example.com/win11.zip', desc: 'Windows 11 Pro Full', downloads: 900, viewCount: 180, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwNzhENCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+V2luZG93cyAxMTwvdGV4dD48L3N2Zz4=' }
    ];
    localStorage.setItem(DB_FILES, JSON.stringify(samples));
}

if (!localStorage.getItem(DB_DOWNLOADS)) {
    localStorage.setItem(DB_DOWNLOADS, JSON.stringify([]));
}

// === 1. HIỂN THỊ FILE ===
function renderFiles(category = 'all') {
    console.log('renderFiles called with category:', category);
    
    const grid = document.getElementById('filesGrid') || document.getElementById('accountsGrid');
    if (!grid) {
        console.log('Grid element not found! filesGrid:', document.getElementById('filesGrid'));
        return;
    }
    
    console.log('Grid element found:', grid);

    const files = JSON.parse(localStorage.getItem(DB_FILES)) || [];
    console.log('Total files in localStorage:', files.length);
    console.log('Files:', files);
    
    let displayFiles = category === 'all' ? files : files.filter(f => f.category.includes(category));
    console.log('Display files for category', category, ':', displayFiles.length);

    if (displayFiles.length === 0) {
        grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 20px;">Không có file nào.</p>';
        console.log('No files to display, showing empty message');
        return;
    }

    console.log('Rendering', displayFiles.length, 'files...');
    grid.innerHTML = displayFiles.map(f => `
        <article class="product-card">
            <div class="product-image">
                <img src="${f.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzZDNzVEIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}" 
                     alt="${f.name}" 
                     loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzZDNzVEIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='">
            </div>
            <div class="product-info">
                <h3 class="product-title">${f.name}</h3>
                <p class="product-desc">${f.desc}</p>
                <div class="product-meta">
                    <span><i class="fa-solid fa-database"></i> ${f.size}</span>
                    <span><i class="fa-solid fa-download"></i> ${f.downloads}</span>
                </div>
                <button class="btn-primary download-btn" style="width:100%; margin-top:10px;" onclick="downloadFile('${f.id}', '${f.name}')">
                    <i class="fa-solid fa-download"></i> TẢI XUỐNG
                </button>
            </div>
        </article>
    `).join('');
    
    console.log('Render completed! Grid HTML length:', grid.innerHTML.length);
    updateCategoryStats(files, category);
}

// Update category statistics
function updateCategoryStats(files, currentCategory) {
    const totalFilesEl = document.getElementById('totalFilesCount');
    const totalDownloadsEl = document.getElementById('totalDownloadsCount');
    const totalViewsEl = document.getElementById('totalViewsCount');
    
    if (totalFilesEl && totalDownloadsEl && totalViewsEl) {
        let displayFiles = currentCategory === 'all' ? files : files.filter(f => f.category.includes(currentCategory));
        
        const totalFiles = displayFiles.length;
        const totalDownloads = displayFiles.reduce((sum, f) => sum + (f.downloads || 0), 0);
        const totalViews = displayFiles.reduce((sum, f) => sum + (f.viewCount || 0), 0);
        
        // Animate numbers
        animateNumber(totalFilesEl, totalFiles);
        animateNumber(totalDownloadsEl, totalDownloads);
        animateNumber(totalViewsEl, totalViews);
    }
}

// Animate number counting
function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    const step = Math.abs(target - current) / 20;
    let value = current;
    
    const timer = setInterval(() => {
        value += increment * Math.ceil(step);
        if ((increment > 0 && value >= target) || (increment < 0 && value <= target)) {
            value = target;
            clearInterval(timer);
        }
        element.textContent = value.toLocaleString();
    }, 50);
}

// === 1.1. HIỂN THỊ 3 SẢN PHẨM HOT NHẤT ===
function renderHotFiles() {
    const grid = document.getElementById('hotFilesGrid');
    if (!grid) return;

    const files = JSON.parse(localStorage.getItem(DB_FILES)) || [];
    // Sắp xếp theo viewCount giảm dần và lấy 3 cái đầu
    const hotFiles = files.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3);

    if (hotFiles.length === 0) {
        grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; padding: 20px;">Không có file nào.</p>';
        return;
    }

    grid.innerHTML = hotFiles.map((f, index) => `
        <article class="product-card hot-card">
            ${index === 0 ? '<div class="hot-badge">🔥 HOT NHẤT</div>' : index === 1 ? '<div class="hot-badge">⭐ HOT</div>' : ''}
            <div class="product-image">
                <img src="${f.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzZDNzVEIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}" 
                     alt="${f.name}" 
                     loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzZDNzVEIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='">
            </div>
            <div class="product-info">
                <h3 class="product-title">${f.name}</h3>
                <p class="product-desc">${f.desc}</p>
                <div class="product-meta">
                    <span><i class="fa-solid fa-database"></i> ${f.size}</span>
                    <span><i class="fa-solid fa-eye"></i> ${f.viewCount || 0}</span>
                    <span><i class="fa-solid fa-download"></i> ${f.downloads}</span>
                </div>
                <button class="btn-primary download-btn" style="width:100%; margin-top:10px;" onclick="downloadFile('${f.id}', '${f.name}')">
                    <i class="fa-solid fa-download"></i> TẢI XUỐNG
                </button>
            </div>
        </article>
    `).join('');
}

// === 2. CHỨC NĂNG TẢI FILE ===
function downloadFile(id, name) {
    const files = JSON.parse(localStorage.getItem(DB_FILES)) || [];
    const file = files.find(f => f.id === id);

    if (file) {
        // Thêm vào lịch sử tải
        const downloads = JSON.parse(localStorage.getItem(DB_DOWNLOADS)) || [];
        const downloadItem = {
            id: Date.now(),
            fileId: id,
            fileName: name,
            downloadTime: new Date().toLocaleString('vi-VN'),
            size: file.size
        };
        downloads.unshift(downloadItem);
        localStorage.setItem(DB_DOWNLOADS, JSON.stringify(downloads));

        // Tăng số lượt tải
        file.downloads = (file.downloads || 0) + 1;
        localStorage.setItem(DB_FILES, JSON.stringify(files));

        // Cập nhật badge
        updateDownloadsBadge();

        // Hiển thị modal tải
        showDownloadModal(name, file.link);
    }
}

// Tạo Modal hiển thị Download
function showDownloadModal(name, downloadLink) {
    // Xóa modal cũ nếu có
    const oldModal = document.getElementById('resultModal');
    if(oldModal) oldModal.remove();

    const modalHTML = `
        <div id="resultModal" class="modal active" style="display:flex;">
            <div class="modal-content" style="text-align:center;">
                <div class="modal-header">
                    <h3 style="color:var(--primary-color);">🚀 BẮT ĐẦU TẢI!</h3>
                    <span class="close-modal" onclick="document.getElementById('resultModal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <p>File: <strong>${name}</strong></p>
                    <div style="background:#222; padding:15px; margin:15px 0; border:1px dashed var(--primary-color); word-break: break-all; color: #fff; font-family: monospace; font-size: 1.2rem;">
                        ${downloadLink}
                    </div>
                    <p style="font-size:0.9rem; color:#aaa;">Link tải sẽ tự động mở sau 3 giây...</p>
                </div>
                <div class="modal-footer" style="justify-content: center;">
                    <button class="btn-primary" onclick="window.open('${downloadLink}', '_blank')">Mở Link</button>
                    <button class="btn-secondary" onclick="document.getElementById('resultModal').remove()">Đóng</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Tự động mở link sau 3 giây
    setTimeout(() => {
        window.open(downloadLink, '_blank');
    }, 3000);
}

// === 3. XỬ LÝ TAB DANH MỤC ===
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Get category and render files
            const cat = btn.getAttribute('data-category');

            if (USE_CLOUD) {
                loadProductsFromCloud();
                return;
            }

            renderFiles(cat);
        });
    });
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const body = document.body;

    if (!body.getAttribute('data-theme')) {
        body.setAttribute('data-theme', 'light');
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = 'fa-solid fa-moon';
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        themeToggle.querySelector('i').className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
}

function showAlert(msg) {
    showToast(msg, 'success', 3000);
}

// === 4. QUẢN LÝ LỊCH SỬ TẢI ===
function updateDownloadsBadge() {
    const downloads = JSON.parse(localStorage.getItem(DB_DOWNLOADS)) || [];
    const badge = document.getElementById('downloadsBadge');
    if (badge) {
        badge.textContent = downloads.length;
    }
}

// === 5. ĐỒNG BỘ DỮ LIỆU ===
function checkForDataUpdates() {
    const currentData = JSON.parse(localStorage.getItem(DB_FILES)) || [];
    const lastCheck = localStorage.getItem('lastDataCheck');
    const currentCheck = Date.now();
    
    // Force refresh if data might have changed
    if (lastCheck && currentCheck - parseInt(lastCheck) < 5000) {
        // Check if data length changed (simple change detection)
        const previousLength = parseInt(localStorage.getItem('previousDataLength') || '0');
        if (currentData.length !== previousLength) {
            console.log('Data changed, refreshing...');
            renderFiles();
            renderHotFiles();
            localStorage.setItem('previousDataLength', currentData.length.toString());
        }
    }
    
    localStorage.setItem('lastDataCheck', currentCheck.toString());
    localStorage.setItem('previousDataLength', currentData.length.toString());
}

// Manual refresh function
function refreshData() {
    console.log('Manual refresh triggered...');

    if (USE_CLOUD) {
        loadProductsFromCloud();
        showToast('Dữ liệu đã được làm mới!', 'success', 2000);
        return;
    }

    renderFiles();
    renderHotFiles();
    showToast('Dữ liệu đã được làm mới!', 'success', 2000);
    
    // Update the check timestamp
    const currentData = JSON.parse(localStorage.getItem(DB_FILES)) || [];
    localStorage.setItem('lastDataCheck', Date.now().toString());
    localStorage.setItem('previousDataLength', currentData.length.toString());
}

if (!USE_CLOUD) {
    setInterval(checkForDataUpdates, 5000);

    let lastDataHash = '';
    let lastUpdateTime = Date.now();

    function checkRealTimeUpdate() {
        const files = JSON.parse(localStorage.getItem(DB_FILES)) || [];
        const currentHash = JSON.stringify(files).length + '_' + files.length;
        const currentTime = Date.now();
        
        if (lastDataHash && currentHash !== lastDataHash) {
            console.log('Real-time update: Data changed, refreshing all users...');
            renderFiles();
            renderHotFiles();
            
            const timeDiff = currentTime - lastUpdateTime;
            if (timeDiff < 5000) {
                showToast('🆕 Có sản phẩm mới vừa được đăng!', 'success', 4000);
            } else {
                showToast('📢 Dữ liệu đã được cập nhật!', 'info', 3000);
            }
            
            lastUpdateTime = currentTime;
        }
        lastDataHash = currentHash;
    }

    console.log('Starting real-time synchronization for all users...');
    setInterval(checkRealTimeUpdate, 1000);
    checkRealTimeUpdate();

    window.addEventListener('storage', function(e) {
        if (e.key === DB_FILES) {
            console.log('Storage event: Data changed, refreshing all users...', e);
            
            setTimeout(() => {
                renderFiles();
                renderHotFiles();
                showToast('🆕 Có sản phẩm mới vừa được đăng!', 'success', 4000);
            }, 100);
        }
    });

    window.addEventListener('storage-custom', function(e) {
        if (e.detail.key === DB_FILES) {
            console.log('Custom storage event: Admin uploaded new file', e.detail);
            
            renderFiles();
            renderHotFiles();
            showToast('🚀 Admin vừa đăng sản phẩm mới!', 'success', 4000);
        }
    });
}

// Listen for visibility changes (when user returns to this tab)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Page became visible, checking for updates...');
        if (USE_CLOUD) {
            loadProductsFromCloud();
            return;
        }

        checkForDataUpdates();
        renderFiles();
        renderHotFiles();
    }
});

function showDownloads() {
    const downloads = JSON.parse(localStorage.getItem(DB_DOWNLOADS)) || [];
    const list = document.getElementById('downloadsList');
    const count = document.getElementById('downloadsCount');
    
    if (list) {
        if (downloads.length === 0) {
            list.innerHTML = '<p class="text-center">Chưa có file nào được tải.</p>';
        } else {
            list.innerHTML = downloads.map(d => `
                <div class="download-item" style="padding: 10px; border-bottom: 1px solid #333;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${d.fileName}</strong>
                            <div style="font-size: 0.9rem; color: #aaa;">
                                <i class="fa-solid fa-database"></i> ${d.size} | 
                                <i class="fa-solid fa-clock"></i> ${d.downloadTime}
                            </div>
                        </div>
                        <button class="btn-icon" onclick="removeDownload(${d.id})" title="Xóa">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (count) count.textContent = downloads.length;
}

function removeDownload(id) {
    const downloads = JSON.parse(localStorage.getItem(DB_DOWNLOADS)) || [];
    const filtered = downloads.filter(d => d.id !== id);
    localStorage.setItem(DB_DOWNLOADS, JSON.stringify(filtered));
    showDownloads();
    updateDownloadsBadge();
}

function clearDownloads() {
    if (confirm('Xóa toàn bộ lịch sử tải?')) {
        localStorage.setItem(DB_DOWNLOADS, JSON.stringify([]));
        showDownloads();
        updateDownloadsBadge();
        showToast('Đã xóa lịch sử tải!', 'success', 3000);
    }
}

function closeDownloads() {
    const modal = document.getElementById('downloadsModal');
    if (modal) modal.classList.remove('active');
}

// === 6. AI SUPPORT FUNCTIONS ===
function openAISupport() {
    const modal = document.getElementById('aiSupportModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('aiInput').focus();
    }
}

function closeAISupport() {
    const modal = document.getElementById('aiSupportModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatContainer = document.getElementById('chatContainer');
    
    // Add user message
    addMessageToChat(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Simulate AI thinking
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessageToChat(aiResponse, 'ai');
    }, 1000);
}

function handleAIKeyPress(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

function quickQuestion(question) {
    document.getElementById('aiInput').value = question;
    sendAIMessage();
}

function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.style.marginBottom = '15px';
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px; justify-content: flex-end;">
                <div style="background: var(--primary-color); color: #000; padding: 12px 15px; border-radius: 12px; max-width: 70%;">
                    ${message}
                </div>
                <div style="background: var(--secondary-color); color: #fff; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">
                    YOU
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="background: var(--primary-color); color: #000; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">
                    AI
                </div>
                <div style="background: var(--card-bg); padding: 12px 15px; border-radius: 12px; max-width: 70%;">
                    ${message}
                </div>
            </div>
        `;
    }
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Game related responses
    if (lowerMessage.includes('game') || lowerMessage.includes('trò chơi')) {
        if (lowerMessage.includes('pc')) {
            return `Tôi có nhiều game PC hay nhất cho bạn! 🎮\n\n**Game phổ biến nhất:**\n• CS2 Full - 25GB - Game bắn súng FPS\n• Office 2024 - 3.2GB - Bộ công cụ văn phòng\n• Photoshop 2024 - 4.1GB - Thiết kế đồ họa\n\nBạn muốn tải game nào? Tôi có thể hướng dẫn chi tiết!`;
        }
        return `Tôi có nhiều game hấp dẫn! 🎮\n\n**Danh mục game:**\n• Game PC - Các game offline/online hay nhất\n• Game Mobile - Game cho điện thoại\n• Mods & Tools - Công cụ hỗ trợ game\n\nBạn quan tâm thể loại game nào?`;
    }
    
    // Download guide responses
    if (lowerMessage.includes('tải') || lowerMessage.includes('download') || lowerMessage.includes('hướng dẫn')) {
        return `Hướng dẫn tải file rất đơn giản! 📥\n\n**Các bước tải file:**\n1. Chọn file bạn muốn tải\n2. Nhấn nút "TẢI XUỐNG"\n3. Chờ 3 giây để link tải tự động mở\n4. Lưu file về máy của bạn\n\n**Lưu ý:**\n• Kiểm tra dung lượng trước khi tải\n• Sử dụng trình duyệt Chrome/Edge để tốt nhất\n• Liên hệ nếu link tải bị lỗi\n\nCần hỗ trợ thêm gì không?`;
    }
    
    // Software responses
    if (lowerMessage.includes('văn phòng') || lowerMessage.includes('office')) {
        return `Tôi có đầy đủ phần mềm văn phòng! 📄\n\n**Phần mềm văn phòng:**\n• Office 2024 Full - 3.2GB - Word, Excel, PowerPoint\n• Google Drive Offline - Làm việc offline\n• PDF Reader - Đọc và chỉnh sửa PDF\n\nBạn cần phần mềm cụ thể nào?`;
    }
    
    // IT documents responses
    if (lowerMessage.includes('tài liệu') || lowerMessage.includes('it') || lowerMessage.includes('lập trình')) {
        return `Tôi có kho tài liệu IT phong phú! 📚\n\n**Tài liệu lập trình:**\n• Bộ tài liệu IT - 150MB - HTML, CSS, JavaScript\n• Hướng dẫn Python - Cơ bản đến nâng cao\n• Documentation các framework phổ biến\n\nBạn muốn học ngôn ngữ lập trình nào?`;
    }
    
    // Help and support responses
    if (lowerMessage.includes('help') || lowerMessage.includes('hỗ trợ') || lowerMessage.includes('giúp')) {
        return `Tôi ở đây để giúp bạn! 🤖\n\n**Tôi có thể hỗ trợ:**\n• Tìm kiếm file theo danh mục\n• Hướng dẫn tải file\n• Giải đáp thắc mắc về nền tảng\n• Đề xuất file phù hợp\n\nHãy hỏi tôi bất cứ điều gì!`;
    }
    
    // Default response
    return `Cảm ơn câu hỏi của bạn! 🤖\n\nTôi hiểu bạn đang quan tâm đến: "${message}"\n\n**Để giúp bạn tốt hơn, tôi có thể:**\n• Tìm kiếm file theo danh mục\n• Hướng dẫn cách tải file\n• Giới thiệu các file phổ biến\n• Hỗ trợ kỹ thuật\n\nBạn cần hỗ trợ cụ thể về vấn đề gì?`;
}

// === 5. EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js loaded - DOM ready');

    if (USE_CLOUD) {
        loadProductsFromCloud();
    } else {
        // Initialize sample data if empty
        initializeSampleData();

        // Render files
        renderFiles();
        renderHotFiles();
    }
    renderMonsters(); // Render monsters section
    renderTopupData(); // Render topup data section
    updateDownloadsBadge();
    
    console.log('Main.js initialization complete');
    
    // Modal downloads
    const downloadsBtn = document.getElementById('downloadsBtn');
    const downloadsModal = document.getElementById('downloadsModal');
    
    if (downloadsBtn && downloadsModal) {
        downloadsBtn.addEventListener('click', () => {
            showDownloads();
            downloadsModal.classList.add('active');
        });
    }
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    // AI Support modal close on outside click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
});