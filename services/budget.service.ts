import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from "./api";

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
  exceeded: boolean;
  remaining: number;
  percentage: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBudgetData {
  category: string;
  limit: number;
  spent?: number;
  color: string;
  icon: string;
}

export interface UpdateBudgetData {
  category?: string;
  limit?: number;
  spent?: number;
  color?: string;
  icon?: string;
}

export interface BudgetAlert {
  budget_id: string;
  category: string;
  percentage: number;
  threshold: number;
}

export const budgetService = {
  async getAll(): Promise<ApiResponse<Budget[]>> {
    return apiGet<Budget[]>("/api/budgets");
  },

  async getById(id: string): Promise<ApiResponse<Budget>> {
    return apiGet<Budget>(`/api/budgets/${id}`);
  },

  async getByCategory(category: string): Promise<ApiResponse<Budget>> {
    return apiGet<Budget>(`/api/budgets/category/${category}`);
  },

  async create(data: CreateBudgetData): Promise<ApiResponse<Budget>> {
    return apiPost<Budget, CreateBudgetData>("/api/budgets", data);
  },

  async update(id: string, data: UpdateBudgetData): Promise<ApiResponse<Budget>> {
    return apiPut<Budget, UpdateBudgetData>(`/api/budgets/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete(`/api/budgets/${id}`);
  },

  async updateSpent(id: string, amount: number): Promise<ApiResponse<Budget>> {
    return apiPost<Budget, { amount: number }>(`/api/budgets/${id}/spent`, { amount });
  },

  async resetSpent(id: string): Promise<ApiResponse<Budget>> {
    return apiPost<Budget>(`/api/budgets/${id}/reset`, {});
  },
};

export interface BudgetStats {
  total: number;
  exceeded: number;
  withinLimit: number;
  totalLimit: number;
  totalSpent: number;
  totalRemaining: number;
  averagePercentage: number;
}

export const budgetStatsService = {
  async get(): Promise<ApiResponse<BudgetStats>> {
    return apiGet<BudgetStats>("/api/budgets/stats");
  },

  async getAlerts(): Promise<ApiResponse<BudgetAlert[]>> {
    return apiGet<BudgetAlert[]>("/api/budgets/alerts");
  },

  async getExceeded(): Promise<ApiResponse<Budget[]>> {
    return apiGet<Budget[]>("/api/budgets/exceeded");
  },

  async getByMonth(year: number, month: number): Promise<ApiResponse<Budget[]>> {
    return apiGet<Budget[]>(`/api/budgets?year=${year}&month=${month}`);
  },
};
