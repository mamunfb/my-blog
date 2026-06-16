/**
 * Social Sharing Tracker
 * Tracks social sharing metrics for blog posts
 */

export interface ShareMetrics {
  platform: "facebook" | "twitter" | "whatsapp" | "email" | "linkedin" | "reddit" | "telegram";
  shareCount: number;
  clickCount: number;
}

export class SocialSharingTracker {
  private postId: number;
  private metrics: Map<string, ShareMetrics> = new Map();

  constructor(postId: number) {
    this.postId = postId;
    this.loadMetrics();
  }

  private loadMetrics() {
    const stored = localStorage.getItem(`sharing-metrics-${this.postId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([platform, metrics]: [string, any]) => {
          this.metrics.set(platform, metrics);
        });
      } catch (e) {
        console.error("Failed to load sharing metrics", e);
      }
    }
  }

  private saveMetrics() {
    const data: Record<string, ShareMetrics> = {};
    this.metrics.forEach((metrics, platform) => {
      data[platform] = metrics;
    });
    localStorage.setItem(`sharing-metrics-${this.postId}`, JSON.stringify(data));
  }

  trackShare(platform: ShareMetrics["platform"]) {
    const current = this.metrics.get(platform) || {
      platform,
      shareCount: 0,
      clickCount: 0,
    };
    current.shareCount++;
    this.metrics.set(platform, current);
    this.saveMetrics();

    // Send to server
    this.sendToServer(platform, "share");
  }

  trackClick(platform: ShareMetrics["platform"]) {
    const current = this.metrics.get(platform) || {
      platform,
      shareCount: 0,
      clickCount: 0,
    };
    current.clickCount++;
    this.metrics.set(platform, current);
    this.saveMetrics();

    // Send to server
    this.sendToServer(platform, "click");
  }

  private sendToServer(platform: string, action: "share" | "click") {
    // Send to server via fetch (implement your API endpoint)
    fetch("/api/track-sharing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: this.postId,
        platform,
        action,
      }),
    }).catch((error) => console.error("Failed to track sharing", error));
  }

  getMetrics() {
    const result: Record<string, ShareMetrics> = {};
    this.metrics.forEach((metrics, platform) => {
      result[platform] = metrics;
    });
    return result;
  }

  getTotalShares() {
    let total = 0;
    this.metrics.forEach((metrics) => {
      total += metrics.shareCount;
    });
    return total;
  }

  getMostSharedPlatform() {
    let maxPlatform = "";
    let maxShares = 0;
    this.metrics.forEach((metrics) => {
      if (metrics.shareCount > maxShares) {
        maxShares = metrics.shareCount;
        maxPlatform = metrics.platform;
      }
    });
    return maxPlatform;
  }
}

// Helper function to generate share URLs
export function generateShareUrl(
  platform: ShareMetrics["platform"],
  postUrl: string,
  postTitle: string,
  postExcerpt: string
): string {
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(postTitle);
  const encodedExcerpt = encodeURIComponent(postExcerpt);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case "email":
      return `mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0A${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "reddit":
      return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    default:
      return postUrl;
  }
}
