import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Gallery',
  description: 'Browse our gallery of beautifully decorated events. Get inspired by our previous work for weddings, birthdays, corporate events, and more.',
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
