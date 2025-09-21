# Movie Database Management System

A full-stack web application for managing a movie database built with Next.js (frontend) and NestJS (backend).

## Features

### Core Features

- ✅ User authentication (login/register) with JWT tokens
- ✅ Movie CRUD operations (Create, Read, Update, Delete)
- ✅ Movie poster upload functionality
- ✅ Pagination for movie listings
- ✅ Form validation for all inputs
- ✅ Responsive design for mobile and desktop
- ✅ State management with Redux Toolkit

### Extra Credit Features

- ✅ Docker containerization with docker-compose
- ✅ API documentation with Swagger
- ✅ Form validation with error handling
- ✅ Movie list pagination
- ✅ State management
- ✅ Mobile responsiveness
- ✅ Creative UI design matching provided specifications

## Tech Stack

### Frontend

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Redux Toolkit for state management
- React Hook Form with Yup validation
- Axios for API calls
- Lucide React for icons
- React Hot Toast for notifications

### Backend

- NestJS
- TypeScript
- SQLite database with TypeORM
- JWT authentication
- Passport.js for authentication strategies
- Multer for file uploads
- Swagger for API documentation
- Class-validator for DTO validation

## Project Structure

```
task-movie-dashboard/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── movies/         # Movies module
│   │   ├── upload/         # File upload module
│   │   └── database/       # Database configuration
│   ├── uploads/            # Uploaded files
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── store/         # Redux store
│   │   ├── lib/           # API client and utilities
│   │   └── types/         # TypeScript types
│   └── Dockerfile
└── docker-compose.yml     # Docker orchestration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-movie-dashboard
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

   The backend will run on http://localhost:3001

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will run on http://localhost:3000

### Docker Setup

1. **Build and run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Movies

- `GET /movies` - Get all movies (with pagination)
- `GET /movies/:id` - Get movie by ID
- `POST /movies` - Create a new movie
- `PATCH /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie

### Upload

- `POST /upload/poster` - Upload movie poster

## Design Implementation

The application follows the provided design specifications:

- **Login Screen**: Dark teal background with wave pattern, centered form
- **Movie List**: Grid layout with movie cards, pagination controls
- **Empty State**: Centered message with call-to-action button
- **Movie Form**: Modal with image upload and form fields
- **Color Scheme**: Dark teal (#263E4A), light green (#60D68A), white text

## Features in Detail

### Authentication

- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- Automatic token refresh and logout

### Movie Management

- Full CRUD operations for movies
- Image upload with validation
- Pagination with customizable page size
- Real-time form validation
- Responsive grid layout

### Form Validation

- Email format validation
- Password strength requirements
- Movie title and year validation
- File type and size validation for uploads
- Real-time error display

### State Management

- Redux Toolkit for predictable state updates
- Async thunks for API calls
- Persistent authentication state
- Optimistic updates for better UX

### Mobile Responsiveness

- Responsive grid layout
- Touch-friendly interface
- Mobile-optimized forms
- Adaptive navigation

## Environment Variables

### Backend (.env)

```
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Schema

### Users Table

- id (Primary Key)
- email (Unique)
- password (Hashed)
- createdAt
- updatedAt

### Movies Table

- id (Primary Key)
- title
- publishingYear
- poster (Optional)
- userId (Foreign Key)
- createdAt
- updatedAt

## Development Scripts

### Backend

- `npm run start` - Start production server
- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
