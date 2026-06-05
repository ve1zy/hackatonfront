"use client";

import * as React from "react";
import { Root, Trigger, Content, Title, Description, Close } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = Root;
export const DialogTrigger = Trigger;
export const DialogClose = Close;

export type DialogContentProps = React.ComponentPropsWithoutRef<typeof Content>;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  DialogContentProps
>(({ className, children, ...props }, ref) => (
  <Content
    ref={ref}
    className={cn(
      "fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-48 data-[state=open]:slide-in-from-bottom-48 sm:rounded-lg",
      className
    )}
    {...props}
  >
    {children}
  </Content>
));
DialogContent.displayName = Content.displayName;

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogHeader = ({
  className,
  ...props
}: DialogHeaderProps) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogFooter = ({
  className,
  ...props
}: DialogFooterProps) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export type DialogTitleProps = React.ComponentPropsWithoutRef<typeof Title>;

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = Title.displayName;

export type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof Description>;

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = Description.displayName;