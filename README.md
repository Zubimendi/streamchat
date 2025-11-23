# 🚀 StreamChat

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18.0-61DAFB)
![Node](https://img.shields.io/badge/Node-20%2B-339933)
![Socket.io](https://img.shields.io/badge/Socket.io-4.0-white)

**Connect instantly. Chat seamlessly. Collaborate effortlessly.**

StreamChat is a modern, real-time messaging platform built to master full-stack event-driven architecture. It leverages a high-performance **Monorepo** structure to share type definitions between the frontend and backend, ensuring end-to-end type safety.

## ✨ Features

- **🔌 Real-time Messaging:** Instant message delivery using `Socket.io` WebSockets.
- **🔐 Secure Authentication:** JWT-based auth with Access/Refresh token rotation.
- **📂 Room Management:** Create public channels and join active discussions.
- **👀 Presence System:** Real-time "Online/Offline" status and typing indicators.
- **🎨 Modern UI:** Built with **Tailwind CSS** and **Shadcn/ui** for a clean, accessible interface.
- **📱 Responsive:** Mobile-first design that works seamlessly across devices.
- **⚡ Monorepo:** Powered by **TurboRepo** and **pnpm workspaces** for efficient builds.

## 🛠️ Tech Stack

### **Architecture**
- **Monorepo:** TurboRepo + pnpm workspaces
- **Shared Package:** `@streamchat/shared` (TypeScript Interfaces & Zod Schemas)

### **Frontend (`apps/client`)**
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS, Shadcn/ui, Framer Motion
- **Networking:** Socket.io-client, Axios

### **Backend (`apps/server`)**
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Real-time:** Socket.io Server
- **Database:** MongoDB (Mongoose ODM)
- **Validation:** Zod

## 📂 Project Structure

```bash
stream-chat/
├── apps/
│   ├── client/          # Vite + React Frontend
│   └── server/          # Express + Socket.io Backend
├── packages/
│   └── shared/          # Shared Types & Interfaces
├── package.json         # Root scripts
├── pnpm-workspace.yaml  # Workspace configuration
└── turbo.json           # Build pipeline configuration