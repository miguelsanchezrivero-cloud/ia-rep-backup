import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

export function Card({
  children,
  className,
  interactive = false,
  onClick,
}: PropsWithChildren<{
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-200/80 bg-white shadow-sm shadow-ink-900/5",
        interactive &&
          "cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: PropsWithChildren<{
  tone?: "neutral" | "brand" | "success" | "warn" | "danger";
}>) {
  const tones = {
    neutral: "bg-ink-100 text-ink-700",
    brand: "bg-brand-100 text-brand-800",
    success: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-900",
    danger: "bg-rose-100 text-rose-800",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    primary:
      "bg-brand-700 text-white hover:bg-brand-800 shadow-sm shadow-brand-900/10",
    secondary: "bg-ink-900 text-white hover:bg-ink-800",
    ghost: "bg-transparent text-ink-700 hover:bg-ink-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    outline: "border border-ink-200 bg-white text-ink-800 hover:bg-ink-50",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none ring-brand-500/30 placeholder:text-ink-400 focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none ring-brand-500/30 placeholder:text-ink-400 focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none ring-brand-500/30 focus:ring-2",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ children }: PropsWithChildren) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
      {children}
    </label>
  );
}

export function Stat({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-900">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
        </div>
        {icon ? (
          <div className="rounded-xl bg-brand-50 p-2 text-brand-700">
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function Empty({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center">
      <p className="font-medium text-ink-700">{title}</p>
      {subtitle ? (
        <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-900 md:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm text-ink-500">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

// Modal Component
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  className,
}: PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions?: ReactNode;
  className?: string;
}>) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Fondo de pantalla / Backdrop con difuminado */}
      <div
        className="fixed inset-0 bg-transparent backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del Modal */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 my-auto",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-ink-100 pb-3">
          {title ? (
            <h2 className="text-lg font-bold text-ink-900">{title}</h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4">{children}</div>

        {actions ? (
          <div className="mt-6 flex flex-wrap gap-2 justify-end">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}

// Drawer Component (Right slide-over)
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  action,
}: PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  action?: ReactNode;
}>) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink-900/50 transition-opacity duration-350"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-sm transform bg-white shadow-2xl transition-all duration-350",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-96 opacity-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-6 py-4">
            {title ? (
              <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
            ) : null}
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-ink-500 hover:bg-ink-100 transition-colors"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          {action ? (
            <div className="border-t border-ink-100 px-6 py-4">{action}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ConfirmDialog Component (Modal variant for destructive actions)
export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isDangerous = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isDangerous?: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {description && <p className="text-sm text-ink-600">{description}</p>}
      <div className="mt-4 flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          variant={isDangerous ? "danger" : "primary"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

// Popover Component (Hover/click tooltip)
export function Popover({
  trigger,
  content,
  side = "top",
}: {
  trigger: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}) {
  const positions = {
    top: "bottom-full mb-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
  };

  return (
    <div className="group relative inline-block">
      {trigger}
      <div
        className={cn(
          "pointer-events-none absolute z-50 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100",
          positions[side],
        )}
      >
        <div className="rounded-xl bg-ink-900 px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap">
          {content}
        </div>
      </div>
    </div>
  );
}
