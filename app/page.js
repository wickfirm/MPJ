'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, BarChart3, Calendar, TrendingUp, Megaphone, ExternalLink, Users, Lightbulb, RefreshCw, LogOut, DollarSign, ShoppingBag, Target, Upload, Image as ImageIcon, Eye, MousePointerClick, Percent, Instagram, MessageSquare } from 'lucide-react'
import { LineChart as ReLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

import CollapsibleSection from './components/CollapsibleSection'
import DeltaBadge from './components/DeltaBadge'
import KPICard from './components/KPICard'
import AdSetRow from './components/AdSetRow'
import Toast from './components/Toast'
import ErrorState from './components/ErrorState'
import { DashboardSkeleton } from './components/SkeletonLoader'
import CreativeThumb from './components/CreativeThumb'
import CreativeUpload from './components/CreativeUpload'
import CreativeGallery from './components/CreativeGallery'
import SocialMediaInsights from './components/SocialMediaInsights'

// ── Constants ────────────────────────────────
const COLORS = ['#76527c', '#d8ee91', '#D0E4E7', '#9f7aea', '#68d391', '#fc8181']
const AUTO_REFRESH_MS = 5 * 60 * 1000 // 5 minutes

const SLA_DATA = [
  { type: 'Monthly Report - GM', timeline: '5 working days after receiving the 7rooms report once the month is over' },
  { type: 'Monthly Report - Internal', timeline: '5 working days after receiving the 7rooms report once the month is over' },
  { type: 'Weekly Report', timeline: '2 working days after receiving the 7rooms report. For Thursday meetings, reports must be sent by Monday 10 AM' },
  { type: 'Influencer Report', timeline: '7 working days after the influencer launches the campaign, to allow time for content reach' },
  { type: 'AEO/SEO Report', timeline: '3-5 working days once the month is over' },
  { type: 'Influencer Media Plans', timeline: '3-5 working days depending on seasonality and number of influencers' },
  { type: 'Online/Offline Media Plans', timeline: '3-5 working days depending on seasonality, number of verticals, and budget' }
]

// ── Helpers ──────────────────────────────────
const formatNum = (n) => n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'
const formatInt = (n) => n?.toLocaleString('en-US') || '0'
const formatK = (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n
const calcAvgSpend = (rev, res) => res > 0 ? (rev / res).toFixed(2) : '0.00'

// ── Main Dashboard ───────────────────────────
export default function Dashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Data state
  const [activeTab, setActiveTab] = useState('workspace')
  const [venues, setVenues] = useState([])
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [previousWeek, setPreviousWeek] = useState(null)
  const [weeklyReports, setWeeklyReports] = useState({})
  const [allWeeks, setAllWeeks] = useState([])
  const [liveCampaigns, setLiveCampaigns] = useState({})
  const [workspaceData, setWorkspaceData] = useState([])
  const [workspaceMonths, setWorkspaceMonths] = useState([])
  const [selectedBudgetMonth, setSelectedBudgetMonth] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [expandedAdSets, setExpandedAdSets] = useState({})
  const [liveCampaignVenue, setLiveCampaignVenue] = useState('')
  const [adCreatives, setAdCreatives] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [socialMediaData, setSocialMediaData] = useState([])
  const [adNotes, setAdNotes] = useState({})         // { "venueId_weekKey_adName": "note text" }
  const [savingNote, setSavingNote] = useState(null)  // key of note currently saving
  const [venueNotes, setVenueNotes] = useState({})   // { "venueId_weekKey": "note text" }
  const [savingVenueNote, setSavingVenueNote] = useState(false)

  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [toast, setToast] = useState(null)

  // ── Auth check ───────────────────────────
  useEffect(() => {
    const auth = sessionStorage.getItem('mpj_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      window.location.href = '/login'
    }
    setAuthChecked(true)
  }, [])

  // ── Data fetching ────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    if (!isRefresh) setLoading(true)
    setError(null)

    try {
      const [venuesRes, reportsRes, campaignsRes, workspaceRes, monthlyRes, creativesRes, socialRes, adNotesRes] = await Promise.all([
        supabase.from('venues').select('*').order('name'),
        supabase.from('weekly_reports').select('*, venues(name, poc)').order('week_end', { ascending: false }),
        supabase.from('live_campaigns').select('*, venues(name)'),
        supabase.from('workspace_budgets').select('*').order('month').order('brand'),
        supabase.from('monthly_rollups').select('*').order('month'),
        supabase.from('ad_creatives').select('*, venues(name)').order('created_at', { ascending: false }),
        supabase.from('social_media_monthly').select('*, venues(name)').order('month', { ascending: false }),
        supabase.from('ad_notes').select('*'),
      ])

      // Check for errors
      const errors = [venuesRes, reportsRes, campaignsRes, workspaceRes, monthlyRes, creativesRes, socialRes, adNotesRes]
        .filter(r => r.error)
        .map(r => r.error.message)

      if (errors.length > 0) {
        throw new Error(errors.join('; '))
      }

      // Process venues
      const venuesData = venuesRes.data || []
      setVenues(venuesData)
      if (venuesData.length > 0 && !selectedVenue) {
        setSelectedVenue(venuesData[0].name)
        setLiveCampaignVenue(venuesData[0].name)
      }

      // Process weekly reports
      const reportsMap = {}
      const weeksSet = new Set()
      reportsRes.data?.forEach(r => {
        if (r.venues?.name) {
          const weekKey = `${r.week_start}_${r.week_end}`
          weeksSet.add(weekKey)
          if (!reportsMap[r.venues.name]) reportsMap[r.venues.name] = {}
          reportsMap[r.venues.name][weekKey] = { ...r, poc: r.venues.poc }
        }
      })
      setWeeklyReports(reportsMap)

      const weeksArray = Array.from(weeksSet).map(wk => {
        const [start, end] = wk.split('_')
        return { key: wk, start, end, label: `${start} → ${end}` }
      }).sort((a, b) => new Date(b.end) - new Date(a.end))

      setAllWeeks(weeksArray)
      if (weeksArray.length > 0 && !selectedWeek) {
        setSelectedWeek(weeksArray[0].key)
        if (weeksArray.length > 1) setPreviousWeek(weeksArray[1].key)
      }

      // Process live campaigns
      const campaignsMap = {}
      campaignsRes.data?.forEach(c => {
        if (c.venues?.name) {
          if (!campaignsMap[c.venues.name]) campaignsMap[c.venues.name] = []
          campaignsMap[c.venues.name].push(c)
        }
      })
      setLiveCampaigns(campaignsMap)

      // Workspace + Monthly
      const wsData = workspaceRes.data || []
      setWorkspaceData(wsData)

      // Extract unique months from workspace data
      const monthsSet = new Set(wsData.map(w => w.month))
      const monthsArr = Array.from(monthsSet).sort((a, b) => new Date(a) - new Date(b))
      setWorkspaceMonths(monthsArr)
      if (monthsArr.length > 0 && !selectedBudgetMonth) {
        setSelectedBudgetMonth(monthsArr[0])
      }

      setMonthlyData(monthlyRes.data || [])
      setAdCreatives(creativesRes.data || [])
      setSocialMediaData(socialRes.data || [])

      // Build ad_notes lookup map: "venueId_weekKey_adName" -> note
      const notesMap = {}
      ;(adNotesRes.data || []).forEach(n => {
        notesMap[`${n.venue_id}_${n.week_key}_${n.ad_name}`] = n.note || ''
        // Also load venue-level notes (ad_name === '__venue__')
        if (n.ad_name === '__venue__') {
          setVenueNotes(prev => ({ ...prev, [`${n.venue_id}_${n.week_key}`]: n.note || '' }))
        }
      })
      setAdNotes(notesMap)

      // Build venue notes map from same ad_notes table (ad_name = '__venue__')
      const venueNotesMap = {}
      ;(adNotesRes.data || []).filter(n => n.ad_name === '__venue__').forEach(n => {
        venueNotesMap[`${n.venue_id}_${n.week_key}`] = n.note || ''
      })
      setVenueNotes(venueNotesMap)

      setLastUpdated(new Date())

      if (isRefresh) {
        setToast({ message: 'Data refreshed successfully', type: 'success' })
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load dashboard data')
      if (isRefresh) {
        setToast({ message: 'Failed to refresh data', type: 'error' })
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedVenue, selectedWeek])

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated])

  // Auto-refresh
  useEffect(() => {
    if (!isAuthenticated) return
    const interval = setInterval(() => fetchData(true), AUTO_REFRESH_MS)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchData])

  // ── Derived data (memoized) ──────────────
  const sortByImpressions = useCallback((arr) => {
    if (!arr || !Array.isArray(arr)) return []
    return [...arr].sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
  }, [])

  const getVenueData = useCallback((venueName, weekKey) => {
    const venue = venues.find(v => v.name === venueName)
    const report = weeklyReports[venueName]?.[weekKey]

    const sortedMeta = report?.meta_data ? {
      campaigns: sortByImpressions(report.meta_data.campaigns),
      adSets: sortByImpressions(report.meta_data.adSets),
      ads: sortByImpressions(report.meta_data.ads),
      analysis: report.meta_data.analysis
    } : { campaigns: [], adSets: [], ads: [], analysis: null }

    return {
      ...venue,
      weekStart: report?.week_start,
      weekEnd: report?.week_end,
      adSpend: report?.ad_spend || 0,
      meta: sortedMeta,
      revenue: report?.revenue_data,
      programmatic: report?.programmatic_data,
      liveCampaigns: liveCampaigns[venueName] || [],
      poc: report?.poc || venue?.poc
    }
  }, [venues, weeklyReports, liveCampaigns, sortByImpressions])

  // Get creative image for an ad (matches by venue name + ad name + month)
  const getCreativeForAd = useCallback((venueName, adName, weekStart) => {
    if (!weekStart) return null
    const month = weekStart.substring(0, 7) // '2026-02' from '2026-02-01'
    return adCreatives.find(c =>
      c.venues?.name === venueName &&
      c.ad_name === adName &&
      c.month === month
    )
  }, [adCreatives])

  // Handle creative upload success
  const handleCreativeUploaded = useCallback((creative) => {
    setAdCreatives(prev => [creative, ...prev])
    setShowUploadModal(false)
    setToast({ message: 'Creative uploaded successfully', type: 'success' })
  }, [])

  // Handle creative deletion
  const handleCreativeDeleted = useCallback((id) => {
    setAdCreatives(prev => prev.filter(c => c.id !== id))
    setToast({ message: 'Creative deleted', type: 'success' })
  }, [])

  // Toggle ad status (active ↔ inactive) and persist to DB
  const toggleAdStatus = useCallback(async (venueName, weekKey, adName, currentStatus) => {
    const venue = venues.find(v => v.name === venueName)
    if (!venue) return
    const [weekStart, weekEnd] = weekKey.split('_')
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    // Optimistic update
    setWeeklyReports(prev => {
      const report = prev[venueName]?.[weekKey]
      if (!report?.meta_data?.ads) return prev
      const updatedAds = report.meta_data.ads.map(a =>
        a.name === adName ? { ...a, status: newStatus } : a
      )
      return {
        ...prev,
        [venueName]: {
          ...prev[venueName],
          [weekKey]: { ...report, meta_data: { ...report.meta_data, ads: updatedAds } }
        }
      }
    })

    try {
      const res = await fetch('/api/ads/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue_id: venue.id, week_start: weekStart, week_end: weekEnd, ad_name: adName, status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to save')
      setToast({ message: `Ad marked ${newStatus}`, type: 'success' })
    } catch {
      setToast({ message: 'Failed to update status', type: 'error' })
      // Revert optimistic update
      setWeeklyReports(prev => {
        const report = prev[venueName]?.[weekKey]
        if (!report?.meta_data?.ads) return prev
        const revertedAds = report.meta_data.ads.map(a =>
          a.name === adName ? { ...a, status: currentStatus } : a
        )
        return {
          ...prev,
          [venueName]: {
            ...prev[venueName],
            [weekKey]: { ...report, meta_data: { ...report.meta_data, ads: revertedAds } }
          }
        }
      })
    }
  }, [venues])

  // ── Ad Notes helpers ──────────────────
  const getNoteKey = useCallback((venueName, weekKey, adName) => {
    const venue = venues.find(v => v.name === venueName)
    return venue ? `${venue.id}_${weekKey}_${adName}` : null
  }, [venues])

  const saveAdNote = useCallback(async (venueName, weekKey, adName, note) => {
    const venue = venues.find(v => v.name === venueName)
    if (!venue) return
    const key = `${venue.id}_${weekKey}_${adName}`
    setSavingNote(key)
    try {
      const { error } = await supabase.from('ad_notes').upsert({
        venue_id: venue.id,
        week_key: weekKey,
        ad_name: adName,
        note: note,
        updated_at: new Date().toISOString()
      }, { onConflict: 'venue_id,week_key,ad_name' })
      if (error) throw error
      setAdNotes(prev => ({ ...prev, [key]: note }))
    } catch (err) {
      console.error('Failed to save note:', err)
      setToast({ message: 'Failed to save note', type: 'error' })
    } finally {
      setSavingNote(null)
    }
  }, [venues])

  const saveVenueNote = useCallback(async (venueName, weekKey, note) => {
    const venue = venues.find(v => v.name === venueName)
    if (!venue) return
    const key = `${venue.id}_${weekKey}`
    setSavingVenueNote(true)
    try {
      const { error } = await supabase.from('ad_notes').upsert({
        venue_id: venue.id,
        week_key: weekKey,
        ad_name: '__venue__',
        note: note,
        updated_at: new Date().toISOString()
      }, { onConflict: 'venue_id,week_key,ad_name' })
      if (error) throw error
      setVenueNotes(prev => ({ ...prev, [key]: note }))
    } catch (err) {
      console.error('Failed to save venue note:', err)
      setToast({ message: 'Failed to save note', type: 'error' })
    } finally {
      setSavingVenueNote(false)
    }
  }, [venues])

  const currentData = useMemo(() =>
    selectedVenue && selectedWeek ? getVenueData(selectedVenue, selectedWeek) : null
  , [selectedVenue, selectedWeek, getVenueData])

  const previousData = useMemo(() =>
    selectedVenue && previousWeek && compareMode ? getVenueData(selectedVenue, previousWeek) : null
  , [selectedVenue, previousWeek, compareMode, getVenueData])

  const executiveMetrics = useMemo(() => {
    if (!selectedWeek) return { totalAdSpend: 0, totalOnlineRevenue: 0, totalRevenue: 0, totalReservations: 0, onlineReservations: 0, totalImpressions: 0, totalClicks: 0, totalLinkClicks: 0, allVenuesSpend: [], pocPieData: [], allVenuesImpressions: [] }

    let totalAdSpend = 0, totalOnlineRevenue = 0, totalRevenue = 0, totalReservations = 0, onlineReservations = 0
    let totalImpressions = 0, totalClicks = 0, totalLinkClicks = 0
    const allVenuesSpend = []
    const allVenuesImpressions = []
    const spendByPOC = {}

    venues.forEach(v => {
      const d = getVenueData(v.name, selectedWeek)
      totalAdSpend += d.adSpend || 0
      totalOnlineRevenue += d.revenue?.totalOnline || 0
      totalRevenue += d.revenue?.totalBusiness || 0
      totalReservations += d.revenue?.totalReservations || 0
      onlineReservations += d.revenue?.onlineReservations || 0
      let venueImpressions = 0, venueLinkClicks = 0
      if (d.meta?.campaigns) {
        d.meta.campaigns.forEach(c => {
          totalImpressions += c.impressions || 0
          totalClicks += c.clicks || 0
          totalLinkClicks += c.linkClicks || 0
          venueImpressions += c.impressions || 0
          venueLinkClicks += c.linkClicks || 0
        })
      }
      allVenuesSpend.push({ name: v.name.length > 12 ? v.name.substring(0, 12) + '..' : v.name, spend: d.adSpend })
      allVenuesImpressions.push({ name: v.name.length > 12 ? v.name.substring(0, 12) + '..' : v.name, impressions: venueImpressions, linkClicks: venueLinkClicks })
      spendByPOC[v.poc] = (spendByPOC[v.poc] || 0) + (d.adSpend || 0)
    })

    const pocPieData = Object.entries(spendByPOC).map(([name, value]) => ({ name, value }))
    return { totalAdSpend, totalOnlineRevenue, totalRevenue, totalReservations, onlineReservations, totalImpressions, totalClicks, totalLinkClicks, allVenuesSpend, pocPieData, allVenuesImpressions }
  }, [venues, selectedWeek, getVenueData])

  // Workspace budget filtered by month
  const filteredWorkspaceData = useMemo(() => {
    if (!selectedBudgetMonth) return []
    return workspaceData.filter(w => w.month === selectedBudgetMonth)
  }, [workspaceData, selectedBudgetMonth])

  const workspaceTotals = useMemo(() => {
    return filteredWorkspaceData.reduce((acc, w) => ({
      budget: acc.budget + parseFloat(w.monthly_budget || 0),
      traffic: acc.traffic + parseFloat(w.traffic || 0),
      community: acc.community + parseFloat(w.community || 0),
      spend: acc.spend + parseFloat(w.total_spend || 0),
      remaining: acc.remaining + parseFloat(w.remaining || 0),
    }), { budget: 0, traffic: 0, community: 0, spend: 0, remaining: 0 })
  }, [filteredWorkspaceData])

  const formatMonth = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const calcROAS = (d) => (!d?.revenue || !d?.adSpend) ? '0x' : (d.revenue.totalOnline / d.adSpend).toFixed(2) + 'x'
  const calcOnlinePercent = (d) => {
    if (!d?.revenue) return { rev: '0%', res: '0%' }
    return {
      rev: ((d.revenue.totalOnline / d.revenue.totalBusiness) * 100).toFixed(2) + '%',
      res: ((d.revenue.onlineReservations / d.revenue.totalReservations) * 100).toFixed(2) + '%'
    }
  }

  const getBrandPOC = (brandName) => {
    const venueName = brandName.replace(' Media', '')
    const venue = venues.find(v => v.name === venueName)
    return venue?.poc || '-'
  }

  // ── Actions ────────────────────────────
  const toggleAdSet = (name) => setExpandedAdSets(prev => ({ ...prev, [name]: !prev[name] }))

  const exportToCSV = () => {
    let csv = 'Venue,Week,Ad Spend,Total Revenue,Online Revenue,ROAS,Reservations\n'
    venues.forEach(v => {
      const d = getVenueData(v.name, selectedWeek)
      csv += `${v.name},${d.weekStart} to ${d.weekEnd},${d.adSpend},${d.revenue?.totalBusiness || 0},${d.revenue?.totalOnline || 0},${calcROAS(d)},${d.revenue?.totalReservations || 0}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `mpj-report-${selectedWeek}.csv`; a.click()
    URL.revokeObjectURL(url)
    setToast({ message: 'CSV exported successfully', type: 'success' })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('mpj_auth')
    window.location.href = '/login'
  }

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Calendar },
    // { id: 'executive', label: 'Executive Summary', icon: TrendingUp },
    { id: 'venue', label: 'Venue View', icon: BarChart3 }
    // { id: 'live', label: 'Live Campaigns', icon: Megaphone }
  ]

  // ── Render guards ──────────────────────
  if (!authChecked) return null
  if (!isAuthenticated) return null
  if (loading) return <DashboardSkeleton />
  if (error && venues.length === 0) return <ErrorState message={error} onRetry={() => fetchData()} />

  // ── Render ─────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ──────────────────────── */}
      <header className="bg-mpj-purple text-white px-4 md:px-6 py-4 no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">MPJ F&Bs Performance Dashboard</h1>
            <p className="text-xs md:text-sm text-white/70">
              Marriott Palm Jumeirah Weekly Reports
              {lastUpdated && (
                <span className="ml-2 hidden sm:inline">
                  | Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {allWeeks.length > 1 && (
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                  compareMode ? 'bg-green-500 text-white' : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                {compareMode ? 'Compare ON' : 'Compare'}
              </button>
            )}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 rounded-lg hover:bg-white/25 text-xs md:text-sm cursor-pointer disabled:opacity-50 transition-colors"
              aria-label="Refresh data"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 rounded-lg hover:bg-white/25 text-xs md:text-sm cursor-pointer transition-colors"
              aria-label="Export to CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 rounded-lg hover:bg-white/25 text-xs md:text-sm cursor-pointer transition-colors"
              aria-label="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Tabs ────────────────────────── */}
      <nav className="bg-white border-b sticky top-0 z-30 no-print" aria-label="Dashboard sections">
        <div className="max-w-7xl mx-auto flex gap-0.5 px-4 md:px-6 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-mpj-purple text-mpj-purple'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ─────────────────────── */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">

        {/* WORKSPACE TAB */}
        {activeTab === 'workspace' && (
          <div className="space-y-4 animate-fade-in">
            {/* Month Selector */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 flex-wrap">
              <div className="min-w-[200px]">
                <label htmlFor="budget-month-select" className="block text-xs font-medium text-gray-500 mb-1">Select Month</label>
                <select
                  id="budget-month-select"
                  value={selectedBudgetMonth || ''}
                  onChange={(e) => setSelectedBudgetMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple cursor-pointer"
                >
                  {workspaceMonths.map(m => (
                    <option key={m} value={m}>{formatMonth(m)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-1 flex-wrap">
                {workspaceMonths.map(m => {
                  const isActive = m === selectedBudgetMonth
                  const monthLabel = new Date(m + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })
                  return (
                    <button
                      key={m}
                      onClick={() => setSelectedBudgetMonth(m)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive ? 'bg-mpj-purple text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {monthLabel}
                    </button>
                  )
                })}
              </div>
            </div>

            <CollapsibleSection title={`Budget Workspace — ${selectedBudgetMonth ? formatMonth(selectedBudgetMonth) : 'All Brands'}`} icon={DollarSign}>
              <div className="table-responsive">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Brand</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">POC</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Monthly Budget</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Total Spend</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Remaining</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">% Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkspaceData.map((w, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2.5 font-medium text-gray-900">{w.brand}</td>
                        <td className="px-3 py-2.5 text-gray-600 hidden sm:table-cell">{getBrandPOC(w.brand)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">AED {formatNum(w.monthly_budget)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">AED {formatNum(w.total_spend)}</td>
                        <td className={`px-3 py-2.5 text-right tabular-nums hidden sm:table-cell font-medium ${parseFloat(w.remaining) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          AED {formatNum(w.remaining)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold">{w.pct_spent}</td>
                      </tr>
                    ))}
                    {/* Totals Row */}
                    {filteredWorkspaceData.length > 0 && (
                      <tr className="border-t-2 border-mpj-purple/30 bg-gray-50 font-semibold">
                        <td className="px-3 py-3 text-mpj-purple">TOTAL</td>
                        <td className="hidden sm:table-cell"></td>
                        <td className="px-3 py-3 text-right tabular-nums">AED {formatNum(workspaceTotals.budget)}</td>
                        <td className="px-3 py-3 text-right tabular-nums">AED {formatNum(workspaceTotals.spend)}</td>
                        <td className={`px-3 py-3 text-right tabular-nums hidden sm:table-cell ${workspaceTotals.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          AED {formatNum(workspaceTotals.remaining)}
                        </td>
                        <td className="px-3 py-3 text-right">{workspaceTotals.budget > 0 ? ((workspaceTotals.spend / workspaceTotals.budget) * 100).toFixed(1) + '%' : '0.0%'}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="SLA Timelines" color="#4a5568" icon={Calendar}>
              <div className="table-responsive">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Report Type</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SLA_DATA.map((sla, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">{sla.type}</td>
                        <td className="px-3 py-2.5 text-gray-600">{sla.timeline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-4">*Timelines may shift due to public holidays (e.g., Eid) or country-specific circumstances.</p>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* EXECUTIVE SUMMARY TAB */}
        {activeTab === 'executive' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPICard label="Total Ad Spend" value={formatNum(executiveMetrics.totalAdSpend)} prefix="AED " icon={DollarSign} />
              <KPICard label="Online Revenue" value={formatNum(executiveMetrics.totalOnlineRevenue)} prefix="AED " icon={TrendingUp} />
              <KPICard label="Online Reservations" value={formatInt(executiveMetrics.onlineReservations)} icon={ShoppingBag} />
              <KPICard label="ROAS" value={executiveMetrics.totalAdSpend > 0 ? (executiveMetrics.totalOnlineRevenue / executiveMetrics.totalAdSpend).toFixed(2) : '0'} suffix="x" icon={Target} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPICard label="Impressions" value={formatInt(executiveMetrics.totalImpressions)} icon={Eye} />
              <KPICard label="Link Clicks" value={formatInt(executiveMetrics.totalLinkClicks)} icon={MousePointerClick} />
              <KPICard label="CTR" value={executiveMetrics.totalImpressions > 0 ? ((executiveMetrics.totalClicks / executiveMetrics.totalImpressions) * 100).toFixed(2) : '0'} suffix="%" icon={Percent} />
              <KPICard label="Cost per Click" value={executiveMetrics.totalClicks > 0 ? formatNum(executiveMetrics.totalAdSpend / executiveMetrics.totalClicks) : '0.00'} prefix="AED " icon={DollarSign} />
            </div>

            <CollapsibleSection title="All Venues Performance" icon={BarChart3}>
              <div className="table-responsive">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Venue</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">POC</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Ad Spend</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Revenue</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Reservations</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-gray-600">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venues.map(v => {
                      const d = getVenueData(v.name, selectedWeek)
                      return (
                        <tr key={v.id} className="border-t hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2.5 font-medium text-gray-900">{v.name}</td>
                          <td className="px-3 py-2.5 text-gray-600 hidden md:table-cell">{v.poc}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">AED {formatNum(d.adSpend)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">AED {formatNum(d.revenue?.totalBusiness || 0)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{formatInt(d.revenue?.totalReservations || 0)}</td>
                          <td className="px-3 py-2.5 text-right font-semibold text-mpj-purple">{calcROAS(d)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            {monthlyData.length > 0 && (
              <CollapsibleSection title="Monthly Rollup" color="#4a5568" icon={TrendingUp}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Ad Spend vs Revenue</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={formatK} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v) => 'AED ' + formatNum(v)} />
                        <Legend />
                        <Bar dataKey="ad_spend" fill="#76527c" name="Ad Spend" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="revenue" fill="#d8ee91" name="Revenue" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Reservations Trend</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <ReLineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="reservations" stroke="#76527c" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Visual Trends" color="#2d3748" icon={BarChart3}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Ad Spend by Venue</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={executiveMetrics.allVenuesSpend} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tickFormatter={formatK} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => 'AED ' + formatNum(v)} />
                      <Bar dataKey="spend" fill="#76527c" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Spend by POC</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={executiveMetrics.pocPieData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ strokeWidth: 1 }}>
                        {executiveMetrics.pocPieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => 'AED ' + formatNum(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* VENUE VIEW TAB */}
        {activeTab === 'venue' && currentData && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 flex-wrap bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-[180px]">
                <label htmlFor="venue-select" className="block text-xs font-medium text-gray-500 mb-1">Venue</label>
                <select
                  id="venue-select"
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple cursor-pointer"
                >
                  {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="week-select" className="block text-xs font-medium text-gray-500 mb-1">Reporting Week</label>
                <select
                  id="week-select"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple cursor-pointer"
                >
                  {allWeeks.map(w => <option key={w.key} value={w.key}>{w.label}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-0.5 gap-3">
                <span className="text-xs text-gray-500">POC: <strong className="text-mpj-purple">{currentData.poc}</strong></span>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-mpj-purple/10 hover:bg-mpj-purple/20 text-mpj-purple rounded-lg text-xs font-medium transition-colors"
                  title="Upload ad creative image"
                >
                  <Upload size={13} />
                  Upload Creative
                </button>
              </div>
            </div>

            {/* ── Meeting Notes Box ── */}
            {(() => {
              const venue = venues.find(v => v.name === selectedVenue)
              const noteKey = venue ? `${venue.id}_${selectedWeek}` : null
              const noteVal = noteKey ? (venueNotes[noteKey] || '') : ''
              return (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-mpj-purple" />
                      Meeting Notes — {selectedVenue}
                    </label>
                    {savingVenueNote && <span className="text-[10px] text-mpj-purple animate-pulse">saving...</span>}
                  </div>
                  <textarea
                    key={noteKey}
                    defaultValue={noteVal}
                    placeholder="Add notes for your meeting here — context, action items, observations..."
                    rows={3}
                    onBlur={(e) => {
                      const val = e.target.value
                      if (val !== noteVal) saveVenueNote(selectedVenue, selectedWeek, val)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.metaKey) e.target.blur()
                    }}
                    className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple resize-none bg-gray-50 hover:bg-white transition-colors placeholder:text-gray-400"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Auto-saves on blur · Cmd+Enter to save</p>
                </div>
              )
            })()}

            {compareMode && previousData && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-slide-down">
                <h3 className="font-semibold text-blue-900 mb-3 text-sm">Period Comparison</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Impressions</p>
                    <p className="font-semibold text-gray-900">{formatInt(currentData.meta.campaigns.reduce((s, c) => s + (c.impressions || 0), 0))}</p>
                    <DeltaBadge current={currentData.meta.campaigns.reduce((s, c) => s + (c.impressions || 0), 0)} previous={previousData.meta.campaigns.reduce((s, c) => s + (c.impressions || 0), 0)} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Revenue</p>
                    <p className="font-semibold text-gray-900">AED {formatNum(currentData.revenue?.totalBusiness || 0)}</p>
                    <DeltaBadge current={currentData.revenue?.totalBusiness || 0} previous={previousData.revenue?.totalBusiness || 0} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Reservations</p>
                    <p className="font-semibold text-gray-900">{formatInt(currentData.revenue?.totalReservations || 0)}</p>
                    <DeltaBadge current={currentData.revenue?.totalReservations || 0} previous={previousData.revenue?.totalReservations || 0} />
                  </div>
                </div>
              </div>
            )}

            {currentData.meta?.analysis && (
              <CollapsibleSection title="Analysis & Recommendations" color="#2563eb" icon={Lightbulb}>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lightbulb size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1.5 text-sm">Summary</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{currentData.meta.analysis.summary}</p>
                      </div>
                    </div>
                  </div>
                  {currentData.meta.analysis.recommendations?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">Recommendations</h4>
                      <ul className="space-y-2">
                        {currentData.meta.analysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-gray-50 px-3 py-2.5 rounded-lg">
                            <span className="text-mpj-purple font-bold text-lg leading-none mt-0.5">-</span>
                            <span className="leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {currentData.meta?.campaigns?.length > 0 && (
              <CollapsibleSection title="Meta Ads Performance" icon={Megaphone}>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Campaign Level</h4>
                    <div className="table-responsive">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Campaign</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Clicks</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Link Clicks</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Engagement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.meta.campaigns.map((c, i) => (
                            <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                              <td className="px-3 py-2.5 font-medium max-w-[200px] truncate">{c.name}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.impressions)}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.clicks)}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums">{c.ctr}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(c.linkClicks)}</td>
                              <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(c.engagement)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {currentData.meta.adSets?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Ad Set Level <span className="text-xs font-normal text-gray-400">(click to view audience)</span>
                      </h4>
                      <div className="table-responsive">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Ad Set</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Clicks</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Link Clicks</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Engagement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentData.meta.adSets.map((a) => (
                              <AdSetRow key={a.name} adSet={a} isExpanded={expandedAdSets[a.name]} onToggle={() => toggleAdSet(a.name)} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {currentData.meta.ads?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        Ad Level
                        <span className="text-xs font-normal text-gray-400 flex items-center gap-1"><MessageSquare size={11} /> click notes to edit</span>
                      </h4>
                      <div className="table-responsive">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-2 py-2.5 font-semibold text-gray-600 w-12 hidden sm:table-cell">Ad</th>
                              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Ad Name</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Link Clicks</th>
                              <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Engagement</th>
                              <th className="text-center px-3 py-2.5 font-semibold text-gray-600">Status <span className="text-[10px] font-normal text-gray-400">(click to toggle)</span></th>
                              <th className="text-left px-3 py-2.5 font-semibold text-gray-600 min-w-[180px]">
                                <span className="flex items-center gap-1"><MessageSquare size={12} /> Notes</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              // Build lookup: for each ad, find best-matching adSet and campaign by longest common prefix
                              const adSets = currentData.meta.adSets || []
                              const campaigns = currentData.meta.campaigns || []
                              const findParent = (arr, adName) => {
                                let best = null, bestLen = 0
                                arr.forEach(p => {
                                  const shorter = Math.min(p.name.length, adName.length)
                                  let common = 0
                                  for (let i = 0; i < shorter; i++) {
                                    if (p.name[i] === adName[i]) common++
                                    else break
                                  }
                                  if (common > bestLen) { bestLen = common; best = p.name }
                                })
                                return best
                              }
                              return currentData.meta.ads.map((a, i) => {
                              const noteKey = getNoteKey(selectedVenue, selectedWeek, a.name)
                              const noteVal = noteKey ? (adNotes[noteKey] || '') : ''
                              const isSaving = savingNote === noteKey
                              const matchedAdSet = findParent(adSets, a.name)
                              const matchedCampaign = findParent(campaigns, a.name)
                              return (
                                <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                                  <td className="px-2 py-2 hidden sm:table-cell">
                                    <CreativeThumb creative={getCreativeForAd(selectedVenue, a.name, currentData.weekStart)} size={36} />
                                  </td>
                                  <td className="px-3 py-2.5 max-w-[200px] font-medium">
                                    <div className="relative group/adname">
                                      <span className="block truncate cursor-default">{a.name}</span>
                                      {/* Hover tooltip */}
                                      <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover/adname:block w-72 bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 space-y-1.5 pointer-events-none">
                                        <div>
                                          <span className="text-gray-400 uppercase tracking-wide text-[10px]">Ad</span>
                                          <p className="font-medium leading-snug mt-0.5">{a.name}</p>
                                        </div>
                                        {matchedAdSet && (
                                          <div className="border-t border-gray-700 pt-1.5">
                                            <span className="text-gray-400 uppercase tracking-wide text-[10px]">Ad Set</span>
                                            <p className="leading-snug mt-0.5 text-gray-200">{matchedAdSet}</p>
                                          </div>
                                        )}
                                        {matchedCampaign && (
                                          <div className="border-t border-gray-700 pt-1.5">
                                            <span className="text-gray-400 uppercase tracking-wide text-[10px]">Campaign</span>
                                            <p className="leading-snug mt-0.5 text-gray-200">{matchedCampaign}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(a.impressions)}</td>
                                  <td className="px-3 py-2.5 text-right tabular-nums">{a.ctr}</td>
                                  <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(a.linkClicks)}</td>
                                  <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(a.engagement)}</td>
                                  <td className="px-3 py-2.5 text-center">
                                    <button
                                      onClick={() => toggleAdStatus(selectedVenue, selectedWeek, a.name, a.status)}
                                      title="Click to toggle active / inactive"
                                      className={`px-2.5 py-1 rounded-md text-xs font-bold text-white transition-opacity hover:opacity-75 cursor-pointer ${a.status === 'active' ? 'bg-green-500' : a.status === 'learning' ? 'bg-amber-500' : a.status === 'not_delivering' || a.status === 'inactive' ? 'bg-red-400' : 'bg-gray-400'}`}
                                    >
                                      {a.status || 'unknown'}
                                    </button>
                                  </td>
                                  <td className="px-3 py-1.5">
                                    <div className="relative">
                                      <textarea
                                        defaultValue={noteVal}
                                        placeholder="Add note..."
                                        rows={1}
                                        onBlur={(e) => {
                                          const val = e.target.value.trim()
                                          if (val !== noteVal) {
                                            saveAdNote(selectedVenue, selectedWeek, a.name, val)
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            e.target.blur()
                                          }
                                        }}
                                        className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-mpj-purple/40 focus:border-mpj-purple resize-none bg-white hover:bg-gray-50 transition-colors min-w-[160px]"
                                      />
                                      {isSaving && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-mpj-purple animate-pulse">saving...</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )
                            })})()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {/* Creative Gallery */}
            {adCreatives.filter(c => c.venues?.name === selectedVenue).length > 0 && (
              <CollapsibleSection title="Creative Gallery" icon={ImageIcon} defaultOpen={false}>
                <CreativeGallery
                  creatives={adCreatives.filter(c => c.venues?.name === selectedVenue)}
                  onDelete={handleCreativeDeleted}
                />
              </CollapsibleSection>
            )}

            {/* Social Media Insights */}
            {socialMediaData.filter(d => d.venues?.name === selectedVenue).length > 0 && (
              <CollapsibleSection title="Social Media Insights" icon={Instagram} defaultOpen={false}>
                <SocialMediaInsights
                  allData={socialMediaData}
                  venueName={selectedVenue}
                />
              </CollapsibleSection>
            )}

            {currentData.revenue && (() => {
              const rev = currentData.revenue
              const onlinePct = rev.totalBusiness > 0 ? ((rev.totalOnline / rev.totalBusiness) * 100) : 0
              const resPct = rev.totalReservations > 0 ? ((rev.onlineReservations / rev.totalReservations) * 100) : 0
              const roas = currentData.adSpend > 0 ? (rev.totalOnline / currentData.adSpend) : null
              const offlineTotal = rev.totalBusiness - rev.totalOnline
              const donutData = [
                { name: 'Online', value: rev.totalOnline },
                { name: 'Offline', value: offlineTotal }
              ]
              const onlineChannels = rev.channels
                ? Object.entries(rev.channels)
                    .filter(([, v]) => v.revenue > 0)
                    .sort((a, b) => b[1].revenue - a[1].revenue)
                : []
              const topChannel = onlineChannels[0]

              // Walk In rank context
              const walkInRevenue = rev.offline?.['Walk In']?.revenue || 0
              const onlineVsWalkIn = walkInRevenue > 0
                ? ((rev.totalOnline / walkInRevenue) * 100).toFixed(0)
                : null

              return (
                <CollapsibleSection title="Revenue & Reservations (7rooms)" icon={DollarSign}>
                  <div className="space-y-5">

                    {/* ── KPI Summary Cards ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gradient-to-br from-mpj-purple/10 to-mpj-purple/5 border border-mpj-purple/20 rounded-xl p-3.5">
                        <p className="text-xs font-medium text-mpj-purple/70 mb-1">Online Revenue Share</p>
                        <p className="text-2xl font-bold text-mpj-purple">{onlinePct.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500 mt-0.5">of total business</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3.5">
                        <p className="text-xs font-medium text-green-700 mb-1">Online Bookings Share</p>
                        <p className="text-2xl font-bold text-green-700">{resPct.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500 mt-0.5">of total reservations</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-3.5">
                        <p className="text-xs font-medium text-blue-700 mb-1">Online Revenue</p>
                        <p className="text-2xl font-bold text-blue-700">AED {rev.totalOnline >= 1000 ? (rev.totalOnline / 1000).toFixed(0) + 'K' : formatNum(rev.totalOnline)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatInt(rev.onlineReservations)} reservations</p>
                      </div>
                      <div className={`rounded-xl p-3.5 border ${roas ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                        <p className={`text-xs font-medium mb-1 ${roas ? 'text-amber-700' : 'text-gray-500'}`}>ROAS</p>
                        <p className={`text-2xl font-bold ${roas ? 'text-amber-700' : 'text-gray-400'}`}>{roas ? roas.toFixed(2) + 'x' : '—'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{roas ? 'online rev / ad spend' : 'no ad spend data'}</p>
                      </div>
                    </div>

                    {/* ── Insight Callouts ── */}
                    <div className="flex flex-wrap gap-2">
                      {topChannel && (
                        <div className="flex items-center gap-2 bg-mpj-purple/8 border border-mpj-purple/20 rounded-lg px-3 py-2 text-sm">
                          <span className="text-mpj-purple font-bold">★</span>
                          <span className="text-gray-700">Top online channel: <strong className="text-mpj-purple">{topChannel[0]}</strong> — AED {formatNum(topChannel[1].revenue)} across {topChannel[1].reservations} reservations</span>
                        </div>
                      )}
                      {onlineVsWalkIn && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                          <span className="text-green-600 font-bold">↑</span>
                          <span className="text-gray-700">Online is <strong className="text-green-700">{onlineVsWalkIn}%</strong> of Walk-In revenue — the #2 revenue source</span>
                        </div>
                      )}
                      {roas && (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm">
                          <span className="text-amber-600 font-bold">💰</span>
                          <span className="text-gray-700">Every <strong>AED 1</strong> in Meta spend generated <strong className="text-amber-700">AED {roas.toFixed(2)}</strong> in tracked online revenue</span>
                        </div>
                      )}
                    </div>

                    {/* ── Charts Row ── */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Donut: Online vs Offline */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Revenue Split</h4>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie
                              data={donutData}
                              cx="50%" cy="50%"
                              innerRadius={50} outerRadius={75}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                              labelLine={{ strokeWidth: 1 }}
                            >
                              <Cell fill="#76527c" />
                              <Cell fill="#e5e7eb" />
                            </Pie>
                            <Tooltip formatter={(v) => 'AED ' + formatNum(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Bar: Online channels ranked */}
                      {onlineChannels.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Online Channels by Revenue</h4>
                          <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={onlineChannels.map(([name, v]) => ({ name, revenue: v.revenue }))} layout="vertical" margin={{ left: 8, right: 16 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                              <XAxis type="number" tickFormatter={(v) => v >= 1000 ? (v/1000).toFixed(0)+'K' : v} tick={{ fontSize: 10 }} />
                              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                              <Tooltip formatter={(v) => 'AED ' + formatNum(v)} />
                              <Bar dataKey="revenue" fill="#76527c" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>

                    {/* ── Detail Table ── */}
                    <div className="table-responsive">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left px-3 py-2.5 font-semibold text-gray-600 w-32">Category</th>
                            <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Metric / Channel</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Revenue (AED)</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Reservations</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Avg. Spend</th>
                            <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">% of Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Total row */}
                          <tr className="border-t bg-gray-50/80">
                            <td className="px-3 py-2.5 font-semibold text-mpj-purple">Overall</td>
                            <td className="px-3 py-2.5">Total Business</td>
                            <td className="px-3 py-2.5 text-right font-medium tabular-nums">{formatNum(rev.totalBusiness)}</td>
                            <td className="px-3 py-2.5 text-right font-medium tabular-nums hidden sm:table-cell">{formatInt(rev.totalReservations)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(rev.totalBusiness, rev.totalReservations)}</td>
                            <td className="px-3 py-2.5 text-right hidden md:table-cell">100%</td>
                          </tr>
                          {/* Online total */}
                          <tr className="border-t">
                            <td className="px-3 py-2.5 font-semibold text-mpj-purple">Online</td>
                            <td className="px-3 py-2.5 font-medium">Total Online</td>
                            <td className="px-3 py-2.5 text-right tabular-nums font-medium">{formatNum(rev.totalOnline)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{formatInt(rev.onlineReservations)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(rev.totalOnline, rev.onlineReservations)}</td>
                            <td className="px-3 py-2.5 text-right hidden md:table-cell">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-mpj-purple/10 text-mpj-purple">{onlinePct.toFixed(1)}%</span>
                            </td>
                          </tr>
                          {/* Online channels */}
                          {rev.channels && Object.entries(rev.channels).map(([ch, v]) => (
                            <tr key={ch} className="border-t">
                              <td></td>
                              <td className="px-3 py-2 pl-6 text-gray-600">↳ {ch}</td>
                              <td className="px-3 py-2 text-right tabular-nums text-gray-700">{formatNum(v.revenue)}</td>
                              <td className="px-3 py-2 text-right tabular-nums hidden sm:table-cell text-gray-600">{v.reservations}</td>
                              <td className="px-3 py-2 text-right tabular-nums hidden md:table-cell text-gray-600">{calcAvgSpend(v.revenue, v.reservations)}</td>
                              <td className="px-3 py-2 text-right hidden md:table-cell text-gray-500 text-xs">{rev.totalBusiness > 0 ? ((v.revenue / rev.totalBusiness) * 100).toFixed(1) + '%' : '—'}</td>
                            </tr>
                          ))}
                          {/* Walk In — highlighted as #1 offline, right after online */}
                          {rev.offline?.['Walk In'] && (() => {
                            const wi = rev.offline['Walk In']
                            return (
                              <tr className="border-t bg-gray-50/60">
                                <td className="px-3 py-2.5 font-semibold text-gray-500">Offline</td>
                                <td className="px-3 py-2.5 font-medium text-gray-700">
                                  Walk In
                                  <span className="ml-2 text-xs font-normal text-gray-400">#1 offline source</span>
                                </td>
                                <td className="px-3 py-2.5 text-right tabular-nums">{formatNum(wi.revenue)}</td>
                                <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{wi.reservations}</td>
                                <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(wi.revenue, wi.reservations)}</td>
                                <td className="px-3 py-2.5 text-right hidden md:table-cell text-gray-500 text-xs">{rev.totalBusiness > 0 ? ((wi.revenue / rev.totalBusiness) * 100).toFixed(1) + '%' : '—'}</td>
                              </tr>
                            )
                          })()}
                          {/* Remaining offline channels */}
                          {rev.offline && Object.entries(rev.offline)
                            .filter(([ch]) => ch !== 'Walk In')
                            .map(([ch, v]) => (
                              <tr key={ch} className="border-t">
                                <td></td>
                                <td className="px-3 py-2 pl-6 text-gray-600">↳ {ch}</td>
                                <td className="px-3 py-2 text-right tabular-nums text-gray-700">{formatNum(v.revenue)}</td>
                                <td className="px-3 py-2 text-right tabular-nums hidden sm:table-cell text-gray-600">{v.reservations}</td>
                                <td className="px-3 py-2 text-right tabular-nums hidden md:table-cell text-gray-600">{calcAvgSpend(v.revenue, v.reservations)}</td>
                                <td className="px-3 py-2 text-right hidden md:table-cell text-gray-500 text-xs">{rev.totalBusiness > 0 ? ((v.revenue / rev.totalBusiness) * 100).toFixed(1) + '%' : '—'}</td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CollapsibleSection>
              )
            })()}

            {currentData.programmatic && (
              <CollapsibleSection title="Programmatic Performance" color="#4a5568" icon={Target}>
                <div className="table-responsive">
                  <table className="w-full text-sm mb-4">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Creative</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Format</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Size</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Clicks</th>
                        <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.programmatic.creatives?.map((c, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2.5 font-medium truncate max-w-[150px]">{c.file}</td>
                          <td className="px-3 py-2.5 hidden md:table-cell">{c.format}</td>
                          <td className="px-3 py-2.5 hidden md:table-cell">{c.size}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.impressions)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.clicks)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{c.ctr}</td>
                        </tr>
                      ))}
                      {currentData.programmatic.totals && (
                        <tr className="border-t bg-gray-100 font-semibold">
                          <td className="px-3 py-2.5">TOTALS</td>
                          <td className="hidden md:table-cell"></td>
                          <td className="hidden md:table-cell"></td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(currentData.programmatic.totals.impressions)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(currentData.programmatic.totals.clicks)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{currentData.programmatic.totals.ctr}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {currentData.programmatic.viewability && (
                  <div className="flex gap-6 text-sm text-gray-600 mt-2">
                    <span>Viewability: <strong className="text-gray-900">{currentData.programmatic.viewability}</strong></span>
                    <span>VTR: <strong className="text-gray-900">{currentData.programmatic.vtr}</strong></span>
                  </div>
                )}
              </CollapsibleSection>
            )}

            {/* Live Campaigns hidden until data is updated
            {currentData.liveCampaigns?.length > 0 && (
              <CollapsibleSection title={`Live Campaigns - ${selectedVenue}`} color="#9333ea" icon={Megaphone}>
                ...
              </CollapsibleSection>
            )}
            */}
          </div>
        )}

        {/* LIVE CAMPAIGNS TAB */}
        {activeTab === 'live' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <label htmlFor="live-venue-select" className="block text-xs font-medium text-gray-500 mb-1">Select Venue</label>
              <select
                id="live-venue-select"
                value={liveCampaignVenue}
                onChange={(e) => setLiveCampaignVenue(e.target.value)}
                className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-purple/30 focus:border-mpj-purple cursor-pointer"
              >
                {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>

            <CollapsibleSection title={`Live Campaigns - ${liveCampaignVenue}`} icon={Megaphone}>
              {liveCampaigns[liveCampaignVenue]?.length > 0 ? (
                <div className="table-responsive">
                  <table className="w-full text-sm">
                    <thead className="bg-mpj-teal/50 border-b">
                      <tr>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Type</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Name</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden sm:table-cell">Language</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Format</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Captions</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Landing Page</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveCampaigns[liveCampaignVenue].map((c, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium text-white ${(c.type === 'Dark Post' || c.type === 'Dark') ? 'bg-blue-500' : 'bg-pink-400'}`}>
                              {c.type === 'Dark' ? 'Dark Post' : c.type}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-medium">{c.name}</td>
                          <td className="px-3 py-2.5 hidden sm:table-cell">{c.language}</td>
                          <td className="px-3 py-2.5 hidden md:table-cell">
                            <span className={`px-2 py-1 rounded-md text-xs ${c.format === 'Carousel' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{c.format}</span>
                          </td>
                          <td className="px-3 py-2.5 hidden md:table-cell">
                            <span className={`px-2 py-1 rounded-md text-xs ${c.captions === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.captions}</span>
                          </td>
                          <td className="px-3 py-2.5 hidden lg:table-cell">
                            {c.landing_page?.startsWith('http') ? (
                              <a href={c.landing_page} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs truncate max-w-[180px]">
                                {c.landing_page.replace('https://', '').substring(0, 25)}...
                                <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">{c.landing_page || '--'}</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold text-white ${c.status === 'active' ? 'bg-green-500' : c.status === 'learning' ? 'bg-amber-500' : c.status === 'not_delivering' || c.status === 'inactive' ? 'bg-red-400' : 'bg-gray-400'}`}>{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Megaphone size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No live campaigns for this venue</p>
                </div>
              )}
            </CollapsibleSection>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400 no-print">
          Made with ❤️ by <a href="https://omnixia.ai/" target="_blank" rel="noopener noreferrer" className="text-mpj-purple hover:underline font-medium">Omnixia</a>
        </div>
      </main>

      {/* Creative Upload Modal */}
      {showUploadModal && (
        <CreativeUpload
          venues={venues}
          weeklyReports={weeklyReports}
          onSuccess={handleCreativeUploaded}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  )
}
