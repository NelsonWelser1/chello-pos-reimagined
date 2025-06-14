
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Check, AlertTriangle, Clock, Package } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedItem?: string;
}

interface StockAlertNotificationsProps {
  onNotificationAction?: (notificationId: string, action: string) => void;
}

export default function StockAlertNotifications({ onNotificationAction }: StockAlertNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "critical",
      title: "Critical Stock Alert",
      message: "Chicken Breast will run out in 1 day. Immediate reorder required.",
      timestamp: new Date().toISOString(),
      isRead: false,
      actionRequired: true,
      relatedItem: "Chicken Breast"
    },
    {
      id: "2",
      type: "warning",
      title: "Low Stock Warning",
      message: "Fresh Tomatoes below minimum threshold (3kg remaining)",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
      actionRequired: true,
      relatedItem: "Fresh Tomatoes"
    },
    {
      id: "3",
      type: "info",
      title: "Supplier Delivery Confirmed",
      message: "Mediterranean Oils delivery scheduled for tomorrow",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: false,
      actionRequired: false,
      relatedItem: "Olive Oil"
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = (notification: Notification, action: string) => {
    if (action === 'reorder') {
      toast.success(`Reorder initiated for ${notification.relatedItem}`);
      onNotificationAction?.(notification.id, action);
    } else if (action === 'contact_supplier') {
      toast.info(`Contacting supplier for ${notification.relatedItem}`);
      onNotificationAction?.(notification.id, action);
    }
    markAsRead(notification.id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'info': return <Package className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto z-50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Stock Alerts</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${notification.isRead ? 'bg-gray-50' : 'bg-white border-l-4'} ${
                    notification.type === 'critical' ? 'border-l-red-500' :
                    notification.type === 'warning' ? 'border-l-orange-500' : 'border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                      
                      {notification.actionRequired && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleAction(notification, 'reorder')}
                            className="text-xs"
                          >
                            Reorder Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(notification, 'contact_supplier')}
                            className="text-xs"
                          >
                            Contact Supplier
                          </Button>
                        </div>
                      )}
                      
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs mt-2"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
