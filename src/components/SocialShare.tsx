import React from 'react';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Currency Converter - Live Exchange Rates & Trading',
  description = 'Convert 150+ currencies with live rates. Free real-time forex calculator with crypto support, charts & alerts.',
  className = ''
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      
      {/* Native share button for mobile */}
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      )}

      {/* Social media buttons */}
      <button
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4 text-blue-600" />
      </button>

      <button
        onClick={() => openShareWindow(shareLinks.twitter)}
        className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4 text-sky-600" />
      </button>

      <button
        onClick={() => openShareWindow(shareLinks.linkedin)}
        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4 text-blue-700" />
      </button>

      <button
        onClick={() => openShareWindow(shareLinks.whatsapp)}
        className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4 text-green-600" />
      </button>
    </div>
  );
};

export default SocialShare;
