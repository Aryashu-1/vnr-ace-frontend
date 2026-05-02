
import { PlacementsProvider } from "@/components/placements-provider";

export default function ApplicationPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PlacementsProvider>{children}</PlacementsProvider>;
}
