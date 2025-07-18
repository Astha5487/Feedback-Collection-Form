# Feedback Collection Platform Frontend

This is the frontend for the Feedback Collection Platform, built with React and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

### Development

To start the development server:

```
npm run dev
```

or

```
yarn dev
```

This will start the development server at [http://localhost:5173](http://localhost:5173).

### Building for Production

To build the application for production:

```
npm run build
```

or

```
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```
npm run preview
```

or

```
yarn preview
```

## Features

- User authentication (login/register)
- Form creation and management
- Form submission
- Response viewing

## Backend Integration

The frontend is configured to communicate with the backend API running at `http://localhost:8080` during development. In production, it will use relative paths to the API endpoints.