export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export type EventCategory = 
  | 'Cleanup'
  | 'Plantation'
  | 'Donation'
  | 'Healthcare'
  | 'Education'
  | 'Other';

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  creatorName?: string;
  attendeesCount?: number;
  createdAt?: string;
}

export interface JoinedEventItem {
  _id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  thumbnail: string;
  eventType: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

