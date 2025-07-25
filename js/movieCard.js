function createMovieCard(movie, isFavorite = false) {
    if (!movie || !movie.id) {
        console.warn('Invalid movie data:', movie);
        return '';
    }

    const posterUrl = movie.poster_path ? api.getImageUrl(movie.poster_path, 'w342') : 'assets/placeHolder.webp';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    }) : 'TBA';
    
    // Truncate title for better mobile display
    const truncatedTitle = movie.title.length > 20 ? 
        movie.title.substring(0, 17) + '...' : 
        movie.title;
    
    return `
        <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-lg transition-all duration-300 movie-card border border-gray-200 dark:border-gray-700 group" 
             data-movie-id="${movie.id}"
             tabindex="0"
             role="button"
             aria-label="View details for ${movie.title}">
            
            <div class="aspect-[2/3] relative overflow-hidden">
                <!-- Lazy loading image with better fallback -->
                <img 
                    data-src="${posterUrl}" 
                    alt="${movie.title} poster" 
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onerror="this.src='assets/placeHolder.webp'; this.onerror=null;"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='342' height='513'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E"
                >
                
                <!-- Rating badge with better styling -->
                <div class="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-sm">
                    ⭐ ${rating}
                </div>
                
                <!-- Favorite remove button -->
                ${isFavorite ? `
                    <button 
                        class="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200 remove-favorite shadow-md" 
                        data-movie-id="${movie.id}"
                        aria-label="Remove from favorites"
                        title="Remove from favorites">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                ` : ''}
                
                <!-- Overlay for hover effect -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                            <svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-3 md:p-4">
                <!-- Movie title with tooltip for full text -->
                <div class="text-sm md:text-base font-semibold mb-2 line-clamp-2" title="${movie.title}">
                    ${movie.title}
                </div>
                
                <!-- Release date -->
                <div class="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    ${releaseDate}
                </div>
                
                <!-- Action buttons -->
                <div class="space-y-2">
                    <!-- Book Now button -->
                    <button 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 book-btn text-sm font-medium shadow-sm" 
                        data-movie-id="${movie.id}"
                        aria-label="Book tickets for ${movie.title}">
                        🎫 Book Now
                    </button>
                    

                </div>
            </div>
        </div>
    `;
}

// Enhanced image lazy loading with Intersection Observer
function setupImageLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    
                    // Add fade-in effect when loaded
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    }, { once: true });
                    
                    observer.unobserve(img);
                }
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        imageObserver.observe(img);
    });
}

// Call this function after adding movie cards to the DOM
function lazyLoadImages() {
    setupImageLazyLoading();
}

// Enhanced movie card click handler
function handleMovieCardClick(movieId, element) {
    // Add click animation
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
    
    // Show modal
    showMovieModal(movieId);
}

// Utility function to create skeleton loading cards
function createMovieCardSkeleton() {
    return `
        <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
            <div class="aspect-[2/3] bg-gray-300 dark:bg-gray-600"></div>
            <div class="p-3 md:p-4">
                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-3/4"></div>
                <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    `;
}

// Function to display multiple skeleton cards while loading
function showMovieSkeletons(count = 10) {
    const movieGrid = document.getElementById('movie-grid');
    if (movieGrid) {
        movieGrid.innerHTML = Array(count).fill(0).map(() => createMovieCardSkeleton()).join('');
    }
}

