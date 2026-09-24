'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { formatNaira } from '@/lib/currency';
import { Badge, Button, Card, EmptyState, Skeleton, SkeletonRows } from '@/components/ui';
import { Bell, BookOpen, CheckCircle2, ChevronRight, ClipboardList, FileCheck2, FilePlus2, LayoutDashboard, LifeBuoy, Menu, Search, Settings, ShoppingCart, Truck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const navigation = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Requests', href: '/requests', icon: ClipboardList },
  { label: 'Quotes', href: '/dashboard', icon: FileCheck2 },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Tracking', href: '/orders', icon: Truck },
  { label: 'Support', href: '/contact', icon: LifeBuoy },
  { label: 'Settings', href: '/settings', icon: Settings },
];

function requestStatus(status: string) {
  if (status === 'quoted') return <Badge tone="success">Quote Ready</Badge>;
  if (status === 'accepted') return <Badge tone="info">Approved</Badge>;
  if (status === 'declined') return <Badge tone="neutral">Cancelled</Badge>;
  return <Badge tone="warning">Under Review</Badge>;
}

function orderStatus(status: string) {
  if (status === 'delivered') return <Badge tone="success">Delivered</Badge>;
  if (status === 'shipped') return <Badge tone="info">Dispatched</Badge>;
  if (status === 'processing' || status === 'confirmed') return <Badge tone="warning">Processing</Badge>;
  return <Badge tone="neutral">Submitted</Badge>;
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const { userProfile, orders, supplyRequests, placeOrderFromRFQ, notifications, authReady } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string | null>(null);

  useEffect(() => {
    const requestNumber = new URLSearchParams(window.location.search).get('submitted');
    if (!requestNumber) return;
    window.setTimeout(() => setSubmittedRequestNumber(requestNumber), 0);
    window.history.replaceState({}, '', '/dashboard');
  }, []);

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return supplyRequests;
    return supplyRequests.filter((request) => `${request.requestNumber} ${request.items.map((item) => item.itemName).join(' ')}`.toLowerCase().includes(query));
  }, [searchTerm, supplyRequests]);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) => `${order.orderNumber} ${order.items.map((item) => item.itemName).join(' ')}`.toLowerCase().includes(query));
  }, [orders, searchTerm]);

  const activeRequests = supplyRequests.filter((request) => ['pending', 'quoted'].includes(request.status));
  const pendingQuotes = supplyRequests.filter((request) => request.status === 'quoted');
  const activeOrders = orders.filter((order) => order.status !== 'delivered');
  const deliveries = orders.filter((order) => ['shipped', 'delivered'].includes(order.status));
  const unreadNotifications = notifications.filter((notification) => !notification.read_at).length;

  if (!authReady) {
    return (
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <SkeletonRows count={5} />
      </main>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#f8fafc]">
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-[1600px]">
        {/* Sidebar */}
        <aside className={`${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden'} w-64 shrink-0 flex-col border-r border-[#e2e8f0] bg-white lg:sticky lg:top-[4.5rem] lg:flex lg:self-stretch`}>
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-5 lg:block">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0b8f55]">Client workspace</p>
              <p className="mt-1 truncate text-sm font-bold text-[#0f172a]">{userProfile.companyName}</p>
            </div>
            <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="rounded-lg p-2 text-[#64748b] hover:bg-[#f1f5f9] lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-5">
            {navigation.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  label === 'Dashboard' ? 'bg-[#f1f5f9] text-[#173962]' : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#173962]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {label === 'Quotes' && pendingQuotes.length > 0 && (
                  <span className="ml-auto rounded-full bg-[#edf9f2] px-2 py-0.5 text-[10px] font-bold text-[#087443]">{pendingQuotes.length}</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="border-t border-[#e2e8f0] p-4">
            <div className="rounded-xl bg-[#102a4c] p-4 text-white">
              <p className="text-xs font-bold">Need procurement support?</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#c9d5e3]">Our team can help clarify a request or quote.</p>
              <Link href="/contact" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#8ee0b2]">
                Contact support <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </aside>

        {mobileNavOpen && <button type="button" aria-label="Close navigation overlay" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-40 bg-[#0b1f3a]/30 lg:hidden" />}

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)} className="rounded-lg border border-[#e2e8f0] bg-white p-2.5 text-[#52627a] lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0b8f55]">Client dashboard</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">Procurement overview</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search requests or orders"
                  aria-label="Search requests or orders"
                  className="h-10 w-60 rounded-lg border border-[#e2e8f0] bg-white pl-9 pr-3 text-xs"
                />
              </div>
              <button type="button" aria-label={`${unreadNotifications} unread notifications`} className="relative rounded-lg border border-[#e2e8f0] bg-white p-2.5 text-[#52627a] hover:bg-[#f8fafc]">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0b8f55] px-1 text-[9px] font-bold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <div className="hidden items-center gap-2 border-l border-[#e2e8f0] pl-3 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173962] text-sm font-bold text-white">
                  {userProfile.companyName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="max-w-32 truncate text-xs font-bold text-[#0f172a]">{userProfile.companyName}</p>
                  <p className="text-[10px] text-[#64748b]">Buyer account</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Good to see you, {userProfile.contactPerson.split(' ')[0]}</h2>
              <p className="mt-1 text-sm text-[#64748b]">Here is what is happening with your procurement activity.</p>
            </div>
            <Button onClick={() => router.push('/rfq')} tone="success" className="hidden sm:inline-flex">
              <FilePlus2 className="h-4 w-4" />New procurement request
            </Button>
          </div>

          {submittedRequestNumber && (
            <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-[#bdebd2] bg-[#edf9f2] px-4 py-3 text-sm text-[#087443]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Request <strong>{submittedRequestNumber}</strong> was submitted and is ready for review.</span>
            </div>
          )}

          {/* Metric Cards */}
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {[
              { label: 'Active requests', value: activeRequests.length, icon: ClipboardList, tone: 'info' },
              { label: 'Pending quotes', value: pendingQuotes.length, icon: FileCheck2, tone: 'warning' },
              { label: 'Active orders', value: activeOrders.length, icon: ShoppingCart, tone: 'neutral' },
              { label: 'Deliveries', value: deliveries.length, icon: Truck, tone: 'success' },
            ].map(({ label, value, icon: Icon, tone }) => (
              <Card key={label} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#64748b]">{label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-[#0f172a]">{value}</p>
                  </div>
                  <span className={`rounded-lg p-2 ${
                    tone === 'success' ? 'bg-[#edf9f2] text-[#087443]' :
                    tone === 'warning' ? 'bg-[#fffbe6] text-[#b45309]' :
                    tone === 'info' ? 'bg-[#f1f5f9] text-[#173962]' : 'bg-[#f8fafc] text-[#64748b]'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-[11px] text-[#94a3b8]">Live account total</p>
              </Card>
            ))}
          </div>

          {/* Recent Requests */}
          <Card className="mb-8 overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">Recent requests</h2>
                <p className="mt-0.5 text-xs text-[#64748b]">Track requests from intake through quote approval.</p>
              </div>
              <Link href="/requests" className="hidden items-center gap-1 text-xs font-bold text-[#087443] sm:flex hover:underline">
                View all requests <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {filteredRequests.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  title={searchTerm ? 'No matching requests' : 'No procurement requests yet'}
                  description={searchTerm ? 'Try another request ID or item description.' : 'Create your first request to start sourcing for your team.'}
                  action={
                    <Button tone="success" onClick={() => router.push('/rfq')}>
                      <FilePlus2 className="h-4 w-4" />New request
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] text-[10px] uppercase text-[#64748b]">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Request ID</th>
                        <th className="px-4 py-3 font-semibold">Description</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-6 py-3 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {filteredRequests.slice(0, 8).map((request) => (
                        <tr key={request.id} className="hover:bg-[#f8fafc]/80 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-[#173962]">{request.requestNumber}</td>
                          <td className="max-w-xs px-4 py-4 font-medium text-[#334155] truncate">{request.items.map((item) => item.itemName).join(', ')}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-[#64748b]">{request.createdAt}</td>
                          <td className="px-4 py-4">{requestStatus(request.status)}</td>
                          <td className="px-4 py-4 font-semibold text-[#0f172a]">{request.totalQuoteAmount ? formatNaira(request.totalQuoteAmount) : 'Pending'}</td>
                          <td className="px-6 py-4 text-right">
                            {request.status === 'quoted' ? (
                              <button onClick={() => placeOrderFromRFQ(request.id, 'PO-APX-RFQ-ACCEPTED', userProfile.address)} className="text-xs font-bold text-[#087443] hover:underline">
                                Approve quote
                              </button>
                            ) : (
                              <Link href={`/requests/${request.id}`} className="text-xs font-bold text-[#173962] hover:underline">
                                View request
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divide-y divide-[#e2e8f0] md:hidden">
                  {filteredRequests.slice(0, 8).map((request) => (
                    <div key={request.id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs font-bold text-[#173962]">{request.requestNumber}</p>
                          <p className="mt-1 text-sm font-semibold text-[#0f172a]">{request.items.map((item) => item.itemName).join(', ')}</p>
                        </div>
                        {requestStatus(request.status)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#64748b]">
                        <span>{request.createdAt}</span>
                        <span>{request.totalQuoteAmount ? formatNaira(request.totalQuoteAmount) : 'Amount pending'}</span>
                      </div>
                      {request.status === 'quoted' ? (
                        <button onClick={() => placeOrderFromRFQ(request.id, 'PO-APX-RFQ-ACCEPTED', userProfile.address)} className="text-xs font-bold text-[#087443]">
                          Approve quote
                        </button>
                      ) : (
                        <Link href={`/requests/${request.id}`} className="text-xs font-bold text-[#173962]">
                          View request
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Recent Orders */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">Recent orders</h2>
                <p className="mt-0.5 text-xs text-[#64748b]">Monitor fulfilment and delivery progress.</p>
              </div>
              <Link href="/orders" className="hidden items-center gap-1 text-xs font-bold text-[#087443] sm:flex hover:underline">
                View all orders <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {filteredOrders.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  title={searchTerm ? 'No matching orders' : 'No orders yet'}
                  description="Approved quotes will appear here as trackable orders."
                  action={
                    <Button tone="secondary" onClick={() => router.push('/requests')}>
                      <BookOpen className="h-4 w-4" />Browse requests
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] text-[10px] uppercase text-[#64748b]">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Order ID</th>
                        <th className="px-4 py-3 font-semibold">Order name</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Delivery date</th>
                        <th className="px-6 py-3 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {filteredOrders.slice(0, 8).map((order) => (
                        <tr key={order.id} className="hover:bg-[#f8fafc]/80 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-[#173962]">{order.orderNumber}</td>
                          <td className="max-w-xs px-4 py-4 font-medium text-[#334155] truncate">{order.items.map((item) => item.itemName).join(', ')}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-[#64748b]">{order.createdAt}</td>
                          <td className="px-4 py-4">{orderStatus(order.status)}</td>
                          <td className="px-4 py-4 text-[#64748b]">{order.status === 'delivered' ? order.updatedAt : 'In coordination'}</td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/orders/${order.id}`} className="text-xs font-bold text-[#173962] hover:underline">
                              Track order
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divide-y divide-[#e2e8f0] md:hidden">
                  {filteredOrders.slice(0, 8).map((order) => (
                    <div key={order.id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs font-bold text-[#173962]">{order.orderNumber}</p>
                          <p className="mt-1 text-sm font-semibold text-[#0f172a]">{order.items.map((item) => item.itemName).join(', ')}</p>
                        </div>
                        {orderStatus(order.status)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#64748b]">
                        <span>{order.createdAt}</span>
                        <span>{order.status === 'delivered' ? order.updatedAt : 'In coordination'}</span>
                      </div>
                      <Link href={`/orders/${order.id}`} className="text-xs font-bold text-[#173962]">
                        Track order
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
          <Button onClick={() => router.push('/rfq')} tone="success" className="mt-4 w-full sm:hidden">
            <FilePlus2 className="h-4 w-4" />New procurement request
          </Button>
        </main>
      </div>
    </div>
  );
}

