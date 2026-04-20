import axios, { AxiosInstance, AxiosError } from 'axios';
import { User, AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = localStorage.getItem('accessToken');

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, tenantName: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', { email, password, tenantName });
    return response.data;
  }

  async me(): Promise<User> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Accounts
  async getAccounts(limit = 20, offset = 0) {
    const response = await this.client.get('/accounts', { params: { limit, offset } });
    return response.data;
  }

  async getAccount(id: string) {
    const response = await this.client.get(`/accounts/${id}`);
    return response.data;
  }

  async createAccount(data: any) {
    const response = await this.client.post('/accounts', data);
    return response.data;
  }

  async updateAccount(id: string, data: any) {
    const response = await this.client.put(`/accounts/${id}`, data);
    return response.data;
  }

  async deleteAccount(id: string) {
    return this.client.delete(`/accounts/${id}`);
  }

  async getAccountContacts(accountId: string, limit = 50, offset = 0) {
    const response = await this.client.get(`/accounts/${accountId}/contacts`, { params: { limit, offset } });
    return response.data;
  }

  async getAccountOpportunities(accountId: string, limit = 50, offset = 0) {
    const response = await this.client.get(`/accounts/${accountId}/opportunities`, { params: { limit, offset } });
    return response.data;
  }

  // Contacts
  async getContacts(limit = 20, offset = 0, accountId?: string) {
    const params: any = { limit, offset };
    if (accountId) {
      params.accountId = accountId;
    }
    const response = await this.client.get('/contacts', { params });
    return response.data;
  }

  async getContact(id: string) {
    const response = await this.client.get(`/contacts/${id}`);
    return response.data;
  }

  async createContact(data: any) {
    const response = await this.client.post('/contacts', data);
    return response.data;
  }

  async updateContact(id: string, data: any) {
    const response = await this.client.put(`/contacts/${id}`, data);
    return response.data;
  }

  async deleteContact(id: string) {
    return this.client.delete(`/contacts/${id}`);
  }

  async getContactAccount(contactId: string) {
    const response = await this.client.get(`/contacts/${contactId}/account`);
    return response.data;
  }

  async getContactActivities(contactId: string, limit = 50, offset = 0) {
    const response = await this.client.get(`/contacts/${contactId}/activities`, { params: { limit, offset } });
    return response.data;
  }

  // Leads
  async getLeads(limit = 20, offset = 0) {
    const response = await this.client.get('/leads', { params: { limit, offset } });
    return response.data;
  }

  async getLead(id: string) {
    const response = await this.client.get(`/leads/${id}`);
    return response.data;
  }

  async createLead(data: any) {
    const response = await this.client.post('/leads', data);
    return response.data;
  }

  async updateLead(id: string, data: any) {
    const response = await this.client.put(`/leads/${id}`, data);
    return response.data;
  }

  async deleteLead(id: string) {
    return this.client.delete(`/leads/${id}`);
  }

  async convertLead(id: string) {
    const response = await this.client.post(`/leads/${id}/convert`);
    return response.data;
  }

  // Opportunities
  async getOpportunities(limit = 20, offset = 0, accountId?: string) {
    const params: any = { limit, offset };
    if (accountId) {
      params.accountId = accountId;
    }
    const response = await this.client.get('/opportunities', { params });
    return response.data;
  }

  async getOpportunity(id: string) {
    const response = await this.client.get(`/opportunities/${id}`);
    return response.data;
  }

  async createOpportunity(data: any) {
    const response = await this.client.post('/opportunities', data);
    return response.data;
  }

  async updateOpportunity(id: string, data: any) {
    const response = await this.client.put(`/opportunities/${id}`, data);
    return response.data;
  }

  async deleteOpportunity(id: string) {
    return this.client.delete(`/opportunities/${id}`);
  }

  async getOpportunityAccount(opportunityId: string) {
    const response = await this.client.get(`/opportunities/${opportunityId}/account`);
    return response.data;
  }

  async getOpportunityActivities(opportunityId: string, limit = 50, offset = 0) {
    const response = await this.client.get(`/opportunities/${opportunityId}/activities`, { params: { limit, offset } });
    return response.data;
  }

  // Activities
  async getActivities(limit = 20, offset = 0) {
    const response = await this.client.get('/activities', { params: { limit, offset } });
    return response.data;
  }

  async getActivity(id: string) {
    const response = await this.client.get(`/activities/${id}`);
    return response.data;
  }

  async createActivity(data: any) {
    const response = await this.client.post('/activities', data);
    return response.data;
  }

  async updateActivity(id: string, data: any) {
    const response = await this.client.put(`/activities/${id}`, data);
    return response.data;
  }

  async deleteActivity(id: string) {
    return this.client.delete(`/activities/${id}`);
  }
}

export default new ApiClient();
