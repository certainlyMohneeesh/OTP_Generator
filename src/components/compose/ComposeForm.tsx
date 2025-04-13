'use client'
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SMSService } from '@/services/sms';
import Link from 'next/link';
import type { Contact } from '@/types';

interface ComposeFormProps {
  contact: Contact;
}

export function ComposeForm({ contact }: ComposeFormProps) {
  const [isSending, setIsSending] = React.useState(false);
  const [otp, setOtp] = React.useState<string>('');
  const [messageId, setMessageId] = React.useState<string>('');
  const [timeLeft, setTimeLeft] = React.useState<number>(0);
  const [status, setStatus] = React.useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Check message status periodically
  React.useEffect(() => {
    if (!messageId) return;

    const checkStatus = () => {
      const response = SMSService.getInstance().getMessageStatus(messageId);
      if (response.status === 'failed') {
        setStatus({
          type: 'error',
          message: response.error || 'Message failed to deliver'
        });
      } else if (response.status === 'delivered') {
        setStatus({
          type: 'success',
          message: 'Message delivered successfully!'
        });
      }
    };

    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [messageId]);

  // OTP expiration timer
  React.useEffect(() => {
    if (!messageId || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus({
            type: 'error',
            message: 'OTP has expired'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [messageId, timeLeft]);

  const handleSendMessage = () => {
    const sendMessage = async () => {
      try {
        setIsSending(true);
        const newOtp = generateOTP();
        setOtp(newOtp);

        const message = `Your OTP is: ${newOtp}. This code will expire in 5 minutes.`;
        const response = await SMSService.getInstance().sendSMS(
          contact.phoneNumber,
          message,
          newOtp
        );

        if (response.success && response.messageId) {
          setMessageId(response.messageId);
          setTimeLeft(300); // 5 minutes in seconds
          setStatus({
            type: 'success',
            message: 'Message sent successfully!'
          });
        } else {
          setStatus({
            type: 'error',
            message: response.error || 'Failed to send message'
          });
        }
      } catch (error) {
        setStatus({
          type: 'error',
          message: 'An error occurred while sending the message'
        });
      } finally {
        setIsSending(false);
      }
    };

    sendMessage();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Send OTP Message</h1>
            <p className="text-gray-500 mt-2">
              Sending to: {contact.firstName} {contact.lastName}
            </p>
          </div>

          <div className="space-y-4">
            {otp && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  OTP: <span className="font-mono">{otp}</span>
                  {timeLeft > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      Expires in: {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </p>
              </div>
            )}

            {status && (
              <div
                className={`p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleSendMessage}
                disabled={isSending || (timeLeft > 0)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSending ? 'Sending...' : timeLeft > 0 ? 'Wait for OTP to expire' : 'Send Message'}
              </Button>
              <Link href={`/contacts/${contact.id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}