import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Check } from "lucide-react";
import { toast } from "sonner";

export default function PushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if browser supports push notifications
    const supported =
      "serviceWorker" in navigator && "PushManager" in window;
    setIsSupported(supported);

    if (supported) {
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const handleToggleNotifications = async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported in your browser");
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
        });

        // Send subscription to server
        await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        setIsSubscribed(true);
        toast.success("Push notifications enabled!");
      } else if (permission === "denied") {
        toast.error("Push notifications permission denied");
      }
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      toast.error("Failed to enable push notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        toast.success("Push notifications disabled");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast.error("Failed to disable push notifications");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={
        isSubscribed ? handleUnsubscribe : handleToggleNotifications
      }
      disabled={isLoading}
      className="gap-2"
    >
      {isSubscribed ? (
        <>
          <Check className="w-4 h-4" />
          Notifications On
        </>
      ) : (
        <>
          <Bell className="w-4 h-4" />
          Enable Notifications
        </>
      )}
    </Button>
  );
}
