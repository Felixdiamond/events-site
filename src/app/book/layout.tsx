import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Our Services',
  description: 'Ready to book your event? Fill out our booking form to secure our services for your special occasion. Fast and easy booking process.',
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
