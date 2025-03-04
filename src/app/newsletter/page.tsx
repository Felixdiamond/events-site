import NewsletterSignup from '@/components/common/NewsletterSignup';

export default function Newsletter() {
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent mb-4">
            Stay Connected
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about upcoming events, 
            special promotions, and exclusive content.
          </p>
        </div>
        
        {/* Newsletter Signup Form */}
        <div className="mt-12">
          <NewsletterSignup />
        </div>
        
        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Event Alerts</h3>
            <p className="text-white/70">
              Be the first to know about upcoming events and secure your spot before tickets sell out.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Exclusive Offers</h3>
            <p className="text-white/70">
              Receive special promotions and discounts available only to our newsletter subscribers.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Event Tips</h3>
            <p className="text-white/70">
              Get expert advice and inspiration for planning your next event or celebration.
            </p>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">How often will I receive newsletters?</h3>
              <p className="text-white/70">
                We send newsletters once or twice a month, with additional special announcements for major events.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Can I customize what types of updates I receive?</h3>
              <p className="text-white/70">
                Yes, you can select your preferences when signing up, and you can update them at any time.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">How do I unsubscribe?</h3>
              <p className="text-white/70">
                Every newsletter includes an unsubscribe link at the bottom. You can also contact us directly to be removed from our mailing list.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 