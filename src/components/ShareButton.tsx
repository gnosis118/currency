import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  convertedAmount: string;
  rate: string;
}

export const ShareButton = ({ fromCurrency, toCurrency, amount, convertedAmount, rate }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = `💰 ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency} (Rate: ${rate}) - Convert currencies instantly at Currency to Currency! 🚀`;
  const shareUrl = `${window.location.origin}`;

  const handleShare = async (platform: string) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    };

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'Currency Conversion',
          text: shareText,
          url: shareUrl,
        });
        toast({ description: "Shared successfully!" });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareText + ' ' + shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ description: "Copied to clipboard!" });
      } catch (error) {
        toast({ description: "Failed to copy", variant: "destructive" });
      }
    } else if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  if (navigator.share) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('native')}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare('copy')} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-2">
          <div className="h-4 w-4 bg-[#1DA1F2] rounded" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')} className="gap-2">
          <div className="h-4 w-4 bg-[#4267B2] rounded" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="gap-2">
          <div className="h-4 w-4 bg-[#25D366] rounded" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('telegram')} className="gap-2">
          <div className="h-4 w-4 bg-[#0088CC] rounded" />
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')} className="gap-2">
          <div className="h-4 w-4 bg-[#0077B5] rounded" />
          LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};