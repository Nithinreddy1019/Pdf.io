import { ClerkLoaded } from "@clerk/nextjs";
import { Header } from "./_components/header";

const DashboardLayout = ({
    children
}: {children: React.ReactNode}) => {
    return (
        <ClerkLoaded>
            <main className="h-screen flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </ClerkLoaded>
    );
}
 
export default DashboardLayout;