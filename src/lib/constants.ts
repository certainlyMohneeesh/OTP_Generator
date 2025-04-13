import { Contact } from '@/types';

export const SAMPLE_CONTACTS: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+919810153260',
    email: 'john.doe@example.com'
  },
  {
    id: '2',
    firstName: 'Chemical',
    lastName: 'Myth',
    phoneNumber: '+917498147939',
    email: 'jane.smith@example.com'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    phoneNumber: '+919810153262',
    email: 'robert.johnson@example.com'
  }
];

export const NAV_ITEMS = [
  {
    title: 'Contacts',
    href: '/contacts',
    icon: 'users'
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: 'message-square'
  }
];