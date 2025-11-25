import { X, AlertCircle, Info, CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface NotificationBannerProps {
  type: "info" | "success" | "warning";
  title: string;
  message: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const notificationStyles = {
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-900",
    message: "text-blue-700",
    Icon: Info,
  },
  success: {
    container: "bg-green-50 border-green-200",
    icon: "text-green-600",
    title: "text-green-900",
    message: "text-green-700",
    Icon: CheckCircle,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200",
    icon: "text-yellow-600",
    title: "text-yellow-900",
    message: "text-yellow-700",
    Icon: AlertCircle,
  },
};

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  title,
  message,
  onDismiss,
  dismissible = true,
}) => {
  const style = notificationStyles[type];
  const IconComponent = style.Icon;

  return (
    <div className={cn("relative rounded-lg border p-4 mb-4", style.container)}>
      <div className="flex items-start gap-3">
        <IconComponent
          className={cn("h-5 w-5 mt-0.5 flex-shrink-0", style.icon)}
        />

        <div className="flex-1 min-w-0">
          <h3 className={cn("font-semibold text-sm", style.title)}>{title}</h3>
          <p className={cn("text-sm mt-1", style.message)}>{message}</p>
        </div>

        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
