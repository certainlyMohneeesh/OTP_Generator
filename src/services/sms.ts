import { SMSResponse } from '@/types';

export class SMSService {
  private static instance: SMSService;
  private messages: { [key: string]: string } = {};

  private constructor() {}

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  public async sendSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock success response
      this.messages[phoneNumber] = message;

      return {
        success: true,
        message: 'SMS sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send SMS'
      };
    }
  }

  public getMessageHistory(phoneNumber: string): string | undefined {
    return this.messages[phoneNumber];
  }
} 