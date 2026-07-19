# 🌐 SYNAPSE

**The Stadium Intelligence Mesh for FIFA World Cup 2026™**

SYNAPSE is a next-generation platform designed for high-density stadium environments. When 80,000 fans are in a single venue, traditional cloud networks collapse under kickoff load. SYNAPSE solves this by running an edge intelligence mesh—operating on Bluetooth beacons and local stadium Wi-Fi points rather than relying purely on external cellular bandwidth.

## ✨ Features

- **Edge Intelligence**: Small, distilled language models live directly on stadium Wi-Fi access points.
- **Real-Time Translation**: Live crowd safety and navigation instructions translated instantly on the edge.
- **Glassmorphism UI**: A premium, "liquid glass" interface designed for the ultimate fan experience, matching the FIFA World Cup 2026™ Gold & Red branding.
- **Immersive Network Canvas**: An interactive mesh background simulating stadium connectivity nodes.

---

## 📸 Project Previews

### The Hero Experience
A stunning visual introduction featuring a dynamic stadium mesh and the World Cup aesthetic.

![Hero Section](screenshots/hero_section.png)

### The Legends of 2026
A premium player card grid showcasing the biggest stars taking the field, complete with high-resolution photography and flag integrations.

![Player Cards](screenshots/player_cards.png)

---

## 🛠️ Technology Stack

- **HTML5** & **CSS3** (Custom properties, grid, flexbox, glassmorphic filters)
- **Vanilla JavaScript** (Interactive mesh background and scroll animations)
- **Node.js** (Local development server)

## 🚀 Getting Started

### Local Development

1. Clone or download this repository.
2. Run `npm install` to install local dependencies.
3. Start the local server:
   ```bash
   node server.js
   ```
4. Open `http://localhost:8080` in your web browser.

### Deploy to Vercel

This project is configured out-of-the-box for **Vercel** serverless deployment. 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fsynapse-mesh)

Vercel will automatically serve the static HTML files with Clean URLs (e.g. `/platform` instead of `/platform.html`) and host the contact form processing endpoint (`/api/contact`) via Vercel Serverless Functions.

*Note: For the contact form email notifications to work on Vercel, be sure to set `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, and `EMAIL_PORT` in your Vercel Project Environment Variables.*

---
*Built for the future of stadium technology.*
