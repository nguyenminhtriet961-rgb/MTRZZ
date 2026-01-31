// ==========================================
// COMPONENTS.JS - Header & Footer Components
// ==========================================

/**
 * Render Header component
 * @param {string} activePage - Page active pour highlight menu
 */
function loadHeader(activePage = 'home') {
    const headerHTML = `
    <header class="main-header">
        <div class="header-top">
            <div class="container">
                <div class="header-content">
                    <a href="index.html" class="logo">
                        <img src="https://sf-static.upanhlaylink.com/img/image_20260128bfa88f9f154c2985044fd2d4658f90af.jpg" alt="MINT Hub Logo" style="height: 40px; width: auto; border-radius: 8px;">
                        <span>MINT Hub</span>
                    </a>
                    
                    <div class="search-bar">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="searchInput" placeholder="Tìm kiếm game, phần mềm, tài liệu...">
                    </div>
                    
                    <div class="header-actions">
                        <button class="btn-icon mobile-menu-toggle" id="mobile-menu-toggle" title="Menu">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                        <a class="btn-primary" href="https://zalo.me/0383539399" target="_blank" rel="noopener" style="padding: 10px 14px; font-size: 0.9rem;">
                            🔥 Inbox báo giá
                        </a>
                        <button class="btn-icon" id="theme-toggle" title="Đổi theme">
                            <i class="fa-solid fa-moon"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <nav class="main-nav">
            <div class="container">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="index.html#home" class="${activePage === 'home' ? 'active' : ''}" title="Trang chủ">
                            <i class="fa-solid fa-home"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#game-pc" class="${activePage === 'hot' ? 'active' : ''}" title="HOT">
                            <i class="fa-solid fa-fire"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#all-files" class="${activePage === 'files' ? 'active' : ''}" title="Tất cả file">
                            <i class="fa-solid fa-folder"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#contact" class="${activePage === 'contact' ? 'active' : ''}" title="Liên hệ">
                            <i class="fa-solid fa-address-book"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="about.html" class="${activePage === 'about' ? 'active' : ''}" title="Giới thiệu">
                            <i class="fa-solid fa-user"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        
        <!-- Mobile Menu Dropdown -->
        <div class="mobile-menu-dropdown" id="mobile-menu-dropdown" style="width: 25vw;">
            <div class="mobile-menu-header">
                <span>Menu</span>
                <button class="btn-icon" id="mobile-menu-close" title="Đóng">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <ul class="mobile-menu-list">
                <li>
                    <a href="index.html#home" class="${activePage === 'home' ? 'active' : ''}">
                        <i class="fa-solid fa-home"></i> Trang chủ
                    </a>
                </li>
                <li>
                    <a href="#game-pc" class="${activePage === 'hot' ? 'active' : ''}">
                        <i class="fa-solid fa-fire"></i> HOT
                    </a>
                </li>
                <li>
                    <a href="#all-files" class="${activePage === 'files' ? 'active' : ''}">
                        <i class="fa-solid fa-folder"></i> Tất cả file
                    </a>
                </li>
                <li>
                    <a href="#contact" class="${activePage === 'contact' ? 'active' : ''}">
                        <i class="fa-solid fa-address-book"></i> Liên hệ
                    </a>
                </li>
                <li>
                    <a href="about.html" class="${activePage === 'about' ? 'active' : ''}">
                        <i class="fa-solid fa-user"></i> Giới thiệu
                    </a>
                </li>
            </ul>
        </div>
    </header>

    <!-- AI Support Modal -->
    <div id="aiSupportModal" class="modal">
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3><i class="fa-solid fa-robot"></i> AI Hỗ Trợ 24/7</h3>
                <span class="close-modal" onclick="closeAISupport()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="chat-container">
                    <div class="chat-header">
                        <div class="bot-info">
                            <div class="bot-avatar">
                                <i class="fa-solid fa-robot"></i>
                            </div>
                            <div class="bot-details">
                                <h4>MINT AI Assistant</h4>
                                <span class="bot-status online">🟢 Online</span>
                            </div>
                        </div>
                        <div class="chat-actions">
                            <button class="btn-icon" onclick="clearChat()" title="Xóa cuộc trò chuyện">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="chat-message bot">
                            <div class="message-content">
                                <div class="message-text">
                                    Xin chào! Tôi là AI Assistant của MINT Hub. Tôi có thể giúp bạn tìm game, phần mềm, hướng dẫn cài đặt và sửa lỗi. Bạn cần giúp gì ạ? 😊
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <div class="quick-actions">
                            <button class="quick-btn" onclick="askAI('Game hay nhất')">
                                <i class="fa-solid fa-gamepad"></i> Game
                            </button>
                            <button class="quick-btn" onclick="askAI('Office 2024')">
                                <i class="fa-solid fa-file-word"></i> Office
                            </button>
                            <button class="quick-btn" onclick="askAI('Hướng dẫn cài đặt')">
                                <i class="fa-solid fa-book"></i> Hướng dẫn
                            </button>
                            <button class="quick-btn" onclick="askAI('Sửa lỗi game')">
                                <i class="fa-solid fa-wrench"></i> Sửa lỗi
                            </button>
                        </div>
                        <div class="chat-input-box">
                            <input type="text" id="chatInput" placeholder="Nhập câu hỏi của bạn..." maxlength="500">
                            <button id="sendBtn" class="send-btn">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    const headerContainer = document.getElementById('header-placeholder');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
        
        // Re-initialize header event listeners after rendering
        initHeaderEvents();
    }
}

/**
 * Render Footer component
 */
function loadFooter() {
    const footerHTML = `
    <footer class="main-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4><i class="fa-solid fa-info-circle"></i> Thông tin</h4>
                    <ul>
                        <li><a href="about.html">Giới thiệu</a></li>
                        <li><a href="#" onclick="openAISupport()">AI hỗ trợ</a></li>
                        <li><a href="chinh-sach-bao-mat.html">Chính sách bảo mật</a></li>
                        <li><a href="dieu-khoan-su-dung.html">Điều khoản sử dụng</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4><i class="fa-solid fa-headset"></i> Hỗ trợ</h4>
                    <ul>
                        <li><a href="https://zalo.me/84383539399" target="_blank">
                            <i class="fa-solid fa-comments"></i> Zalo: 84383539399
                        </a></li>
                        <li><a href="https://t.me/+84794328504" target="_blank">
                            <i class="fa-solid fa-paper-plane"></i> Telegram: +84 79 4328 504
                        </a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4><i class="fa-solid fa-link"></i> Mạng xã hội</h4>
                    <div class="social-links">
                        <a href="https://www.facebook.com/nguyen.minh.triet.71039" target="_blank" title="Facebook">
                            <i class="fa-brands fa-facebook"></i>
                        </a>
                        <a href="https://zalo.me/84383539399" target="_blank" title="Zalo">
                            <i class="fa-solid fa-comments"></i>
                        </a>
                        <a href="https://t.me/+84794328504" target="_blank" title="Telegram">
                            <i class="fa-brands fa-telegram"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 File Download Hub. Tất cả quyền được bảo lưu.</p>
            </div>
        </div>
    </footer>
    `;
    
    const footerContainer = document.getElementById('footer-placeholder');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}

/**
 * Initialize header event listeners
 */
function initHeaderEvents() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');
    
    if (mobileMenuToggle && mobileMenuDropdown) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuDropdown.classList.toggle('active');
        });
    }
    
    if (mobileMenuClose && mobileMenuDropdown) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenuDropdown.classList.remove('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenuDropdown && 
            !mobileMenuDropdown.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuDropdown.classList.remove('active');
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-list a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuDropdown.classList.remove('active');
        });
    });
}

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
}

/**
 * Update downloads badge count
 */
function updateDownloadsBadge() {
    const downloads = JSON.parse(localStorage.getItem('downloads_history')) || [];
    const badge = document.getElementById('downloadsBadge');
    if (badge) {
        badge.textContent = downloads.length;
    }
}

/**
 * Handle search input
 */
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    // Search logic will be implemented in main.js
    if (typeof searchFiles === 'function') {
        searchFiles(query);
    }
}

/**
 * Open downloads modal
 */
function openDownloads() {
    const modal = document.getElementById('downloadsModal');
    if (modal) {
        modal.style.display = 'flex';
        if (typeof renderDownloadsList === 'function') {
            renderDownloadsList();
        }
    }
}

/**
 * Initialize components on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get current page from URL
    const currentPage = getCurrentPage();
    
    // Load components
    loadHeader(currentPage);
    loadFooter();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
});

/**
 * Get current page name from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/') return 'home';
    if (path.includes('products.html')) return 'products';
    if (path.includes('about.html')) return 'about';
    if (path.includes('admin.html')) return 'admin';
    if (path.includes('checkout.html')) return 'checkout';
    if (path.includes('topup.html')) return 'topup';
    return 'home';
}

// === AI SUPPORT FUNCTIONS ===
function openAISupport() {
    const modal = document.getElementById('aiSupportModal');
    if (modal) {
        modal.style.display = 'block';
        // Focus on input
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.focus();
            }
        }, 100);
    }
}

function closeAISupport() {
    const modal = document.getElementById('aiSupportModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="chat-message bot">
                <div class="message-content">
                    <div class="message-text">
                        Cuộc trò chuyện đã được xóa. Tôi có thể giúp gì cho bạn? 😊
                    </div>
                </div>
            </div>
        `;
    }
}