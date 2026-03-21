import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from "./api";

export interface Installment {
  id: string;
  description: string;
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  installmentValue: number;
  remainingInstallments: number;
  totalInstallments: number;
  paidInstallments: number;
  nextDueDate: string;
  color: string;
  category: string;
  completed: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateInstallmentData {
  description: string;
  totalValue: number;
  totalInstallments: number;
  startDate: string;
  category: string;
  color: string;
}

export interface UpdateInstallmentData {
  description?: string;
  totalValue?: number;
  totalInstallments?: number;
  startDate?: string;
  category?: string;
  color?: string;
}

export interface PayInstallmentData {
  amount?: number;
}

export const installmentService = {
  async getAll(): Promise<ApiResponse<Installment[]>> {
    return apiGet<Installment[]>("/api/installments");
  },

  async getById(id: string): Promise<ApiResponse<Installment>> {
    return apiGet<Installment>(`/api/installments/${id}`);
  },

  async getActive(): Promise<ApiResponse<Installment[]>> {
    return apiGet<Installment[]>("/api/installments/active");
  },

  async getCompleted(): Promise<ApiResponse<Installment[]>> {
    return apiGet<Installment[]>("/api/installments/completed");
  },

  async create(data: CreateInstallmentData): Promise<ApiResponse<Installment>> {
    return apiPost<Installment, CreateInstallmentData>("/api/installments", data);
  },

  async update(id: string, data: UpdateInstallmentData): Promise<ApiResponse<Installment>> {
    return apiPut<Installment, UpdateInstallmentData>(`/api/installments/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete(`/api/installments/${id}`);
  },

  async payInstallment(id: string, data?: PayInstallmentData): Promise<ApiResponse<Installment>> {
    return apiPost<Installment, PayInstallmentData>(`/api/installments/${id}/pay`, data || {});
  },

  async markAsCompleted(id: string): Promise<ApiResponse<Installment>> {
    return apiPut<Installment>(`/api/installments/${id}/complete`, {});
  },
};

export interface InstallmentStats {
  total: number;
  active: number;
  completed: number;
  totalRemaining: number;
  totalPaid: number;
  averageInstallment: number;
}

export const installmentStatsService = {
  async get(): Promise<ApiResponse<InstallmentStats>> {
    return apiGet<InstallmentStats>("/api/installments/stats");
  },

  async getUpcoming(days: number = 7): Promise<ApiResponse<Installment[]>> {
    return apiGet<Installment[]>(`/api/installments/upcoming?days=${days}`);
  },

  async getOverdue(): Promise<ApiResponse<Installment[]>> {
    return apiGet<Installment[]>("/api/installments/overdue");
  },

  async getByCategory(category: string): Promise<ApiResponse<Installment[]>> {
    return apiGet<Installment[]>(`/api/installments?category=${category}`);
  },
};
