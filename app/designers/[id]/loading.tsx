import { Skeleton } from "@/components/ui/skeleton";

export default function DesignerProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-[#1a1610] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <Skeleton className="h-5 w-36" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 animate-pulse">
              <div className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-7 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="my-6 border-y border-white/[0.06]" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <div className="mt-8 space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
