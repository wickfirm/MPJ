'use client'

function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`}>&nbsp;</div>
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-mpj-purple px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <SkeletonBlock className="h-6 w-64 mb-2 !bg-white/20" />
            <SkeletonBlock className="h-4 w-48 !bg-white/10" />
          </div>
          <div className="flex gap-3">
            <SkeletonBlock className="h-9 w-32 !bg-white/20 rounded-lg" />
            <SkeletonBlock className="h-9 w-28 !bg-white/20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex gap-4 px-6 py-3">
          {[1, 2, 3, 4].map(i => (
            <SkeletonBlock key={i} className="h-8 w-32 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100">
              <SkeletonBlock className="h-3 w-20 mb-3" />
              <SkeletonBlock className="h-8 w-32" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <SkeletonBlock className="h-12 w-full !rounded-none" />
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <SkeletonBlock key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>

        {/* Charts skeleton */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <SkeletonBlock className="h-4 w-40 mb-4" />
            <SkeletonBlock className="h-48 w-full" />
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <SkeletonBlock className="h-4 w-40 mb-4" />
            <SkeletonBlock className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBlock key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
