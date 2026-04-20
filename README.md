# PayCode Connect — Example App

An example [Next.js](https://nextjs.org) application that demonstrates how to integrate the [`@paycode/connect`](https://www.npmjs.com/package/@paycode/connect) SDK into a web app. It covers connection setup via QR code, EMV payments, authentication, device capabilities, transaction management, and PIN configuration.

---

## Getting Started

### Installation

```bash
pnpm install
```

### Running the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   └── page.tsx              # Main page — QR connection flow & command UI
├── components/
│   ├── commands/
│   │   ├── index.tsx          # Tabbed container for all commands
│   │   ├── emv.tsx            # EMV payment form
│   │   ├── authenticate.tsx   # Authentication form
│   │   ├── capabilities.tsx   # Device capabilities form
│   │   ├── transaction.tsx    # Print / reverse transaction form
│   │   └── pin.tsx            # PIN management form
│   └── ui/                    # Shared UI primitives (shadcn/ui)
└── hooks/
    └── usePayCode.ts          # React hook that initializes the SDK
```


---

## How It Works

### 1. SDK Setup

The SDK is initialized with a `setup()` call. The included `usePayCode` hook wraps this in a React-friendly way:

```ts
// src/hooks/usePayCode.ts
import { setup } from "@paycode/connect";

setup().then((pc) => {
  // pc is your PayCodeConnect instance — ready to use
});
```

`setup()` returns a `PayCodeConnect` instance that exposes every command and event the SDK supports.

### 2. Connecting to a PoS

Once the SDK is ready, generate a connection ticket and render it as a QR code for a Point-of-Sale device to scan:

```ts
const ticket = pc.generateTicket();
// Render `ticket` as a QR code (this app uses the `qrcode` package)
```

Listen for connection state changes:

```ts
pc.on("connected", (isConnected: boolean) => {
  console.log("Connection status:", isConnected);
});
```

When the PoS scans the QR code and a connection is established, the app transitions from the QR screen to the commands interface.

### 3. Sending Commands

After a successful connection, the app exposes five command tabs that exercise the core SDK methods:

| Tab | SDK Method | Description |
| --- | --- | --- |
| **EMV** | `pc.startEMV(amount)` | Initiates an EMV card payment for the given amount. |
| **Authenticate** | `pc.authorize(email, password)` | Authenticates against the PayCode platform. |
| **Capabilities** | `pc.setCapabilities(opts)` | Configures device capabilities (scanner prefixes, connectivity ping, remote control, manual payments). |
| **Transaction** | `pc.printTransaction(folio)` / `pc.reverseTransaction(folio)` | Prints or reverses a transaction by its folio ID. |
| **PIN** | `pc.setPin(pin, password)` | Sets a new device PIN. |

For a full list of commands please see [`@paycode/connect`](https://www.npmjs.com/package/@paycode/connect#commands)

### 4. Listening to Events

The SDK emits events you can subscribe to with `pc.on()` and unsubscribe from with `pc.off()`:

| Event | Payload | Description |
| --- | --- | --- |
| `connected` | `boolean` | Fires when the connection state changes. |
| `emvState` | `EMVData` | Fires during an EMV transaction with status updates. |

For a full list of events please see [`@paycode/connect`](https://www.npmjs.com/package/@paycode/connect#receiving-events)
