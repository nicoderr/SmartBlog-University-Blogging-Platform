# University Blogging Platform

A full-stack blogging platform built with **React**, **Express.js**, **PostgreSQL (Supabase)**, and **Elasticsearch**. Features user authentication, role-based access control, topic subscriptions, and full-text search.

## 🎯 Features

- ✅ **User Authentication** - Register, Login, Logout with JWT tokens
- ✅ **Role-Based Access** - User, Student, Faculty, Staff, Moderator, Administrator
- ✅ **Blog Management** - Create, read, update, delete blog posts
- ✅ **Topic Subscriptions** - Subscribe to topics and get notifications
- ✅ **Full-Text Search** - Search posts with Elasticsearch
- ✅ **Admin Dashboard** - Manage users and content (Administrators only)
- ✅ **Responsive UI** - Built with Material-UI for beautiful design
- ✅ **Real-time Notifications** - Stay updated with post notifications

## 🏗️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **Material-UI (MUI)** - Component library
- **React Router 7.3** - Routing
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

### Backend
- **Express.js 4.21** - Web framework
- **Node.js** - Runtime
- **Supabase PostgreSQL** - Primary database
- **Elasticsearch 8.0** - Full-text search
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Supabase** - Database hosting
- **Docker** - Elasticsearch containerization

---

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 9+** - Comes with Node.js
- **Docker** (optional, for Elasticsearch) - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Quick Start (Development)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "University Blogging Platform/Blog_Material_UI_React_4"
```

### 2. Setup Backend

```bash
# Navigate to backend
cd elastic-backend

# Install dependencies
npm install

# Create .env file (copy from .env.example or add your own credentials)
# See .env.example for template

# Start Elasticsearch (in separate terminal or Docker)
docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.0.0

# Start backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ Connected to Elasticsearch
```

### 3. Setup Frontend

Open a **new terminal**:

```bash
# Navigate to frontend
cd my-react-project

# Install dependencies
npm install

# Create .env file (copy from .env.example or add your own credentials)

# Start React app
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view my-react-project in the browser at http://localhost:3000
```

### 4. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

---

## 🧪 Testing the Application

### Test Scenario 1: Register New User

1. Go to `http://localhost:3000`
2. Click **"Don't have an account? Sign up"**
3. Enter:
   - Email: `student@example.com`
   - Password: `password123` (min 6 chars)
   - Role: `Student`
4. Click **"Sign Up"**
5. Should see Blog page ✅

### Test Scenario 2: Login

1. Click **"Already have an account? Login"**
2. Enter credentials from registration
3. Click **"Login"**
4. Should see Blog page ✅

### Test Scenario 3: Session Persistence

1. Stay on Blog page
2. Press **F5** (refresh page)
3. Should stay logged in ✅ (not redirect to login)

### Test Scenario 4: Admin Dashboard

1. Register with role: `Administrator`
2. Click **"Manage Users"** button
3. Should see Admin page ✅

### Test Scenario 5: Logout

1. Click logout button in Header
2. Should redirect to Login page ✅

---

## 📁 Project Structure

```
Blog_Material_UI_React_4/
│
├── elastic-backend/                 # Express.js Backend
│   ├── config/
│   │   └── supaBaseClient.js        # Supabase configuration
│   ├── controllers/
│   │   ├── AuthController.js        # Login, Register, Logout
│   │   ├── ElasticSearchController.js
│   │   └── ...
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── elasticRoutes.js
│   │   └── ...
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── .env                         # Backend environment variables
│
├── my-react-project/                # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── models/
│   │   │   │   └── LoginFile.js     # Login/Register component
│   │   │   ├── views/
│   │   │   │   └── Blog.js          # Main blog page
│   │   │   └── controllers/
│   │   ├── services/
│   │   │   └── authService.js       # API service for auth
│   │   ├── App.js                   # Main app component
│   │   └── index.js
│   ├── package.json
│   └── .env                         # Frontend environment variables
│
└── README.md                        # This file
```

---

## 🔐 Environment Variables Setup

### Backend (.env)

```env
# Supabase Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT Authentication
JWT_SECRET=your-secret-key-here

# Server Config
PORT=5000
NODE_ENV=development

# Elasticsearch Search
ELASTICSEARCH_URL=http://localhost:9200

# Frontend CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
# Backend API
REACT_APP_API_URL=http://localhost:5000

# Optional APIs
REACT_APP_OPENAI_API_KEY=your-openai-key
REACT_APP_GOOGLE_MAPS_KEY=your-google-key
```

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/validate` | Validate token |
| GET | `/api/auth/me` | Get current user (protected) |

### Example: Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "User"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "User"
  },
  "token": "eyJhbGc..."
}
```

---

## 🐘 Database Schema

### Users Table
```sql
id, email, password_hash, role, created_at, updated_at
```

### Posts Table
```sql
id, author_id, topic_id, title, content, created_at, updated_at
```

### Sessions Table
```sql
id, user_id, token, expires_at, created_at
```

### Topics Table
```sql
id, name, description, created_at
```

### Subscriptions Table
```sql
id, user_id, topic_id, subscribed_at
```

---

## 🚢 Deployment Guide

### Deploy Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project
4. Set `REACT_APP_API_URL` to backend URL
5. Deploy ✅

### Deploy Backend (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables (from .env)
6. Deploy ✅

### Setup Database (Supabase)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Run SQL schema (see `ELASTICSEARCH_SETUP.md`)
4. Get connection credentials
5. Add to backend .env ✅

### Setup Search (Docker on Render)

1. Create `docker-compose.yml` (see below)
2. Deploy with Docker
3. Elasticsearch runs on port 9200 ✅

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - elasticsearch
    environment:
      - ELASTICSEARCH_URL=http://elasticsearch:9200

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

volumes:
  elasticsearch_data:
```

---

## 🐛 Troubleshooting

### Backend won't start

```
Error: ConnectionError at http://localhost:9200
```

**Solution:** Start Elasticsearch
```bash
docker run -d -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.0.0
```

### Frontend won't compile

```
Module not found: 'authService'
```

**Solution:** Make sure file exists at `src/services/authService.js`

### Login fails with 401

```
Error: Invalid credentials
```

**Solution:** 
- Check backend is running on port 5000
- Check Supabase credentials in `.env`
- Verify user exists in database

### CORS errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Update `FRONTEND_URL` in backend `.env` to match your frontend URL

---

## 📞 Support

For issues, check:
1. Backend terminal for error messages
2. Browser DevTools (F12) → Network tab
3. `.env` files for correct credentials
4. Supabase dashboard for database status

---

## 📝 Available Scripts

### Backend

```bash
npm start          # Start backend
npm run dev        # Start with nodemon (auto-reload)
npm run build      # Build for production
```

### Frontend

```bash
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Material-UI Components](https://mui.com/material-ui/getting-started/)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Contributors

- Your Name - Initial work

---

## 🚀 Future Enhancements

- [ ] Add real-time notifications with WebSockets
- [ ] Implement Redis caching layer
- [ ] Add email notifications
- [ ] User profile customization
- [ ] Comment system for posts
- [ ] Like/vote functionality
- [ ] Advanced search filters
- [ ] Post analytics dashboard
- [ ] Mobile app (React Native)
- [ ] API rate limiting

---

**Happy Blogging! 📝**
