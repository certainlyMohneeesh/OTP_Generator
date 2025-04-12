export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

export interface Message {
  id: string;
  contactId: string;
  contactName: string;
  otp: string;
  timestamp: Date;
  status: 'sent' | 'failed';
}

export interface SMSResponse {
  success: boolean;
  message?: string;
  error?: string;
} 