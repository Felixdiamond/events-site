# Sparkling World Events

A premium event management and rental company website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern and elegant design
- 📱 Fully responsive layout
- ⚡ Fast page loads with Next.js App Router
- 🎭 Smooth animations with Framer Motion
- 🗺️ Google Maps integration
- 📸 Image gallery with lightbox
- 📝 Contact form with validation
- 🎯 SEO optimized

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Google Maps API
- Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- Bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sparklingworldevents.git
   cd sparklingworldevents
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
bun run build
```

To start the production server:
```bash
bun start
```

## Project Structure

```
src/
├── app/                 # App router pages
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── ui/             # UI components
│   ├── home/           # Home page components
│   ├── services/       # Services page components
│   ├── gallery/        # Gallery page components
│   └── contact/        # Contact page components
├── styles/             # Global styles
└── types/              # TypeScript types

public/
├── images/             # Static images
└── fonts/             # Custom fonts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Sparkling World Events
- Email: sparklingworldevents@gmail.com
- WhatsApp: +234 911 921 7578
- Instagram: @sparklingworldng
- Facebook: Sparkling World
