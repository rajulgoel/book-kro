function showPaymentModal(movie, bookingState) {
    const total = Math.round(bookingState.timePrice * bookingState.tickets * bookingState.seatMultiplier);
    
    const paymentModal = `
        <div id="payment-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md md:max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 text-center">Payment Gateway</h2>
                    
                    <div class="flex flex-col md:flex-row gap-6">
                        <!-- Booking Summary -->
                        <div class="flex-1">
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 h-full">
                                <h3 class="font-semibold mb-4 text-gray-800 dark:text-gray-200">Order Summary</h3>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Movie:</span>
                                        <span class="font-medium">${movie.title}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Theater:</span>
                                        <span class="font-medium">${bookingState.theater}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Date & Time:</span>
                                        <span class="font-medium">${bookingState.date} at ${bookingState.time}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600 dark:text-gray-400">Tickets:</span>
                                        <span class="font-medium">${bookingState.tickets} (${bookingState.seatType})</span>
                                    </div>
                                    <hr class="border-gray-300 dark:border-gray-600">
                                    <div class="flex justify-between font-bold text-lg">
                                        <span>Total Amount:</span>
                                        <span class="text-green-600 dark:text-green-400">₹${total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- QR Code Section -->
                        <div class="flex-1 text-center">
                            <p class="text-gray-600 dark:text-gray-400 mb-4">Scan QR code to pay</p>
                            <div class="flex justify-center mb-4">
                                <img src="assets/qr.jpg" alt="Payment QR Code" class="w-48 h-48 md:w-56 md:h-56 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
                            </div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Use any UPI app to scan and pay ₹${total}</p>
                        </div>
                    </div>
                    
                    <!-- Payment Actions -->
                    <div class="flex gap-3 mt-6">
                        <button id="cancel-payment" class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button id="payment-done" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', paymentModal);
    
    // Setup event listeners
    document.getElementById('cancel-payment').addEventListener('click', () => {
        closePaymentModal();
    });
    
    document.getElementById('payment-done').addEventListener('click', () => {
        closePaymentModal();
        processPaymentAndConfirmBooking(movie, bookingState);
    });
    
    // Close on backdrop click
    document.getElementById('payment-modal').addEventListener('click', (e) => {
        if (e.target.id === 'payment-modal') {
            closePaymentModal();
        }
    });
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.remove();
    }
}

function processPaymentAndConfirmBooking(movie, bookingState) {
    const total = Math.round(bookingState.timePrice * bookingState.tickets * bookingState.seatMultiplier);
    
    // Create booking object
    const booking = {
        id: Date.now(),
        movieTitle: movie.title,
        movieId: movie.id,
        theater: bookingState.theater,
        date: bookingState.date,
        time: bookingState.time,
        tickets: bookingState.tickets,
        seatType: bookingState.seatType,
        total: total,
        timestamp: new Date().toISOString(),
        status: 'confirmed',
        paymentStatus: 'paid'
    };
    
    // Save booking to localStorage
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success message
    showBookingSuccessModal(booking);
}