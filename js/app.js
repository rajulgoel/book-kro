let currentPage = 1;
let currentLoadFunction = null;
let isLoading = false;

// Enhanced error handling and loading states
class AppManager {
    constructor() {
        this.loadingState = false;
        this.currentView = 'movies';
        this.retryAttempts = 0;
        this.maxRetries = 3;
    }

    showError(message) {
        const errorBoundary = document.getElementById('error-boundary');
        const errorMessage = document.getElementById('error-message');
        
        errorMessage.textContent = message;
        errorBoundary.classList.remove('hidden');
        
        // Hide error after 10 seconds
        setTimeout(() => {
            errorBoundary.classList.add('hidden');
        }, 10000);
    }

    hideError() {
        document.getElementById('error-boundary').classList.add('hidden');
        this.retryAttempts = 0;
    }

    setLoading(loading) {
        this.loadingState = loading;
        isLoading = loading;
        
        const movieGrid = document.getElementById('movie-grid');
        if (loading) {
            this.showLoadingSkeleton();
        }
    }

    showLoadingSkeleton() {
        const movieGrid = document.getElementById('movie-grid');
        const skeletonCards = Array(10).fill(0).map(() => `
            <div class="movie-card-skeleton loading-skeleton"></div>
        `).join('');
        movieGrid.innerHTML = skeletonCards;
    }

    async retry() {
        if (this.retryAttempts < this.maxRetries) {
            this.retryAttempts++;
            this.hideError();
            
            if (currentLoadFunction) {
                await currentLoadFunction(currentPage);
            } else {
                await loadPopularMovies();
            }
        } else {
            this.showError('Maximum retry attempts reached. Please refresh the page.');
        }
    }
}

const appManager = new AppManager();

async function loadPopularMovies(page = 1) {
    if (isLoading) return;
    
    currentLoadFunction = loadPopularMovies;
    appManager.setLoading(true);
    
    try {
        const data = await api.discoverMovies({ sort: 'popularity.desc', page });
        const movieGrid = document.getElementById('movie-grid');
        const paginationContainer = document.getElementById('pagination');
        
        if (data && data.results) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            movieGrid.innerHTML = data.results.map(movie => {
                const isFav = favorites.some(fav => fav.id === movie.id);
                return createMovieCard(movie, isFav);
            }).join('');
            paginationContainer.innerHTML = createPagination(data.page, data.total_pages, loadPopularMovies);
            
            currentPage = data.page;
            setupPaginationEvents(currentPage, data.total_pages, loadPopularMovies);
            
            appManager.hideError();
            
            // Lazy load images after content is displayed
            lazyLoadImages();
        } else {
            throw new Error('No movie data received');
        }
    } catch (error) {
        console.error('Error loading movies:', error);
        appManager.showError(error.message || 'Failed to load movies. Please try again.');
        
        // Fallback content
        document.getElementById('movie-grid').innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">🎬</div>
                <p class="text-lg text-gray-600 dark:text-gray-400">Unable to load movies</p>
                <button onclick="appManager.retry()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Try Again
                </button>
            </div>
        `;
    } finally {
        appManager.setLoading(false);
    }
}

async function loadUpcomingMovies(page = 1) {
    if (isLoading) return;
    
    currentLoadFunction = loadUpcomingMovies;
    appManager.setLoading(true);
    
    try {
        const data = await api.getUpcomingMovies(page);
        const movieGrid = document.getElementById('movie-grid');
        const paginationContainer = document.getElementById('pagination');
        
        if (data && data.results) {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            movieGrid.innerHTML = data.results.map(movie => {
                const isFav = favorites.some(fav => fav.id === movie.id);
                return createMovieCard(movie, isFav);
            }).join('');
            paginationContainer.innerHTML = createPagination(data.page, data.total_pages, loadUpcomingMovies);
            
            currentPage = data.page;
            setupPaginationEvents(currentPage, data.total_pages, loadUpcomingMovies);
            
            appManager.hideError();
            lazyLoadImages();
        } else {
            throw new Error('No upcoming movies data received');
        }
    } catch (error) {
        console.error('Error loading upcoming movies:', error);
        appManager.showError(error.message || 'Failed to load upcoming movies. Please try again.');
    } finally {
        appManager.setLoading(false);
    }
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
}

// Enhanced initialization with proper loading sequence
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        
        // Initialize header first
        renderHeader();
        
        // Show loading overlay while initializing
        const loadingOverlay = document.getElementById('loading-overlay');
        const app = document.getElementById('app');
        
        // Initialize app components
        await initializeApp();
        
        // Hide loading overlay and show app
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            app.style.opacity = '1';
            
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1000);
        
    } catch (error) {
        console.error('App initialization failed:', error);
        appManager.showError('Failed to initialize the app. Please refresh the page.');
    }
});

async function initializeApp() {
    try {
        // Initialize components
        document.getElementById('search-container').innerHTML = createSearchBar();
        
        // Initialize localStorage if not exists
        if (!localStorage.getItem('favorites')) {
            localStorage.setItem('favorites', '[]');
        }
        if (!localStorage.getItem('bookings')) {
            localStorage.setItem('bookings', '[]');
        }
        
        // Load initial content
        await loadPopularMovies();
        
        // Setup event listeners
        setupSearchEvents();
        setupGlobalEvents();
        setupErrorHandling();
        

        
    } catch (error) {
        console.error('App initialization error:', error);
        throw error;
    }
}

// Enhanced event handling with better performance
function setupGlobalEvents() {
    // Use event delegation for better performance
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleGlobalKeydown);
    

    

}

function handleGlobalClick(e) {
    // Book button click - check this first
    if (e.target.classList.contains('book-btn') || e.target.closest('.book-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const bookBtn = e.target.classList.contains('book-btn') ? e.target : e.target.closest('.book-btn');
        const movieId = bookBtn.dataset.movieId;
        if (movieId) {
            handleBookingClick(movieId);
        }
        return;
    }
    

    // Remove favorite click
    if (e.target.classList.contains('remove-favorite') || e.target.closest('.remove-favorite')) {
        e.preventDefault();
        e.stopPropagation();
        const removeBtn = e.target.classList.contains('remove-favorite') ? e.target : e.target.closest('.remove-favorite');
        const movieId = removeBtn.dataset.movieId;
        if (movieId) {
            removeFromFavorites(parseInt(movieId));
        }
        return;
    }
    

    
    // Movie card click - only if not clicking on buttons
    if (e.target.classList.contains('movie-card') || e.target.closest('.movie-card')) {
        const movieCard = e.target.classList.contains('movie-card') ? e.target : e.target.closest('.movie-card');
        const movieId = movieCard.dataset.movieId;
        
        // Don't show modal if clicking on buttons
        if (!e.target.closest('button')) {
            showMovieModal(movieId);
        }
        return;
    }
    
    // Retry button click
    if (e.target.id === 'retry-button') {
        appManager.retry();
        return;
    }
}

function handleGlobalKeydown(e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        closeMovieModal();
        closeBookingModal();
    }
    
    // Enter key on focused elements
    if (e.key === 'Enter' && e.target.classList.contains('movie-card')) {
        const movieId = e.target.dataset.movieId;
        showMovieModal(movieId);
    }
}

async function handleBookingClick(movieId) {
    try {
        // Show loading state
        const bookBtn = document.querySelector(`[data-movie-id="${movieId}"] .book-btn`);
        if (bookBtn) {
            bookBtn.disabled = true;
            bookBtn.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Loading...';
        }
        
        const movie = await api.getMovieDetails(movieId);
        
        // Reset button state
        if (bookBtn) {
            bookBtn.disabled = false;
            bookBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg> Book Now';
        }
        
        showBookingModal(movie);
    } catch (error) {
        console.error('Error loading movie details for booking:', error);
        
        // Reset button state
        const bookBtn = document.querySelector(`[data-movie-id="${movieId}"] .book-btn`);
        if (bookBtn) {
            bookBtn.disabled = false;
            bookBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg> Book Now';
        }
        
        showError('Failed to load movie details. Please try again.');
    }
}



function setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        appManager.showError('An unexpected error occurred. Please refresh the page.');
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
        appManager.showError('An error occurred while processing your request.');
    });
}



// Enhanced navigation functions with smooth transitions
function showMoviesTab() {
    appManager.currentView = 'movies';
    
    const upcomingMovies = document.getElementById('upcoming-movies');
    const favoritesSection = document.getElementById('favorites-section');
    const bookingsContainer = document.getElementById('bookings-container');
    const searchContainer = document.getElementById('search-container');
    
    if (upcomingMovies) upcomingMovies.classList.remove('hidden');
    if (favoritesSection) favoritesSection.classList.add('hidden');
    if (bookingsContainer) bookingsContainer.classList.add('hidden');
    if (searchContainer) searchContainer.classList.remove('hidden');
    
    updateActiveTab('movies');
    scrollToTop();
}



function showBookingsTab() {
    appManager.currentView = 'bookings';
    
    const upcomingMovies = document.getElementById('upcoming-movies');
    const favoritesSection = document.getElementById('favorites-section');
    const bookingsContainer = document.getElementById('bookings-container');
    const searchContainer = document.getElementById('search-container');
    
    if (upcomingMovies) upcomingMovies.classList.add('hidden');
    if (favoritesSection) favoritesSection.classList.add('hidden');
    if (bookingsContainer) bookingsContainer.classList.remove('hidden');
    if (searchContainer) searchContainer.classList.add('hidden');
    
    loadBookings();
    updateActiveTab('bookings');
    scrollToTop();
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
        }
        
        if (mobileElement) {
            mobileElement.classList.toggle('text-blue-600', tab === activeTab);
            mobileElement.classList.toggle('font-semibold', tab === activeTab);
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingsList = document.getElementById('bookings-list');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">🎫</div>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">No bookings found</p>
                <p class="text-sm text-gray-500 dark:text-gray-500">Book your first movie to see it here!</p>
            </div>
        `;
        return;
    }
    
    bookingsList.innerHTML = bookings
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(booking => `
            <div class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg mb-4 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div class="flex-1">
                        <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400">Booking #${booking.id.toString().slice(-6)}</h3>
                        <div class="mt-2 space-y-1 text-sm">
                            <p class="text-gray-600 dark:text-gray-400">
                                <span class="font-medium">Theater:</span> ${booking.theater}
                            </p>
                            <p class="text-gray-600 dark:text-gray-400">
                                <span class="font-medium">Date:</span> ${booking.date} at ${booking.time}
                            </p>
                            <p class="text-gray-600 dark:text-gray-400">
                                <span class="font-medium">Tickets:</span> ${booking.tickets}
                            </p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-xl text-green-600 dark:text-green-400">₹${booking.total}</p>
                        <p class="text-xs text-gray-500 mt-1">
                            Booked on ${new Date(booking.timestamp).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
}



