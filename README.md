# Book-kro 🎬

A modern, responsive movie booking web application that allows users to discover movies, view details, and book tickets online.

## Features

- **Movie Discovery**: Browse popular and upcoming movies
- **Search Functionality**: Search for movies by title
- **Movie Details**: View comprehensive movie information including cast, crew, and trailers
- **Ticket Booking**: Book movie tickets with theater selection and seat booking
- **Payment Integration**: Secure payment processing with UPI and card options
- **Booking Management**: View and manage your movie bookings
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **API**: The Movie Database (TMDb) API
- **Storage**: Local Storage for bookings and preferences

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/book-kro-main.git
cd book-kro-main
```

2. Open `index.html` in your web browser or serve it using a local server:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx serve .
```

3. Navigate to `http://localhost:8000` in your browser

### API Setup

The application uses The Movie Database (TMDb) API. The API key is already configured in `js/api.js`. For production use, you should:

1. Get your own API key from [TMDb](https://www.themoviedb.org/settings/api)
2. Replace the API key in `js/api.js`

## Project Structure

```
book-kro-main/
├── assets/                 # Static assets
│   ├── darkMode.svg       # Dark mode icon
│   ├── placeHolder.webp   # Placeholder image
│   └── qr.jpg            # QR code for payments
├── css/
│   └── styles.css        # Custom styles
├── js/                   # JavaScript modules
│   ├── api.js           # API service layer
│   ├── app.js           # Main application logic
│   ├── booking.js       # Booking functionality
│   ├── debug.js         # Debug utilities
│   ├── header.js        # Header component
│   ├── movieCard.js     # Movie card component
│   ├── movieModal.js    # Movie details modal
│   ├── pagination.js    # Pagination component
│   ├── payment.js       # Payment processing
│   └── search.js        # Search functionality
├── index.html           # Main HTML file
└── README.md           # Project documentation
```

## Usage

### Browsing Movies
- The homepage displays popular movies by default
- Use the search bar to find specific movies
- Click on any movie card to view detailed information

### Booking Tickets
1. Click "Book Now" on any movie card
2. Select your preferred theater and showtime
3. Choose the number of tickets
4. Proceed to payment
5. Complete the booking process

### Managing Bookings
- Click on "My Bookings" in the navigation to view all your bookings
- Bookings are stored locally and persist across browser sessions

## Features in Detail

### Movie Discovery
- **Popular Movies**: Displays trending and popular movies
- **Upcoming Movies**: Shows movies releasing soon
- **Search**: Real-time search with debouncing for better performance
- **Pagination**: Navigate through multiple pages of results

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface for mobile devices

### Performance Optimizations
- Lazy loading for images
- Request debouncing for search
- Loading skeletons for better UX
- Error boundaries with retry functionality

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus management

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the movie data API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- Icons from [Heroicons](https://heroicons.com/)

## Contact

For questions or support, please open an issue on GitHub.

---

**Book-kro** - Your gateway to seamless movie booking! 🍿
