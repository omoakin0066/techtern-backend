# TechTern Backend API

A Node.js/Express backend API for the TechTern internship platform, built with MongoDB Atlas.

## Features

- User Authentication (signup, login, logout) with JWT and cookies
- Role-based Access Control (student, employer, admin)
- User Profile Management (view, update)
- Internship CRUD Operations
- Search, Filter, Sort, and Pagination for Internships
- Application System for Students

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (Password Hashing)
- cookie-parser

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Run the Server

```bash
npm start
```

Or for development:

```bash
node server.js
```

The server will start on `http://localhost:5000`

## API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/signup` | Register a new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Public |
| GET | `/profile` | Get user profile | Authenticated |
| PUT | `/profile` | Update user profile | Authenticated |
| PUT | `/password` | Change password | Authenticated |

### Internship Routes (`/api/internships`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all internships (with search, filter, sort, pagination) | Public |
| GET | `/:id` | Get single internship | Public |
| POST | `/` | Create new internship | Employer/Admin |
| PUT | `/:id` | Update internship | Owner/Admin |
| DELETE | `/:id` | Delete internship | Owner/Admin |
| GET | `/my-internships` | Get employer's internships | Employer/Admin |
| GET | `/my-applications` | Get student's applications | Student |
| POST | `/:id/apply` | Apply to internship | Student |
| GET | `/:id/applications` | View applications for internship | Owner/Admin |
| PUT | `/:id/application-status` | Update application status | Owner/Admin |

### Geocoding Routes (`/api/geocode`) - Third-Party API Integration

**External Service:** OpenStreetMap Nominatim API (Free, Open-Access)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Geocode location string to coordinates | Public |
| GET | `/reverse` | Reverse geocode coordinates to location | Public |
| GET | `/search` | Search for locations/places | Public |

#### Example Usage:

```bash
# Geocode a location
GET /api/geocode?location=London,UK

# Reverse geocode coordinates
GET /api/geocode/reverse?lat=51.5074&lon=-0.1278

# Search for locations
GET /api/geocode/search?q=Manchester&limit=5
```

#### Example Response:
```json
{
  "success": true,
  "message": "Location geocoded successfully",
  "source": "OpenStreetMap Nominatim API",
  "data": {
    "latitude": 51.5073219,
    "longitude": -0.1276474,
    "displayName": "London, Greater London, England, United Kingdom",
    "address": {
      "city": "London",
      "state": "England",
      "country": "United Kingdom"
    }
  }
}
```

## Query Parameters for Internship Listing

| Parameter | Description | Example |
|-----------|-------------|---------|
| `search` | Search by title, company, description | `?search=software` |
| `category` | Filter by category | `?category=Software Development` |
| `location` | Filter by location | `?location=London` |
| `type` | Filter by type (remote/onsite/hybrid) | `?type=remote` |
| `sortBy` | Sort field (createdAt, stipend, title) | `?sortBy=createdAt` |
| `sortOrder` | Sort order (asc/desc) | `?sortOrder=desc` |
| `page` | Page number | `?page=1` |
| `limit` | Items per page | `?limit=10` |

## User Roles

| Role | Permissions |
|------|-------------|
| `student` | View internships, apply to internships, view own applications |
| `employer` | Create internships, manage own internships, view applications |
| `admin` | Full access to all resources |

## Test Credentials

For testing purposes, you can create accounts with these roles:

- **Student**: Set `role: "student"` during signup
- **Employer**: Set `role: "employer"` during signup
- **Admin**: Must be set directly in database

## Tutor Access & Live Deployment

### Live URLs
- **Frontend (Vercel):** https://techtern-frontend.vercel.app
- **Backend API (Render):** https://techtern-backend.onrender.com
- **Frontend Code:** https://github.com/omoakin0066/techtern-frontend
- **Backend Code:** https://github.com/omoakin0066/techtern-backend

### MongoDB Atlas Database Access
The tutor has been invited to the MongoDB Atlas project with read-only access.
- **Cluster:** cluster0.li6fihr.mongodb.net
- **Database User:** dxu6_db_user
- **Role:** Read Only

### Environment Variables (for local development)
```
MONGO_URI=mongodb+srv://akintolaphii_db_user:<password>@cluster0.li6fihr.mongodb.net/test
JWT_SECRET=techternsecret123
PORT=5000
```

### Test Account (Live Site)
- **Email:** testlive@example.com
- **Password:** TestLive123!

## Project Structure

```
techtern-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── userController.js
│   └── internshipController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── Internship.js
├── routes/
│   ├── userRoutes.js
│   └── internshipRoutes.js
├── .env
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Author

TechTern Backend - MSc Computing Section 2
