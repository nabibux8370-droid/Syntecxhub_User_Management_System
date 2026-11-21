# Syntecxhub User Management System

RESTful API for user management built with **Node.js, Express, MongoDB & Mongoose**, secured with **HTTP Basic Authentication**.
(Syntecxhub Web Development Internship - Week 2, Project 1)

## Features
- CRUD: Create, Read (all/one), Update, Delete
- MongoDB + Mongoose schema with validation
- Passwords hashed with bcrypt (never returned in responses)
- Basic Auth on protected endpoints
- Role-based access: `user` (own account only) / `admin` (everything)
- Pagination + search on user list
- Centralized error handling (validation, duplicate email, invalid id, bad JSON)
- Postman collection included

## Setup
```bash
git clone https://github.com/<your-username>/Syntecxhub_User_Management_System.git
cd Syntecxhub_User_Management_System
npm install
cp .env.example .env      # apna MONGO_URI / admin credentials set karein
npm start                 # ya: npm run dev
```
MongoDB local chalana zaroori hai (ya MongoDB Atlas ka URI `.env` me dein).
Start par `.env` wala admin automatically create ho jata hai.

## Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users` | Public | Create user (signup) |
| GET | `/api/users?page=&limit=&search=` | Admin | List users |
| GET | `/api/users/:id` | Self / Admin | Get one user |
| PUT | `/api/users/:id` | Self / Admin | Update user (role sirf admin) |
| DELETE | `/api/users/:id` | Self / Admin | Delete user |

Auth header: `Authorization: Basic base64(email:password)` (Postman me Authorization tab -> Basic Auth).

## Example
```bash
# Create
curl -X POST http://localhost:5000/api/users -H "Content-Type: application/json" \
  -d '{"name":"Ali Khan","email":"ali@example.com","password":"secret123","age":22}'

# Get my profile
curl -u ali@example.com:secret123 http://localhost:5000/api/users/<id>
```

## Testing with Postman
`postman/UserManagement.postman_collection.json` import karein, `userId` variable me create wale user ki `_id` paste karein.

## Project Structure
```
server.js
src/
  app.js
  config/db.js
  models/User.js
  middleware/auth.js, errorHandler.js
  controllers/userController.js
  routes/userRoutes.js
postman/
```
