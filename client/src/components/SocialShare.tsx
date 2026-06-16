import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface SocialShareProps {
  title: string;
  url: string;
  className?: string;
}

export default function SocialShare({ title, url, className = "" }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-foreground/70 flex items-center gap-1">
        <Share2 className="w-4 h-4" />
        Share:
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnFacebook}
        title="Share on Facebook"
        className="hover:bg-blue-50 dark:hover:bg-blue-950"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        title="Share on Twitter"
        className="hover:bg-sky-50 dark:hover:bg-sky-950"
      >
        <Twitter className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOnLinkedIn}
        title="Share on LinkedIn"
        className="hover:bg-blue-100 dark:hover:bg-blue-900"
      >
        <Linkedin className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        title="Copy link"
        className={copied ? "bg-green-50 dark:bg-green-950" : ""}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
}
