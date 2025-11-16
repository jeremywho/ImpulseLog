import {
  User,
  RegisterDto,
  LoginDto,
  UpdateUserDto,
  AuthResponse,
  ApiError,
  ImpulseEntry,
  CreateImpulseEntry,
  UpdateImpulseEntry,
  ImpulseFilters
} from './types';

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message);
    }

    return response.json();
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/users/me');
  }

  async updateCurrentUser(data: UpdateUserDto): Promise<User> {
    return this.request<User>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Impulse Entry Methods
  async getImpulses(filters?: ImpulseFilters): Promise<ImpulseEntry[]> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.didAct && filters.didAct !== 'all') params.append('didAct', filters.didAct);

    const query = params.toString();
    return this.request<ImpulseEntry[]>(`/api/impulseentries${query ? `?${query}` : ''}`);
  }

  async getImpulse(id: string): Promise<ImpulseEntry> {
    return this.request<ImpulseEntry>(`/api/impulseentries/${id}`);
  }

  async createImpulse(data: CreateImpulseEntry): Promise<ImpulseEntry> {
    return this.request<ImpulseEntry>('/api/impulseentries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateImpulse(id: string, data: UpdateImpulseEntry): Promise<ImpulseEntry> {
    return this.request<ImpulseEntry>(`/api/impulseentries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteImpulse(id: string): Promise<void> {
    await this.request<void>(`/api/impulseentries/${id}`, {
      method: 'DELETE',
    });
  }
}
