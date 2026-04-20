# CRM Frontend - Salesforce-like Interface

A modern, responsive React + TypeScript + Material-UI frontend for your custom CRM system.

## 🚀 Features

✅ **Salesforce-like Design**
- Modern sidebar navigation
- Custom object explorer
- Dashboard with statistics
- List views with search & filtering

✅ **Authentication**
- JWT-based login/logout
- Protected routes
- User session management

✅ **Custom Objects Support**
- Accounts
- Contacts
- Leads
- Opportunities
- Activities

✅ **Advanced UI Components**
- Material-UI for enterprise design
- Responsive layout (mobile-friendly)
- Real-time data fetching with Axios
- State management with Zustand

## 📋 Tech Stack

- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI v5
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Styling**: CSS-in-JS (Emotion)

## 🔧 Installation

```bash
cd frontend
npm install
```

## 🏃 Running the Frontend

```bash
# Development server (runs on localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Left sidebar with object navigation
│   └── ListView.tsx    # Table component for displaying records
├── pages/              # Page components (one per route)
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Accounts.tsx
│   ├── Contacts.tsx
│   └── ...
├── layouts/            # Layout wrappers
│   └── MainLayout.tsx  # Main app layout
├── services/           # API client
│   └── apiClient.ts    # Axios instance + API methods
├── store/              # Zustand stores
│   ├── authStore.ts    # Authentication state
│   └── navStore.ts     # Navigation state
├── types/              # TypeScript types/interfaces
│   └── index.ts
├── App.tsx             # Main app component + routing
└── main.tsx            # React DOM entry point
```

## 🔐 Authentication Flow

1. User enters credentials on login page
2. Frontend sends request to `/auth/login`
3. Backend returns `accessToken` and user data
4. Token stored in localStorage
5. All API requests include token in `Authorization: Bearer <token>` header
6. Protected routes redirect unauthenticated users to login

## 🌐 API Integration

The frontend connects to the backend API at `http://localhost:3000` (configurable via `.env.development`).

### Available API Methods

```typescript
// Auth
apiClient.login(email, password)
apiClient.register(email, password, tenantName)
apiClient.me()

// Accounts
apiClient.getAccounts(limit, offset)
apiClient.getAccount(id)
apiClient.createAccount(data)
apiClient.updateAccount(id, data)
apiClient.deleteAccount(id)

// Contacts, Leads, Opportunities, Activities
// (Same pattern as Accounts)
```

## 🎨 Customizing the Theme

Edit the Material-UI theme in `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#0070d2' },      // Salesforce blue
    secondary: { main: '#48cae4' },    // Light blue
  },
  typography: {
    fontFamily: 'Your Font Family',
  },
});
```

## 🚀 Next Steps

- [x] Dashboard with stats
- [x] Login page with auth
- [x] Account list view
- [x] Contact list view
- [ ] Detail pages for each object
- [ ] Create/Edit forms
- [ ] Advanced filtering & search
- [ ] Reporting & analytics
- [ ] Mobile app (React Native)

## 📝 Notes

- Backend must be running on `http://localhost:3000`
- By default, the frontend runs on `http://localhost:5173`
- CORS is handled by the backend
- Token refresh is handled automatically on 401 errors

## 🔗 Related Documentation

- [Backend API Docs](../backend/README.md)
- [Project Setup Guide](../README.md)
