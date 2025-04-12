'use client'
import React from 'react';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContactService } from '@/services/contacts';
import { SMSService } from '@/services/sms';
import Link from 'next/link';
import { SMS_TEMPLATE } from '@/lib/sms-templates';
interface ComposePageProps {
  params: {
    id: string;
  };
}

export default function ComposePage({ params }: ComposePageProps) {
  const contact = ContactService.getInstance().getContactById(params.id);
  const [isSending, setIsSending] = React.useState(false);
  const [otp, setOtp] = React.useState<string>('');
  const [status, setStatus] = React.useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  if (!contact) {
    notFound();
  }

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendMessage = async () => {
    try {
      setIsSending(true);
      const newOtp = generateOTP();
      setOtp(newOtp);
      const message = SMS_TEMPLATE.replace('{otp}', newOtp);

      const response = await SMSService.getInstance().sendSMS(
        contact.phoneNumber,
        message
      );

      if (response.success) {
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
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Hi. Your OTP is: <span className="font-mono">{otp}</span>
              </p>
            </div>

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
                disabled={isSending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSending ? 'Sending...' : 'Send Message'}
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