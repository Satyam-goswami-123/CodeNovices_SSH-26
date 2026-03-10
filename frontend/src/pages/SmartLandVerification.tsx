import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldCheck, User, CheckCircle2, AlertCircle, FileText, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';

// Fix Leaflet icon issue in React
import L from 'leaflet';
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({

    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Mock data
const mockParcels = [
    {
        id: 'LND-2026-9081',
        owner: 'Arjun Kumar',
        status: 'verified',
        taxStatus: 'paid',
        area: '450 sq. meters',
        coordinates: [
            [28.6139, 77.2090],
            [28.6149, 77.2090],
            [28.6149, 77.2100],
            [28.6139, 77.2100],
        ],
        center: [28.6144, 77.2095]
    },
    {
        id: 'LND-2026-4432',
        owner: 'Sunita Devi',
        status: 'pending',
        taxStatus: 'due',
        area: '1200 sq. meters',
        coordinates: [
            [28.6160, 77.2120],
            [28.6170, 77.2120],
            [28.6170, 77.2135],
            [28.6160, 77.2135],
        ],
        center: [28.6165, 77.21275]
    }
];

export function SmartLandVerification() {
    const [selectedParcel, setSelectedParcel] = useState<any>(null);

    const handleParcelClick = (parcel: any) => {
        setSelectedParcel(parcel);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    Smart Land Verification
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Verify land ownership, check property tax status, and view governance records directly on the interactive map.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm h-[600px] z-0">
                    <MapContainer center={[28.6150, 77.2110]} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {mockParcels.map((parcel) => (
                            <React.Fragment key={parcel.id}>
                                <Polygon
                                    positions={parcel.coordinates as any}
                                    pathOptions={{
                                        color: parcel.status === 'verified' ? '#2563eb' : '#fbbf24',
                                        fillColor: parcel.status === 'verified' ? '#3b82f6' : '#fcd34d',
                                        fillOpacity: 0.4
                                    }}
                                    eventHandlers={{
                                        click: () => handleParcelClick(parcel),
                                    }}
                                />
                                <Marker position={parcel.center as any} eventHandlers={{ click: () => handleParcelClick(parcel) }}>
                                    <Popup>
                                        <div className="font-semibold text-gray-900">{parcel.id}</div>
                                        <div className="text-sm text-gray-500">Click parcel for details</div>
                                    </Popup>
                                </Marker>
                            </React.Fragment>
                        ))}
                    </MapContainer>
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Parcel Details</h2>

                        {selectedParcel ? (
                            <div className="space-y-5">
                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Property ID</div>
                                    <div className="font-mono font-medium text-zinc-900 dark:text-white flex items-center justify-between">
                                        {selectedParcel.id}
                                        <FileText className="h-4 w-4 text-zinc-400" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">Owner Name (Demo)</span>
                                    </div>
                                    <div className="font-medium text-lg text-zinc-900 dark:text-white">{selectedParcel.owner}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Land Area</div>
                                        <div className="font-medium text-zinc-900 dark:text-white">{selectedParcel.area}</div>
                                    </div>
                                </div>

                                <hr className="border-zinc-200 dark:border-zinc-700" />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-medium text-zinc-900 dark:text-white">Gov Record Status</span>
                                        </div>
                                        {selectedParcel.status === 'verified' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                <AlertCircle className="h-3.5 w-3.5" />
                                                Pending
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-medium text-zinc-900 dark:text-white">Property Tax</span>
                                        </div>
                                        {selectedParcel.taxStatus === 'paid' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                Due
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 grid grid-cols-2 gap-3">
                                    <Button className="w-full" variant="outline" size="sm">Download Record</Button>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">Pay Tax Due</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700">
                                <MapContainer center={[0, 0]} zoom={0} style={{ display: 'none' }} /> {/* Just to silence linter if any */}
                                <ShieldCheck className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mb-4" />
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Select a land parcel on the map to view its details, ownership status, and tax records.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
