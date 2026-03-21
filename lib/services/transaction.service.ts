import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from "./api";

export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  description: string;
  category: string;
  value: number;
  type: TransactionType;
  date: string;
  wallet: string;
  wallet_id?: string;
  wallet_to_id?: string;
  paid: boolean;
  color?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionData {
  description: string;
  category: string;
  value: number;
  type: TransactionType;
  date: string;
  wallet_id: string;
  wallet_to_id?: string;
  paid?: boolean;
  color?: string;
}

export interface UpdateTransactionData {
  description?: string;
  category?: string;
  value?: number;
  type?: TransactionType;
  date?: string;
  wallet_id?: string;
  wallet_to_id?: string;
  paid?: boolean;
  color?: string;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType | "all";
  category?: string;
  wallet_id?: string;
  date_from?: string;
  date_to?: string;
  paid?: boolean;
}

export const transactionService = {
  async getAll(filters?: TransactionFilters): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.search) params.append("search", filters.search);
      if (filters.type && filters.type !== "all") params.append("type", filters.type);
      if (filters.category) params.append("category", filters.category);
      if (filters.wallet_id) params.append("wallet_id", filters.wallet_id);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.paid !== undefined) params.append("paid", String(filters.paid));
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/transactions?${queryString}` : "/api/transactions";

    return apiGet<Transaction[]>(endpoint);
  },

  async getById(id: string): Promise<ApiResponse<Transaction>> {
    return apiGet<Transaction>(`/api/transactions/${id}`);
  },

  async getRecent(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    return apiGet<Transaction[]>(`/api/transactions/recent?limit=${limit}`);
  },

  async create(data: CreateTransactionData): Promise<ApiResponse<Transaction>> {
    return apiPost<Transaction, CreateTransactionData>("/api/transactions", data);
  },

  async update(id: string, data: UpdateTransactionData): Promise<ApiResponse<Transaction>> {
    return apiPut<Transaction, UpdateTransactionData>(`/api/transactions/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete(`/api/transactions/${id}`);
  },

  async markAsPaid(id: string, paid: boolean): Promise<ApiResponse<Transaction>> {
    return apiPut<Transaction, { paid: boolean }>(`/api/transactions/${id}/paid`, { paid });
  },
};

export interface TransactionStats {
  total: number;
  income: number;
  expense: number;
  transfer: number;
  paidCount: number;
  unpaidCount: number;
  byCategory: {
    category: string;
    total: number;
    count: number;
  }[];
  byWallet: {
    wallet_id: string;
    wallet_name: string;
    total: number;
    count: number;
  }[];
}

export const transactionStatsService = {
  async get(filters?: TransactionFilters): Promise<ApiResponse<TransactionStats>> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/transactions/stats?${queryString}` : "/api/transactions/stats";

    return apiGet<TransactionStats>(endpoint);
  },
};
