# The Fit Cubs Frontend

React frontend for The Fit Cubs Kids Mini Marathon 2025 registration system.

## Features

- Responsive design for all devices
- Modern UI with custom theme colors
- Multi-step registration form
- Real-time payment amount calculation
- Payment success/failure handling
- Comprehensive event information

## Pages

### Home (`/`)
- Event overview
- Run categories and pricing
- Prize information
- Event highlights
- Call-to-action sections

### About (`/about`)
- About The Fit Cubs organization
- Detailed event information
- Run category details
- Why participate section

### Register (`/register`)
- Complete registration form
- Child details
- Parent/guardian details
- Category selection
- T-shirt size selection
- Breakfast add-on option
- Payment summary
- Form validation

### Contact (`/contact`)
- Contact information
- Contact form
- FAQ section
- Event location details

### Payment Success (`/payment-success`)
- Success confirmation
- Registration details
- Next steps
- Downloadable receipt

### Payment Failed (`/payment-failed`)
- Failure notification
- Error information
- Retry options
- Support information

## Components

### Navbar
- Responsive navigation
- Mobile hamburger menu
- Active link highlighting

### Footer
- Contact information
- Quick links
- Social media links
- Event details

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Styling

The application uses custom CSS with the following theme:
- Primary Blue: #35AEBF
- Primary Green: #9CBC1D
- Primary Red: #F47475

All styles are modular and component-specific.

## API Integration

Frontend communicates with the backend API using Axios:
- Base URL configured in `.env`
- Error handling on all requests
- Loading states for async operations

## Form Validation

- Required field validation
- Email format validation
- Phone number validation (10 digits)
- Age range validation
- Date of birth validation

## Responsive Design

- Mobile-first approach
- Breakpoints at 768px and 968px
- Touch-friendly interface
- Optimized for all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React.lazy (can be added)
- Optimized images
- Minimal dependencies
- CSS animations for smooth UX
