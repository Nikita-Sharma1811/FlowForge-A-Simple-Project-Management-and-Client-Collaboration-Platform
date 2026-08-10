import axios from "../utils/axiosInstance";

const unwrap = (response) => {
  if (response.data?.status === false) {
    throw new Error(response.data.message || "API request failed");
  }
  return response.data;
};

export const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || String(value);
};

export const getDisplayName = (user) => {
  if (!user) return "Unassigned";
  if (typeof user === "string") return user;
  return user.userName || user.name || user.email || "Team member";
};

export const taskVerseApi = {
  auth: {
    login: (payload) => axios.post("/user/login", payload).then(unwrap),
    register: (payload) => axios.post("/user/register", payload).then(unwrap),
  },
  user: {
    profile: () => axios.get("/user/profile").then(unwrap),
    updateProfile: (payload) => axios.put("/user/profile", payload).then(unwrap),
    organizations: () => axios.get("/user/organizations").then(unwrap),
    userOrganizations: (userId) => axios.get(`/user/${userId}/organizations`).then(unwrap),
    joinOrganization: (payload) => axios.post("/user/join-organization", payload).then(unwrap),
    leaveOrganization: (payload) => axios.delete("/user/leave-organization", { data: payload }).then(unwrap),
    updateRole: (payload) => axios.put("/user/update-role", payload).then(unwrap),
    myProjects: () => axios.get("/user/getMyProjects").then(unwrap),
    responsibleTasks: () => axios.get("/user/getUserReseponsibleTasks").then(unwrap),
  },
  organizations: {
    create: (payload) => axios.post("/organisation/createOrganization", payload).then(unwrap),
    mine: () => axios.get("/organisation/my-organizations").then(unwrap),
    members: (organizationId) => axios.get(`/organisation/${organizationId}/members`).then(unwrap),
    createUser: (organizationId, payload) => axios.post(`/organisation/${organizationId}/users`, payload).then(unwrap),
    addMember: (organizationId, payload) => axios.post(`/organisation/${organizationId}/members`, payload).then(unwrap),
    removeMember: (organizationId, userId) => axios.delete(`/organisation/${organizationId}/members/${userId}`).then(unwrap),
  },
  projects: {
    create: (payload) => axios.post("/projects", payload).then(unwrap),
    update: (projectId, payload) => axios.patch(`/projects/${projectId}`, payload).then(unwrap),
    delete: (projectId) => axios.delete(`/projects/${projectId}`).then(unwrap),
    byId: (projectId) => axios.get(`/projects/${projectId}`).then(unwrap),
    byOrganization: (organizationId) => axios.get(`/projects/organization/${organizationId}`).then(unwrap),
    addMember: (projectId, payload) => axios.post(`/projects/${projectId}/members`, payload).then(unwrap),
    changeStatus: (projectId, status) => axios.patch(`/projects/${projectId}/status`, { status }).then(unwrap),
    changeVisibility: (projectId, visibility) => axios.patch(`/projects/${projectId}/visibility`, { visibility }).then(unwrap),
  },
  tasks: {
    create: (payload) => axios.post("/tasks", payload).then(unwrap),
    update: (taskId, payload) => axios.patch(`/tasks/${taskId}`, payload).then(unwrap),
    byId: (taskId) => axios.get(`/tasks/${taskId}`).then(unwrap),
    delete: (taskId) => axios.delete(`/tasks/${taskId}`).then(unwrap),
    changeStatus: (taskId, status) => axios.patch(`/tasks/${taskId}/status`, { status }).then(unwrap),
    byProject: (projectId) => axios.get(`/tasks/project/${projectId}`).then(unwrap),
    subTasks: (parentTaskId) => axios.get(`/tasks/subtasks/${parentTaskId}`).then(unwrap),
    assign: (taskId, userId) => axios.post(`/tasks/${taskId}/assign`, { userId }).then(unwrap),
  },
  comments: {
    create: (payload) => axios.post("/comments", payload).then(unwrap),
    byHost: (hostId) => axios.get(`/comments/${hostId}`).then(unwrap),
    update: (commentId, payload) => axios.patch(`/comments/${commentId}`, payload).then(unwrap),
    delete: (commentId) => axios.delete(`/comments/${commentId}/delete`).then(unwrap),
    like: (commentId) => axios.patch(`/comments/${commentId}/like`).then(unwrap),
  },
  db: {
    status: () => axios.get("/db/status").then(unwrap),
  },
};
