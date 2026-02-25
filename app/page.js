'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Download, BarChart3, Calendar, TrendingUp, Megaphone, ExternalLink, Users, Lightbulb, RefreshCw, LogOut, DollarSign, ShoppingBag, Target, Upload, Image as ImageIcon, Eye, MousePointerClick, Percent, Instagram, MessageSquare, Settings, Copy, Check, ChevronRight } from 'lucide-react'
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
const COLORS = ['#D4A853', '#1C1917', '#78716C', '#C4956A', '#8FAF8A', '#C4726A']
const AUTO_REFRESH_MS = 5 * 60 * 1000 // 5 minutes

// ── Venue logo map ───────────────────────────
const VENUE_LOGOS = {
  'Above Eleven': '/logos/above eleven logo.png',
  'Acquasale':    '/logos/acquasale by cucina logo.jpg',
  'BHB':          '/logos/bhb logo.webp',
  'Cucina':       '/logos/cucina logo.png',
  'Smoki Moto':   '/logos/smoki-moto-logo.png',
  'Layalina':     '/logos/layalina logo.webp',
  'Resort':       '/logos/Marriott_logo.avif',
  'Myami':        '/logos/myami logo.webp',
  'SPA':          '/logos/spa logo.png',
}
const getVenueLogo = (name) => {
  if (!name) return null
  return VENUE_LOGOS[name] ?? VENUE_LOGOS[Object.keys(VENUE_LOGOS).find(k => k.toLowerCase() === name.toLowerCase())] ?? null
}

// ── Custom chart tooltip ──────────────────────
const ChartTooltip = ({ active, payload, label, prefix = 'AED ', suffix = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl shadow-tooltip px-3 py-2.5 border border-white/10" style={{ minWidth: 130 }}>
      {label && <p className="text-gray-400 mb-1.5 font-medium truncate max-w-[180px]">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mt-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color || p.fill || '#D4A853' }} />
          <span className="text-gray-300 truncate">{p.name}</span>
          <span className="font-semibold text-white ml-auto pl-2 tabular-nums">
            {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : p.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  )
}

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

// ── Meta status badge ─────────────────────────
const MetaStatusBadge = ({ status }) => {
  if (!status || status === 'UNKNOWN') return null
  const s = status.toUpperCase()
  const isActive      = s === 'ACTIVE'
  const isPaused      = s === 'PAUSED' || s === 'CAMPAIGN_PAUSED' || s === 'ADSET_PAUSED'
  const isIssue       = s === 'WITH_ISSUES' || s === 'DISAPPROVED' || s === 'DELETED'
  const isPending     = s === 'IN_PROCESS' || s === 'PENDING_REVIEW' || s === 'PREAPPROVED'
  const isCompleted   = s === 'COMPLETED' || s === 'ARCHIVED'

  const cls = isActive    ? 'bg-green-100 text-green-700 border-green-200'
            : isPaused    ? 'bg-gray-100 text-gray-500 border-gray-200'
            : isIssue     ? 'bg-red-100 text-red-600 border-red-200'
            : isPending   ? 'bg-amber-100 text-amber-700 border-amber-200'
            : isCompleted ? 'bg-blue-100 text-blue-600 border-blue-200'
            :               'bg-gray-100 text-gray-400 border-gray-200'

  const dot = isActive  ? 'bg-green-500'
            : isPaused  ? 'bg-gray-400'
            : isIssue   ? 'bg-red-400'
            : isPending ? 'bg-amber-400'
            :             'bg-blue-400'

  const label = s === 'CAMPAIGN_PAUSED' ? 'Camp. Paused'
              : s === 'ADSET_PAUSED'    ? 'Set Paused'
              : s === 'IN_PROCESS'      ? 'In Process'
              : s === 'PENDING_REVIEW'  ? 'In Review'
              : s === 'WITH_ISSUES'     ? 'Issues'
              : s.charAt(0) + s.slice(1).toLowerCase()

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

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
  const [adStatuses, setAdStatuses] = useState({})   // { "venueId_weekStart_weekEnd_adName": bool }
  const [venueTab, setVenueTab] = useState('overview')

  // ── Admin / Meta state ────────────────────
  const [userRole, setUserRole] = useState('client')
  const [activeAdminSection, setActiveAdminSection] = useState('sync')
  const [syncWeekStart, setSyncWeekStart] = useState('')
  const [syncWeekEnd, setSyncWeekEnd]   = useState('')
  const [syncing, setSyncing]           = useState(false)
  const [syncResult, setSyncResult]     = useState(null)
  const [mappings, setMappings]         = useState([])
  const [draft, setDraft]               = useState(null)
  const [publishingVenue, setPublishingVenue] = useState(null)
  const [columnVisibility, setColumnVisibility] = useState({ spend: false, impressions: true, ctr: true, linkClicks: true, engagement: true, reach: false })
  const [shortLivedToken, setShortLivedToken] = useState('')
  const [longLivedToken, setLongLivedToken]   = useState('')
  const [tokenExchanging, setTokenExchanging] = useState(false)
  const [copiedToken, setCopiedToken]   = useState(false)
  const [savingColumns, setSavingColumns] = useState(false)

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
      const role = sessionStorage.getItem('mpj_role')
      if (role === 'admin') setUserRole('admin')
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
      const [venuesRes, reportsRes, campaignsRes, workspaceRes, monthlyRes, creativesRes, socialRes, adNotesRes, adStatusesRes, colVisRes] = await Promise.all([
        supabase.from('venues').select('*').order('name'),
        supabase.from('weekly_reports').select('*, venues(name, poc)').order('week_end', { ascending: false }),
        supabase.from('live_campaigns').select('*, venues(name)'),
        supabase.from('workspace_budgets').select('*').order('month').order('brand'),
        supabase.from('monthly_rollups').select('*').order('month'),
        supabase.from('ad_creatives').select('*, venues(name)').order('created_at', { ascending: false }),
        supabase.from('social_media_monthly').select('*, venues(name)').order('month', { ascending: false }),
        supabase.from('ad_notes').select('*'),
        supabase.from('ad_statuses').select('*'),
        supabase.from('report_settings').select('setting_value').eq('setting_key', 'meta_column_visibility').maybeSingle(),
      ])

      // Load column visibility (ignore error if table not yet created)
      if (colVisRes?.data?.setting_value) {
        setColumnVisibility(colVisRes.data.setting_value)
      }

      // Check for errors
      const errors = [venuesRes, reportsRes, campaignsRes, workspaceRes, monthlyRes, creativesRes, socialRes, adNotesRes, adStatusesRes]
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

      // Build ad_statuses lookup map: "venueId_weekStart_weekEnd_adName" -> is_active (bool)
      const statusesMap = {}
      ;(adStatusesRes.data || []).forEach(s => {
        statusesMap[`${s.venue_id}_${s.week_start}_${s.week_end}_${s.ad_name}`] = s.is_active
      })
      setAdStatuses(statusesMap)

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
    const [weekStart, weekEnd] = weekKey ? weekKey.split('_') : ['', '']

    // Merge ad_statuses overrides into the ads array
    const applyStatuses = (ads) => {
      if (!ads) return []
      return sortByImpressions(ads).map(ad => {
        const key = `${venue?.id}_${weekStart}_${weekEnd}_${ad.name}`
        if (key in adStatuses) {
          return { ...ad, status: adStatuses[key] ? 'active' : 'inactive' }
        }
        return ad
      })
    }

    const sortedMeta = report?.meta_data ? {
      campaigns: sortByImpressions(report.meta_data.campaigns),
      adSets: sortByImpressions(report.meta_data.adSets),
      ads: applyStatuses(report.meta_data.ads),
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
  }, [venues, weeklyReports, liveCampaigns, sortByImpressions, adStatuses])

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

  // Toggle ad status (active ↔ inactive) — persists to ad_statuses table
  const toggleAdStatus = useCallback(async (venueName, weekKey, adName, currentStatus) => {
    const venue = venues.find(v => v.name === venueName)
    if (!venue) return
    const [weekStart, weekEnd] = weekKey.split('_')
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const statusKey = `${venue.id}_${weekStart}_${weekEnd}_${adName}`

    // Optimistic update — flat map, no JSONB surgery
    setAdStatuses(prev => ({ ...prev, [statusKey]: newStatus === 'active' }))

    try {
      const res = await fetch('/api/ads/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue_id: venue.id, week_start: weekStart, week_end: weekEnd, ad_name: adName, status: newStatus })
      })
      const resBody = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(resBody?.error || 'Failed to save')
      setToast({ message: `Ad marked ${newStatus}`, type: 'success' })
    } catch {
      setToast({ message: 'Failed to update status', type: 'error' })
      // Revert optimistic update
      setAdStatuses(prev => ({ ...prev, [statusKey]: currentStatus === 'active' }))
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
    sessionStorage.removeItem('mpj_role')
    window.location.href = '/login'
  }

  // ── Admin callbacks ────────────────────────
  const loadMappings = useCallback(async () => {
    const res = await fetch('/api/meta/mappings')
    const json = await res.json()
    if (json.mappings) setMappings(json.mappings)
  }, [])

  const loadLatestDraft = useCallback(async (weekStart, weekEnd) => {
    const params = weekStart && weekEnd ? `?week_start=${weekStart}&week_end=${weekEnd}` : ''
    const res = await fetch(`/api/meta/draft${params}`)
    const json = await res.json()
    setDraft(json.draft || null)
  }, [])

  const handleSync = useCallback(async () => {
    if (!syncWeekStart || !syncWeekEnd) {
      setToast({ message: 'Select a week range first', type: 'error' }); return
    }
    setSyncing(true); setSyncResult(null)
    try {
      const res = await fetch('/api/meta/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week_start: syncWeekStart, week_end: syncWeekEnd })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Sync failed')
      setSyncResult(json)
      setToast({ message: `Synced ${json.campaigns_fetched} campaigns`, type: 'success' })
      await loadMappings()
      await loadLatestDraft(syncWeekStart, syncWeekEnd)
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setSyncing(false)
    }
  }, [syncWeekStart, syncWeekEnd, loadMappings, loadLatestDraft])

  const handleSaveMappings = useCallback(async () => {
    try {
      const res = await fetch('/api/meta/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings: mappings.map(m => ({ campaign_id: m.campaign_id, campaign_name: m.campaign_name, venue_id: m.venue_id || null })) })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setToast({ message: 'Mappings saved', type: 'success' })
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    }
  }, [mappings])

  const handleDraftOverride = useCallback(async (venueId, level, index, field, value) => {
    if (!draft) return
    // Optimistic local update
    setDraft(prev => {
      if (!prev) return prev
      const overrides = { ...prev.overrides }
      if (!overrides[venueId]) overrides[venueId] = {}
      if (!overrides[venueId][level]) overrides[venueId][level] = {}
      if (!overrides[venueId][level][index]) overrides[venueId][level][index] = {}
      overrides[venueId][level][index][field] = value
      return { ...prev, overrides }
    })
    try {
      const res = await fetch('/api/meta/draft', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft_id: draft.id, venue_id: venueId, level, index, field, value })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
    } catch (err) {
      setToast({ message: 'Failed to save override', type: 'error' })
    }
  }, [draft])

  const handlePublishVenue = useCallback(async (venueId) => {
    if (!draft) return
    setPublishingVenue(venueId)
    try {
      const res = await fetch('/api/meta/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft_id: draft.id, venue_id: venueId })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Publish failed')
      setToast({ message: `Published for venue — AED ${json.ad_spend?.toFixed(0)} spend`, type: 'success' })
      await fetchData(true)
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setPublishingVenue(null)
    }
  }, [draft, fetchData])

  const handleSaveColumns = useCallback(async (newCols) => {
    setSavingColumns(true)
    try {
      const res = await fetch('/api/settings/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: newCols })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setColumnVisibility(newCols)
      setToast({ message: 'Column settings saved', type: 'success' })
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setSavingColumns(false)
    }
  }, [])

  const handleTokenExchange = useCallback(async () => {
    setTokenExchanging(true); setLongLivedToken('')
    try {
      const res = await fetch('/api/meta/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shortLivedToken ? { short_lived_token: shortLivedToken } : {})
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Exchange failed')
      setLongLivedToken(json.long_lived_token)
      setToast({ message: `Token valid for ~${Math.round(json.expires_in / 86400)} days`, type: 'success' })
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setTokenExchanging(false)
    }
  }, [shortLivedToken])

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Calendar },
    // { id: 'executive', label: 'Executive Summary', icon: TrendingUp },
    { id: 'venue', label: 'Venue View', icon: BarChart3 },
    // { id: 'live', label: 'Live Campaigns', icon: Megaphone }
    ...(userRole === 'admin' ? [{ id: 'admin', label: 'Admin', icon: Settings }] : []),
  ]

  // ── Render guards ──────────────────────
  if (!authChecked) return null
  if (!isAuthenticated) return null
  if (loading) return <DashboardSkeleton />
  if (error && venues.length === 0) return <ErrorState message={error} onRetry={() => fetchData()} />

  // ── Render ─────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f7f9]">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ──────────────────────── */}
      <header className="header-gradient text-white px-4 md:px-6 py-4 no-print shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img src="/logos/Marriott_logo.avif" alt="Marriott" className="h-9 md:h-11 w-auto object-contain brightness-0 invert" />
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
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs md:text-sm cursor-pointer disabled:opacity-50 transition-all duration-200 backdrop-blur-sm border border-white/10"
              aria-label="Refresh data"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs md:text-sm cursor-pointer transition-all duration-200 backdrop-blur-sm border border-white/10"
              aria-label="Export to CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-red-500/40 rounded-xl text-xs md:text-sm cursor-pointer transition-all duration-200 backdrop-blur-sm border border-white/10"
              aria-label="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Tabs ────────────────────────── */}
      <nav className="bg-white border-b sticky top-0 z-30 no-print shadow-sm" aria-label="Dashboard sections">
        <div className="max-w-7xl mx-auto flex gap-1 px-4 md:px-6 py-2 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-mpj-charcoal text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <tab.icon size={14} />
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
            <div className="card p-4 flex items-center gap-4 flex-wrap">
              <div className="min-w-[200px]">
                <label htmlFor="budget-month-select" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Month</label>
                <select
                  id="budget-month-select"
                  value={selectedBudgetMonth || ''}
                  onChange={(e) => setSelectedBudgetMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold cursor-pointer bg-white input-shadow"
                >
                  {workspaceMonths.map(m => (
                    <option key={m} value={m}>{formatMonth(m)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {workspaceMonths.map(m => {
                  const isActive = m === selectedBudgetMonth
                  const monthLabel = new Date(m + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                  return (
                    <button
                      key={m}
                      onClick={() => setSelectedBudgetMonth(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive ? 'bg-mpj-charcoal text-white shadow-sm' : 'bg-mpj-bone-dark text-mpj-charcoal-muted hover:bg-mpj-warm hover:text-mpj-charcoal'
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
                  <thead>
                    <tr className="bg-mpj-gold-xlight border-b border-mpj-warm">
                      <th className="text-left px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Brand</th>
                      <th className="text-left px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider hidden sm:table-cell">POC</th>
                      <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Budget</th>
                      <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Spend</th>
                      <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider hidden sm:table-cell">Remaining</th>
                      <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">% Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkspaceData.map((w, i) => (
                      <tr key={i} className={`border-t border-gray-100 hover:bg-mpj-gold-xlight/60 transition-colors duration-150 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                        <td className="px-3 py-3 font-semibold text-gray-900">{w.brand}</td>
                        <td className="px-3 py-3 text-gray-500 hidden sm:table-cell text-sm">{getBrandPOC(w.brand)}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-gray-700 text-sm">AED {formatNum(w.monthly_budget)}</td>
                        <td className="px-3 py-3 text-right tabular-nums font-semibold text-gray-900 text-sm">AED {formatNum(w.total_spend)}</td>
                        <td className={`px-3 py-3 text-right tabular-nums hidden sm:table-cell text-sm font-semibold ${parseFloat(w.remaining) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          AED {formatNum(w.remaining)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className={`badge ${parseFloat(w.pct_spent) > 90 ? 'badge-red' : parseFloat(w.pct_spent) > 70 ? 'badge-amber' : 'badge-green'}`}>
                            {w.pct_spent}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Totals Row */}
                    {filteredWorkspaceData.length > 0 && (
                      <tr className="border-t-2 border-mpj-charcoal/15 bg-mpj-gold-xlight font-bold">
                        <td className="px-3 py-3 text-mpj-charcoal">TOTAL</td>
                        <td className="hidden sm:table-cell"></td>
                        <td className="px-3 py-3 text-right tabular-nums text-gray-700">AED {formatNum(workspaceTotals.budget)}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-gray-900">AED {formatNum(workspaceTotals.spend)}</td>
                        <td className={`px-3 py-3 text-right tabular-nums hidden sm:table-cell ${workspaceTotals.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          AED {formatNum(workspaceTotals.remaining)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="badge badge-charcoal">{workspaceTotals.budget > 0 ? ((workspaceTotals.spend / workspaceTotals.budget) * 100).toFixed(1) + '%' : '0.0%'}</span>
                        </td>
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
                          <td className="px-3 py-2.5 text-right font-semibold text-mpj-charcoal">{calcROAS(d)}</td>
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
                        <Tooltip content={<ChartTooltip />} />
                        <Legend />
                        <Bar dataKey="ad_spend" fill="#D4A853" name="Ad Spend" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="revenue" fill="#1C1917" name="Revenue" radius={[4, 4, 0, 0]} />
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
                        <Tooltip content={<ChartTooltip prefix="" suffix="" />} />
                        <Line type="monotone" dataKey="reservations" stroke="#D4A853" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
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
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="spend" fill="#D4A853" radius={[0, 4, 4, 0]} />
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
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* VENUE VIEW TAB */}
        {activeTab === 'venue' && currentData && (
          <div className="space-y-3 animate-fade-in">

            {/* ── Control bar ── */}
            <div className="flex items-center gap-3 flex-wrap card p-4">
              <div className="flex-1 min-w-[180px]">
                <label htmlFor="venue-select" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Venue</label>
                <select
                  id="venue-select"
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold cursor-pointer bg-white input-shadow"
                >
                  {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="week-select" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Reporting Week</label>
                <select
                  id="week-select"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold cursor-pointer bg-white input-shadow"
                >
                  {allWeeks.map(w => <option key={w.key} value={w.key}>{w.label}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-3 pb-0.5">
                {getVenueLogo(selectedVenue) && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Venue</span>
                    <div className="h-8 flex items-center bg-white border border-mpj-warm rounded-lg px-2 py-1">
                      <img
                        src={getVenueLogo(selectedVenue)}
                        alt={selectedVenue}
                        className="h-6 w-auto max-w-[110px] object-contain"
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">POC</span>
                  <span className="text-sm font-bold text-mpj-charcoal bg-mpj-gold-xlight px-2.5 py-1 rounded-lg">{currentData.poc}</span>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-mpj-charcoal text-white hover:bg-mpj-charcoal-light rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Upload ad creative image"
                >
                  <Upload size={13} />
                  Upload Creative
                </button>
              </div>
            </div>

            {/* ── Inner tab bar ── */}
            <div className="flex gap-1 bg-mpj-bone-dark rounded-xl p-1 flex-wrap">
              {[
                { id: 'overview', label: 'Overview',  icon: BarChart3 },
                { id: 'meta',     label: 'Meta Ads',  icon: Megaphone },
                { id: 'revenue',  label: 'Revenue',   icon: DollarSign },
                { id: 'social',   label: 'Social',    icon: Instagram },
                { id: 'notes',    label: 'Notes',     icon: MessageSquare },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setVenueTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                    venueTab === t.id
                      ? 'bg-white text-mpj-charcoal shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <t.icon size={13} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* ══ OVERVIEW ══ */}
            {venueTab === 'overview' && (() => {
              const totalImpressions = currentData.meta.campaigns.reduce((s, c) => s + (c.impressions || 0), 0)
              const totalLinkClicks  = currentData.meta.campaigns.reduce((s, c) => s + (c.linkClicks  || 0), 0)
              const roas = currentData.adSpend > 0 && currentData.revenue?.totalOnline
                ? (currentData.revenue.totalOnline / currentData.adSpend).toFixed(2)
                : null
              return (
                <div className="space-y-4">
                  {/* KPI strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { label: 'Ad Spend',     value: `AED ${currentData.adSpend >= 1000 ? (currentData.adSpend/1000).toFixed(1)+'K' : formatNum(currentData.adSpend)}`, color: 'text-mpj-charcoal' },
                      { label: 'Impressions',  value: formatK(totalImpressions),  color: 'text-gray-800' },
                      { label: 'Link Clicks',  value: formatInt(totalLinkClicks), color: 'text-gray-800' },
                      { label: 'ROAS',         value: roas ? roas + 'x' : '—',   color: roas ? 'text-amber-600' : 'text-gray-400' },
                      { label: 'Revenue',      value: currentData.revenue ? `AED ${currentData.revenue.totalBusiness >= 1000 ? (currentData.revenue.totalBusiness/1000).toFixed(0)+'K' : formatNum(currentData.revenue.totalBusiness)}` : '—', color: 'text-green-700' },
                      { label: 'Reservations', value: currentData.revenue ? formatInt(currentData.revenue.totalReservations) : '—', color: 'text-blue-700' },
                    ].map(kpi => (
                      <div key={kpi.label} className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</p>
                        <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Compare panel */}
                  {compareMode && previousData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-900 mb-3 text-sm">Period Comparison</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-blue-600 font-medium">Impressions</p>
                          <p className="font-semibold text-gray-900">{formatInt(totalImpressions)}</p>
                          <DeltaBadge current={totalImpressions} previous={previousData.meta.campaigns.reduce((s, c) => s + (c.impressions || 0), 0)} />
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

                  {/* Analysis */}
                  {currentData.meta?.analysis && (
                    <div className="card p-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Lightbulb size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1.5 text-sm">Analysis Summary</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{currentData.meta.analysis.summary}</p>
                        </div>
                      </div>
                      {currentData.meta.analysis.recommendations?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Recommendations</h4>
                          <ul className="space-y-1.5">
                            {currentData.meta.analysis.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <span className="text-mpj-charcoal font-bold mt-0.5">–</span>
                                <span className="leading-relaxed">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* ══ META ADS ══ */}
            {venueTab === 'meta' && (
              <div className="space-y-6">
                {currentData.meta?.campaigns?.length > 0 ? (
                  <>
                    {/* Campaign table */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Campaign Level</h4>
                      <div className="table-responsive">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Campaign</th>
                              <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Status</th>
                              {(userRole === 'admin' || columnVisibility.impressions) && <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Impressions</th>}
                              {(userRole === 'admin' || columnVisibility.spend) && <th className="text-right px-3 py-2.5 font-semibold text-gray-600">Spend (AED)</th>}
                              {(userRole === 'admin' || columnVisibility.ctr) && <th className="text-right px-3 py-2.5 font-semibold text-gray-600">CTR</th>}
                              {(userRole === 'admin' || columnVisibility.linkClicks) && <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Link Clicks</th>}
                              {(userRole === 'admin' || columnVisibility.engagement) && <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Engagement</th>}
                              {(userRole === 'admin' || columnVisibility.reach) && <th className="text-right px-3 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Reach</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {currentData.meta.campaigns.map((c, i) => (
                              <tr key={i} className="border-t hover:bg-gray-50/50 transition-colors">
                                <td className="px-3 py-2.5 font-medium max-w-[200px] truncate">{c.name}</td>
                                <td className="px-3 py-2.5"><MetaStatusBadge status={c.status} /></td>
                                {(userRole === 'admin' || columnVisibility.impressions) && <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(c.impressions)}</td>}
                                {(userRole === 'admin' || columnVisibility.spend) && <td className="px-3 py-2.5 text-right tabular-nums">{c.spend != null ? formatNum(c.spend) : '—'}</td>}
                                {(userRole === 'admin' || columnVisibility.ctr) && <td className="px-3 py-2.5 text-right tabular-nums">{c.ctr ?? '—'}</td>}
                                {(userRole === 'admin' || columnVisibility.linkClicks) && <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(c.linkClicks)}</td>}
                                {(userRole === 'admin' || columnVisibility.engagement) && <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(c.engagement)}</td>}
                                {(userRole === 'admin' || columnVisibility.reach) && <td className="px-3 py-2.5 text-right tabular-nums hidden lg:table-cell">{c.reach != null ? formatInt(c.reach) : '—'}</td>}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Ad Set table */}
                    {currentData.meta.adSets?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Ad Set Level <span className="normal-case font-normal text-gray-400">(click to view audience)</span>
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

                    {/* Ad Level table */}
                    {currentData.meta.ads?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Ad Level <span className="normal-case font-normal text-gray-400 ml-1">· click status to toggle · click notes to edit</span>
                        </h4>
                        <div className="table-responsive">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-mpj-gold-xlight border-b border-mpj-warm">
                                <th className="px-2 py-3 w-12 hidden sm:table-cell"></th>
                                <th className="text-left px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Ad Name</th>
                                {(userRole === 'admin' || columnVisibility.impressions) && <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Impressions</th>}
                                {(userRole === 'admin' || columnVisibility.spend) && <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Spend</th>}
                                {(userRole === 'admin' || columnVisibility.ctr) && <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">CTR</th>}
                                {(userRole === 'admin' || columnVisibility.linkClicks) && <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider hidden md:table-cell">Link Clicks</th>}
                                {(userRole === 'admin' || columnVisibility.engagement) && <th className="text-right px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider hidden md:table-cell">Engagement</th>}
                                <th className="text-center px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Status</th>
                                <th className="text-left px-3 py-3 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider min-w-[180px]">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
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
                                    <tr key={i} className={`border-t border-gray-100 hover:bg-mpj-gold-xlight/60 transition-colors duration-150 ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                                      <td className="px-2 py-2 hidden sm:table-cell">
                                        <CreativeThumb creative={getCreativeForAd(selectedVenue, a.name, currentData.weekStart)} size={36} />
                                      </td>
                                      <td className="px-3 py-2.5 max-w-[200px] font-medium">
                                        <div className="relative group/adname">
                                          <span className="block truncate cursor-default">{a.name}</span>
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
                                      {(userRole === 'admin' || columnVisibility.impressions) && <td className="px-3 py-2.5 text-right tabular-nums">{formatInt(a.impressions)}</td>}
                                      {(userRole === 'admin' || columnVisibility.spend) && <td className="px-3 py-2.5 text-right tabular-nums">{a.spend != null ? formatNum(a.spend) : '—'}</td>}
                                      {(userRole === 'admin' || columnVisibility.ctr) && <td className="px-3 py-2.5 text-right tabular-nums">{a.ctr ?? '—'}</td>}
                                      {(userRole === 'admin' || columnVisibility.linkClicks) && <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(a.linkClicks)}</td>}
                                      {(userRole === 'admin' || columnVisibility.engagement) && <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{formatInt(a.engagement)}</td>}
                                      <td className="px-3 py-2.5 text-center">
                                        <button
                                          onClick={() => toggleAdStatus(selectedVenue, selectedWeek, a.name, a.status)}
                                          title="Click to toggle active / inactive"
                                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 border ${
                                            a.status === 'active'
                                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                              : a.status === 'learning'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                : a.status === 'not_delivering' || a.status === 'inactive'
                                                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                          }`}
                                        >
                                          <span className={`w-1.5 h-1.5 rounded-full ${
                                            a.status === 'active' ? 'bg-green-500' :
                                            a.status === 'learning' ? 'bg-amber-500' :
                                            a.status === 'not_delivering' || a.status === 'inactive' ? 'bg-red-400' : 'bg-gray-400'
                                          }`} />
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
                                              if (val !== noteVal) saveAdNote(selectedVenue, selectedWeek, a.name, val)
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.target.blur() }
                                            }}
                                            className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-mpj-gold/40 focus:border-mpj-gold resize-none bg-white hover:bg-gray-50 transition-colors min-w-[160px]"
                                          />
                                          {isSaving && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-mpj-charcoal animate-pulse">saving...</span>}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Creative Gallery */}
                    {adCreatives.filter(c => c.venues?.name === selectedVenue).length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Creative Gallery</h4>
                        <CreativeGallery
                          creatives={adCreatives.filter(c => c.venues?.name === selectedVenue)}
                          onDelete={handleCreativeDeleted}
                        />
                      </div>
                    )}

                    {/* Programmatic */}
                    {currentData.programmatic && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Programmatic Performance</h4>
                        <div className="table-responsive">
                          <table className="w-full text-sm mb-3">
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
                          <div className="flex gap-6 text-sm text-gray-600">
                            <span>Viewability: <strong className="text-gray-900">{currentData.programmatic.viewability}</strong></span>
                            <span>VTR: <strong className="text-gray-900">{currentData.programmatic.vtr}</strong></span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <Megaphone size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No Meta Ads data for this week.</p>
                  </div>
                )}
              </div>
            )}

            {/* ══ REVENUE ══ */}
            {venueTab === 'revenue' && (
              currentData.revenue ? (() => {
                const rev = currentData.revenue
                const onlinePct = rev.totalBusiness > 0 ? ((rev.totalOnline / rev.totalBusiness) * 100) : 0
                const resPct = rev.totalReservations > 0 ? ((rev.onlineReservations / rev.totalReservations) * 100) : 0
                const roas = currentData.adSpend > 0 ? (rev.totalOnline / currentData.adSpend) : null
                const offlineTotal = rev.totalBusiness - rev.totalOnline
                const donutData = [{ name: 'Online', value: rev.totalOnline }, { name: 'Offline', value: offlineTotal }]
                const onlineChannels = rev.channels
                  ? Object.entries(rev.channels).filter(([, v]) => v.revenue > 0).sort((a, b) => b[1].revenue - a[1].revenue)
                  : []
                const topChannel = onlineChannels[0]
                const walkInRevenue = rev.offline?.['Walk In']?.revenue || 0
                const onlineVsWalkIn = walkInRevenue > 0 ? ((rev.totalOnline / walkInRevenue) * 100).toFixed(0) : null
                return (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gradient-to-br from-mpj-gold/12 to-mpj-gold/5 border border-mpj-charcoal/15 rounded-xl p-3.5">
                        <p className="text-xs font-medium text-mpj-charcoal/70 mb-1">Online Revenue Share</p>
                        <p className="text-2xl font-bold text-mpj-charcoal">{onlinePct.toFixed(1)}%</p>
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
                    <div className="flex flex-wrap gap-2">
                      {topChannel && (
                        <div className="insight-pill bg-mpj-gold-xlight border-mpj-charcoal/15 text-gray-700">
                          <span className="w-6 h-6 rounded-lg bg-mpj-gold flex items-center justify-center text-mpj-charcoal text-xs flex-shrink-0">★</span>
                          Top channel: <strong className="text-mpj-charcoal">{topChannel[0]}</strong> — AED {formatNum(topChannel[1].revenue)} · {topChannel[1].reservations} reservations
                        </div>
                      )}
                      {onlineVsWalkIn && (
                        <div className="insight-pill bg-green-50 border-green-200 text-gray-700">
                          <span className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0">↑</span>
                          Online is <strong className="text-green-700 mx-1">{onlineVsWalkIn}%</strong> of Walk-In revenue
                        </div>
                      )}
                      {roas && (
                        <div className="insight-pill bg-amber-50 border-amber-200 text-gray-700">
                          <span className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white text-xs flex-shrink-0">₿</span>
                          AED 1 spend → <strong className="text-amber-700 mx-1">AED {roas.toFixed(2)}</strong> online revenue
                        </div>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Revenue Split</h4>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`} labelLine={{ strokeWidth: 1 }}>
                              <Cell fill="#D4A853" /><Cell fill="#e5e7eb" />
                            </Pie>
                            <Tooltip content={<ChartTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      {onlineChannels.length > 0 && (
                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Online Channels by Revenue</h4>
                          <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={onlineChannels.map(([name, v]) => ({ name, revenue: v.revenue }))} layout="vertical" margin={{ left: 8, right: 16 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                              <XAxis type="number" tickFormatter={(v) => v >= 1000 ? (v/1000).toFixed(0)+'K' : v} tick={{ fontSize: 10 }} />
                              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                              <Tooltip content={<ChartTooltip />} />
                              <Bar dataKey="revenue" fill="#D4A853" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
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
                          <tr className="border-t bg-gray-50/80">
                            <td className="px-3 py-2.5 font-semibold text-mpj-charcoal">Overall</td>
                            <td className="px-3 py-2.5">Total Business</td>
                            <td className="px-3 py-2.5 text-right font-medium tabular-nums">{formatNum(rev.totalBusiness)}</td>
                            <td className="px-3 py-2.5 text-right font-medium tabular-nums hidden sm:table-cell">{formatInt(rev.totalReservations)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(rev.totalBusiness, rev.totalReservations)}</td>
                            <td className="px-3 py-2.5 text-right hidden md:table-cell">100%</td>
                          </tr>
                          <tr className="border-t">
                            <td className="px-3 py-2.5 font-semibold text-mpj-charcoal">Online</td>
                            <td className="px-3 py-2.5 font-medium">Total Online</td>
                            <td className="px-3 py-2.5 text-right tabular-nums font-medium">{formatNum(rev.totalOnline)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{formatInt(rev.onlineReservations)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(rev.totalOnline, rev.onlineReservations)}</td>
                            <td className="px-3 py-2.5 text-right hidden md:table-cell">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-mpj-charcoal/10 text-mpj-charcoal">{onlinePct.toFixed(1)}%</span>
                            </td>
                          </tr>
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
                          {rev.offline?.['Walk In'] && (() => {
                            const wi = rev.offline['Walk In']
                            return (
                              <tr className="border-t bg-gray-50/60">
                                <td className="px-3 py-2.5 font-semibold text-gray-500">Offline</td>
                                <td className="px-3 py-2.5 font-medium text-gray-700">Walk In <span className="ml-2 text-xs font-normal text-gray-400">#1 offline source</span></td>
                                <td className="px-3 py-2.5 text-right tabular-nums">{formatNum(wi.revenue)}</td>
                                <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">{wi.reservations}</td>
                                <td className="px-3 py-2.5 text-right tabular-nums hidden md:table-cell">{calcAvgSpend(wi.revenue, wi.reservations)}</td>
                                <td className="px-3 py-2.5 text-right hidden md:table-cell text-gray-500 text-xs">{rev.totalBusiness > 0 ? ((wi.revenue / rev.totalBusiness) * 100).toFixed(1) + '%' : '—'}</td>
                              </tr>
                            )
                          })()}
                          {rev.offline && Object.entries(rev.offline).filter(([ch]) => ch !== 'Walk In').map(([ch, v]) => (
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
                )
              })() : (
                <div className="text-center py-16 text-gray-400">
                  <DollarSign size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No revenue data for this week.</p>
                </div>
              )
            )}

            {/* ══ SOCIAL ══ */}
            {venueTab === 'social' && (
              socialMediaData.filter(d => d.venues?.name === selectedVenue).length > 0 ? (
                <SocialMediaInsights allData={socialMediaData} venueName={selectedVenue} />
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <Instagram size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No social media data for this venue.</p>
                </div>
              )
            )}

            {/* ══ NOTES ══ */}
            {venueTab === 'notes' && (() => {
              const venue = venues.find(v => v.name === selectedVenue)
              const noteKey = venue ? `${venue.id}_${selectedWeek}` : null
              const noteVal = noteKey ? (venueNotes[noteKey] || '') : ''
              return (
                <div className="space-y-4 max-w-2xl">
                  <div className="card p-5 border-l-4 border-l-mpj-gold">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MessageSquare size={14} className="text-mpj-charcoal" />
                        Meeting Notes — <span className="text-mpj-charcoal">{selectedVenue}</span>
                      </label>
                      {savingVenueNote && (
                        <span className="text-[10px] text-mpj-charcoal animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-mpj-gold animate-ping inline-block" />
                          saving...
                        </span>
                      )}
                    </div>
                    <textarea
                      key={noteKey}
                      defaultValue={noteVal}
                      placeholder="Add notes for your meeting — context, action items, observations..."
                      rows={8}
                      onBlur={(e) => { const val = e.target.value; if (val !== noteVal) saveVenueNote(selectedVenue, selectedWeek, val) }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) e.target.blur() }}
                      className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold resize-none bg-gray-50/80 hover:bg-white transition-colors placeholder:text-gray-300 input-shadow"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-gray-200 inline-flex items-center justify-center text-[8px] font-bold text-gray-500">⌘</span>
                      Enter to save · auto-saves on click away
                    </p>
                  </div>
                  {compareMode && previousData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-900 mb-3 text-sm">Period Comparison</h3>
                      <div className="grid grid-cols-3 gap-4">
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
                </div>
              )
            })()}

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
                className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold cursor-pointer"
              >
                {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>

            <CollapsibleSection title={`Live Campaigns - ${liveCampaignVenue}`} icon={Megaphone}>
              {liveCampaigns[liveCampaignVenue]?.length > 0 ? (
                <div className="table-responsive">
                  <table className="w-full text-sm">
                    <thead className="bg-mpj-warm/60 border-b">
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

        {/* ADMIN TAB */}
        {activeTab === 'admin' && userRole === 'admin' && (
          <div className="space-y-4 animate-fade-in">
            {/* Admin sub-nav */}
            <div className="flex gap-1 bg-mpj-bone-dark p-1 rounded-2xl w-fit">
              {[
                { id: 'sync',    label: 'Sync' },
                { id: 'draft',   label: 'Draft Review' },
                { id: 'settings',label: 'Settings' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveAdminSection(s.id)
                    if (s.id === 'draft' && !draft) loadLatestDraft()
                    if (s.id === 'sync' && mappings.length === 0) loadMappings()
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeAdminSection === s.id ? 'bg-mpj-charcoal text-white shadow-sm' : 'text-mpj-charcoal-muted hover:text-mpj-charcoal'}`}
                >{s.label}</button>
              ))}
            </div>

            {/* ── SYNC SECTION ── */}
            {activeAdminSection === 'sync' && (
              <div className="space-y-4">
                <div className="card p-5">
                  <h3 className="font-semibold text-mpj-charcoal mb-4 flex items-center gap-2"><RefreshCw size={16} /> Sync from Meta Ads</h3>
                  <div className="flex flex-wrap gap-4 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Week Start (Monday)</label>
                      <input type="date" value={syncWeekStart} onChange={e => setSyncWeekStart(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold input-shadow" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Week End (Sunday)</label>
                      <input type="date" value={syncWeekEnd} onChange={e => setSyncWeekEnd(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold input-shadow" />
                    </div>
                    <button
                      onClick={handleSync}
                      disabled={syncing || !syncWeekStart || !syncWeekEnd}
                      className="px-5 py-2 bg-mpj-charcoal text-white rounded-xl text-sm font-medium hover:bg-mpj-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                      {syncing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Syncing...</> : <><RefreshCw size={14} /> Sync from Meta</>}
                    </button>
                  </div>
                  {syncResult && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm">
                      <p className="font-medium text-green-800">Sync complete ✓</p>
                      <p className="text-green-700 mt-1">
                        {syncResult.campaigns_fetched} campaigns · {syncResult.adsets_fetched} ad sets · {syncResult.ads_fetched} ads
                        {syncResult.unmapped_campaigns > 0 && <span className="ml-2 text-amber-700">⚠ {syncResult.unmapped_campaigns} unmapped campaigns</span>}
                      </p>
                    </div>
                  )}
                </div>

                {/* Campaign Mappings */}
                {mappings.length > 0 && (
                  <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-mpj-charcoal flex items-center gap-2"><Target size={16} /> Campaign → Venue Mapping</h3>
                      <button onClick={handleSaveMappings} className="px-4 py-1.5 bg-mpj-gold text-white rounded-xl text-xs font-medium hover:bg-mpj-charcoal transition-colors cursor-pointer">Save Mappings</button>
                    </div>
                    <div className="table-responsive">
                      <table className="w-full text-sm">
                        <thead className="bg-mpj-gold-xlight border-b border-mpj-warm">
                          <tr>
                            <th className="text-left px-3 py-2.5 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Campaign Name</th>
                            <th className="text-left px-3 py-2.5 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider w-48">Venue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mappings.map((m, i) => (
                            <tr key={m.campaign_id} className={`border-t border-gray-100 ${!m.venue_id ? 'bg-amber-50' : ''}`}>
                              <td className="px-3 py-2.5 text-gray-800 font-medium">
                                {!m.venue_id && <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2" />}
                                {m.campaign_name}
                                <span className="text-gray-400 text-xs ml-2 font-normal hidden md:inline">{m.campaign_id}</span>
                              </td>
                              <td className="px-3 py-2.5">
                                <select
                                  value={m.venue_id || ''}
                                  onChange={e => setMappings(prev => prev.map((mp, idx) => idx === i ? { ...mp, venue_id: e.target.value || null } : mp))}
                                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 cursor-pointer bg-white"
                                >
                                  <option value="">— Unassigned —</option>
                                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── DRAFT REVIEW SECTION ── */}
            {activeAdminSection === 'draft' && (
              <div className="space-y-4">
                {!draft ? (
                  <div className="card p-8 text-center text-gray-500">
                    <RefreshCw size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No draft found</p>
                    <p className="text-sm mt-1">Run a sync first to create a draft</p>
                    <button onClick={() => setActiveAdminSection('sync')} className="mt-4 px-4 py-2 bg-mpj-charcoal text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-mpj-charcoal-light transition-colors">
                      Go to Sync
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-semibold text-mpj-charcoal">Draft: {draft.week_start} → {draft.week_end}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Synced {new Date(draft.synced_at).toLocaleString()} {draft.published_at && `· Published ${new Date(draft.published_at).toLocaleDateString()}`}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <input type="date" value={syncWeekStart} onChange={e => setSyncWeekStart(e.target.value)} placeholder="Week start"
                          className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs input-shadow focus:outline-none focus:ring-2 focus:ring-mpj-gold/40" />
                        <input type="date" value={syncWeekEnd} onChange={e => setSyncWeekEnd(e.target.value)} placeholder="Week end"
                          className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs input-shadow focus:outline-none focus:ring-2 focus:ring-mpj-gold/40" />
                        <button onClick={() => loadLatestDraft(syncWeekStart, syncWeekEnd)} className="px-3 py-1.5 bg-mpj-bone-dark text-mpj-charcoal rounded-lg text-xs font-medium cursor-pointer hover:bg-mpj-warm transition-colors">Load Period</button>
                      </div>
                    </div>

                    {/* Unmapped warning */}
                    {draft.mapped_data?.__unmapped__?.campaigns?.length > 0 && (
                      <div className="card p-4 border-amber-200 bg-amber-50">
                        <p className="font-semibold text-amber-800 flex items-center gap-2">⚠ {draft.mapped_data.__unmapped__.campaigns.length} Unmapped Campaign(s)</p>
                        <p className="text-xs text-amber-700 mt-1">These campaigns are not assigned to any venue. Go to Sync tab → save mappings → re-sync.</p>
                        <div className="mt-2 space-y-1">
                          {draft.mapped_data.__unmapped__.campaigns.map(c => (
                            <p key={c.campaign_id} className="text-xs text-amber-800 font-medium">{c.name}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Per-venue draft cards */}
                    {venues.filter(v => draft.mapped_data?.[v.id]).map(v => {
                      const venueData  = draft.mapped_data[v.id]
                      const overrides  = draft.overrides?.[v.id] || {}
                      const campaigns  = venueData.campaigns || []
                      const isPublishing = publishingVenue === v.id

                      const getOverrideVal = (level, idx, field) => overrides?.[level]?.[idx]?.[field]
                      const isOverridden   = (level, idx, field) => getOverrideVal(level, idx, field) !== undefined

                      return (
                        <div key={v.id} className="card p-5">
                          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <h3 className="font-semibold text-mpj-charcoal text-base">{v.name}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400">{campaigns.length} campaigns · AED {campaigns.reduce((s,c)=>s+(parseFloat(c.spend)||0),0).toFixed(0)} spend</span>
                              <button
                                onClick={() => handlePublishVenue(v.id)}
                                disabled={isPublishing}
                                className="px-4 py-1.5 bg-green-600 text-white rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                              >
                                {isPublishing ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</> : <><ChevronRight size={12} /> Publish to Client</>}
                              </button>
                            </div>
                          </div>
                          {campaigns.length > 0 && (
                            <div className="table-responsive">
                              <table className="w-full text-sm">
                                <thead className="bg-mpj-gold-xlight border-b border-mpj-warm">
                                  <tr>
                                    <th className="text-left px-3 py-2 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Campaign</th>
                                    <th className="text-left px-3 py-2 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-right px-3 py-2 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Impressions</th>
                                    <th className="text-right px-3 py-2 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider">Spend (AED)</th>
                                    <th className="text-right px-3 py-2 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider hidden sm:table-cell">CTR</th>
                                    <th className="text-right px-3 py-2 font-semibold text-mpj-charcoal text-xs uppercase tracking-wider hidden sm:table-cell">Link Clicks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {campaigns.map((c, idx) => (
                                    <tr key={idx} className="border-t border-gray-100 hover:bg-mpj-gold-xlight/40">
                                      <td className="px-3 py-2 font-medium text-gray-800">{c.name}</td>
                                      <td className="px-3 py-2"><MetaStatusBadge status={c.status} /></td>
                                      <td className={`px-3 py-2 text-right tabular-nums ${isOverridden('campaigns', idx, 'impressions') ? 'bg-yellow-50 text-yellow-800 font-semibold' : 'text-gray-700'}`}>
                                        <input
                                          type="number"
                                          defaultValue={getOverrideVal('campaigns', idx, 'impressions') ?? c.impressions}
                                          onBlur={e => { if (parseInt(e.target.value) !== c.impressions) handleDraftOverride(v.id, 'campaigns', idx, 'impressions', parseInt(e.target.value)) }}
                                          className="w-24 text-right bg-transparent focus:bg-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-300 rounded px-1"
                                        />
                                      </td>
                                      <td className={`px-3 py-2 text-right tabular-nums ${isOverridden('campaigns', idx, 'spend') ? 'bg-yellow-50 text-yellow-800 font-semibold' : 'text-gray-700'}`}>
                                        <input
                                          type="number" step="0.01"
                                          defaultValue={getOverrideVal('campaigns', idx, 'spend') ?? c.spend}
                                          onBlur={e => { if (parseFloat(e.target.value) !== c.spend) handleDraftOverride(v.id, 'campaigns', idx, 'spend', parseFloat(e.target.value)) }}
                                          className="w-24 text-right bg-transparent focus:bg-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-300 rounded px-1"
                                        />
                                      </td>
                                      <td className="px-3 py-2 text-right tabular-nums text-gray-700 hidden sm:table-cell">{(getOverrideVal('campaigns', idx, 'ctr') ?? c.ctr)?.toFixed(2)}%</td>
                                      <td className="px-3 py-2 text-right tabular-nums text-gray-700 hidden sm:table-cell">{formatInt(getOverrideVal('campaigns', idx, 'linkClicks') ?? c.linkClicks)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* Ad Set table */}
                          {(() => {
                            const adSets = venueData.adSets || []
                            if (adSets.length === 0) return null
                            return (
                              <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ad Sets ({adSets.length})</p>
                                <div className="table-responsive">
                                  <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                      <tr>
                                        <th className="text-left px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Ad Set</th>
                                        <th className="text-left px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Impressions</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Spend (AED)</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">CTR</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Link Clicks</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {adSets.map((as, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50/60">
                                          <td className="px-3 py-2 text-gray-700 max-w-[220px] truncate">{as.name}</td>
                                          <td className="px-3 py-2"><MetaStatusBadge status={as.status} /></td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600">{formatInt(as.impressions)}</td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600">{as.spend != null ? formatNum(as.spend) : '—'}</td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600 hidden sm:table-cell">{as.ctr?.toFixed(2)}%</td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600 hidden sm:table-cell">{formatInt(as.linkClicks)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Ads table */}
                          {(() => {
                            const ads = venueData.ads || []
                            if (ads.length === 0) return null
                            return (
                              <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ads ({ads.length})</p>
                                <div className="table-responsive">
                                  <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                      <tr>
                                        <th className="text-left px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Ad Name</th>
                                        <th className="text-left px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Impressions</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Spend (AED)</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">CTR</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Link Clicks</th>
                                        <th className="text-right px-3 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Engagement</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ads.map((a, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50/60">
                                          <td className="px-3 py-2 text-gray-700 max-w-[220px] truncate">{a.name}</td>
                                          <td className="px-3 py-2"><MetaStatusBadge status={a.status} /></td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600">{formatInt(a.impressions)}</td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600">{a.spend != null ? formatNum(a.spend) : '—'}</td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600 hidden sm:table-cell">{a.ctr?.toFixed(2)}%</td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600 hidden sm:table-cell">{formatInt(a.linkClicks)}</td>
                                          <td className="px-3 py-2 text-right tabular-nums text-gray-600 hidden md:table-cell">{formatInt(a.engagement)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          })()}
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            )}

            {/* ── SETTINGS SECTION ── */}
            {activeAdminSection === 'settings' && (
              <div className="space-y-4">
                {/* Column Visibility */}
                <div className="card p-5">
                  <h3 className="font-semibold text-mpj-charcoal mb-1 flex items-center gap-2"><Eye size={16} /> Client Column Visibility</h3>
                  <p className="text-xs text-gray-400 mb-4">Admin always sees all columns. These settings control what clients see in the Meta Ads section.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {Object.entries(columnVisibility).map(([col, enabled]) => (
                      <label key={col} className="flex items-center gap-2.5 cursor-pointer group">
                        <div
                          onClick={() => setColumnVisibility(prev => ({ ...prev, [col]: !prev[col] }))}
                          className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${enabled ? 'bg-mpj-charcoal' : 'bg-gray-200'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'left-5' : 'left-0.5'}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-mpj-charcoal transition-colors">
                          {col === 'ctr' ? 'CTR' : col === 'linkClicks' ? 'Link Clicks' : col.charAt(0).toUpperCase() + col.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSaveColumns(columnVisibility)}
                    disabled={savingColumns}
                    className="px-5 py-2 bg-mpj-charcoal text-white rounded-xl text-sm font-medium hover:bg-mpj-charcoal-light transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {savingColumns ? 'Saving...' : 'Save Column Settings'}
                  </button>
                </div>

                {/* Token Exchange */}
                <div className="card p-5">
                  <h3 className="font-semibold text-mpj-charcoal mb-1 flex items-center gap-2"><Settings size={16} /> Meta Token Exchange</h3>
                  <p className="text-xs text-gray-400 mb-4">Exchange a short-lived token for a 60-day long-lived token. Paste it into Vercel env <code className="bg-gray-100 px-1 rounded">META_ACCESS_TOKEN</code> after.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Short-Lived Token (optional — leave blank to use current env token)</label>
                      <input
                        type="text"
                        value={shortLivedToken}
                        onChange={e => setShortLivedToken(e.target.value)}
                        placeholder="EAA..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-mpj-gold/40 focus:border-mpj-gold input-shadow"
                      />
                    </div>
                    <button
                      onClick={handleTokenExchange}
                      disabled={tokenExchanging}
                      className="px-5 py-2 bg-mpj-charcoal text-white rounded-xl text-sm font-medium hover:bg-mpj-charcoal-light transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      {tokenExchanging ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Exchanging...</> : 'Get Long-Lived Token'}
                    </button>
                    {longLivedToken && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-xs font-semibold text-green-800 mb-2">Long-Lived Token (copy to Vercel → META_ACCESS_TOKEN):</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-green-700 bg-green-100 rounded px-2 py-1 flex-1 break-all font-mono">{longLivedToken.substring(0, 40)}...</code>
                          <button
                            onClick={() => { navigator.clipboard.writeText(longLivedToken); setCopiedToken(true); setTimeout(() => setCopiedToken(false), 2000) }}
                            className="p-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors cursor-pointer flex-shrink-0"
                            title="Copy full token"
                          >
                            {copiedToken ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-green-700" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400 no-print">
          Made with ❤️ by <a href="https://omnixia.ai/" target="_blank" rel="noopener noreferrer" className="text-mpj-charcoal hover:underline font-medium">Omnixia</a>
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
