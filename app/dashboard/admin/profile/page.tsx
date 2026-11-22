import { ProfileForm } from "@/components/dashboard/profile-form";

export default function AdminProfilePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="mb-6 mt-1 text-muted-foreground">
                Update your personal information.
            </p>
            <ProfileForm />
        </div>
    );
}