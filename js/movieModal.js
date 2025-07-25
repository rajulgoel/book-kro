function createMovieModal(movie) {
    const backdropUrl = movie.backdrop_path ? api.getImageUrl(movie.backdrop_path, 'w1280') : '';
    const posterUrl = movie.poster_path ? api.getImageUrl(movie.poster_path, 'w500') : 'assets/placeHolder.webp';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
    const runtime = movie.runtime ? `${movie.runtime} min` : '';
    
    // Get genres
    const genres = movie.genres ? movie.genres.map(g => g.name).slice(0, 3).join(', ') : '';
    
    // Get cast (if available)
    const cast = movie.credits && movie.credits.cast ? 
        movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') : '';
    


    return `
        <div id="movie-modal" class="fixed inset-0 bg-black bg-opacity-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-all duration-300">
            <div class="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform translate-y-full sm:translate-y-0 sm:scale-75 transition-all duration-300 shadow-2xl">
                
                <!-- Header with backdrop -->
                <div class="relative">
                    ${backdropUrl ? `
                        <div class="relative h-48 sm:h-64 overflow-hidden rounded-t-2xl">
                            <img src="${backdropUrl}" alt="${movie.title} backdrop" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            <!-- Close button -->
                            <button id="close-modal" class="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm" aria-label="Close modal">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                            
                            <!-- Rating badge -->
                            <div class="absolute top-3 left-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                ⭐ ${rating}
                            </div>
                        </div>
                    ` : `
                        <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <div class="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                                ⭐ ${rating}
                            </div>
                            <button id="close-modal" class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200" aria-label="Close modal">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    `}
                </div>
                
                <!-- Content -->
                <div class="p-4 sm:p-6">
                    <div class="flex flex-col sm:flex-row gap-6">
                        <!-- Poster -->
                        <div class="flex-shrink-0 mx-auto sm:mx-0 hidden sm:block">
                            <img src="${posterUrl}" alt="${movie.title} poster" 
                                 class="w-40 h-60 sm:w-48 sm:h-72 object-cover rounded-xl shadow-lg"
                                 onerror="this.src='assets/placeHolder.webp'">
                        </div>
                        
                        <!-- Movie details -->
                        <div class="flex-1">
                            <h2 class="text-2xl sm:text-3xl font-bold mb-3 text-center sm:text-left">${movie.title}</h2>
                            
                            <!-- Movie meta info -->
                            <div class="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>${releaseYear}</span>
                                ${runtime ? `<span>• ${runtime}</span>` : ''}
                                ${genres ? `<span>• ${genres}</span>` : ''}
                            </div>
                            
                            <!-- Overview -->
                            <div class="mb-6">
                                <h3 class="font-semibold mb-2">Overview</h3>
                                <p class="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                                    ${movie.overview || 'No overview available.'}
                                </p>
                            </div>
                            
                            <!-- Cast -->
                            ${cast ? `
                                <div class="mb-6">
                                    <h3 class="font-semibold mb-2">Cast</h3>
                                    <p class="text-gray-600 dark:text-gray-400 text-sm">${cast}</p>
                                </div>
                            ` : ''}
                            
                            <!-- Action buttons -->
                            <div class="flex flex-col sm:flex-row gap-3">
                                <button id="book-tickets" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium text-center flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                                    </svg>
                                    Book Tickets
                                </button>
                                

                                
                                <!-- Share button -->
                                <button id="share-movie" class="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center" title="Share this movie">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function showMovieModal(movieId) {
    try {
        // Show loading state
        document.body.insertAdjacentHTML('beforeend', `
            <div id="movie-modal-loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p class="text-lg font-medium">Loading movie details...</p>
                </div>
            </div>
        `);

        const movie = await api.getMovieDetails(movieId);
        
        // Remove loading state
        document.getElementById('movie-modal-loading')?.remove();
        
        // Create and show modal
        document.body.insertAdjacentHTML('beforeend', createMovieModal(movie));
        
        const modal = document.getElementById('movie-modal');
        const content = modal.querySelector('div');
        
        // Animate modal in
        setTimeout(() => {
            modal.classList.remove('bg-opacity-0');
            modal.classList.add('bg-opacity-50');
            content.classList.remove('translate-y-full', 'sm:scale-75');
            content.classList.add('translate-y-0', 'sm:scale-100');
        }, 10);
        
        // Setup event listeners
        setupMovieModalEvents(movie);
        
    } catch (error) {
        console.error('Error loading movie details:', error);
        document.getElementById('movie-modal-loading')?.remove();

    }
}

function setupMovieModalEvents(movie) {
    // Close modal events
    document.getElementById('close-modal').addEventListener('click', closeMovieModal);
    document.getElementById('movie-modal').addEventListener('click', (e) => {
        if (e.target.id === 'movie-modal') closeMovieModal();
    });
    
    // Escape key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeMovieModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    

    
    // Book tickets
    document.getElementById('book-tickets').addEventListener('click', () => {
        showBookingModal(movie);
    });
    
    // Share movie
    document.getElementById('share-movie').addEventListener('click', () => {
        shareMovie(movie);
    });
}



function closeMovieModal() {
    const modal = document.getElementById('movie-modal');
    if (modal) {
        const content = modal.querySelector('div');
        modal.classList.remove('bg-opacity-50');
        modal.classList.add('bg-opacity-0');
        content.classList.remove('translate-y-0', 'sm:scale-100');
        content.classList.add('translate-y-full', 'sm:scale-75');
        
        setTimeout(() => modal.remove(), 300);
    }
}





async function shareMovie(movie) {
    const shareData = {
        title: `${movie.title} - Book-kro`,
        text: `Check out ${movie.title} on Book-kro! ${movie.overview?.substring(0, 100)}...`,
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);

        } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);

        }
    } catch (error) {
        console.error('Error sharing movie:', error);

    }
}

// Add additional styles for modal
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    /* Custom scrollbar for modal */
    #movie-modal div:first-child::-webkit-scrollbar {
        width: 6px;
    }
    
    #movie-modal div:first-child::-webkit-scrollbar-track {
        background: transparent;
    }
    
    #movie-modal div:first-child::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }
    
    #movie-modal div:first-child::-webkit-scrollbar-thumb:hover {
        background: rgba(156, 163, 175, 0.7);
    }
    
    /* Backdrop blur effect */
    .backdrop-blur-sm {
        backdrop-filter: blur(4px);
    }
    
    /* Button hover effects */
    button:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
`;
document.head.appendChild(modalStyles);