import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from './Dashboard';
import FocusPage from './FocusPage';
import ProjectsPage from './ProjectsPage';
import ProjectDetailsPage from './ProjectDetailsPage';
import KanbanPage from './KanbanPage';
import SprintsPage from './SprintsPage';
import StandupPage from './StandupPage';
import BlockersPage from './BlockersPage';
import RisksPage from './RisksPage';
import ClientPortalPage from './ClientPortalPage';
import DecisionsPage from './DecisionsPage';
import WorkloadPage from './WorkloadPage';
import ReportsPage from './ReportsPage';
import AdminPage from './AdminPage';
import NotificationsPage from './NotificationsPage';

export default function DashboardContainer() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="focus" element={<FocusPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailsPage />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route path="sprints" element={<SprintsPage />} />
        <Route path="standup" element={<StandupPage />} />
        <Route path="blockers" element={<BlockersPage />} />
        <Route path="risks" element={<RisksPage />} />
        <Route path="client" element={<ClientPortalPage />} />
        <Route path="decisions" element={<DecisionsPage />} />
        <Route path="workload" element={<WorkloadPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Routes>
    </Layout>
  );
}
