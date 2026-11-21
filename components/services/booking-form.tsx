"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { TIME_SLOTS } from "@/constants/time-slots";
import { Button } from "@/components/ui/button";

function todayLocal() {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type BookedState = { date: string; slots: string[] };

export function BookingForm({ serviceId }: { serviceId: string }) {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const [message, setMessage] = useState("");
    const [booked, setBooked] = useState<BookedState>({ date: "", slots: [] });
    const [submitting, setSubmitting] = useState(false);
    const loadingSlots = !!date && booked.date !== date;
    const bookedSlots = booked.date === date ? booked.slots : [];

    useEffect(() => {
        if (!date) return;
        let cancelled = false;

        apiFetch<{ bookedSlots: string[] }>(`/api/appointments/booked?date=${date}`, {
            auth: true,
        })
            .then((r) => {
                if (!cancelled) setBooked({ date, slots: r.bookedSlots });
            })
            .catch((e) => {
                if (cancelled) return;
                toast.error(e.message);
                setBooked({ date, slots: [] });
            });

        return () => {
            cancelled = true;
        };
    }, [date]);

    function handleDateChange(value: string) {
        setDate(value);
        setSlot("");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!date) return toast.error("Please choose a date");
        if (!slot) return toast.error("Please choose a time slot");

        setSubmitting(true);
        try {
            await apiFetch("/api/appointments", {
                method: "POST",
                auth: true,
                body: JSON.stringify({
                    serviceId,
                    appointmentDate: date,
                    timeSlot: slot,
                    message: message.trim() || undefined,
                }),
            });
            toast.success("Appointment request sent. Waiting for confirmation.");
            router.push("/dashboard");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Booking failed");
            apiFetch<{ bookedSlots: string[] }>(`/api/appointments/booked?date=${date}`, {
                auth: true,
            })
                .then((r) => setBooked({ date, slots: r.bookedSlots }))
                .catch(() => { });
            setSlot("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border p-5">
            <h2 className="text-xl font-semibold">Book an appointment</h2>

            <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                    Appointment date
                </label>
                <input
                    id="date"
                    type="date"
                    min={todayLocal()}
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                    required
                />
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium">Available time slots</p>
                {!date ? (
                    <p className="text-sm text-muted-foreground">Choose a date first.</p>
                ) : loadingSlots ? (
                    <p className="text-sm text-muted-foreground">Checking availability...</p>
                ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TIME_SLOTS.map((t) => {
                            const isBooked = bookedSlots.includes(t);
                            const selected = slot === t;
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => setSlot(t)}
                                    className={`h-10 rounded-lg border text-sm transition ${selected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                        } ${isBooked ? "cursor-not-allowed opacity-40 line-through" : ""}`}
                                >
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                    Additional message (optional)
                </label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending request..." : "Request Appointment"}
            </Button>
        </form>
    );
}