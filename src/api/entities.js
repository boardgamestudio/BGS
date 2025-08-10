// Temporarily using mock entities instead of Base44 API
// This allows the app to load without Base44 dependency
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
