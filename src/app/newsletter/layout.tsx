import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Subscribe to our newsletter to stay updated with our latest events, offers, and event planning tips.',
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
