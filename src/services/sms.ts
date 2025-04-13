export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  status?: 'sent' | 'delivered' | 'failed';
}

interface MessageRecord {
  id: string;
  phoneNumber: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed';
  otp: string;
  expiresAt: Date;
}

export class SMSService {
  private static instance: SMSService;
  private messages: Map<string, MessageRecord> = new Map();
  private rateLimits: Map<string, { count: number; resetAt: Date }> = new Map();
  private readonly MAX_ATTEMPTS = 3;
  private readonly RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
  private readonly OTP_EXPIRY = 300000; // 5 minutes in milliseconds

  private constructor() {}

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  private checkRateLimit(phoneNumber: string): boolean {
    const now = new Date();
    const limit = this.rateLimits.get(phoneNumber);

    if (!limit || limit.resetAt < now) {
      // Reset rate limit
      this.rateLimits.set(phoneNumber, {
        count: 1,
        resetAt: new Date(now.getTime() + this.RATE_LIMIT_WINDOW),
      });
      return true;
    }

    if (limit.count >= this.MAX_ATTEMPTS) {
      return false;
    }

    limit.count++;
    return true;
  }

  public async sendSMS(phoneNumber: string, message: string, otp: string): Promise<SMSResponse> {
    try {
      // Check rate limit
      if (!this.checkRateLimit(phoneNumber)) {
        return {
          success: false,
          error: `Rate limit exceeded. Try again after ${new Date(this.rateLimits.get(phoneNumber)?.resetAt || 0).toLocaleTimeString()}`,
          status: 'failed'
        };
      }

      // Send SMS via API route
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Store message record
      const messageRecord: MessageRecord = {
        id: result.messageId,
        phoneNumber,
        message,
        timestamp: new Date(),
        status: 'sent',
        otp,
        expiresAt: new Date(Date.now() + this.OTP_EXPIRY),
      };
      this.messages.set(result.messageId, messageRecord);

      return {
        success: true,
        messageId: result.messageId,
        status: 'sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS',
        status: 'failed'
      };
    }
  }

  public getMessageStatus(messageId: string): SMSResponse {
    const message = this.messages.get(messageId);
    if (!message) {
      return {
        success: false,
        error: 'Message not found',
      };
    }

    // Check OTP expiration
    if (message.expiresAt < new Date()) {
      message.status = 'failed';
      return {
        success: false,
        error: 'OTP has expired',
        status: 'failed'
      };
    }

    return {
      success: true,
      status: message.status
    };
  }

  public verifyOTP(messageId: string, otp: string): boolean {
    const message = this.messages.get(messageId);
    if (!message) return false;
    if (message.expiresAt < new Date()) return false;
    return message.otp === otp;
  }

  public getMessageHistory(phoneNumber: string): MessageRecord[] {
    // If no phone number provided, return all messages
    if (!phoneNumber) {
      return Array.from(this.messages.values())
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    
    // Otherwise, filter by phone number
    return Array.from(this.messages.values())
      .filter(msg => msg.phoneNumber === phoneNumber)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
} 