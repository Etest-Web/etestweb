import {
  StatCardSkeleton,
  ListRowSkeleton,
  PageHeaderSkeleton,
} from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-8">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListRowSkeleton />
        <ListRowSkeleton />
      </div>
    </div>
  );
}
