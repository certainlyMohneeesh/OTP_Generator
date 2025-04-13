'use client'
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SMSService } from '@/services/sms';
import { ContactService } from '@/services/contacts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold">Message History</h1>
        <p className="text-gray-500">View all sent OTP messages</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-x-auto">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Contact</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="hidden md:table-cell">Message</TableHead>
                  <TableHead className="hidden lg:table-cell">Time Sent</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message, index) => (
                  <motion.tr
                    key={`${message.phoneNumber}-${message.timestamp}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="hidden sm:table-cell font-medium">
                      {message.contactName}
                    </TableCell>
                    <TableCell className="font-medium sm:font-normal">
                      {message.phoneNumber}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono">
                      {message.message}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {message.timestamp}
                    </TableCell>
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
                  </motion.tr>
                ))}
                {messages.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No messages sent yet
                    </TableCell>
                  </motion.tr>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
} 