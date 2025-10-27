# 📊 Mova Admin

**Mova Admin** is the administration dashboard for the Mova platform. It is built with [Next.js](https://nextjs.org/) (App Router, TypeScript), and provides a modern interface for managing users, job offers, and platform metadata. This project is designed to be used by administrators and recruiters to manage backend data and monitor platform activity.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🗂️ Project Structure](#️-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [📦 Scripts](#-scripts)
- [🔌 API Routes](#-api-routes)
- [🎨 Styling](#-styling)
- [🧹 Linting & Formatting](#-linting--formatting)
- [⚙️ Configuration Files](#️-configuration-files)
- [🐳 Docker Support](#-docker-support)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [📝 License](#-license)

---

## ✨ Features

- **Authentication**: Secure login for admin users (JWT-based).
- **User Management**: List, search, edit, and delete users.
- **Job Offers Management**: Create, list, search, edit, and delete job offers.
- **Metadata Management**: Fetch job categories, contract types, and experience levels from the backend.
- **Responsive UI**: Modern, responsive design using CSS variables and Tailwind.
- **API Proxy**: Next.js API routes proxy requests to the backend (NestJS) with proper authorization.
- **TypeScript**: Full type safety across the codebase.
- **ESLint**: Code linting and formatting for consistency.

---

## 🗂️ Project Structure

```
mova-admin/
├── .gitignore
├── Dockerfile
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── globals.css           # Global styles and CSS variables
│   │   ├── layout.tsx            # Root layout for all pages
│   │   ├── page.tsx              # Login page
│   │   ├── api/                  # Next.js API routes (proxy to backend)
│   │   │   ├── joboffers/
│   │   │   │   └── route.ts
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── meta/
│   │   │   │   ├── contract-types/route.ts
│   │   │   │   ├── experience-levels/route.ts
│   │   │   │   └── job-categories/route.ts
│   │   │   └── users/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── components/
│   │   │   └── MovaLogo.tsx      # Logo component
│   │   ├── homepage/
│   │   │   └── page.tsx          # Admin dashboard after login
│   │   └── services/
│   │       └── joboffers/
│   │           └── page.tsx      # Job offers management UI
│   └── lib/
│       └── config.ts             # Centralized configuration (e.g., BACKEND_URL)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Access to the Mova backend API (NestJS)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/Portfolio-Project.git
   cd Portfolio-Project/mova-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Create a `.env.local` file at the root of `mova-admin`:
     ```
     BACKEND_URL=http://localhost:3000
     ```
   - Adjust the URL to match your backend API.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 🔑 Environment Variables

- `BACKEND_URL`: The base URL of your backend API (NestJS).  
  Used for proxying API requests from the Next.js frontend.

Example `.env.local`:
```
BACKEND_URL=http://localhost:3000
```

---

## 📦 Scripts

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start the development server       |
| `npm run build`   | Build the application for prod     |
| `npm start`       | Start the production server        |
| `npm run lint`    | Run ESLint on the codebase         |

---

## 🔌 API Routes

All API routes in `src/app/api/` act as proxies to the backend.  
They forward requests and the `Authorization` header to the NestJS backend.

- `/api/login` → Authenticates admin users
- `/api/users` and `/api/users/[id]` → User management
- `/api/joboffers` and `/api/joboffers/[id]` → Job offers management
- `/api/meta/job-categories` → Fetch job categories
- `/api/meta/contract-types` → Fetch contract types
- `/api/meta/experience-levels` → Fetch experience levels

---

## 🎨 Styling

- **Global styles:** Defined in `src/app/globals.css` using CSS variables and Tailwind.
- **Brand colors:** Set as CSS variables (`--primary`, `--secondary`, etc.).
- **Responsive design:** All pages are mobile-friendly.

---

## 🧹 Linting & Formatting

- **ESLint** is configured via `eslint.config.mjs` for Next.js and TypeScript.
- Run `npm run lint` to check code quality.

---

## ⚙️ Configuration Files

- `next.config.ts`: Next.js configuration (customize build, images, etc.)
- `tsconfig.json`: TypeScript configuration
- `eslint.config.mjs`: ESLint configuration
- `postcss.config.mjs`: PostCSS/Tailwind configuration
- `next-env.d.ts`: TypeScript types for Next.js (auto-generated, do not edit)

---

## 🐳 Docker Support

A `Dockerfile` is provided for containerized deployments.

**Build and run with Docker:**
```bash
docker build -t mova-admin .
docker run -p 3000:3000 --env BACKEND_URL=http://backend:3000 mova-admin
```

---

## 🛠️ Troubleshooting

- **API errors:** Check that `BACKEND_URL` is correct and the backend is running.
- **Type errors:** Run `npm run lint` and check your TypeScript setup.
- **Styles not loading:** Ensure `globals.css` is imported in `layout.tsx`.

---

## 📝 License

This project is licensed under the MIT License.  
See [LICENSE](../LICENSE) for details.

---