import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  MessageCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { SocialSharingTracker } from "@/lib/socialSharingTracker";
import { trpc } from "@/lib/trpc";

interface EnhancedSocialShareProps {
  postId?: number;
  title: string;
  url: string;
  excerpt?: string;
}

export default function EnhancedSocialShare({
  postId,
  title,
  url,
  excerpt = "",
}: EnhancedSocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0A${encodedUrl}`,
  };

  const [tracker, setTracker] = useState<SocialSharingTracker | null>(null);
  const trackEngagement = trpc.blog.trackEngagement.useMutation();

  // Extract post ID from URL (assumes URL format like /blog/post-slug)
  const getPostId = () => {
    const match = url.match(/\/(\d+)/);
    return postId || (match ? parseInt(match[1], 10) : 1);
  };

  useEffect(() => {
    setTracker(new SocialSharingTracker(getPostId()));
  }, [url, postId]);

  const handleShare = (platform: string, link: string) => {
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      tracker?.trackShare("email"); // Track as email share
      if (postId) {
        trackEngagement.mutate({ postId, eventType: "share", platform: "copy" });
      }
      toast.success("Link copied to clipboard!");
      return;
    }

    // Track the share
    tracker?.trackShare(platform as any);
    if (postId) {
      trackEngagement.mutate({
        postId,
        eventType: "share",
        platform,
      });
    }
    window.open(link, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-foreground/70 font-medium">Share:</span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook", shareLinks.facebook)}
        className="gap-2"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter", shareLinks.twitter)}
        className="gap-2"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin", shareLinks.linkedin)}
        className="gap-2"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("whatsapp", shareLinks.whatsapp)}
        className="gap-2"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("telegram", shareLinks.telegram)}
        className="gap-2"
        title="Share on Telegram"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Telegram</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("email", shareLinks.email)}
        className="gap-2"
        title="Share via Email"
      >
        <Mail className="w-4 h-4" />
        <span className="hidden sm:inline">Email</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("copy", "")}
        className="gap-2"
        title="Copy link to clipboard"
      >
        <Link2 className="w-4 h-4" />
        <span className="hidden sm:inline">Copy</span>
      </Button>
    </div>
  );
}
