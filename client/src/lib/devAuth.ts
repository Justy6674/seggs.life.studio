// Development authentication bypass
// This provides mock user data for testing the members area

export interface DevUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export const devUser: DevUser = {
  id: "dev-user-123",
  email: "dev@seggs.life",
  firstName: "Dev",
  lastName: "User",
  profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
};

export function getDevUser(): DevUser {
  return devUser;
}