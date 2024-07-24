import { ClerkLoaded } from "@clerk/nextjs";
import { Header } from "./_components/header";

const DashboardLayout = ({
    children
}: {children: React.ReactNode}) => {
    return (
        <ClerkLoaded>
            <main className="h-screen">
                <Header />
                {children}
            </main>
        </ClerkLoaded>
    );
}
 
export default DashboardLayout;