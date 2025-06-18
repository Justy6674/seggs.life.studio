import { User } from "@shared/schema";

export interface UserMemory {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  gender?: string;
  identity?: string;
  spicinessLevel: number; // 1-5 scale
  partnerId?: string;
  partnerName?: string;
  partnerLinked: boolean;
  blueprintResults?: {
    sensual: number;
    sexual: number;
    energetic: number;
    kinky: number;
    shapeshifter: number;
    primaryType: string;
    completedAt: string;
  };
  partnerBlueprint?: {
    sensual: number;
    sexual: number;
    energetic: number;
    kinky: number;
    shapeshifter: number;
    primaryType: string;
    isPredicted: boolean;
  };
  mood?: {
    current: string;
    lastUpdated: string;
    libido: number; // 1-10 scale
  };
  preferences: {
    notifications: boolean;
    privacy: 'private' | 'shared' | 'public';
    contentRating: 'mild' | 'medium' | 'wild';
  };
  subscription: {
    status: 'inactive' | 'active' | 'trial';
    plan: 'individual' | 'couple' | 'premium';
    expiresAt?: string;
  };
}

class UserMemoryService {
  private userMemory: UserMemory | null = null;
  private listeners: ((memory: UserMemory | null) => void)[] = [];

  // Initialize from user data
  initializeFromUser(user: User): UserMemory {
    this.userMemory = {
      id: user.id,
      email: user.email || undefined,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
      gender: undefined, // Will be loaded from profile
      identity: undefined,
      spicinessLevel: 3, // Default to medium
      partnerId: undefined,
      partnerName: undefined,
      partnerLinked: false,
      blueprintResults: undefined,
      partnerBlueprint: undefined,
      mood: undefined,
      preferences: {
        notifications: true,
        privacy: 'private',
        contentRating: 'medium',
      },
      subscription: {
        status: user.subscriptionStatus === 'active' ? 'active' : 'inactive',
        plan: 'individual',
      },
    };
    
    this.notifyListeners();
    return this.userMemory;
  }

  // Get current user memory
  getMemory(): UserMemory | null {
    return this.userMemory;
  }

  // Update specific fields
  updateMemory(updates: Partial<UserMemory>): void {
    if (this.userMemory) {
      this.userMemory = { ...this.userMemory, ...updates };
      this.notifyListeners();
    }
  }

  // Update spiciness level
  updateSpicinessLevel(level: number): void {
    this.updateMemory({ spicinessLevel: Math.max(1, Math.min(5, level)) });
  }

  // Update blueprint results
  updateBlueprintResults(results: UserMemory['blueprintResults']): void {
    this.updateMemory({ blueprintResults: results });
  }

  // Update partner information
  updatePartnerInfo(partnerId: string, partnerName: string): void {
    this.updateMemory({ 
      partnerId, 
      partnerName, 
      partnerLinked: true 
    });
  }

  // Remove partner link
  removePartnerLink(): void {
    this.updateMemory({ 
      partnerId: undefined, 
      partnerName: undefined, 
      partnerLinked: false,
      partnerBlueprint: undefined 
    });
  }

  // Update mood
  updateMood(mood: string, libido: number): void {
    this.updateMemory({
      mood: {
        current: mood,
        lastUpdated: new Date().toISOString(),
        libido
      }
    });
  }

  // Subscribe to changes
  subscribe(listener: (memory: UserMemory | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.userMemory));
  }

  // Clear memory (on logout)
  clear(): void {
    this.userMemory = null;
    this.notifyListeners();
  }

  // Generate AI context string
  getAIContext(): string {
    if (!this.userMemory) return "";

    const parts = [];
    
    if (this.userMemory.gender) {
      parts.push(`Gender: ${this.userMemory.gender}`);
    }
    
    if (this.userMemory.identity) {
      parts.push(`Identity: ${this.userMemory.identity}`);
    }
    
    parts.push(`Spiciness preference: ${this.userMemory.spicinessLevel}/5`);
    
    if (this.userMemory.blueprintResults) {
      parts.push(`Blueprint: ${this.userMemory.blueprintResults.primaryType}`);
    }
    
    if (this.userMemory.partnerLinked && this.userMemory.partnerName) {
      parts.push(`Partner: ${this.userMemory.partnerName} (linked)`);
      if (this.userMemory.partnerBlueprint) {
        parts.push(`Partner blueprint: ${this.userMemory.partnerBlueprint.primaryType}${this.userMemory.partnerBlueprint.isPredicted ? ' (predicted)' : ''}`);
      }
    } else {
      parts.push("Single/no partner linked");
    }
    
    if (this.userMemory.mood) {
      parts.push(`Current mood: ${this.userMemory.mood.current}, libido: ${this.userMemory.mood.libido}/10`);
    }

    return parts.join(", ");
  }
}

export const userMemoryService = new UserMemoryService();