// Real API entities that call the Node.js backend
import apiClient from './apiClient';

export const Project = {
  list: async (sort, limit) => {
    try {
      const params = {};
      if (sort) params.sort = sort;
      if (limit) params.limit = limit;
      
      return await apiClient.get('/projects', params);
    } catch (error) {
      console.error('Project.list error:', error);
      throw error;
    }
  },

  filter: async (params) => {
    try {
      return await apiClient.get('/projects', params);
    } catch (error) {
      console.error('Project.filter error:', error);
      throw error;
    }
  },

  get: async (id) => {
    try {
      return await apiClient.get(`/projects/${id}`);
    } catch (error) {
      console.error('Project.get error:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      return await apiClient.post('/projects', data);
    } catch (error) {
      console.error('Project.create error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await apiClient.put(`/projects/${id}`, data);
    } catch (error) {
      console.error('Project.update error:', error);
      throw error;
    }
  }
};

export const Job = {
  list: async (sort, limit) => {
    try {
      const params = {};
      if (sort) params.sort = sort;
      if (limit) params.limit = limit;
      
      return await apiClient.get('/jobs', params);
    } catch (error) {
      console.error('Job.list error:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      return await apiClient.post('/jobs', data);
    } catch (error) {
      console.error('Job.create error:', error);
      throw error;
    }
  }
};

export const Event = {
  list: async (sort, limit) => {
    try {
      const params = {};
      if (sort) params.sort = sort;
      if (limit) params.limit = limit;
      
      return await apiClient.get('/events', params);
    } catch (error) {
      console.error('Event.list error:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      return await apiClient.post('/events', data);
    } catch (error) {
      console.error('Event.create error:', error);
      throw error;
    }
  }
};

export const User = {
  list: async (sort, limit) => {
    try {
      const params = {};
      if (sort) params.sort = sort;
      if (limit) params.limit = limit;
      
      return await apiClient.get('/users', params);
    } catch (error) {
      console.error('User.list error:', error);
      throw error;
    }
  },

  filter: async (params) => {
    try {
      return await apiClient.get('/users', params);
    } catch (error) {
      console.error('User.filter error:', error);
      throw error;
    }
  },

  me: async () => {
    try {
      // For now, return null to simulate not logged in
      // This will need proper authentication implementation later
      return null;
    } catch (error) {
      console.error('User.me error:', error);
      return null;
    }
  },

  create: async (data) => {
    try {
      return await apiClient.post('/users', data);
    } catch (error) {
      console.error('User.create error:', error);
      throw error;
    }
  }
};

export const DesignDiary = {
  filter: async (params) => {
    try {
      return await apiClient.get('/design-diaries', params);
    } catch (error) {
      console.error('DesignDiary.filter error:', error);
      throw error;
    }
  }
};

// Placeholder entities for features not yet implemented
export const ForumPost = {
  list: async () => {
    try {
      // TODO: Implement forum posts API
      return [];
    } catch (error) {
      console.error('ForumPost.list error:', error);
      return [];
    }
  }
};

export const ServiceProvider = {
  list: async () => {
    try {
      // TODO: Implement service providers API  
      return [];
    } catch (error) {
      console.error('ServiceProvider.list error:', error);
      return [];
    }
  }
};
