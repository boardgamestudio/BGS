# GEMINI Project Guide: Board Game Studio

**Version 2.0**
**Last Updated:** 2025-08-25

---

## 1. Executive Summary

Board Game Studio is a membership platform connecting professionals in the board game and tabletop RPG industries. The platform enables game designers to showcase projects, freelancers to offer services, and companies to provide professional services to the community.

This document serves as the central guide for development, deployment, and architecture. It reflects the current state of the application and its unique production environment.

### 1.1. Core Features

*   **Frontend:** A React single-page application (SPA) built with Vite, styled with Tailwind CSS and shadcn/ui.
*   **Backend:** A Node.js server using the Express framework and Knex for database communication with a MySQL database.
*   **Core Functionality:** Multi-tier memberships, user profiles with portfolios, project showcases, and a unified marketplace.

### 1.2. Target Architecture vs. Current Implementation
This document outlines a detailed target architecture, including advanced services, controllers, and models. **Note:** The current backend implementation is simpler than the full specification. This document should be used as a guide for future development while accurately describing the existing, functional components.

---

## 2. Critical Deployment & Environment Configuration

**THIS IS THE MOST IMPORTANT SECTION. READ THIS BEFORE ANY DEPLOYMENT.**

The production environment has a unique configuration that must be respected to avoid breaking the live site.

### 2.1. The Golden Rule: URL and Directory Structure

*   **The Problem:** The domain `boardgamestudio.com` resolves to the `/home/peoplein/public_html/api/` directory on the cPanel server. This directory itself is the web root.
*   **The Consequence:** The Node.js/Express application running in this directory **MUST NOT** use an `/api/` prefix in its routes. The application's root (`/`) is already inside the `/api/` directory.

**Correct vs. Incorrect Examples:**

*   **Server Routes (in `server/server.js`):**
    *   `app.use('/projects', ...)`  **✅ CORRECT**
    *   `app.use('/api/projects', ...)` **❌ WRONG** (This would resolve to `boardgamestudio.com/api/projects`, which is incorrect)

*   **Frontend Client Calls (in `src/api/...`):**
    *   `apiClient.get('/projects')` **✅ CORRECT**
    *   `apiClient.get('/api/projects')` **❌ WRONG**

*   **GitHub Actions Deployment (`deploy.yml`):**
    *   The `server-dir` for FTP deployment must be `/` or `./`. It must **NOT** be an absolute path or include `/api/`.

### 2.2. Build & Deployment Process

The deployment process requires building the React frontend and copying the static assets into the `server/` directory, which is then deployed.

1.  **Build Frontend:** Run `npm run build` in the project root. This generates the `dist/` directory.
2.  **Copy Assets:** Manually or via script, copy the contents of `dist/` into `server/`.
    *   `cp dist/index.html server/`
    *   `cp -r dist/assets/* server/assets/`
3.  **Deploy:** The `server/` directory is the source for deployment to production.
4.  **Restart Node.js App:** After deployment, the Node.js application must be restarted via the cPanel interface to apply changes.

**Note on Hidden Files:** The `.htaccess` file in the `server/` directory is critical for the cPanel Phusion Passenger setup. Ensure your copy/deployment process includes hidden files.

### 2.3. Environment Variables & Security

*   **NEVER** commit credentials or secrets to version control.
*   The production server uses an `.env` file for configuration. This file is **NOT** in the repository.
*   For local development, create a `.env` file in the `server/` directory based on `server/.env.example`.

---

## 3. API Specification

All API endpoints are served from the root. Example: `https://boardgamestudio.com/projects`.

### 3.1. Authentication Endpoints
`POST /auth/register`
`POST /auth/login`
... *(other auth routes)*

### 3.2. User Profile Endpoints
`GET /users/me`
`PUT /users/me`
`GET /users/{user_id}`
... *(other user routes)*

### 3.3. Project Endpoints
`GET /projects`
`GET /projects/{slug}`
`POST /projects`
... *(other project routes)*

*(Note: This section should be expanded with the full, corrected API details from the original PDD)*

---

## 4. Database Schema

The database schema is managed by Knex migrations. The full schema is extensive and includes tables for users, roles, projects, portfolios, reviews, and more.

*(Note: The detailed SQL schema from the original PDD should be referenced here or moved to a dedicated `database/schema.md` file for clarity.)*

---

## 5. Local Development Setup

1.  **Frontend:**
    *   Navigate to the project root (`BGS-Base44/`).
    *   Run `npm install`.
    *   Run `npm run dev` to start the Vite development server.

2.  **Backend:**
    *   Navigate to the `server/` directory.
    *   Create an `.env` file from `.env.example` and populate it with your local database credentials.
    *   Run `npm install`.
    *   Set up a local MySQL database and run the migrations: `npx knex migrate:latest`.
    *   Run `npm run dev` to start the Node.js server with `nodemon`.
