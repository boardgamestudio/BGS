// Real API entities using the custom Node.js backend
// Following the 10 Commandments - NO /api/ prefixes!
import apiClient from './apiClient';

// Project Entity
export const Project = {
  async list(orderBy = '-created_date', limit = 50) {
    try {
      const projects = await apiClient.get('/projects', { sort: orderBy, limit });
      return projects;
    } catch (error) {
      console.error('Project.list error:', error);
      return [];
    }
  },

  async filter(filters, orderBy = '-created_date') {
    try {
      const projects = await apiClient.get('/projects', { 
        ...filters, 
        sort: orderBy,
        limit: filters.limit || 50 
      });
      return projects;
    } catch (error) {
      console.error('Project.filter error:', error);
      return [];
    }
  },

  async get(id) {
    try {
      const project = await apiClient.get(`/projects/${id}`);
      return project;
    } catch (error) {
      console.error('Project.get error:', error);
      return null;
    }
  },

  async create(data) {
    try {
      const result = await apiClient.post('/projects', data);
      return result;
    } catch (error) {
      console.error('Project.create error:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const result = await apiClient.put(`/projects/${id}`, data);
      return result;
    } catch (error) {
      console.error('Project.update error:', error);
      throw error;
    }
  }
};

// Job Entity
export const Job = {
  async list(orderBy = '-created_date', limit = 50) {
    try {
      const jobs = await apiClient.get('/jobs', { sort: orderBy, limit });
      return jobs;
    } catch (error) {
      console.error('Job.list error:', error);
      return [];
    }
  },

  async filter(filters, orderBy = '-created_date') {
    try {
      const jobs = await apiClient.get('/jobs', { 
        ...filters, 
        sort: orderBy,
        limit: filters.limit || 50 
      });
      return jobs;
    } catch (error) {
      console.error('Job.filter error:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const result = await apiClient.post('/jobs', data);
      return result;
    } catch (error) {
      console.error('Job.create error:', error);
      throw error;
    }
  }
};

// Event Entity
export const Event = {
  async list(orderBy = '-created_date', limit = 50) {
    try {
      const events = await apiClient.get('/events', { sort: orderBy, limit });
      return events;
    } catch (error) {
      console.error('Event.list error:', error);
      return [];
    }
  },

  async filter(filters, orderBy = '-created_date') {
    try {
      const events = await apiClient.get('/events', { 
        ...filters, 
        sort: orderBy,
        limit: filters.limit || 50 
      });
      return events;
    } catch (error) {
      console.error('Event.filter error:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const result = await apiClient.post('/events', data);
      return result;
    } catch (error) {
      console.error('Event.create error:', error);
      throw error;
    }
  }
};

// User Entity
export const User = {
  async list(orderBy = '-created_date', limit = 100) {
    try {
      const users = await apiClient.get('/users', { sort: orderBy, limit });
      return users;
    } catch (error) {
      console.error('User.list error:', error);
      return [];
    }
  },

  async filter(filters) {
    try {
      const users = await apiClient.get('/users', filters);
      return users;
    } catch (error) {
      console.error('User.filter error:', error);
      return [];
    }
  },

  async me() {
    try {
      const user = await apiClient.get('/users/me');
      return user;
    } catch (error) {
      console.error('User.me error:', error);
      // Return a structured error object so the UI can show backend messages
      return { _error: true, message: error.message || 'Failed to fetch user', details: error.data || error };
    }
  },

  async update(data) {
    try {
      const result = await apiClient.put('/users/me', data);
      return result;
    } catch (error) {
      console.error('User.update error:', error);
      throw error;
    }
  }
};

// DesignDiary Entity
export const DesignDiary = {
  async list(orderBy = '-created_date', limit = 50) {
    try {
      const diaries = await apiClient.get('/design-diaries', { sort: orderBy, limit });
      return diaries;
    } catch (error) {
      console.error('DesignDiary.list error:', error);
      return [];
    }
  },

  async filter(filters, orderBy = '-created_date') {
    try {
      const diaries = await apiClient.get('/design-diaries', { 
        ...filters, 
        sort: orderBy,
        limit: filters.limit || 50 
      });
      return diaries;
    } catch (error) {
      console.error('DesignDiary.filter error:', error);
      return [];
    }
  }
};

// Placeholder entities for components that reference them
export const ForumPost = {
  async list() { return []; },
  async filter() { return []; },
  async create() { throw new Error('ForumPost not implemented yet'); }
};

export const ServiceProvider = {
  async list() { return []; },
  async filter() { return []; }
};
