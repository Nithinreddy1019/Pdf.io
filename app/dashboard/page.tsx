import { Documents } from "./_components/documents";

export const dynamic = "force-dynamic";


const Dashboard = () => {
    return (
        <div className="h-full max-w-7xl mx-auto">
            <h1 className="text-xl font-semibold p-4">
                My documents
            </h1>

            <Documents />
        </div>
    );
}
 
export default Dashboard;