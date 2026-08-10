FlowForge — A Simple Project Management and Client Collaboration Platform
Small teams need a simple and focused project management and collaboration platform.

FlowForge is a real-time project management and client collaboration platform designed for small teams.

It provides project and organisation management, team collaboration, task management, Kanban boards, sprint and backlog management, client approvals, workload monitoring, reports, and real-time communication using Socket.IO.

The platform focuses on providing the essential features required by small teams in a simple and focused workspace.

✨ Key Features
📋 Project and Organisation Management
Organisation creation and management
Team management
Project creation
Project member assignment
Project details and management
Role-based access
Admin dashboard
✅ Task Management
FlowForge supports multiple types of work items:

Tasks
Bugs
Stories
Epics
Subtasks
Task management includes:

Priority
Deadlines
Labels
Attachments
Custom task statuses
Comments
Checklists
Time tracking
📌 Kanban Board
Drag-and-drop task management
Move tasks between statuses
Custom task statuses
Visual project workflow
Real-time task movement
The Kanban functionality is implemented using dnd-kit.

🚀 Sprint and Backlog Management
Sprint creation
Sprint management
Backlog management
Assign tasks to sprints
Track sprint-related work
💬 Team Collaboration
Project group chat
Comments
Notifications
Daily stand-up updates
Blocker tracking
Risk tracking
Project decision log
Online/offline member status
👤 Client Collaboration
FlowForge includes a dedicated client collaboration system.

Client management
Client portal
Deliverable approval
Client feedback
Approval tracking
⚡ Real-Time Features
FlowForge uses Socket.IO for real-time communication.

Real-time functionality includes:

Real-time task creation and updates
Live Kanban task movement
Instant comments and notifications
Online/offline member status
Project group chat
Typing indicators
Read receipts
Live timer updates
Users can receive updates without manually refreshing the application.

📊 Workload and Productivity
Team workload dashboard
Workload overload warnings
Focus mode
Today's important tasks
Blocker dashboard
Risk tracking
Reports
Search and filtering
🛠️ Technology Stack
Frontend
React
Vite
Tailwind CSS
React Router
Framer Motion
Lucide React
Axios
dnd-kit
Recharts
Backend
Node.js
Express.js
Socket.IO
JWT
bcrypt
Multer
Database
MongoDB Community Edition
Mongoose
MongoDB Compass
📁 Project Structure
The project is divided into separate frontend and backend applications.

Frontend
frontend/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── home/
│   │   ├── ChatDrawer.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── Layout.jsx
│   │   ├── Modal.jsx
│   │   ├── TaskModal.jsx
│   │   ├── TimerWidget.jsx
│   │   └── WorkloadWarningBanner.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   │
│   ├── Pages/
│   │   ├── AdminPage.jsx
│   │   ├── BlockersPage.jsx
│   │   ├── ClientPortalPage.jsx
│   │   ├── Create.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DashboardContainer.jsx
│   │   ├── DecisionsPage.jsx
│   │   ├── FocusPage.jsx
│   │   ├── Home.jsx
│   │   ├── KanbanPage.jsx
│   │   ├── Login.jsx
│   │   ├── Member.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── Plans.jsx
│   │   ├── Project.jsx
│   │   ├── ProjectDetailsPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── Register.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── RisksPage.jsx
│   │   ├── Settings.jsx
│   │   ├── SprintsPage.jsx
│   │   ├── StandupPage.jsx
│   │   ├── Task.jsx
│   │   ├── Trial.jsx
│   │   └── WorkloadPage.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── taskVerseApi.js
│   │
│   ├── store/
│   │   ├── store.js
│   │   └── auth/
│   │       ├── authAPI.js
│   │       └── authSlice.js
│   │
│   ├── utils/
│   │   ├── axiosInstance.js
│   │   └── createApiThunk.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── public/
├── .env
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── postcss.config.cjs
└── eslint.config.js

backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── chatController.js
│   ├── projectController.js
│   ├── taskController.js
│   └── userController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
├── models/
│   ├── ChatMessage.js
│   ├── Project.js
│   ├── Task.js
│   └── User.js
│
├── routes/
│   ├── authRoutes.js
│   ├── chatRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   └── userRoutes.js
│
├── uploads/
│   └── .gitkeep
│
├── .env
├── package.json
├── package-lock.json
└── server.js
## How to Run the Project

### 1. Clone the Repository

git clone <your-github-repository-url>
cd FlowForge
2. Install Backend Dependencies
Open the terminal:

cd backend
npm install
3. Configure Environment Variables
Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
4. Start the Backend
npm run dev
The backend will run on:

http://localhost:5000
5. Open Another Terminal and Start Frontend
cd frontend
npm install
npm run dev
The frontend will run on:
