# This-is-me

Hi, if you found this repo, it means that you have found my personal website!
A couple things about it...
- I am always updating it with some stupid new idea that comes to mind
- There is tons of messy work I need to clean up at some point :3
- Make sure you check out the live version at [this-is-me.dev](https://this-is-me.dev/)

---

## Stack

**Frontend**
- Next.js 15 (App Router, React 19, TypeScript)
- Tailwind CSS + shadcn/ui (Radix UI)
- Framer Motion for animations
- Resend for contact form email delivery

**Backend**
- Rust with Rocket 0.5 (REST API)
- SQLx 0.8 with async MySQL (Tokio runtime)
- rocket_cors for CORS handling

**Database**
- MySQL 8.4

**Infrastructure**
- Docker + Docker Compose (local dev)
- Nginx reverse proxy (routes `/api/` to backend, `/` to frontend)
- Kubernetes with Helm chart (`this-is-me` namespace)
- Azure DevOps CI/CD pipelines

---

## How It Works

### Local Development

Docker Compose spins up four services:

| Service  | Port | Description |
|----------|------|-------------|
| db       | 3306 | MySQL 8.4, initialized from `backend/DB/backup.sql` |
| backend  | 8000 | Rust/Rocket API |
| frontend | 3000 | Next.js app |
| nginx    | 80   | Reverse proxy |

```bash
docker compose up
```

Nginx routes `/api/*` to the backend and everything else to the frontend.

### Frontend

The site is a single-page app navigated via a CRT TV "menu" UI. Sections include Hero (glitch effects, ASCII animations), About, Blog (markdown posts with dynamic routing), and a Contact form. A jumpscare component with a sound effect is also included.

### Backend

Rocket serves a JSON REST API. SQLx manages an async connection pool to MySQL. The `DATABASE_URL`, `ROCKET_ADDRESS`, and `ROCKET_PORT` are loaded from environment variables.

### CI/CD

Two Azure DevOps pipelines (frontend and backend) trigger on changes to their respective directories. Each pipeline:

1. Builds a Docker image using a multi-stage Dockerfile
2. Pushes to Docker Hub (`tvpow3r/frontend-app`, `tvpow3r/backend-app`) tagged with the build ID
3. Deploys via `helm upgrade --install` using `--reuse-values` so only the changed image tag is updated

The pipelines run on a self-hosted agent that has access to a local kubeconfig.

### Kubernetes

The Helm chart deploys three workloads into the `this-is-me` namespace:

| Workload  | Service Type | Port  |
|-----------|-------------|-------|
| frontend  | ClusterIP   | 3000  |
| backend   | ClusterIP   | 8000  |
| nginx     | NodePort    | 30083 |

Backend environment variables are injected from a Kubernetes Secret (`backend-secrets`).

---

## Environment Variables

**Docker Compose (root `.env`)**

| Variable | Description |
|----------|-------------|
| `DB_ROOT_PASSWORD` | MySQL root password |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |

**Frontend**

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key for Resend (contact form) |

**Backend**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Full MySQL connection string |
| `ROCKET_ADDRESS` | Bind address (e.g. `0.0.0.0`) |
| `ROCKET_PORT` | Port (default `8000`) |
