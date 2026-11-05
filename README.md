# 🌟 UnityAid - Social Development Events Platform (Client)

**UnityAid** is a modern, responsive, community-driven event management platform where citizens, grassroots leaders, and youth volunteers can discover, host, and track social welfare events across Bangladesh.

---

## 🔗 Live Site URL & Submission Links
- **Live Site URL**: [https://unityaid-client-five.vercel.app](https://unityaid-client-five.vercel.app)
- **Client GitHub Repository**: [https://github.com/nipun-roy/unityaid-client](https://github.com/nipun-roy/unityaid-client)
- **Server GitHub Repository**: [https://github.com/nipun-roy/unityaid-server](https://github.com/nipun-roy/unityaid-server)

---

## ✨ 5 Key Features of UnityAid
1. **Dynamic Upcoming Drives with MongoDB Query Limits**: Displays the top 6 upcoming social drives on the home page utilizing MongoDB's `.limit(6)` operator, organized sequentially by event date.
2. **Robust Password Validation & Authentication**: Enforces uppercase, lowercase, and minimum 6-character password rules on registration, complemented by fast Google OAuth and persistent JWT session management.
3. **Verified Creator Event Management**: Community hosts have exclusive permissions to update itineraries, modify locations, or delete drives they initiated, guarded by both client UI and server JWT authorization.
4. **Seamless One-Click Volunteer Participation**: Users can join winter clothes drives, tree plantations, or cleanups with a single click, automatically syncing to their personal volunteer dashboard and digital Google Calendar.
5. **Full Theme Customization (Light/Dark Mode)**: Instant toggle between clean high-contrast light and dark themes with persistent `localStorage` synchronization across the entire system.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, DaisyUI 4
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Security**: JWT Bearer Tokens, Route Protection Guards

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables in .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏆 Minimum 15 Notable Client-Side GitHub Commits Guide

Follow this commit history when publishing your client repository:

1. `feat(init): initialize Next.js 14 App Router project with TypeScript and Tailwind CSS`
2. `feat(theme): configure DaisyUI themes with light/dark theme provider and toggle button`
3. `feat(types): create TypeScript interfaces for Events, Users, and API responses`
4. `feat(api): implement centralized fetch API client with JWT bearer token injection`
5. `feat(auth): set up AuthContext with persistent session state and reload protection`
6. `feat(components): build responsive Navbar with hover user tooltip and mobile drawer`
7. `feat(components): implement accessible Footer with re-branded X logo and social links`
8. `feat(home): design Hero Banner and platform impact statistics section`
9. `feat(home): implement dynamic 6 recent upcoming events section with loading skeletons`
10. `feat(home): add community photography gallery and newsletter subscription section`
11. `feat(events): create public Upcoming Events directory with live search and category filter`
12. `feat(events): build Event Details page with login-protected Join Event functionality`
13. `feat(events): add Create Event private page with future date validation`
14. `feat(events): build Manage Events page with update modal and deletion confirmation`
15. `feat(events): implement Joined Events volunteer schedule page sorted by date`
16. `feat(profile): add volunteer profile view and name/photoURL update feature`

