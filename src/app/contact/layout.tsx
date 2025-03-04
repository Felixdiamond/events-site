import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our events planning team. Send us a message, call us, or visit our office to discuss your event needs.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
