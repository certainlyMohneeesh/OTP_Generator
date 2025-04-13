import { notFound } from 'next/navigation';
import { ContactService } from '@/services/contacts';
import { ComposeForm } from '@/components/compose/ComposeForm';
import { use } from 'react';

interface ComposePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ComposePage({ params }: ComposePageProps) {
  const { id } = use(params);
  const contact = ContactService.getInstance().getContactById(id);

  if (!contact) {
    notFound();
  }

  return <ComposeForm contact={contact} />;
}