import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from "./api";

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface Recurrence {
  id: string;
  description: string;
  value: number;
  type: "income" | "expense";
  frequency: RecurrenceFrequency;
  nextDate: string;
  wallet: string;
  wallet_id?: string;
  category: string;
  active: boolean;
  color: string;
  lastProcessed?: string;
  totalProcessed?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRecurrenceData {
  description: string;
  value: number;
  type: "income" | "expense";
  frequency: RecurrenceFrequency;
  nextDate: string;
  wallet_id: string;
  category: string;
  color: string;
}

export interface UpdateRecurrenceData {
  description?: string;
  value?: number;
  type?: "income" | "expense";
  frequency?: RecurrenceFrequency;
  nextDate?: string;
  wallet_id?: string;
  category?: string;
  color?: string;
}

export const recurrenceService = {
  async getAll(): Promise<ApiResponse<Recurrence[]>> {
    return apiGet<Recurrence[]>("/api/recurrences");
  },

  async getById(id: string): Promise<ApiResponse<Recurrence>> {
    return apiGet<Recurrence>(`/api/recurrences/${id}`);
  },

  async getActive(): Promise<ApiResponse<Recurrence[]>> {
    return apiGet<Recurrence[]>("/api/recurrences/active");
  },

  async getInactive(): Promise<ApiResponse<Recurrence[]>> {
    return apiGet<Recurrence[]>("/api/recurrences/inactive");
  },

  async create(data: CreateRecurrenceData): Promise<ApiResponse<Recurrence>> {
    return apiPost<Recurrence, CreateRecurrenceData>("/api/recurrences", data);
  },

  async update(id: string, data: UpdateRecurrenceData): Promise<ApiResponse<Recurrence>> {
    return apiPut<Recurrence, UpdateRecurrenceData>(`/api/recurrences/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete(`/api/recurrences/${id}`);
  },

  async toggleActive(id: string): Promise<ApiResponse<Recurrence>> {
    return apiPost<Recurrence>(`/api/recurrences/${id}/toggle`, {});
  },

  async processNow(id: string): Promise<ApiResponse<Recurrence>> {
    return apiPost<Recurrence>(`/api/recurrences/${id}/process`, {});
  },

  async skipNext(id: string): Promise<ApiResponse<Recurrence>> {
    return apiPost<Recurrence>(`/api/recurrences/${id}/skip`, {});
  },
};

export interface RecurrenceStats {
  total: number;
  active: number;
  inactive: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  byFrequency: {
    frequency: RecurrenceFrequency;
    count: number;
    total: number;
  }[];
}

export const recurrenceStatsService = {
  async get(): Promise<ApiResponse<RecurrenceStats>> {
    return apiGet<RecurrenceStats>("/api/recurrences/stats");
  },

  async getUpcoming(days: number = 7): Promise<ApiResponse<Recurrence[]>> {
    return apiGet<Recurrence[]>(`/api/recurrences/upcoming?days=${days}`);
  },

  async getByFrequency(frequency: RecurrenceFrequency): Promise<ApiResponse<Recurrence[]>> {
    return apiGet<Recurrence[]>(`/api/recurrences?frequency=${frequency}`);
  },
};
