// Temporary fallback to mock entities until API backend is properly deployed
// This ensures the website loads instead of showing blank page when API fails
import {
  Project as MockProject,
  ForumPost as MockForumPost,
  Event as MockEvent,
  ServiceProvider as MockServiceProvider,
  Job as MockJob,
  DesignDiary as MockDesignDiary,
  User as MockUser
} from './mockEntities';

export const Project = MockProject;
export const ForumPost = MockForumPost;
export const Event = MockEvent;
export const ServiceProvider = MockServiceProvider;
export const Job = MockJob;
export const DesignDiary = MockDesignDiary;
export const User = MockUser;

// TODO: Once backend is properly deployed on cPanel, replace with real API calls
// The API client is ready at src/api/apiClient.js for when the backend is working
