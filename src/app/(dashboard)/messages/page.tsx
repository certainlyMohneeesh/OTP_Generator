'use client'
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SMSService } from '@/services/sms';
import { ContactService } from '@/services/contacts';
import { format } from 'date-fns';

export default function MessagesPage() {
  const [messages, setMessages] = React.useState<Array<{
    contactName: string;
    phoneNumber: string;
    message: string;
    timestamp: Date;
  }>>([]);

  React.useEffect(() => {
    // In a real application, this would fetch from a database
    const contactService = ContactService.getInstance();
    const smsService = SMSService.getInstance();

    const allMessages = contactService.getAllContacts().map(contact => {
      const message = smsService.getMessageHistory(contact.phoneNumber);
      if (message) {
        return {
          contactName: `${contact.firstName} ${contact.lastName}`,
          phoneNumber: contact.phoneNumber,
          message,
          timestamp: new Date() // In a real app, this would come from the database
        };
      }
      return null;
    }).filter(Boolean);

    setMessages(allMessages as any);
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {message.contactName}
                </TableCell>
                <TableCell>{message.phoneNumber}</TableCell>
                <TableCell className="font-mono">{message.message}</TableCell>
                <TableCell>
                  {format(message.timestamp, 'MMM d, yyyy h:mm a')}
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
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