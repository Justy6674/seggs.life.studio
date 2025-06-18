import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerConnection {
  id: string;
  userId: string;
  partnerId: string;
  status: string;
  createdAt: Date;
}

export interface IntimacyTracking {
  id: string;
  userId: string;
  mood: string;
  libido: number;
  notes?: string;
  date: Date;
}

export interface AiSuggestion {
  id: string;
  userId: string;
  content: string;
  category: string;
  isRead: boolean;
  isApplied: boolean;
  createdAt: Date;
}

export interface Assessment {
  id: string;
  userId: string;
  type: string;
  responses: any;
  results: any;
  completedAt: Date;
}

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  messages: any[];
  lastMessageAt: Date;
  createdAt: Date;
}

export class FirebaseStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async upsertUser(userData: Partial<User> & { id: string }): Promise<User> {
    try {
      const userRef = doc(db, 'users', userData.id);
      const userDoc = await getDoc(userRef);
      
      const now = new Date();
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          ...userData,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return this.getUser(userData.id) as Promise<User>;
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  // Partner connections
  async createPartnerConnection(connection: Omit<PartnerConnection, 'id' | 'createdAt'>): Promise<PartnerConnection> {
    try {
      const docRef = await addDoc(collection(db, 'partnerConnections'), {
        ...connection,
        createdAt: serverTimestamp()
      });
      
      const newDoc = await getDoc(docRef);
      return { id: newDoc.id, ...newDoc.data() } as PartnerConnection;
    } catch (error) {
      console.error('Error creating partner connection:', error);
      throw error;
    }
  }

  async getPartnerConnections(userId: string): Promise<PartnerConnection[]> {
    try {
      const q = query(
        collection(db, 'partnerConnections'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PartnerConnection[];
    } catch (error) {
      console.error('Error getting partner connections:', error);
      return [];
    }
  }

  // Intimacy tracking
  async createIntimacyEntry(entry: Omit<IntimacyTracking, 'id'>): Promise<IntimacyTracking> {
    try {
      const docRef = await addDoc(collection(db, 'intimacyTracking'), entry);
      const newDoc = await getDoc(docRef);
      return { id: newDoc.id, ...newDoc.data() } as IntimacyTracking;
    } catch (error) {
      console.error('Error creating intimacy entry:', error);
      throw error;
    }
  }

  async getIntimacyEntries(userId: string): Promise<IntimacyTracking[]> {
    try {
      const q = query(
        collection(db, 'intimacyTracking'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IntimacyTracking[];
    } catch (error) {
      console.error('Error getting intimacy entries:', error);
      return [];
    }
  }

  // AI suggestions
  async createAiSuggestion(suggestion: Omit<AiSuggestion, 'id' | 'createdAt'>): Promise<AiSuggestion> {
    try {
      const docRef = await addDoc(collection(db, 'aiSuggestions'), {
        ...suggestion,
        createdAt: serverTimestamp()
      });
      
      const newDoc = await getDoc(docRef);
      return { id: newDoc.id, ...newDoc.data() } as AiSuggestion;
    } catch (error) {
      console.error('Error creating AI suggestion:', error);
      throw error;
    }
  }

  async getUserSuggestions(userId: string): Promise<AiSuggestion[]> {
    try {
      const q = query(
        collection(db, 'aiSuggestions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AiSuggestion[];
    } catch (error) {
      console.error('Error getting user suggestions:', error);
      return [];
    }
  }

  // Chat conversations
  async createChatConversation(conversation: Omit<ChatConversation, 'id' | 'createdAt' | 'lastMessageAt'>): Promise<ChatConversation> {
    try {
      const now = serverTimestamp();
      const docRef = await addDoc(collection(db, 'chatConversations'), {
        ...conversation,
        createdAt: now,
        lastMessageAt: now
      });
      
      const newDoc = await getDoc(docRef);
      return { id: newDoc.id, ...newDoc.data() } as ChatConversation;
    } catch (error) {
      console.error('Error creating chat conversation:', error);
      throw error;
    }
  }

  async updateChatConversation(id: string, messages: any[]): Promise<ChatConversation> {
    try {
      const chatRef = doc(db, 'chatConversations', id);
      await updateDoc(chatRef, {
        messages,
        lastMessageAt: serverTimestamp()
      });
      
      const updatedDoc = await getDoc(chatRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as ChatConversation;
    } catch (error) {
      console.error('Error updating chat conversation:', error);
      throw error;
    }
  }

  async getUserChatConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const q = query(
        collection(db, 'chatConversations'),
        where('userId', '==', userId),
        orderBy('lastMessageAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatConversation[];
    } catch (error) {
      console.error('Error getting user chat conversations:', error);
      return [];
    }
  }
}

export const firebaseStorage = new FirebaseStorage();