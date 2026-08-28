import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-lg bg-white/[0.07]", className)}
      {...props}
    />
  )
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1610] p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-6 w-8 rounded-full" />
      </div>
      <Skeleton className="mb-2 h-9 w-20" />
      <Skeleton className="h-4 w-28" />
    </div>
  )
}

function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1610] p-6">
      <div className="flex items-center gap-3 pb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="space-y-2 pb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  )
}

function DesignerCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1610]">
      <div className="flex items-center gap-3 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

function ListRowSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1610] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-md" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  )
}

function PageHeaderSkeleton() {
  return (
    <div className="mb-8 space-y-3">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-80" />
    </div>
  )
}

export {
  Skeleton,
  StatCardSkeleton,
  JobCardSkeleton,
  DesignerCardSkeleton,
  ListRowSkeleton,
  PageHeaderSkeleton,
}
