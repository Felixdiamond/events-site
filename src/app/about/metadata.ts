import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Sparkling World Events',
  description: 'Learn about our 7+ years of experience in event planning and decoration. Our professional team has executed over 500 successful events.',
  openGraph: {
    title: 'About Us | Sparkling World Events',
    description: 'Learn about our 7+ years of experience in event planning and decoration. Our professional team has executed over 500 successful events.',
    url: 'https://sparklingworldevents.com/about',
    siteName: 'Sparkling World Events',
    images: [
      {
        url: 'https://sparklingworldevents.com/images/about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'About Sparkling World Events Team',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Sparkling World Events',
    description: 'Learn about our 7+ years of experience in event planning and decoration. Our professional team has executed over 500 successful events.',
    images: ['https://sparklingworldevents.com/images/about-og.jpg'],
  },
};
