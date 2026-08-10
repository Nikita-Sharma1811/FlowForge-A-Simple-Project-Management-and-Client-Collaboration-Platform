// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to attach JWT token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to unwrap data and handle 401
// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Clear token if invalid
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('authUser');
//     }
//     const message = error.response?.data?.message || error.message || 'API Request Failed';
//     return Promise.reject(new Error(message));
//   }
// );

// export const flowForgeApi = {
//   auth: {
//     login: (data) => api.post('/auth/login', data),
//     register: (data) => api.post('/auth/register', data),
//     me: () => api.get('/auth/me'),
//   },
//   users: {
//     list: () => api.get('/users'),
//     updateProfile: (data) => api.put('/users/profile', data),
//     updateRole: (data) => api.put('/users/role', data),
//     getWorkload: () => api.get('/users/workload'),
//   },
//   organizations: {
//     create: (data) => api.post('/organizations', data),
//     list: () => api.get('/organizations'),
//     getById: (id) => api.get(`/organizations/${id}`),
//     addMember: (id, data) => api.post(`/organizations/${id}/members`, data),
//     removeMember: (id, userId) => api.delete(`/organizations/${id}/members/${userId}`),
//   },
//   teams: {
//     create: (data) => api.post('/teams', data),
//     list: () => api.get('/teams'),
//   },
//   projects: {
//     create: (data) => api.post('/projects', data),
//     list: () => api.get('/projects'),
//     getById: (id) => api.get(`/projects/${id}`),
//     update: (id, data) => api.patch(`/projects/${id}`, data),
//     delete: (id) => api.delete(`/projects/${id}`),
//     updateStatuses: (id, customStatuses) => api.put(`/projects/${id}/statuses`, { customStatuses }),
//   },
//   tasks: {
//     create: (data) => api.post('/tasks', data),
//     list: (params) => api.get('/tasks', { params }),
//     getById: (id) => api.get(`/tasks/${id}`),
//     update: (id, data) => api.patch(`/tasks/${id}`, data),
//     delete: (id) => api.delete(`/tasks/${id}`),
//   },
//   sprints: {
//     create: (data) => api.post('/sprints', data),
//     list: (params) => api.get('/sprints', { params }),
//     update: (id, data) => api.patch(`/sprints/${id}`, data),
//     delete: (id) => api.delete(`/sprints/${id}`),
//   },
//   labels: {
//     create: (data) => api.post('/labels', data),
//     list: (params) => api.get('/labels', { params }),
//     delete: (id) => api.delete(`/labels/${id}`),
//   },
//   comments: {
//     create: (data) => api.post('/comments', data),
//     getByTask: (taskId) => api.get(`/comments/task/${taskId}`),
//     delete: (id) => api.delete(`/comments/${id}`),
//   },
//   checklists: {
//     getByTask: (taskId) => api.get(`/checklists/task/${taskId}`),
//     addItem: (taskId, title) => api.post(`/checklists/task/${taskId}/item`, { title }),
//     toggleItem: (taskId, itemId) => api.put(`/checklists/task/${taskId}/toggle`, { itemId }),
//     deleteItem: (taskId, itemId) => api.delete(`/checklists/task/${taskId}/item/${itemId}`),
//   },
//   uploads: {
//     uploadFile: (formData) =>
//       api.post('/uploads', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       }),
//     getAttachments: (params) => api.get('/uploads', { params }),
//   },
//   standups: {
//     create: (data) => api.post('/standups', data),
//     list: (params) => api.get('/standups', { params }),
//   },
//   blockers: {
//     create: (data) => api.post('/blockers', data),
//     list: (params) => api.get('/blockers', { params }),
//     update: (id, data) => api.patch(`/blockers/${id}`, data),
//     delete: (id) => api.delete(`/blockers/${id}`),
//   },
//   risks: {
//     create: (data) => api.post('/risks', data),
//     list: (params) => api.get('/risks', { params }),
//     update: (id, data) => api.patch(`/risks/${id}`, data),
//     delete: (id) => api.delete(`/risks/${id}`),
//   },
//   clients: {
//     create: (data) => api.post('/clients', data),
//     list: () => api.get('/clients'),
//   },
//   approvals: {
//     create: (data) => api.post('/approvals', data),
//     list: (params) => api.get('/approvals', { params }),
//     respond: (id, data) => api.put(`/approvals/${id}/respond`, data),
//   },
//   decisions: {
//     create: (data) => api.post('/decisions', data),
//     list: (params) => api.get('/decisions', { params }),
//   },
//   time: {
//     startTimer: (data) => api.post('/time/start', data),
//     stopTimer: (data) => api.post('/time/stop', data),
//     manual: (data) => api.post('/time/manual', data),
//     list: (params) => api.get('/time', { params }),
//     getActiveTimer: () => api.get('/time/active'),
//   },
//   notifications: {
//     list: () => api.get('/notifications'),
//     markRead: (id) => api.patch(`/notifications/${id}/read`),
//     markAllRead: () => api.patch('/notifications/read-all'),
//   },
//   chat: {
//     getMessages: (projectId) => api.get(`/chat/project/${projectId}`),
//     sendMessage: (data) => api.post('/chat', data),
//     markRead: (projectId) => api.patch(`/chat/project/${projectId}/read`),
//   },
//   reports: {
//     getSummary: (params) => api.get('/reports', { params }),
//   },
//   seed: {
//     run: () => api.post('/seed', {}),
//   },
// };

// export default api;
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap data and handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'API Request Failed';

    return Promise.reject(new Error(message));
  }
);

export const flowForgeApi = {
  auth: {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
  },

  users: {
    list: () => api.get('/users'),
    updateProfile: (data) => api.put('/users/profile', data),
    updateRole: (data) => api.put('/users/role', data),
    getWorkload: () => api.get('/users/workload'),
  },

  organizations: {
    create: (data) => api.post('/organizations', data),
    list: () => api.get('/organizations'),
    getById: (id) => api.get(`/organizations/${id}`),
    addMember: (id, data) =>
      api.post(`/organizations/${id}/members`, data),
    removeMember: (id, userId) =>
      api.delete(`/organizations/${id}/members/${userId}`),
  },

  teams: {
    create: (data) => api.post('/teams', data),
    list: () => api.get('/teams'),
  },

  projects: {
    create: (data) => api.post('/projects', data),
    list: () => api.get('/projects'),
    getById: (id) => api.get(`/projects/${id}`),
    update: (id, data) => api.patch(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    updateStatuses: (id, customStatuses) =>
      api.put(`/projects/${id}/statuses`, { customStatuses }),
  },

  tasks: {
    create: (data) => api.post('/tasks', data),
    list: (params) => api.get('/tasks', { params }),
    getById: (id) => api.get(`/tasks/${id}`),
    update: (id, data) => api.patch(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
  },

  sprints: {
    create: (data) => api.post('/sprints', data),
    list: (params) => api.get('/sprints', { params }),
    update: (id, data) => api.patch(`/sprints/${id}`, data),
    delete: (id) => api.delete(`/sprints/${id}`),
  },

  labels: {
    create: (data) => api.post('/labels', data),
    list: (params) => api.get('/labels', { params }),
    delete: (id) => api.delete(`/labels/${id}`),
  },

  comments: {
    create: (data) => api.post('/comments', data),
    getByTask: (taskId) => api.get(`/comments/task/${taskId}`),
    delete: (id) => api.delete(`/comments/${id}`),
  },

  checklists: {
    getByTask: (taskId) =>
      api.get(`/checklists/task/${taskId}`),

    addItem: (taskId, title) =>
      api.post(`/checklists/task/${taskId}/item`, { title }),

    toggleItem: (taskId, itemId) =>
      api.put(`/checklists/task/${taskId}/toggle`, { itemId }),

    deleteItem: (taskId, itemId) =>
      api.delete(`/checklists/task/${taskId}/item/${itemId}`),
  },

  uploads: {
    uploadFile: (formData) =>
      api.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    getAttachments: (params) => api.get('/uploads', { params }),
  },

  standups: {
    create: (data) => api.post('/standups', data),
    list: (params) => api.get('/standups', { params }),
  },

  blockers: {
    create: (data) => api.post('/blockers', data),
    list: (params) => api.get('/blockers', { params }),
    update: (id, data) => api.patch(`/blockers/${id}`, data),
    delete: (id) => api.delete(`/blockers/${id}`),
  },

  risks: {
    create: (data) => api.post('/risks', data),
    list: (params) => api.get('/risks', { params }),
    update: (id, data) => api.patch(`/risks/${id}`, data),
    delete: (id) => api.delete(`/risks/${id}`),
  },

  clients: {
    create: (data) => api.post('/clients', data),
    list: () => api.get('/clients'),
  },

  approvals: {
    create: (data) => api.post('/approvals', data),
    list: (params) => api.get('/approvals', { params }),
    respond: (id, data) =>
      api.put(`/approvals/${id}/respond`, data),
  },

  decisions: {
    create: (data) => api.post('/decisions', data),
    list: (params) => api.get('/decisions', { params }),
  },

  time: {
    startTimer: (data) => api.post('/time/start', data),
    stopTimer: (data) => api.post('/time/stop', data),
    manual: (data) => api.post('/time/manual', data),
    list: (params) => api.get('/time', { params }),
    getActiveTimer: () => api.get('/time/active'),
  },

  notifications: {
    list: () => api.get('/notifications'),
    markRead: (id) =>
      api.patch(`/notifications/${id}/read`),
    markAllRead: () =>
      api.patch('/notifications/read-all'),
  },

  chat: {
    getMessages: (projectId) =>
      api.get(`/chat/project/${projectId}`),
    sendMessage: (data) => api.post('/chat', data),
    markRead: (projectId) =>
      api.patch(`/chat/project/${projectId}/read`),
  },

  reports: {
    getSummary: (params) => api.get('/reports', { params }),
  },

  seed: {
    run: () => api.post('/seed', {}),
  },
};

export default api;
