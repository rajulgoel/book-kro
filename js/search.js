function createSearchBar() {
    return `
        <div class="mb-8">
            <div class="flex flex-col md:flex-row gap-4 items-stretch">
                <!-- Search input with enhanced styling -->
                <div class="flex-1 relative">
                    <input 
                        type="text" 
                        id="search-input" 
                        placeholder="Search movies..." 
                        class="w-full px-4 py-3 pr-10 rounded-full border border-gray-300 dark:border-gray-600 bg-purple-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    
                    <!-- Search suggestions dropdown -->
                    <div id="search-suggestions" class="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg mt-1 shadow-lg z-20 hidden max-h-60 overflow-y-auto">
                    </div>
                    
                    <!-- Loading indicator -->
                    <div id="search-loading" class="absolute inset-y-0 right-8 flex items-center hidden">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                </div>
                
                <!-- Filter controls -->
                <div class="flex gap-2 md:gap-4">
                    <select id="genre-filter" class="px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base min-w-0 flex-1 md:flex-none">
                        <option value="">All Genres</option>
                        <option value="28">Action</option>
                        <option value="35">Comedy</option>
                        <option value="18">Drama</option>
                        <option value="27">Horror</option>
                        <option value="10749">Romance</option>
                        <option value="878">Sci-Fi</option>
                        <option value="53">Thriller</option>
                        <option value="16">Animation</option>
                        <option value="12">Adventure</option>
                        <option value="14">Fantasy</option>
                    </select>
                    
                    <select id="sort-filter" class="px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base min-w-0 flex-1 md:flex-none">
                        <option value="popularity.desc">Most Popular</option>
                        <option value="vote_average.desc">Highest Rated</option>
                        <option value="release_date.desc">Latest Release</option>
                        <option value="revenue.desc">Top Grossing</option>
                        <option value="original_title.asc">A-Z</option>
                    </select>
                </div>
                
                <!-- Clear filters button -->
                <button id="clear-filters" class="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors duration-200 text-sm font-medium hidden">
                    Clear
                </button>
            </div>
            
            <!-- Search info -->
            <div id="search-info" class="mt-3 text-sm text-gray-600 dark:text-gray-400 hidden">
                <span id="search-results-count"></span>
            </div>
        </div>
    `;
}

let searchTimeout;
let typingInterval;
let searchSuggestionsCache = new Map();

function startTypingEffect() {
    const searchInput = document.getElementById('search-input');
    const messages = [
        'Search movies...',
        'Find your next favorite...',
        'Discover new releases...',
        'Search by title, genre...',
        'AI powered search...'
    ];
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        if (searchInput === document.activeElement || searchInput.value.length > 0) {
            setTimeout(type, 2000);
            return;
        }
        
        const currentMessage = messages[messageIndex];
        
        if (!isDeleting && charIndex < currentMessage.length) {
            searchInput.placeholder = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
            searchInput.placeholder = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, 50);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                messageIndex = (messageIndex + 1) % messages.length;
            }
            setTimeout(type, isDeleting ? 1500 : 500);
        }
    }
    
    type();
}

function setupSearchEvents() {
    const searchInput = document.getElementById('search-input');
    const genreFilter = document.getElementById('genre-filter');
    const sortFilter = document.getElementById('sort-filter');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    startTypingEffect();

    // Enhanced search input handler
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleSearchFocus);
    searchInput.addEventListener('blur', handleSearchBlur);
    searchInput.addEventListener('keydown', handleSearchKeydown);

    // Filter change handlers
    genreFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    
    // Clear filters button
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            hideSuggestions();
        }
    });
}

function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    clearTimeout(searchTimeout);
    
    if (query.length === 0) {
        hideSuggestions();
        hideSearchLoading();
        hideSearchInfo();
        loadPopularMovies();
        return;
    }
    
    if (query.length < 2) {
        hideSuggestions();
        return;
    }
    
    showSearchLoading();
    
    searchTimeout = setTimeout(async () => {
        try {
            await searchMovies(query);
            await showSearchSuggestions(query);
        } catch (error) {
            console.error('Search error:', error);
            hideSearchLoading();
        }
    }, 300);
}

function handleSearchFocus() {
    const query = document.getElementById('search-input').value.trim();
    if (query.length >= 2) {
        showSearchSuggestions(query);
    }
}

function handleSearchBlur() {
    // Delay hiding to allow for suggestion clicks
    setTimeout(() => {
        hideSuggestions();
    }, 200);
}

function handleSearchKeydown(e) {
    const suggestions = document.getElementById('search-suggestions');
    const activeSuggestion = suggestions.querySelector('.suggestion-active');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateSuggestions('down');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateSuggestions('up');
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestion) {
            selectSuggestion(activeSuggestion.textContent);
        }
    } else if (e.key === 'Escape') {
        hideSuggestions();
        e.target.blur();
    }
}

function handleFilterChange() {
    updateClearFiltersButton();
    filterMovies();
}

async function searchMovies(query) {
    if (!query || query.length < 2) return;
    
    try {
        const data = await api.searchMovies(query);
        
        if (data && data.results) {
            displayMovies(data.results);

        }
        
        hideSearchLoading();
    } catch (error) {
        console.error('Search error:', error);
        hideSearchLoading();

    }
}

async function showSearchSuggestions(query) {
    if (query.length < 2) return;
    
    // Check cache first
    if (searchSuggestionsCache.has(query)) {
        renderSuggestions(searchSuggestionsCache.get(query));
        return;
    }
    
    try {
        const data = await api.searchMovies(query);
        
        if (data && data.results) {
            const suggestions = data.results.slice(0, 5).map(movie => movie.title);
            searchSuggestionsCache.set(query, suggestions);
            renderSuggestions(suggestions);
        }
    } catch (error) {
        console.error('Suggestions error:', error);
        hideSuggestions();
    }
}

function renderSuggestions(suggestions) {
    const container = document.getElementById('search-suggestions');
    
    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }
    
    container.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150">
            ${suggestion}
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            selectSuggestion(item.textContent);
        });
    });
    
    container.classList.remove('hidden');
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = suggestion;
    hideSuggestions();
    searchMovies(suggestion);
}

function navigateSuggestions(direction) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    const current = document.querySelector('.suggestion-active');
    
    if (suggestions.length === 0) return;
    
    let newIndex = 0;
    
    if (current) {
        current.classList.remove('suggestion-active');
        const currentIndex = Array.from(suggestions).indexOf(current);
        
        if (direction === 'down') {
            newIndex = (currentIndex + 1) % suggestions.length;
        } else {
            newIndex = currentIndex === 0 ? suggestions.length - 1 : currentIndex - 1;
        }
    }
    
    suggestions[newIndex].classList.add('suggestion-active', 'bg-blue-100', 'dark:bg-blue-900');
}

async function filterMovies() {
    const genre = document.getElementById('genre-filter').value;
    const sort = document.getElementById('sort-filter').value;
    const searchQuery = document.getElementById('search-input').value.trim();
    
    // If there's a search query, don't apply filters
    if (searchQuery) {
        return;
    }
    
    try {
        showSearchLoading();
        const data = await api.discoverMovies({ genre, sort });
        
        if (data && data.results) {
            displayMovies(data.results);
            showSearchInfo(data.results.length, null, { genre, sort });
        }
        
        hideSearchLoading();
    } catch (error) {
        console.error('Filter error:', error);
        hideSearchLoading();

    }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movie-grid');
    
    if (movies.length === 0) {
        const query = document.getElementById('search-input').value.trim();

        movieGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">🔍</div>
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">No movies found</p>
                <p class="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    movieGrid.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
    lazyLoadImages();
}

function clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('genre-filter').value = '';
    document.getElementById('sort-filter').value = 'popularity.desc';
    
    hideSuggestions();
    hideSearchInfo();
    updateClearFiltersButton();
    
    loadPopularMovies();
}

function updateClearFiltersButton() {
    const clearBtn = document.getElementById('clear-filters');
    const hasFilters = document.getElementById('search-input').value ||
                      document.getElementById('genre-filter').value ||
                      document.getElementById('sort-filter').value !== 'popularity.desc';
    
    clearBtn.classList.toggle('hidden', !hasFilters);
}

function showSearchLoading() {
    document.getElementById('search-loading').classList.remove('hidden');
}

function hideSearchLoading() {
    document.getElementById('search-loading').classList.add('hidden');
}

function showSearchInfo(count, query, filters) {
    const infoElement = document.getElementById('search-info');
    const countElement = document.getElementById('search-results-count');
    
    let message = '';
    
    if (query) {
        message = `Found ${count} results for "${query}"`;
    } else if (filters) {
        const genreText = filters.genre ? getGenreName(filters.genre) : '';
        const sortText = getSortName(filters.sort);
        message = `Showing ${count} ${genreText} movies sorted by ${sortText}`;
    }
    
    countElement.textContent = message;
    infoElement.classList.remove('hidden');
}

function hideSearchInfo() {
    document.getElementById('search-info').classList.add('hidden');
}

function hideSuggestions() {
    document.getElementById('search-suggestions').classList.add('hidden');
}

function getGenreName(genreId) {
    const genres = {
        28: 'Action',
        35: 'Comedy',
        18: 'Drama',
        27: 'Horror',
        10749: 'Romance',
        878: 'Sci-Fi',
        53: 'Thriller',
        16: 'Animation',
        12: 'Adventure',
        14: 'Fantasy'
    };
    return genres[genreId] || '';
}

function getSortName(sortValue) {
    const sorts = {
        'popularity.desc': 'popularity',
        'vote_average.desc': 'rating',
        'release_date.desc': 'release date',
        'revenue.desc': 'box office',
        'original_title.asc': 'alphabetical order'
    };
    return sorts[sortValue] || 'popularity';
}

// Add enhanced CSS for suggestions
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .suggestion-item.suggestion-active {
        background-color: rgba(59, 130, 246, 0.1);
    }
    
    .dark .suggestion-item.suggestion-active {
        background-color: rgba(59, 130, 246, 0.2);
    }
    
    #search-suggestions {
        animation: slideDown 0.2s ease-out;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(searchStyles);