import React from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface MessageCardProps {
  contactName: string;
  phoneNumber: string;
  message: string;
  timestamp: Date;
}

export function MessageCard({ contactName, phoneNumber, message, timestamp }: MessageCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{contactName}</h3>
            <p className="text-sm text-gray-500">{phoneNumber}</p>
          </div>
          <span className="text-sm text-gray-500">
            {format(timestamp, 'MMM d, yyyy h:mm a')}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="font-mono text-sm">{message}</p>
        </div>
      </div>
    </Card>
  );
} 