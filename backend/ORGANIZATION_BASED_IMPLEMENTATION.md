# Organization-Based Task Management System Implementation

## Overview

This implementation transforms the task management system into an organization-based architecture where:

- Organizations are created by users who become godadmins
- Only godadmins can create projects within their organization
- Projects have their own member roles and permissions
- Tasks are created within projects with proper access control

## Key Features Implemented

### 1. Enhanced Data Models

#### User Schema (`src/models/user.schema.ts`)

- Added `OrganizationMembership` class with role-based access
- Users can belong to multiple organizations with different roles
- Roles: `GODADMIN`, `ADMIN`, `MANAGER`, `MEMBER`, `VIEWER`

#### Organization Schema (`src/models/organisation.schema.ts`)

- Enhanced with member management and settings
- Organization status tracking (ACTIVE, INACTIVE, SUSPENDED)
- Configurable settings for member invites and project creation

#### Project Schema (`src/models/project.schema.ts`)

- Organization-based project creation
- Project-level member roles: `PROJECT_ADMIN`, `PROJECT_MANAGER`, `PROJECT_MEMBER`, `PROJECT_VIEWER`
- Enhanced documentation and progress tracking

#### Task Schema (`src/models/task.schema.ts`)

- Maintains existing structure with organization-based access control
- Tasks inherit permissions from their parent project

### 2. Service Layer Enhancements

#### Organization Service (`src/modules/organisation/organisation.service.ts`)

- `createOrganization()`: Creates organization with creator as godadmin
- `addMemberToOrganization()`: Adds members with role validation
- `removeMemberFromOrganization()`: Removes members with permission checks
- `hasOrganizationPermission()`: Permission validation helper
- `getOrganizationMembers()`: Retrieves organization members
- `getUserOrganizations()`: Gets user's organization memberships

#### Projects Service (`src/modules/projects/projects.service.ts`)

- `createProject()`: Only godadmins can create projects
- `hasOrganizationPermission()`: Validates organization-level permissions
- `hasProjectPermission()`: Validates project-level permissions
- `getProjectsByOrganization()`: Lists organization projects
- `addMemberToProject()`: Adds members to projects

#### Tasks Service (`src/modules/tasks/tasks.service.ts`)

- `createTask()`: Validates project membership before task creation
- `hasProjectPermission()`: Checks both project and organization permissions
- `assignTaskToUser()`: Assigns tasks with proper permission validation
- All CRUD operations now include permission checks

#### User Service (`src/modules/user/user.service.ts`)

- `getUserProfile()`: Enhanced with organization data
- `joinOrganization()`: Adds users to organizations
- `leaveOrganization()`: Removes users from organizations
- `updateUserRoleInOrganization()`: Updates user roles

### 3. Controller Layer Updates

#### Organization Controller (`src/modules/organisation/organisation.controller.ts`)

- `POST /organisation`: Create organization
- `GET /organisation/my-organizations`: Get user's organizations
- `GET /organisation/:id/members`: Get organization members
- `POST /organisation/:id/members`: Add member to organization
- `DELETE /organisation/:id/members/:userId`: Remove member

#### Projects Controller (`src/modules/projects/projects.controller.ts`)

- `POST /projects`: Create project (godadmin only)
- `GET /projects/organization/:organizationId`: Get organization projects
- `POST /projects/:id/members`: Add member to project
- All endpoints include proper authentication and authorization

#### Tasks Controller (`src/modules/tasks/tasks.controller.ts`)

- `POST /tasks`: Create task with project validation
- `GET /tasks/project/:projectId`: Get project tasks
- `POST /tasks/:id/assign`: Assign task to user
- All operations include permission validation

#### User Controller (`src/modules/user/user.controller.ts`)

- `GET /user/organizations`: Get user's organizations
- `POST /user/join-organization`: Join organization (admin only)
- `DELETE /user/leave-organization`: Leave organization
- `PUT /user/update-role`: Update user role in organization

## Permission Matrix

### Organization Level

| Role     | Create Projects | Add Members | Remove Members | View Members | Update Settings |
| -------- | --------------- | ----------- | -------------- | ------------ | --------------- |
| Godadmin | ✅              | ✅          | ✅             | ✅           | ✅              |
| Admin    | ❌              | ✅          | ✅             | ✅           | ❌              |
| Manager  | ❌              | ❌          | ❌             | ✅           | ❌              |
| Member   | ❌              | ❌          | ❌             | ✅           | ❌              |
| Viewer   | ❌              | ❌          | ❌             | ✅           | ❌              |

### Project Level

| Role                  | Create Tasks | Update Tasks | Delete Tasks | Add Members | View Tasks |
| --------------------- | ------------ | ------------ | ------------ | ----------- | ---------- |
| Project Admin         | ✅           | ✅           | ✅           | ✅          | ✅         |
| Project Manager       | ✅           | ✅           | ✅           | ✅          | ✅         |
| Project Member        | ✅           | ✅           | ❌           | ❌          | ✅         |
| Project Viewer        | ❌           | ❌           | ❌           | ❌          | ✅         |
| Organization Godadmin | ✅           | ✅           | ✅           | ✅          | ✅         |
| Organization Admin    | ✅           | ✅           | ✅           | ✅          | ✅         |

## API Endpoints Summary

### Organization Management

- `POST /organisation` - Create organization
- `GET /organisation/my-organizations` - Get user organizations
- `GET /organisation/:id/members` - Get organization members
- `POST /organisation/:id/members` - Add member to organization
- `DELETE /organisation/:id/members/:userId` - Remove member

### Project Management

- `POST /projects` - Create project (godadmin only)
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `GET /projects/organization/:organizationId` - Get organization projects
- `POST /projects/:id/members` - Add member to project

### Task Management

- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task details
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/project/:projectId` - Get project tasks
- `GET /tasks/subtasks/:parentTaskId` - Get sub-tasks
- `POST /tasks/:id/assign` - Assign task to user

### User Management

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/organizations` - Get user organizations
- `POST /user/join-organization` - Join organization
- `DELETE /user/leave-organization` - Leave organization
- `PUT /user/update-role` - Update user role

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Role-Based Access Control**: Granular permissions based on organization and project roles
3. **Permission Inheritance**: Organization admins have project-level permissions
4. **Data Validation**: Comprehensive input validation using class-validator
5. **Error Handling**: Proper HTTP status codes and error messages

## Best Practices Implemented

1. **Separation of Concerns**: Clear separation between models, services, and controllers
2. **Dependency Injection**: Proper use of NestJS dependency injection
3. **Error Handling**: Consistent error handling across all services
4. **API Documentation**: Swagger/OpenAPI documentation for all endpoints
5. **Type Safety**: Full TypeScript implementation with proper typing
6. **Database Relations**: Proper MongoDB relationships with population
7. **Permission Validation**: Centralized permission checking methods

## Usage Flow

1. **User Registration**: User creates account
2. **Organization Creation**: User creates organization (becomes godadmin)
3. **Member Management**: Godadmin adds members to organization
4. **Project Creation**: Godadmin creates projects within organization
5. **Project Management**: Project admins/managers add members to projects
6. **Task Management**: Project members create and manage tasks
7. **Task Assignment**: Tasks are assigned to specific users

This implementation provides a robust, scalable, and secure organization-based task management system with proper role-based access control and comprehensive API endpoints.
