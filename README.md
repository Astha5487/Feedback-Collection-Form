# Feedback Collection Platform

A modern web application that allows businesses to create customizable feedback forms and collect responses from customers. Built with Spring Boot for the backend and React + Tailwind CSS for the frontend.

## Features

- **User Authentication**: Secure JWT-based authentication for admins
- **Form Creation**: Create customizable feedback forms with text and multiple-choice questions
- **Public Forms**: Share forms via public URLs that don't require login
- **Response Collection**: Collect and store responses from users
- **Dashboard View**: View responses in both tabular and summary formats
- **Export**: Export responses to CSV format
- **Responsive Design**: Mobile-friendly interface that works on all devices

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL/H2 Database
- Maven

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- React Router for navigation
- Axios for API requests
- Vite for build tooling

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- npm or yarn
- PostgreSQL (optional, can use H2 in-memory database for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/feedback-collection-platform.git
   cd feedback-collection-platform
   ```

2. Backend Setup:
   ```bash
   # Build the project
   ./mvnw clean install
   
   # Run the application
   ./mvnw spring-boot:run
   ```

3. Frontend Setup:
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9191/api

### Configuration

#### Backend Configuration
Edit `src/main/resources/application.properties` to configure:
- Database connection
- JWT secret and expiration
- CORS settings
- Logging levels

#### Frontend Configuration
Edit `frontend/.env` to configure:
- API base URL
- Environment-specific settings

## Usage

### Admin/Business User
1. Register a new account or login with existing credentials
2. Create a new feedback form with custom questions
3. Share the generated public URL with customers
4. View responses in the dashboard
5. Export responses to CSV if needed
6. Use the theme toggle to switch between light and dark modes.

### Customer/End User
1. Access the form via the shared public URL
2. Fill out the feedback form
3. Submit responses (no login required)

## Project Structure

### Backend Structure
```
src/main/java/com/FeedBackCollectionForm/assignment/
├── config/           # Configuration classes
├── controller/       # REST API controllers
├── exception/        # Custom exceptions
├── model/            # Entity classes
├── payload/          # Request/Response DTOs
├── repository/       # Data access interfaces
├── security/         # Security configuration
└── service/          # Business logic
```

### Frontend Structure
```
frontend/
├── src/
│   ├── assets/       # Static assets
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── services/     # API service functions
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
├── public/           # Public static files
└── index.html        # HTML template
```

## Project Screenshot
![Screenshot 1](https://github.com/user-attachments/assets/2a5c899f-9175-4391-b5a7-77d153604f08)

![Screenshot 2](https://github.com/user-attachments/assets/2e0e754a-7782-4f55-8b03-bd3cafdcdfd5)

![Screenshot 3](https://github.com/user-attachments/assets/0e8970fb-ff29-4e41-aad6-d46833568050)

![Screenshot 4](https://github.com/user-attachments/assets/292e0372-da4f-4d66-a88d-7313cf188950)

![Screenshot 5](https://github.com/user-attachments/assets/87339b96-f0fb-4859-a006-2689277746a1)


