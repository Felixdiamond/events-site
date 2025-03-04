import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our 7+ years of experience in event planning and decoration. Our professional team has executed over 500 successful events.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
