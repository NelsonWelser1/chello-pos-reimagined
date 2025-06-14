
import StockAlertNotifications from "@/components/stock-alert/StockAlertNotifications";

interface StockAlertHeaderProps {
  onNotificationAction: (notificationId: string, action: string) => void;
}

export default function StockAlertHeader({ onNotificationAction }: StockAlertHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-4">
            🚨 Smart Stock Alert System
          </h1>
          <p className="text-xl text-gray-600 mt-4 font-medium">
            AI-powered inventory monitoring and predictive analytics with full system integration
          </p>
        </div>
        <StockAlertNotifications onNotificationAction={onNotificationAction} />
      </div>
    </div>
  );
}
