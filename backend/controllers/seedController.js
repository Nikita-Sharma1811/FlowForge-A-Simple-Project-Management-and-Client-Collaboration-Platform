import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Sprint from '../models/Sprint.js';
import Standup from '../models/Standup.js';
import Blocker from '../models/Blocker.js';
import Risk from '../models/Risk.js';
import DecisionLog from '../models/DecisionLog.js';
import Approval from '../models/Approval.js';
import Comment from '../models/Comment.js';

export const seedDatabase = async (req, res) => {
  try {
    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      Team.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      Sprint.deleteMany({}),
      Standup.deleteMany({}),
      Blocker.deleteMany({}),
      Risk.deleteMany({}),
      DecisionLog.deleteMany({}),
      Approval.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    // 1. Create Organization
    const adminUser = await User.create({
      name: 'Sarah Connor (Admin)',
      email: 'admin@flowforge.com',
      password: 'password123',
      role: 'Admin',
      status: 'online',
    });

    const org = await Organization.create({
      name: 'FlowForge Corp',
      description: 'High performance agile development team',
      owner: adminUser._id,
      members: [{ user: adminUser._id, role: 'Admin' }],
    });

    adminUser.organization = org._id;
    await adminUser.save();

    // 2. Create Team Members & Client
    const pmUser = await User.create({
      name: 'Alex Johnson (PM)',
      email: 'pm@flowforge.com',
      password: 'password123',
      role: 'Project Manager',
      organization: org._id,
      status: 'online',
    });

    const devUser1 = await User.create({
      name: 'Rahul Sharma (Dev)',
      email: 'dev@flowforge.com',
      password: 'password123',
      role: 'Team Member',
      organization: org._id,
      status: 'online',
    });

    const devUser2 = await User.create({
      name: 'Priya Patel (Designer)',
      email: 'priya@flowforge.com',
      password: 'password123',
      role: 'Team Member',
      organization: org._id,
      status: 'offline',
    });

    const clientUser = await User.create({
      name: 'Mark Davis (Client)',
      email: 'client@acme.com',
      password: 'password123',
      role: 'Client',
      organization: org._id,
      status: 'offline',
    });

    org.members.push(
      { user: pmUser._id, role: 'Project Manager' },
      { user: devUser1._id, role: 'Team Member' },
      { user: devUser2._id, role: 'Team Member' },
      { user: clientUser._id, role: 'Client' }
    );
    await org.save();

    // 3. Create Team
    const coreTeam = await Team.create({
      name: 'Core Engineering',
      description: 'Full-stack engineering & design squad',
      organization: org._id,
      leader: pmUser._id,
      members: [adminUser._id, pmUser._id, devUser1._id, devUser2._id],
    });

    // 4. Create Project
    const project = await Project.create({
      name: 'FlowForge Core Engine',
      description: 'Real-time collaborative project management SaaS suite for agile teams',
      organization: org._id,
      projectManager: pmUser._id,
      members: [adminUser._id, pmUser._id, devUser1._id, devUser2._id, clientUser._id],
      status: 'Active',
      priority: 'High',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      customStatuses: ['Backlog', 'Todo', 'In Progress', 'Review', 'Testing', 'Done'],
      createdBy: pmUser._id,
    });

    // 5. Create Sprint
    const sprint = await Sprint.create({
      name: 'Sprint 1 - Foundation & Realtime',
      goal: 'Deliver core drag-and-drop Kanban, WebSocket live sync, and client approval portal',
      project: project._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'Active',
    });

    // 6. Create Epic, Story, Tasks & Subtasks
    const epic = await Task.create({
      title: 'Epic: Authentication & Socket Engine',
      description: 'Implement JWT authorization and real-time Socket.IO room handling',
      type: 'Epic',
      status: 'In Progress',
      priority: 'Critical',
      assignee: devUser1._id,
      reporter: pmUser._id,
      project: project._id,
      sprint: sprint._id,
      estimatedHours: 40,
      loggedHours: 18,
      createdBy: pmUser._id,
    });

    const story = await Task.create({
      title: 'Story: Real-time Kanban Board Drag & Drop',
      description: 'Allow team members to drag task cards across status columns instantly broadcasting via WebSockets',
      type: 'Story',
      status: 'In Progress',
      priority: 'High',
      assignee: devUser1._id,
      reporter: pmUser._id,
      project: project._id,
      sprint: sprint._id,
      parentTask: epic._id,
      labels: ['Frontend', 'Socket.IO', 'dnd-kit'],
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estimatedHours: 16,
      loggedHours: 10,
      createdBy: pmUser._id,
    });

    const task1 = await Task.create({
      title: 'Setup Socket.IO Event Rooms',
      description: 'Configure project room joins, presence broadcasts, and status sync',
      type: 'Task',
      status: 'Done',
      priority: 'High',
      assignee: devUser1._id,
      reporter: pmUser._id,
      project: project._id,
      sprint: sprint._id,
      parentTask: story._id,
      labels: ['Backend', 'Socket.IO'],
      estimatedHours: 8,
      loggedHours: 8,
      createdBy: devUser1._id,
    });

    const task2 = await Task.create({
      title: 'Design Client Approval Deliverable View',
      description: 'Build sleek portal view for clients to approve or request changes on completed deliverables',
      type: 'Task',
      status: 'Review',
      priority: 'High',
      assignee: devUser2._id,
      reporter: pmUser._id,
      project: project._id,
      sprint: sprint._id,
      parentTask: story._id,
      labels: ['UI/UX', 'Client Portal'],
      estimatedHours: 12,
      loggedHours: 9,
      createdBy: pmUser._id,
    });

    const task3 = await Task.create({
      title: 'Fix Memory Leak on WebSockets Disconnect',
      description: 'Clean up client map on disconnect event to prevent memory leaks',
      type: 'Bug',
      status: 'Todo',
      priority: 'Critical',
      assignee: devUser1._id,
      reporter: pmUser._id,
      project: project._id,
      sprint: sprint._id,
      labels: ['Bug', 'Backend'],
      estimatedHours: 6,
      loggedHours: 0,
      createdBy: pmUser._id,
    });

    // 7. Create Comment
    await Comment.create({
      task: story._id,
      user: pmUser._id,
      content: 'Great progress on dnd-kit integration! Please check socket latency when updating board columns.',
    });

    // 8. Create Standup
    await Standup.create({
      user: devUser1._id,
      project: project._id,
      yesterday: 'Integrated dnd-kit columns and wired up WebSocket broadcast listeners',
      today: 'Connecting live timer update and time entry database persistence',
      blockers: 'None currently',
      date: new Date().toISOString().split('T')[0],
    });

    // 9. Create Blocker
    await Blocker.create({
      title: 'MongoDB Connection Timeout on High Concurrency',
      description: 'Database pool connection limit causes intermittent timeout during peak real-time socket events',
      project: project._id,
      task: task3._id,
      reportedBy: devUser1._id,
      assignedTo: adminUser._id,
      severity: 'Critical',
      status: 'Open',
    });

    // 10. Create Risk
    await Risk.create({
      title: 'Third-party File Storage Rate Limit',
      description: 'Large file attachments during sprint demo could trigger local storage limit',
      project: project._id,
      probability: 'Medium',
      impact: 'High',
      severity: 'High',
      owner: pmUser._id,
      status: 'Open',
      mitigationPlan: 'Enforce Multer 10MB per file size limit and strip binary payloads from MongoDB documents',
    });

    // 11. Create Decision Log
    await DecisionLog.create({
      title: 'Adopt dnd-kit over HTML5 Native Drag & Drop',
      description: 'Chosen dnd-kit for flexible touch support, smooth drop animations, and accessible keyboard navigability.',
      project: project._id,
      madeBy: pmUser._id,
      reason: 'Superior modern UX performance and cleaner React 19 compatibility',
      impact: 'Faster board rendering speed and seamless mobile touch dragging',
    });

    // 12. Create Client Deliverable Approval
    await Approval.create({
      title: 'Sprint 1 - Deliverable UX Prototype',
      deliverableName: 'Interactive Client Portal & Standup Dashboard',
      description: 'Fully responsive UI featuring real-time client feedback submission and historical standup logs.',
      project: project._id,
      client: clientUser._id,
      status: 'Pending',
      requestedBy: pmUser._id,
    });

    const responseData = {
      message: 'FlowForge Database successfully seeded!',
      credentials: {
        Admin: { email: 'admin@flowforge.com', password: 'password123' },
        ProjectManager: { email: 'pm@flowforge.com', password: 'password123' },
        TeamMember: { email: 'dev@flowforge.com', password: 'password123' },
        Client: { email: 'client@acme.com', password: 'password123' },
      },
    };

    if (res) {
      return res.json({ status: true, data: responseData });
    }
    return responseData;
  } catch (error) {
    console.error('[Seed Error]', error);
    if (res) {
      return res.status(500).json({ status: false, message: error.message });
    }
    throw error;
  }
};
