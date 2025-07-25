function createHeader() {
    return `
        <div class="flex justify-between items-center max-w-7xl mx-auto">
            <div class="flex items-center space-x-4">
                <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity duration-200" id="home-logo">
                    🎬 Book-kro
                </h1>
            </div>
            
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center space-x-6">
                <a href="#" id="movies-tab" class="hover:text-blue-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    Movies
                </a>

                <a href="#" id="bookings-tab" class="hover:text-blue-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    My Bookings
                </a>
                
                <!-- Theme toggle button -->
                <button id="theme-toggle" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors duration-200 ml-4" aria-label="Toggle theme">
                    <svg class="w-5 h-5 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                        <path class="dark:hidden" fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
                        <path class="hidden dark:block" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                </button>
            </nav>
            
            <!-- Mobile menu button -->
            <button id="hamburger" class="md:hidden flex flex-col space-y-1 p-2" aria-label="Toggle mobile menu">
                <span class="w-6 h-0.5 bg-current transition-transform duration-200"></span>
                <span class="w-6 h-0.5 bg-current transition-opacity duration-200"></span>
                <span class="w-6 h-0.5 bg-current transition-transform duration-200"></span>
            </button>
        </div>
        
        <!-- Mobile Navigation -->
        <nav id="mobile-menu" class="hidden md:hidden mt-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 -mx-4 px-4 py-4 space-y-3">
            <a href="#" id="mobile-movies-tab" class="block hover:text-blue-400 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                📽️ Movies
            </a>

            <a href="#" id="mobile-bookings-tab" class="block hover:text-blue-400 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                🎫 My Bookings
            </a>
            
            <!-- Mobile theme toggle -->
            <button id="mobile-theme-toggle" class="flex items-center space-x-2 w-full py-2 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200" aria-label="Toggle theme">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path class="dark:hidden" fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
                    <path class="hidden dark:block" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
                <span class="dark:hidden">Dark Mode</span>
                <span class="hidden dark:block">Light Mode</span>
            </button>
        </nav>
    `;
}

function renderHeader() {
    document.getElementById('header').innerHTML = createHeader();
    
    // Setup event listeners
    setupHeaderEvents();
    
    // Home logo click event
    document.getElementById('home-logo').addEventListener('click', () => {
        showMoviesTab();
        updateActiveTab('movies');
    });
    
    // Set initial active tab
    updateActiveTab('movies');
}

function setupHeaderEvents() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    hamburger.addEventListener('click', () => {
        toggleMobileMenu();
        animateHamburger();
    });
    
    // Theme toggle events
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('mobile-theme-toggle').addEventListener('click', () => {
        toggleTheme();
        // Close mobile menu after theme change
        setTimeout(() => toggleMobileMenu(), 100);
    });
    
    // Desktop navigation
    setupTabNavigation();
    
    // Mobile navigation
    setupMobileTabNavigation();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
                resetHamburger();
            }
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
            resetHamburger();
        }
    });
}

function setupTabNavigation() {
    document.getElementById('movies-tab').addEventListener('click', (e) => {
        e.preventDefault();
        showMoviesTab();
        updateActiveTab('movies');
    });
    

    
    document.getElementById('bookings-tab').addEventListener('click', (e) => {
        e.preventDefault();
        showBookingsTab();
        updateActiveTab('bookings');
    });
}

function setupMobileTabNavigation() {
    document.getElementById('mobile-movies-tab').addEventListener('click', (e) => {
        e.preventDefault();
        showMoviesTab();
        updateActiveTab('movies');
        toggleMobileMenu();
        resetHamburger();
    });
    

    
    document.getElementById('mobile-bookings-tab').addEventListener('click', (e) => {
        e.preventDefault();
        showBookingsTab();
        updateActiveTab('bookings');
        toggleMobileMenu();
        resetHamburger();
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    
    // Add slide animation
    if (!menu.classList.contains('hidden')) {
        menu.style.animation = 'slideDown 0.3s ease-out';
    }
}

function animateHamburger() {
    const hamburger = document.getElementById('hamburger');
    const spans = hamburger.querySelectorAll('span');
    
    hamburger.classList.toggle('active');
    
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        resetHamburger();
    }
}

function resetHamburger() {
    const hamburger = document.getElementById('hamburger');
    const spans = hamburger.querySelectorAll('span');
    
    hamburger.classList.remove('active');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
}

function updateActiveTab(activeTab) {
    // Update desktop tabs
    const tabs = ['movies', 'bookings'];
    tabs.forEach(tab => {
        const element = document.getElementById(`${tab}-tab`);
        const mobileElement = document.getElementById(`mobile-${tab}-tab`);
        
        if (element) {
            element.classList.toggle('text-blue-600', tab === activeTab);
            element.classList.toggle('font-semibold', tab === activeTab);
            element.classList.toggle('bg-blue-50', tab === activeTab);
            element.classList.toggle('dark:bg-blue-900', tab === activeTab);
        }
        
        if (mobileElement) {
            mobileElement.classList.toggle('text-blue-600', tab === activeTab);
            mobileElement.classList.toggle('font-semibold', tab === activeTab);
            mobileElement.classList.toggle('bg-blue-50', tab === activeTab);
            mobileElement.classList.toggle('dark:bg-blue-900', tab === activeTab);
        }
    });
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');

    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');

    }
    
    // Animate theme transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    #hamburger span {
        transition: all 0.3s ease;
        transform-origin: center;
    }
    
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: .5;
        }
    }
`;
document.head.appendChild(style);