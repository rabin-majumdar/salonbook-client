import { ProfileForm } from "@/components/dashboard/profile-form";

export default function AdminProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    My Profile
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Update your personal information and avatar.
                </p>
            </div>

            <ProfileForm />
        </div>
    );
}