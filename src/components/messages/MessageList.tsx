import React from 'react';
import { MessageCard } from './MessageCard';

interface Message {
  id: string;
  contactName: string;
  phoneNumber: string;
  message: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No messages found
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id}>
            <MessageCard
              contactName={message.contactName}
              phoneNumber={message.phoneNumber}
              message={message.message}
              timestamp={message.timestamp}
            />
          </div>
        ))
      )}
    </div>
  );
} 