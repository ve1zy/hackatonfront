import * as React from "react";
import { Root } from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof Root>;

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <Check className="h-4 w-4 hidden peer-data-[state=checked]:block" />
  </Root>
));
Checkbox.displayName = Root.displayName;