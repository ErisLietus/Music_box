# Music_box

A music player on the web that you can insert your own music to play from the web browser


A backend API for creating and managing music playlists, built with Express, 
TypeScript, PostgreSQL, and Drizzle ORM.

## Purpose

This project demonstrates a full backend implementation including:
- JWT-based authentication and middleware-protected routes
- Relational schema design (foreign keys, cascading deletes, composite unique constraints)
- Efficient querying (joins instead of N+1 lookups, aggregate functions for computed values)
- Centralized error handling with a custom error class hierarchy

**Note:** This project had to be changed or it wasn't going to work for a single project. Here is proof of a working backend for the project with some aspects being moved to a new project using Electron 

## Tech Stack

- Node.js / Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- JWT (jsonwebtoken)

## Setup

\`\`\`bash
git clone https://github.com/ErisLietus/Music_box
npm install
#  Database_url and JWT secret in env.exsample
Look at docker-compose.yml and env.exsample before using docker compose up -d
npm run generate
npm run migrate  
npm run dev
\`\`\`

## API Overview

### Auth

- `POST /api/auth/register` — create a new user
- `POST /api/auth/login` — authenticate and receive a JWT

### Playlists

- `POST /api/playlist/create` — create a playlist (requires auth)

### Media

- `POST /api/media/link` — add a link-based media item to a playlist (requires auth)

## Example Requests (curl)

## login
\`\`\`
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
  \`\`\`

## Create Playlist 

\`\`\`
curl -X POST http://localhost:8080/api/playlist/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Road Trip Mix"
  }'
  \`\`\`

## Add media

\`\`\`
curl -X POST http://localhost:8080/api/media/link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "playlistName": "Road Trip Mix",
    "title": "Never Gonna Give You Up",
    "mediaUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }'
  \`\`\`
    

### Register a user

\`\`\`
curl -X POST http://localhost:8080/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
\`\`\`

Expected response:
\`\`\`json
{"message": "User has been created"}
\`\`\`

### Attempt to register a duplicate username (error case)

\`\`\`
curl -X POST http://localhost:8080/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"username": "testuser", "email": "different@example.com", "password": "password123"}'
\`\`\`

Expected response:
\`\`\`json
{"error": "That username has been taken"}
\`\`\`



