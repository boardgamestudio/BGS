import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68816d9339eb2c15bd9477f3", 
  requiresAuth: true // Ensure authentication is required for all operations
});
