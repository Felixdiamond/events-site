import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Discover our professional event decoration and planning services. From weddings to corporate events, we offer comprehensive solutions for every occasion.',
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
