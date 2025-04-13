'use client'
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SMSService } from '@/services/sms';
import { ContactService } from '@/services/contacts';
import { format } from 'date-fns';

interface MessageDisplay {
  contactName: string;
  phoneNumber: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
}

export default function MessagesPage() {
  const [messages, setMessages] = React.useState<MessageDisplay[]>([]);

  // Fetch messages periodically
  React.useEffect(() => {
    const fetchMessages = () => {
      const contactService = ContactService.getInstance();
      const smsService = SMSService.getInstance();

      // Get all messages
      const messageHistory = smsService.getMessageHistory('');

      // Map messages to contacts
      const formattedMessages = messageHistory.map(msg => {
        const contact = contactService.getContactByPhoneNumber(msg.phoneNumber);
        return {
          contactName: contact ? `${contact.firstName} ${contact.lastName}` : msg.phoneNumber,
          phoneNumber: msg.phoneNumber,
          message: msg.message,
          timestamp: format(msg.timestamp, 'MMM d, yyyy h:mm a'),
          status: msg.status
        };
      });

      setMessages(formattedMessages);
    };

    // Fetch immediately
    fetchMessages();

    // Then fetch every 5 seconds
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Message History</h1>
        <p className="text-gray-500">View all sent OTP messages</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Time Sent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message, index) => (
              <TableRow key={`${message.phoneNumber}-${message.timestamp}`}>
                <TableCell className="font-medium">
                  {message.contactName}
                </TableCell>
                <TableCell>{message.phoneNumber}</TableCell>
                <TableCell className="font-mono">{message.message}</TableCell>
                <TableCell>{message.timestamp}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    message.status === 'delivered' 
                      ? 'bg-green-100 text-green-800'
                      : message.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No messages sent yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 