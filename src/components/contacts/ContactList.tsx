import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Contact } from '@/types';
import { ContactService } from '@/services/contacts';

export function ContactList() {
  const contacts = ContactService.getInstance().getAllContacts();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <Link key={contact.id} href={`/contacts/${contact.id}`}>
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {contact.firstName[0]}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-sm text-gray-500">{contact.phoneNumber}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 