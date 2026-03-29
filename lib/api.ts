const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        message: "Erro de conexão com o servidor",
      };
    }
  }

  private async _request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        message: "Erro de conexão com o servidor",
      };
    }
  }

  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getProfile() {
    return this.request<any>("/auth/profile");
  }

  async updateProfile(data: { name?: string; image?: string }) {
    return this.request<any>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<any>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getWallets() {
    return this.request<any[]>("/wallets");
  }

  async createWallet(data: { name: string; type: string; value_initial: number; color: string }) {
    return this.request<any>("/wallets", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        value_initial: Number(data.value_initial),
      }),
    });
  }

  async updateWallet(id: string, data: Partial<{ name: string; type: string; color: string }>) {
    return this.request<any>(`/wallets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteWallet(id: string) {
    return this.request<void>(`/wallets/${id}`, {
      method: "DELETE",
    });
  }

  async getTransactions(params?: { walletId?: string; month?: string; type?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.walletId) queryParams.set("walletId", params.walletId);
    if (params?.month) queryParams.set("month", params.month);
    if (params?.type) queryParams.set("type", params.type);
    const query = queryParams.toString();
    return this.request<any[]>(`/transactions${query ? `?${query}` : ""}`);
  }

  async createTransaction(data: {
    description: string;
    category: string;
    value: number;
    type: string;
    date: string;
    wallet_id: string;
    wallet_to_id?: string;
    paid?: boolean;
    color?: string;
  }) {
    return this.request<any>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: Partial<{
    description: string;
    category: string;
    value: number;
    type: string;
    date: string;
    wallet_id: string;
    wallet_to_id: string;
    paid: boolean;
    color: string;
  }>) {
    return this.request<any>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<void>(`/transactions/${id}`, {
      method: "DELETE",
    });
  }

  async getGoals() {
    return this.request<any[]>("/goals");
  }

  async createGoal(data: {
    name: string;
    target: number;
    current?: number;
    deadline: string;
    color: string;
    icon: string;
  }) {
    return this.request<any>("/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGoal(id: string, data: Partial<{
    name: string;
    target: number;
    current: number;
    deadline: string;
    color: string;
    icon: string;
  }>) {
    return this.request<any>(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: string) {
    return this.request<void>(`/goals/${id}`, {
      method: "DELETE",
    });
  }

  async getBudgets() {
    return this.request<any[]>("/budgets");
  }

  async createBudget(data: {
    category: string;
    limit: number;
    spent?: number;
    color: string;
    icon: string;
  }) {
    return this.request<any>("/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBudget(id: string, data: Partial<{
    category: string;
    limit: number;
    spent: number;
    color: string;
    icon: string;
  }>) {
    return this.request<any>(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBudget(id: string) {
    return this.request<void>(`/budgets/${id}`, {
      method: "DELETE",
    });
  }

  async getInstallments() {
    return this.request<any[]>("/installments");
  }

  async createInstallment(data: {
    description: string;
    totalValue: number;
    totalInstallments: number;
    startDate: string;
    category: string;
    color: string;
  }) {
    return this.request<any>("/installments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateInstallment(id: string, data: Partial<{
    description: string;
    totalValue: number;
    totalInstallments: number;
    startDate: string;
    paidInstallments: number;
    paidValue: number;
    nextDueDate: string;
    color: string;
    category: string;
  }>) {
    return this.request<any>(`/installments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteInstallment(id: string) {
    return this.request<void>(`/installments/${id}`, {
      method: "DELETE",
    });
  }

  async getRecurrences() {
    return this.request<any[]>("/recurrences");
  }

  async createRecurrence(data: {
    description: string;
    value: number;
    type: string;
    frequency: string;
    nextDate: string;
    wallet_id: string;
    category: string;
    color: string;
  }) {
    return this.request<any>("/recurrences", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRecurrence(id: string, data: Partial<{
    description: string;
    value: number;
    type: string;
    frequency: string;
    nextDate: string;
    wallet_id: string;
    category: string;
    active: boolean;
    color: string;
  }>) {
    return this.request<any>(`/recurrences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRecurrence(id: string) {
    return this.request<void>(`/recurrences/${id}`, {
      method: "DELETE",
    });
  }

  async getSubscription() {
    return this.request<any>("/subscription");
  }

  async getSubscriptionStats() {
    return this.request<any>("/subscription/stats");
  }

  async upgradeToPro(paymentData?: any) {
    return this.request<any>("/subscription?action=upgrade", {
      method: "POST",
      body: JSON.stringify(paymentData || {}),
    });
  }

  async downgradeToFree() {
    return this.request<any>("/subscription?action=downgrade", {
      method: "POST",
    });
  }

  async parsePixCode(pixCode: string) {
    return this.request<any>("/payment/parse", {
      method: "POST",
      body: JSON.stringify({ pixCode }),
    });
  }

  async getDashboardStats() {
    const [wallets, transactions, goals, installments, recurrences] = await Promise.all([
      this.getWallets(),
      this.getTransactions(),
      this.getGoals(),
      this.getInstallments(),
      this.getRecurrences(),
    ]);

    return { wallets, transactions, goals, installments, recurrences };
  }
}

export const api = new ApiService();
