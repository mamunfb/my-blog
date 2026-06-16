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
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border-2 border-purple-300 dark:border-purple-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">Subscribe to Our Newsletter</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Get the latest articles delivered to your inbox. No spam, just great content.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubscribe} className="flex gap-2 flex-col sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="flex-1 border-2 border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 rounded-lg"
        />
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
        ✓ We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}
