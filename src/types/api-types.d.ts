/**
 * @typedef CreateTaskRequest
 * @type {object}
 * @property {string} title - The title of the task
 */
export interface CreateTaskRequest {
  title: string;
}

/**
 * @typedef UpdateTaskRequest
 * @type {object}
 * @property {string} [title] - The updated task title
 * @property {boolean} [completed] - Whether the task is completed
 */
export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
}

/**
 * @typedef TaskResponse
 * @type {object}
 * @property {string} taskId - The task ID
 * @property {string} title - The task title
 * @property {boolean} completed - Whether the task is completed
 * @property {string} createdAt - When the task was created
 */
export interface TaskResponse {
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}
