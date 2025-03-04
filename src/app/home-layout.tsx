import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Transform your special moments into extraordinary experiences with Nigeria\'s leading event planning service.',
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
