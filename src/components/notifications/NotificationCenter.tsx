'use client'

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, X } from 'lucide-react';
import { cn } from '@/utilities/ui';


export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification, clearNotifications } = useNotifications();

  return (
    <div className="fixed right-4 top-4 z-50 w-80">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
         
         
          {notifications.length > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {notifications.length}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearNotifications}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px] rounded-md border bg-background p-4">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg p-3',
                  {
                    'bg-blue-50 dark:bg-blue-950': notification.type === 'info',
                    'bg-green-50 dark:bg-green-950': notification.type === 'success',
                    'bg-yellow-50 dark:bg-yellow-950': notification.type === 'warning',
                    'bg-red-50 dark:bg-red-950': notification.type === 'error',
                  }
                )}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeNotification(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}; 