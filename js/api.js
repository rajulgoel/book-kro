const API_KEY = '0a0a0f8a3015737bf280ff45a2ec950c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Request debouncing for search
let searchController = null;

const api = {
    async makeRequest(url) {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network connection failed. Please check your internet connection.');
            }
            
            throw error;
        }
    },

    async getUpcomingMovies(page = 1) {
        return this.makeRequest(
            `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-IN&region=IN&page=${page}`
        );
    },
    
    async searchMovies(query, page = 1) {
        // Cancel previous search request
        if (searchController) {
            searchController.abort();
        }
        
        searchController = new AbortController();
        
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
        
        try {
            const response = await fetch(url, { signal: searchController.signal });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Search request cancelled');
                return null;
            }
            throw error;
        }
    },
    
    async discoverMovies({ genre, sort, page = 1 }) {
        let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`;
        
        if (genre) url += `&with_genres=${genre}`;
        if (sort) url += `&sort_by=${sort}`;
        
        return this.makeRequest(url);
    },
    
    async getMovieDetails(movieId) {
        return this.makeRequest(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
        );
    },

    getImageUrl(path, size = 'w500') {
        if (!path) return 'assets/placeHolder.webp';
        return `https://image.tmdb.org/t/p/${size}${path}`;
    }
};