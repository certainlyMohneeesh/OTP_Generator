import { Contact } from '@/types';
import { SAMPLE_CONTACTS } from '@/lib/constants';

export class ContactService {
  private static instance: ContactService;
  private contacts: Contact[];

  private constructor() {
    this.contacts = SAMPLE_CONTACTS;
  }

  public static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  public getAllContacts(): Contact[] {
    return this.contacts;
  }

  public getContactById(id: string): Contact | undefined {
    return this.contacts.find(contact => contact.id === id);
  }

  public getContactByPhoneNumber(phoneNumber: string): Contact | undefined {
    return this.contacts.find(contact => contact.phoneNumber === phoneNumber);
  }
} 