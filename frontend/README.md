# StationSathi frontend

## Local development

Run the backend first from the repository root:

```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

In a second terminal, start Vite:

```powershell
cd frontend
npm run dev
```

The frontend is available at `http://localhost:5173`. Vite proxies API requests
to `http://127.0.0.1:8000`. Override that target with
`$env:VITE_API_PROXY_TARGET = "https://example.test"` when needed.

The app also has client-side fallback data, but the backend is required for live
station data, routing, assistant queries, and feedback submission.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
