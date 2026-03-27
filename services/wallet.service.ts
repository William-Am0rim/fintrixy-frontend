import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from "./api";

export interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
  icon?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWalletData {
  name: string;
  type: string;
  value_initial: number;
  color: string;
  icon?: string;
}

export interface UpdateWalletData {
  name?: string;
  type?: string;
  balance?: number;
  color?: string;
  icon?: string;
}

export const walletService = {
  async getAll(): Promise<ApiResponse<Wallet[]>> {
    return apiGet<Wallet[]>("/api/wallets");
  },

  async getById(id: string): Promise<ApiResponse<Wallet>> {
    return apiGet<Wallet>(`/api/wallets/${id}`);
  },

  async create(data: CreateWalletData): Promise<ApiResponse<Wallet>> {
    return apiPost<Wallet, CreateWalletData>("/api/wallets", data);
  },

  async update(id: string, data: UpdateWalletData): Promise<ApiResponse<Wallet>> {
    return apiPut<Wallet, UpdateWalletData>(`/api/wallets/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete(`/api/wallets/${id}`);
  },

  async getBalance(id: string): Promise<ApiResponse<{ balance: number }>> {
    return apiGet<{ balance: number }>(`/api/wallets/${id}/balance`);
  },

  async updateBalance(
    id: string,
    amount: number,
    type: "add" | "subtract"
  ): Promise<ApiResponse<Wallet>> {
    return apiPost<Wallet, { amount: number; type: string }>(
      `/api/wallets/${id}/balance`,
      { amount, type }
    );
  },
};

export interface WalletStats {
  total: number;
  count: number;
  totalIncome: number;
  totalExpense: number;
  byType: {
    type: string;
    count: number;
    total: number;
  }[];
}

export const walletStatsService = {
  async get(): Promise<ApiResponse<WalletStats>> {
    return apiGet<WalletStats>("/api/wallets/stats");
  },
};
