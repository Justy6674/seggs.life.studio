import { useState, useEffect } from 'react';
import { userMemoryService, UserMemory } from '@/lib/userMemory';
import { useAuth } from '@/hooks/useAuth';

export function useUserMemory() {
  const [memory, setMemory] = useState<UserMemory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const isDeveloperRoute = currentPath.startsWith('/dev/');
    
    if (isAuthenticated && user && user.id) {
      // Initialize user memory from authenticated user
      const initialMemory = userMemoryService.initializeFromUser(user);
      setMemory(initialMemory);
      setIsLoading(false);

      // Subscribe to changes
      const unsubscribe = userMemoryService.subscribe((updatedMemory) => {
        setMemory(updatedMemory);
      });

      return unsubscribe;
    } else if (isDeveloperRoute) {
      // For developer routes, initialize with mock data to prevent loading state
      const mockUser = {
        id: 'dev-user-123',
        firstName: 'Dev',
        lastName: 'User',
        email: 'dev@seggs.life',
        profileImageUrl: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStatus: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const initialMemory = userMemoryService.initializeFromUser(mockUser);
      setMemory(initialMemory);
      setIsLoading(false);
    } else {
      userMemoryService.clear();
      setMemory(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  return {
    memory,
    isLoading,
    updateMemory: userMemoryService.updateMemory.bind(userMemoryService),
    updateSpicinessLevel: userMemoryService.updateSpicinessLevel.bind(userMemoryService),
    updateBlueprintResults: userMemoryService.updateBlueprintResults.bind(userMemoryService),
    updatePartnerInfo: userMemoryService.updatePartnerInfo.bind(userMemoryService),
    removePartnerLink: userMemoryService.removePartnerLink.bind(userMemoryService),
    updateMood: userMemoryService.updateMood.bind(userMemoryService),
    getAIContext: userMemoryService.getAIContext.bind(userMemoryService),
  };
}