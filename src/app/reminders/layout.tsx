import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Reminders',
  description: 'Set up reminders for upcoming events. Never miss an important occasion with our convenient event reminder service.',
};

export default function RemindersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
