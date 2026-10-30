'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Truck, Ship, AlertTriangle, CheckCircle, XCircle, MapPin, Clock, AlertCircle } from 'lucide-react';

// Types
interface Shipment {
  id: string;
  mode: string;
  commodity: string;
  shipper: string;
  destination: string;
  status: string;
  statusColor: 'green' | 'red' | 'yellow' | 'blue';
  location: string;
  eta: string;
  revisedEta?: string;
  demurrageWarning?: string;
  milestones: { time: string; description: string }[];
}

// Synthetic data
const shipments: Record<string, Shipment> = {
  '21092924823': {
    id: '21092924823',
    mode: 'Domestic Surface Express',
    commodity: 'British Wool Melton Rolls (18 Rolls)',
    shipper: 'Yorkshire Woolens Ltd / UK Consignment',
    destination: 'Peenya Apparel Hub, Bengaluru (Dock A - Cutting Bay)',
    status: 'DELIVERED / ON SCHEDULE',
    statusColor: 'green',
    location: 'Bengaluru North Distribution Center (Karnataka)',
    eta: 'Today at 14:00 IST',
    milestones: [
      { time: 'Today 11:30 AM', description: 'Out for delivery to Peenya Factory Dock A (Van #KA-04-E-4412)' },
      { time: 'Today 05:45 AM', description: 'Arrived at Bengaluru Central Sort Hub' },
      { time: 'Yesterday 08:30 PM', description: 'Dispatched from Bhiwandi National Sorting Facility (Maharashtra)' },
      { time: '28-Oct 04:00 PM', description: 'Manifest generated & pickup completed' },
    ],
  },
  'MSKU8421095': {
    id: 'MSKU8421095',
    mode: 'EXIM Ocean / Port Container (40ft High Cube)',
    commodity: 'Heavy-Duty Brass Fasteners & Zippers (40k pcs)',
    shipper: 'YKK Americas / Savannah Port',
    destination: 'Peenya Apparel Hub, Bengaluru (Dock B - Sewing Bay)',
    status: 'CRITICAL DELAY / CUSTOMS YARD HOLD',
    statusColor: 'red',
    location: 'APM Terminals Mumbai / GTI Nhava Sheva (Yard Block 4B)',
    eta: 'Today at 14:00 IST',
    revisedEta: '03-Nov-2026 at 18:00 IST (+96 Hours Delay)',
    demurrageWarning: 'WARNING: Container past free-holding period. Demurrage accrual: ₹12,000/day. Sewing production line halted.',
    milestones: [
      { time: 'Today 09:15 AM', description: 'Discharged from Vessel ATLANTA EXPRESS; Staged at Nhava Sheva Yard' },
      { time: 'Yesterday 11:00 PM', description: 'Held for Customs Assessment & Physical Verification' },
      { time: '27-Oct 06:00 AM', description: 'Vessel Berthed at Gateway Terminals India (GTI)' },
      { time: '22-Oct 08:00 AM', description: 'Port of Loading Departure (Savannah, USA)' },
    ],
  },
};

function getDefaultShipment(input: string): Shipment {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const format = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  return {
    id: input,
    mode: 'Domestic Surface Express',
    commodity: 'General Cargo (Assorted)',
    shipper: 'Pune Logistics Hub',
    destination: 'Whitefield Depot, Bengaluru',
    status: 'IN TRANSIT',
    statusColor: 'blue',
    location: 'Pune Central Hub (Maharashtra)',
    eta: `${format(tomorrow)} at 10:00 IST`,
    milestones: [
      { time: `${format(today)} 08:00 AM`, description: 'Departed Pune Central Hub en route to Bengaluru' },
      { time: `${format(today)} 02:00 PM`, description: 'Crossed Pune - Satara Toll Plaza' },
      { time: `${format(tomorrow)} 04:00 AM`, description: 'Arrived at Bengaluru Outer Ring Road Sort Facility' },
      { time: `${format(tomorrow)} 09:00 AM`, description: 'Out for final delivery to Whitefield Depot' },
    ],
  };
}

function StatusBadge({ status, color }: { status: string; color: Shipment['statusColor'] }) {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold';
  const variants = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800 animate-pulse',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
  };
  const iconMap = {
    green: <CheckCircle className="w-4 h-4 mr-1" />,
    red: <AlertTriangle className="w-4 h-4 mr-1" />,
    yellow: <Clock className="w-4 h-4 mr-1" />,
    blue: <Truck className="w-4 h-4 mr-1" />,
  };
  return (
    <span className={`${base} ${variants[color]}`}>
      {iconMap[color]}
      {status}
    </span>
  );
}

export default function TrackingPortal() {
  const [searchType, setSearchType] = useState<'awb' | 'ref'>('awb');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const ids = query.split(',').map(s => s.trim()).filter(Boolean);
    if (!ids.length) return;
    setLoading(true);
    // simulate 1.5s gateway query
    await new Promise(r => setTimeout(r, 1500));
    const found = ids.map(id => shipments[id] || getDefaultShipment(id));
    setResults(found);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top hotline banner */}
      <div className="bg-enterprise-blue text-yellow-300 text-center py-1 text-sm font-medium">
        24/7 Priority Freight Support: 1800-200-APEX
      </div>

      {/* Header navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-enterprise-red rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="text-enterprise-blue font-bold text-lg tracking-tight">APEX EXPRESS LOGISTICS</span>
              <span className="text-slate-400 text-xs uppercase tracking-wider">/ GLOBAL TRACKER</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-700">
              <a href="#" className="hover:text-enterprise-blue transition">Services</a>
              <a href="#" className="hover:text-enterprise-blue transition">Network</a>
              <a href="#" className="text-enterprise-blue border-b-2 border-enterprise-blue pb-1">Tracking</a>
              <a href="#" className="hover:text-enterprise-blue transition">Enterprise Login</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero / Tracking Box */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-enterprise-blue mb-2 text-center">Track Your Shipment</h2>
          <p className="text-slate-500 text-center mb-6">Enter up to 5 Waybill / AWB numbers separated by commas</p>

          {/* Radio toggle */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="awb"
                checked={searchType === 'awb'}
                onChange={() => setSearchType('awb')}
                className="text-enterprise-blue focus:ring-enterprise-blue"
              />
              <span className="text-sm font-medium text-slate-700">Waybill / AWB No.</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="ref"
                checked={searchType === 'ref'}
                onChange={() => setSearchType('ref')}
                className="text-enterprise-blue focus:ring-enterprise-blue"
              />
              <span className="text-sm font-medium text-slate-700">Reference No. / Order ID</span>
            </label>
          </div>

          {/* Input area */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <textarea
              id="tracking-input"
              rows={2}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-enterprise-blue focus:border-transparent text-sm placeholder-slate-400 resize-none"
              placeholder="Enter up to 5 Waybill numbers separated by comma (e.g. 21092924823, MSKU8421095)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-enterprise-blue text-white font-semibold rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Querying…</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>TRACK SHIPMENT</span>
                </>
              )}
            </button>
          </div>

          {loading && (
            <div className="text-center text-slate-500 py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-enterprise-blue" />
              <p>Querying Global Telematics Gateway & Port Terminals...</p>
            </div>
          )}

          {/* Results */}
          {results.map((shipment, idx) => (
            <div key={`${shipment.id}-${idx}`} className="mt-8 border-t border-slate-200 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-enterprise-blue mb-1">Shipment Details</h3>
                  <dl className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between"><dt className="font-medium text-slate-500">Waybill / AWB:</dt><dd id="shipment-id">{shipment.id}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-slate-500">Mode:</dt><dd>{shipment.mode}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-slate-500">Commodity:</dt><dd>{shipment.commodity}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-slate-500">Shipper:</dt><dd>{shipment.shipper}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-slate-500">Destination:</dt><dd>{shipment.destination}</dd></div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-enterprise-blue mb-1">Current Status</h3>
                  <dl className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between">
                      <dt className="font-medium text-slate-500">Status:</dt>
                      <dd><StatusBadge status={shipment.status} color={shipment.statusColor} /></dd>
                    </div>
                    <div className="flex justify-between"><dt className="font-medium text-slate-500">Location:</dt><dd id="current-location"><MapPin className="inline w-4 h-4 mr-1" /> {shipment.location}</dd></div>
                    <div className="flex justify-between"><dt className="font-medium text-slate-500">Expected Delivery:</dt><dd id="expected-eta"><Clock className="inline w-4 h-4 mr-1" /> {shipment.eta}</dd></div>
                    {shipment.revisedEta && (
                      <div className="flex justify-between text-red-600 font-medium">
                        <dt className="text-slate-500">Revised ETA:</dt>
                        <dd id="revised-eta"><AlertCircle className="inline w-4 h-4 mr-1" /> {shipment.revisedEta}</dd>
                      </div>
                    )}
                  </dl>
                  {shipment.demurrageWarning && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{shipment.demurrageWarning}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Milestone timeline table */}
              <h3 className="text-lg font-semibold text-enterprise-blue mb-3">Milestone History</h3>
              <div className="overflow-x-auto">
                <table id="milestone-timeline" className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600">Date / Time</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Event</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shipment.milestones.map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{m.time}</td>
                        <td className="px-4 py-3 text-slate-800">{m.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {results.length === 0 && !loading && query && (
            <p className="text-center text-slate-500 mt-8">No shipments found for the entered numbers.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} APEX EXPRESS LOGISTICS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}