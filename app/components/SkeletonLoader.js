'use client'

function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`}>&nbsp;</div>
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-mpj-bone">
      {/* Header */}
      <div className="header-gradient px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <SkeletonBlock className="h-5 w-56 mb-2 !bg-white/20 !rounded-lg" />
            <SkeletonBlock className="h-3.5 w-44 !bg-white/10 !rounded-md" />
          </div>
          <div className="flex gap-2">
            <SkeletonBlock className="h-8 w-24 !bg-white/20 !rounded-xl" />
            <SkeletonBlock className="h-8 w-20 !bg-white/20 !rounded-xl" />
            <SkeletonBlock className="h-8 w-8 !bg-white/20 !rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex gap-1 px-6 py-2">
          {[1, 2].map(i => (
            <SkeletonBlock key={i} className="h-8 w-28 !rounded-xl" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-5">
        {/* Selector bar */}
        <div className="bg-white p-4 rounded-card border border-gray-100 shadow-card flex gap-4">
          <SkeletonBlock className="h-10 w-48 !rounded-xl" />
          <SkeletonBlock className="h-10 w-56 !rounded-xl" />
        </div>

        {/* Notes box */}
        <div className="bg-white p-4 rounded-card border border-gray-100 shadow-card">
          <SkeletonBlock className="h-3.5 w-32 mb-3 !rounded-md" />
          <SkeletonBlock className="h-16 w-full !rounded-xl" />
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-5 rounded-card border border-gray-100 shadow-card">
              <div className="flex justify-between mb-3">
                <SkeletonBlock className="h-3 w-20 !rounded-md" />
                <SkeletonBlock className="h-8 w-8 !rounded-xl" />
              </div>
              <SkeletonBlock className="h-7 w-28 !rounded-lg" />
              <SkeletonBlock className="h-3 w-16 mt-2 !rounded-md" />
            </div>
          ))}
        </div>

        {/* Section */}
        <div className="bg-white rounded-card border border-gray-100 shadow-card overflow-hidden">
          <SkeletonBlock className="h-12 w-full !rounded-none !bg-white/20" />
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 items-center">
                <SkeletonBlock className="h-9 w-9 flex-shrink-0 !rounded-xl" />
                <SkeletonBlock className="h-4 flex-1 !rounded-lg" />
                <SkeletonBlock className="h-4 w-20 !rounded-lg" />
                <SkeletonBlock className="h-4 w-16 !rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBlock key={j} className={`h-8 flex-1 !rounded-lg ${j === 0 ? 'flex-[2]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
