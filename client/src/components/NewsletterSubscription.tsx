import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate subscription (in production, this would call an API)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail("");
      toast.success("Successfully subscribed to our newsletter!");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-accent-foreground" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Thank you for subscribing!</h3>
        <p className="text-foreground/70">
          Check your email for a confirmation and stay tuned for our latest articles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-foreground/70">
            Get the latest articles delivered directly to your inbox. No spam, just great content.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubscribe} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="px-6"
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>

      <p className="text-xs text-foreground/60 mt-3">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
