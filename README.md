# Todo Application

A simple and clean Todo Application built with React, Vite, and Tailwind CSS v4.

## Tech Stack

- **React 19** — UI library
- **Vite** — fast development server and build tool
- **Tailwind CSS v4** — utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` with hot module replacement.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
├── assets/
│   └── css/
│       └── navbar.css
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Linting

```bash
npm run lint
```

## AI Chat

The tasks page now includes a floating AI chat widget in the bottom-right corner.
It talks to the Express API, which in turn uses the GitHub Copilot SDK.

The server now needs Node 20+ because `@github/copilot-sdk` 0.2.2 declares that runtime requirement.

If you already have GitHub Copilot access, you do not need an OpenAI key. Use a supported GitHub token or local Copilot CLI login. Only set the `COPILOT_PROVIDER_*` variables when you want true BYOK routing through OpenAI or another provider.

To enable the backend assistant:

1. Set up the server environment from `todo-application-server/.env.example`.
2. Keep `COPILOT_MODEL=gpt-4o` if you want the widget to target GPT-4o.
3. If GPT-4o is not available through your default Copilot runtime, set the optional `COPILOT_PROVIDER_*` variables so the SDK uses an OpenAI-compatible provider.
