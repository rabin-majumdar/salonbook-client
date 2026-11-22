"use client";

import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = Omit<React.ComponentProps<"input">, "type"> & {
    id: string;
    label: string;
    icon: LucideIcon;
    type?: string;
};

export function AuthInput({
    id,
    label,
    icon: Icon,
    type = "text",
    className,
    ...props
}: Props) {
    const isPassword = type === "password";
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id={id}
                    type={isPassword && show ? "text" : type}
                    className={`h-11 pl-10 ${isPassword ? "pr-11" : ""} ${className ?? ""}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        aria-label={show ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}