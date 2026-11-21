import { ServiceForm } from "@/components/dashboard/service-form";

export default function AddServicePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Add Service</h1>
            <p className="mb-6 mt-1 text-muted-foreground">
                Create a new salon service.
            </p>
            <ServiceForm />
        </div>
    );
}