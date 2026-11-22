export function AuthShell({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto grid min-h-[80vh] max-w-6xl overflow-hidden lg:my-8 lg:grid-cols-2 lg:rounded-3xl lg:border lg:shadow-sm">
            <div className="relative hidden lg:block">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero.png')" }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/10" />
                <div className="relative flex h-full flex-col justify-end p-10 text-white">
                    <p className="text-3xl font-bold">SalonBook</p>
                    <p className="mt-2 max-w-sm text-white/85">
                        Look good. Feel great. Book your salon appointment in minutes.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center px-6 py-10 sm:px-10">
                <div className="w-full max-w-sm">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="mt-2 text-muted-foreground">{subtitle}</p>
                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}