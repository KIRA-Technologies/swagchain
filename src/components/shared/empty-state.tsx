import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-muted p-5 sm:p-6 mb-4 sm:mb-6">
        <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-4 sm:mb-6 text-sm sm:text-base">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
