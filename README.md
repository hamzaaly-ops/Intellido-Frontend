# DocRAG Frontend

A modern, minimalist React frontend for the DocRAG document intelligence system.

## Features

- 🔐 User authentication (Login/Signup)
- 📄 Document upload interface
- 💬 AI-powered chat interface for querying documents
- 🎨 Modern, minimalist design with gradient backgrounds
- 🚀 Built with React, Vite, and Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Backend Configuration

Make sure your backend is running on `http://localhost:8000`. The frontend is configured to communicate with the backend API.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components (Logo, DocumentUpload, ChatInterface)
│   ├── contexts/        # React contexts (AuthContext)
│   ├── pages/          # Page components (Login, Signup, Dashboard)
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Sign in with your credentials
3. **Upload Documents**: Go to the "Upload Documents" tab and upload PDF, DOCX, or TXT files
4. **Query Documents**: Switch to the "Chat" tab and ask questions about your uploaded documents

## API Endpoints Used

- `POST /users/signup` - User registration
- `POST /auth/login` - User authentication
- `POST /rag/upload` - Document upload
- `POST /rag/query` - Query documents
