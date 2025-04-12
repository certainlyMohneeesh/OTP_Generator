import React from 'react';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContactService } from '@/services/contacts';
import Link from 'next/link';

interface ContactDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ContactDetailsPage({ params }: ContactDetailsPageProps) {
  const contact = ContactService.getInstance().getContactById(params.id);

  if (!contact) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-semibold text-gray-600">
                {contact.firstName[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {contact.firstName} {contact.lastName}
              </h1>
              <p className="text-gray-500">{contact.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Phone Number</h2>
              <p className="text-lg">{contact.phoneNumber}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link href={`/contacts/${contact.id}/compose`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Send OTP Message
              </Button>
            </Link>
            <Link href="/contacts">
              <Button variant="outline">Back to Contacts</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
} 