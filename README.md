# Inventory Web

The frontend (what you see in the browser) for the inventory system. It connects to the `inventory-api` backend to show and manage inventory data.

---

## What you need installed first

- **Node.js** (version 22 or newer) — download from https://nodejs.org

You can check if it is installed by opening a terminal and running:
```
node --version
```

> The **inventory-api** backend must also be running before the frontend is useful. See the `inventory-api` README for setup instructions.

---

## Running locally (for development)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

You should see output like:
```
VITE v6.x.x  ready in 300ms
➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser. Log in with the username and password you created when setting up the API.

> The frontend automatically forwards API requests to `http://localhost:3001` during development, so both servers need to be running at the same time.

---

## Running tests

```bash
npm test
```

---

## Deploying to CapRover

[CapRover](https://caprover.com) is a self-hosted platform for running web apps. These steps assume CapRover is already installed on a server and that `inventory-api` has already been deployed.

### 1. Install the CapRover CLI

```bash
npm install -g caprover
```

### 2. Create the app in CapRover

In the CapRover dashboard, go to **Apps** and create a new app named `inventory-web`.

It is recommended to enable **HTTPS** for this app in the CapRover settings so the connection is secure.

### 3. Set environment variables

In the app settings, add this environment variable:

| Variable | Value |
|---|---|
| `API_URL` | `http://srv-captain--inventory-api:3001` |

> `srv-captain--inventory-api` is how CapRover apps talk to each other internally. Replace `inventory-api` with the actual name of your API app if you named it differently.

### 4. Deploy

From the `inventory-web` folder on your computer:

```bash
caprover deploy
```

Follow the prompts. It will ask for your CapRover server address and the app name (`inventory-web`).

Once deployed, visit the domain CapRover assigned to the app (shown in the app settings) and log in.
