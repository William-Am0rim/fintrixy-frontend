import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from "./api";

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
  completed: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGoalData {
  name: string;
  target: number;
  current?: number;
  deadline: string;
  color: string;
  icon: string;
}

export interface UpdateGoalData {
  name?: string;
  target?: number;
  current?: number;
  deadline?: string;
  color?: string;
  icon?: string;
}

export interface AddToGoalData {
  amount: number;
}

export const goalService = {
  async getAll(): Promise<ApiResponse<Goal[]>> {
    return apiGet<Goal[]>("/api/goals");
  },

  async getById(id: string): Promise<ApiResponse<Goal>> {
    return apiGet<Goal>(`/api/goals/${id}`);
  },

  async create(data: CreateGoalData): Promise<ApiResponse<Goal>> {
    return apiPost<Goal, CreateGoalData>("/api/goals", data);
  },

  async update(id: string, data: UpdateGoalData): Promise<ApiResponse<Goal>> {
    return apiPut<Goal, UpdateGoalData>(`/api/goals/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete(`/api/goals/${id}`);
  },

  async addContribution(id: string, data: AddToGoalData): Promise<ApiResponse<Goal>> {
    return apiPost<Goal, AddToGoalData>(`/api/goals/${id}/contribute`, data);
  },

  async markAsCompleted(id: string): Promise<ApiResponse<Goal>> {
    return apiPut<Goal>(`/api/goals/${id}/complete`, {});
  },
};

export interface GoalStats {
  total: number;
  completed: number;
  inProgress: number;
  totalTarget: number;
  totalCurrent: number;
  averageProgress: number;
}

export const goalStatsService = {
  async get(): Promise<ApiResponse<GoalStats>> {
    return apiGet<GoalStats>("/api/goals/stats");
  },

  async getByDeadline(deadline: string): Promise<ApiResponse<Goal[]>> {
    return apiGet<Goal[]>(`/api/goals?deadline=${deadline}`);
  },

  async getOverdue(): Promise<ApiResponse<Goal[]>> {
    return apiGet<Goal[]>("/api/goals/overdue");
  },
};
