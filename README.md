# Frontend

React frontend for the Inventory & Order Management System.

## Run Locally

```sh
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173` and calls the backend from `VITE_API_BASE_URL`.

If this folder is moved outside the backend repository, keep `.env` updated:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Build

```sh
npm run build
npm run preview
```
# inventory_frontend
