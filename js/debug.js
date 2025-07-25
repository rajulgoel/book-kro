// Debug utilities for Book-kro
(function() {
    // Debug function to test booking functionality
    window.debugBooking = function() {
        console.log('=== Booking Debug Info ===');
        
        // Check if required functions exist
        console.log('showBookingModal exists:', typeof showBookingModal === 'function');
        console.log('handleBookingClick exists:', typeof handleBookingClick === 'function');
        console.log('closeBookingModal exists:', typeof closeBookingModal === 'function');
        
        // Check if API is available
        console.log('API object exists:', typeof api === 'object');
        if (typeof api === 'object') {
            console.log('API getMovieDetails exists:', typeof api.getMovieDetails === 'function');
        }
        

        
        // Check for book buttons
        const bookButtons = document.querySelectorAll('.book-btn');
        console.log('Book buttons found:', bookButtons.length);
        
        // Test with a sample movie
        const testMovie = {
            id: 123,
            title: 'Test Movie',
            overview: 'Test description'
        };
        
        try {
            showBookingModal(testMovie);
            console.log('✅ Booking modal opened successfully');
        } catch (error) {
            console.error('❌ Error opening booking modal:', error);
        }
    };
    
    // Function to test notification system
    window.testNotifications = function() {
        console.log('Testing notification system...');
        

    };
    
    // Auto-run basic checks on load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            console.log('🔍 Running automatic booking system check...');
            
            // Check if all required components are loaded
            const checks = [
                { name: 'Booking Modal Function', test: typeof showBookingModal === 'function' },
                { name: 'API Object', test: typeof api === 'object' },

            ];
            
            checks.forEach(check => {
                if (check.test) {
                    console.log(`✅ ${check.name}: OK`);
                } else {
                    console.error(`❌ ${check.name}: MISSING`);
                }
            });
            
            // Check for common issues
            const bookButtons = document.querySelectorAll('.book-btn');
            if (bookButtons.length === 0) {
                console.warn('⚠️ No book buttons found on page');
            }
            
        }, 2000);
    });
})();