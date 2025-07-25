function showBookingModal(movie) {
    // Close any existing modals first
    closeMovieModal();
    closeBookingModal();
    
    // Validate movie object
    if (!movie || !movie.id || !movie.title) {
        console.error('Invalid movie object:', movie);
        showError('Unable to load booking details. Please try again.');
        return;
    }
    
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(currentDate.getDate() + 30); // Allow booking up to 30 days ahead
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    const bookingModal = `
        <div id="booking-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="p-6">
                    <!-- Header -->
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">Book Tickets</h2>
                            <p class="text-gray-600 dark:text-gray-400 mt-1">${movie.title}</p>
                        </div>
                        <button id="close-booking-modal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Close booking modal">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Booking Form -->
                    <form id="booking-form" class="space-y-6">
                        <!-- Theater Selection -->
                        <div>
                            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                Select Theater
                            </label>
                            <select id="theater-select" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" required>
                                <option value="">Choose a theater...</option>
                                <option value="PVR Cinemas - Mall Road">PVR Cinemas - Mall Road</option>
                                <option value="INOX - City Center">INOX - City Center</option>
                                <option value="Cinepolis - Downtown">Cinepolis - Downtown</option>
                                <option value="Miraj Cinemas - Plaza">Miraj Cinemas - Plaza</option>
                                <option value="Fun Cinemas - Metro Mall">Fun Cinemas - Metro Mall</option>
                            </select>
                        </div>
                        
                        <!-- Date Selection -->
                        <div>
                            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Select Date
                            </label>
                            <input type="date" id="date-select" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                                   min="${formatDate(currentDate)}" max="${formatDate(maxDate)}" required>
                        </div>
                        
                        <!-- Show Time Selection -->
                        <div>
                            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Select Show Time
                            </label>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                ${generateShowTimes().map(time => `
                                    <button type="button" class="show-time-btn px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" data-time="${time.time}" data-price="${time.price}">
                                        <div>${time.time}</div>
                                        <div class="text-xs opacity-75">₹${time.price}</div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Ticket Count -->
                        <div>
                            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                                </svg>
                                Number of Tickets
                            </label>
                            <div class="flex items-center space-x-4">
                                <button type="button" id="decrease-tickets" class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                                    </svg>
                                </button>
                                <span id="ticket-count-display" class="text-2xl font-bold min-w-[3rem] text-center">1</span>
                                <button type="button" id="increase-tickets" class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </button>
                            </div>
                            <input type="hidden" id="ticket-count" value="1">
                        </div>
                        
                        <!-- Seat Type Selection -->
                        <div>
                            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                </svg>
                                Seat Type
                            </label>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button type="button" class="seat-type-btn p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 transition-all duration-200 text-left" data-type="regular" data-multiplier="1">
                                    <div class="font-medium">Regular</div>
                                    <div class="text-sm text-gray-500">Standard seating</div>
                                    <div class="text-xs text-green-600 font-medium">Base price</div>
                                </button>
                                <button type="button" class="seat-type-btn p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 transition-all duration-200 text-left" data-type="premium" data-multiplier="1.5">
                                    <div class="font-medium">Premium</div>
                                    <div class="text-sm text-gray-500">Better view & comfort</div>
                                    <div class="text-xs text-blue-600 font-medium">+50% price</div>
                                </button>
                                <button type="button" class="seat-type-btn p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 transition-all duration-200 text-left" data-type="recliner" data-multiplier="2">
                                    <div class="font-medium">Recliner</div>
                                    <div class="text-sm text-gray-500">Luxury seating</div>
                                    <div class="text-xs text-purple-600 font-medium">+100% price</div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Booking Summary -->
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <h3 class="font-semibold mb-3 text-gray-800 dark:text-gray-200">Booking Summary</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Movie:</span>
                                    <span class="font-medium">${movie.title}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Tickets:</span>
                                    <span id="summary-tickets">1</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Seat Type:</span>
                                    <span id="summary-seat-type">Select seat type</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Time:</span>
                                    <span id="summary-time">Select show time</span>
                                </div>
                                <hr class="border-gray-300 dark:border-gray-600">
                                <div class="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span class="text-green-600 dark:text-green-400">₹<span id="total-price">0</span></span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Proceed to Payment Button -->
                        <button type="submit" id="confirm-booking" class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2" disabled>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Proceed to Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    try {
        document.body.insertAdjacentHTML('beforeend', bookingModal);
        setupBookingEvents(movie);
    } catch (error) {
        console.error('Error setting up booking modal:', error);
        showError('Failed to open booking modal. Please try again.');
    }
}

function generateShowTimes() {
    const times = [
        { time: '10:00 AM', price: 200 },
        { time: '1:30 PM', price: 250 },
        { time: '4:45 PM', price: 300 },
        { time: '7:00 PM', price: 350 },
        { time: '10:30 PM', price: 300 }
    ];
    
    return times;
}

function setupBookingEvents(movie) {
    // Form validation state
    let bookingState = {
        theater: null,
        date: null,
        time: null,
        timePrice: 0,
        tickets: 1,
        seatType: null,
        seatMultiplier: 1
    };
    
    // Close modal events
    document.getElementById('close-booking-modal').addEventListener('click', closeBookingModal);
    document.getElementById('booking-modal').addEventListener('click', (e) => {
        if (e.target.id === 'booking-modal') closeBookingModal();
    });
    
    // Form elements
    const form = document.getElementById('booking-form');
    const theaterSelect = document.getElementById('theater-select');
    const dateSelect = document.getElementById('date-select');
    const ticketCountDisplay = document.getElementById('ticket-count-display');
    const ticketCountInput = document.getElementById('ticket-count');
    const confirmButton = document.getElementById('confirm-booking');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateSelect.value = today;
    bookingState.date = today;
    
    // Theater selection
    theaterSelect.addEventListener('change', (e) => {
        bookingState.theater = e.target.value;
        validateForm();
    });
    
    // Date selection
    dateSelect.addEventListener('change', (e) => {
        bookingState.date = e.target.value;
        validateForm();
    });
    
    // Show time selection
    document.querySelectorAll('.show-time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove previous selection
            document.querySelectorAll('.show-time-btn').forEach(b => {
                b.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
            });
            
            // Add selection to clicked button
            e.currentTarget.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
            
            bookingState.time = e.currentTarget.dataset.time;
            bookingState.timePrice = parseInt(e.currentTarget.dataset.price);
            
            document.getElementById('summary-time').textContent = bookingState.time;
            updateTotalPrice();
            validateForm();
        });
    });
    
    // Ticket count controls
    document.getElementById('decrease-tickets').addEventListener('click', () => {
        if (bookingState.tickets > 1) {
            bookingState.tickets--;
            updateTicketDisplay();
            updateTotalPrice();
        }
    });
    
    document.getElementById('increase-tickets').addEventListener('click', () => {
        if (bookingState.tickets < 10) {
            bookingState.tickets++;
            updateTicketDisplay();
            updateTotalPrice();
        }
    });
    
    // Seat type selection
    document.querySelectorAll('.seat-type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove previous selection
            document.querySelectorAll('.seat-type-btn').forEach(b => {
                b.classList.remove('bg-blue-50', 'border-blue-500', 'dark:bg-blue-900');
            });
            
            // Add selection to clicked button
            e.currentTarget.classList.add('bg-blue-50', 'border-blue-500', 'dark:bg-blue-900');
            
            bookingState.seatType = e.currentTarget.dataset.type;
            bookingState.seatMultiplier = parseFloat(e.currentTarget.dataset.multiplier);
            
            const seatTypeNames = {
                regular: 'Regular',
                premium: 'Premium',
                recliner: 'Recliner'
            };
            
            document.getElementById('summary-seat-type').textContent = seatTypeNames[bookingState.seatType];
            updateTotalPrice();
            validateForm();
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            closeBookingModal();
            showPaymentModal(movie, bookingState);
        }
    });
    
    function updateTicketDisplay() {
        ticketCountDisplay.textContent = bookingState.tickets;
        ticketCountInput.value = bookingState.tickets;
        document.getElementById('summary-tickets').textContent = bookingState.tickets;
    }
    
    function updateTotalPrice() {
        if (bookingState.timePrice && bookingState.seatMultiplier) {
            const total = Math.round(bookingState.timePrice * bookingState.tickets * bookingState.seatMultiplier);
            document.getElementById('total-price').textContent = total;
        }
    }
    
    function validateForm() {
        const isValid = bookingState.theater && 
                       bookingState.date && 
                       bookingState.time && 
                       bookingState.seatType;
        
        confirmButton.disabled = !isValid;
        
        if (isValid) {
            confirmButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
            confirmButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
        } else {
            confirmButton.classList.add('bg-gray-400', 'cursor-not-allowed');
            confirmButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        }
        
        return isValid;
    }
}



function showBookingSuccessModal(booking) {
    const successModal = `
        <div id="success-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 text-center animate-bounce-in">
                <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <h3 class="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Booking Confirmed!</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Your tickets have been successfully booked.</p>
                
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                    <h4 class="font-semibold mb-2">Booking Details:</h4>
                    <div class="space-y-1 text-sm">
                        <div><strong>Booking ID:</strong> #${booking.id.toString().slice(-6)}</div>
                        <div><strong>Movie:</strong> ${booking.movieTitle}</div>
                        <div><strong>Theater:</strong> ${booking.theater}</div>
                        <div><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</div>
                        <div><strong>Tickets:</strong> ${booking.tickets} (${booking.seatType})</div>
                        <div><strong>Total:</strong> ₹${booking.total}</div>
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button id="view-bookings" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                        View Bookings
                    </button>
                    <button id="close-success" class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successModal);
    
    // Setup event listeners
    document.getElementById('close-success').addEventListener('click', () => {
        document.getElementById('success-modal').remove();
    });
    
    document.getElementById('view-bookings').addEventListener('click', () => {
        document.getElementById('success-modal').remove();
        showBookingsTab();
    });
    
    // Auto close after 10 seconds
    setTimeout(() => {
        const modal = document.getElementById('success-modal');
        if (modal) modal.remove();
    }, 10000);
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => modal.remove(), 300);
    }
}