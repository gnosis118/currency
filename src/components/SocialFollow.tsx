import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const SocialFollow: React.FC<{ className?: string }> = ({ className = '' }) => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/currencytocurrency',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 hover:bg-blue-200'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/currencytocurrency',
      icon: Twitter,
      color: 'text-sky-600',
      bgColor: 'bg-sky-100 hover:bg-sky-200'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/currencytocurrency',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100 hover:bg-blue-200'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/currencytocurrency',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 hover:bg-pink-200'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@currencytocurrency',
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-100 hover:bg-red-200'
    }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Follow us:</span>
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full ${social.bgColor} transition-colors`}
            aria-label={`Follow us on ${social.name}`}
          >
            <IconComponent className={`h-4 w-4 ${social.color}`} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialFollow;
