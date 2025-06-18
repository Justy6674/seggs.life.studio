import { useState, useEffect } from 'react';
import { userMemoryService, UserMemory } from '@/lib/userMemory';
import { useAuth } from '@/hooks/useAuth';

export function useUserMemory() {
  const [memory, setMemory] = useState<UserMemory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
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