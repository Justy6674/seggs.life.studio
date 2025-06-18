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
    
    if (isAuthenticated && user && user.uid) {
      // Initialize user memory from Firebase user
      const userData = {
        id: user.uid,
        firstName: user.displayName?.split(' ')[0] || null,
        lastName: user.displayName?.split(' ')[1] || null,
        email: user.email || null,
        profileImageUrl: user.photoURL || null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStatus: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const initialMemory = userMemoryService.initializeFromUser(userData);
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
  }, [isAuthenticated, user?.uid]);

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