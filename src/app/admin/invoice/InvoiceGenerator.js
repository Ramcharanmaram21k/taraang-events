'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/admin-auth';
import { Download, FileText, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- Embedded UI Components (for stability) ---

const Input = ({ className = '', ...props }) => (
    <input
        className={`flex h-10 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 px-8",
    };
    return (
        <button className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.default} ${className}`} {...props}>
            {children}
        </button>
    );
};

// --- Event Types ---
const eventTypes = [
    'Wedding', 'Engagement', 'Birthday Party', 'Corporate Event',
    'Anniversary', 'Baby Shower', 'Reception', 'Haldi & Mehendi', 'Other',
];

// --- Main Component ---

export default function InvoiceGenerator() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isAuthenticated, router]);

    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [customerName, setCustomerName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventType, setEventType] = useState('');
    const [amountFinalized, setAmountFinalized] = useState('');
    const [advancePaid, setAdvancePaid] = useState('');

    const balanceAmount = useMemo(() => {
        const finalized = Number(amountFinalized) || 0;
        const advance = Number(advancePaid) || 0;
        return Math.max(0, finalized - advance);
    }, [amountFinalized, advancePaid]);

    const formatCurrency = (amount) => {
        return `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN');
    };

    // --- PDF Generation ---
    const handleDownloadPDF = async () => {
        if (!customerName.trim()) { alert('Please enter client name'); return; }
        if (!eventDate) { alert('Please select event date'); return; }
        if (!eventType) { alert('Please select event type'); return; }
        if (!amountFinalized || Number(amountFinalized) <= 0) { alert('Please enter a valid finalized amount'); return; }
        if (Number(advancePaid) > Number(amountFinalized)) { alert('Advance paid cannot exceed finalized amount'); return; }

        const element = document.getElementById('invoice-preview');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice_${customerName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Dashboard
                        </Link>
                        <span className="text-gray-300">|</span>
                        <h1 className="text-lg font-bold text-gray-800">Simple Invoice</h1>
                    </div>
                    <Link href="/admin/quotation" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md px-3 py-1.5 transition-colors hover:border-blue-300">
                        <FileSpreadsheet className="h-4 w-4" /> Quotation Generator
                    </Link>
                </div>
            </header>

            <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT: Editor */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" /> Simple Invoice
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Invoice Date *</label>
                                    <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Client Name *</label>
                                    <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter client name" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Event Date *</label>
                                    <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Event Type *</label>
                                    <select
                                        value={eventType}
                                        onChange={(e) => setEventType(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select event type</option>
                                        {eventTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Amount Finalized (Rs.) *</label>
                                    <Input
                                        type="number"
                                        value={amountFinalized}
                                        onChange={(e) => setAmountFinalized(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Advance Paid (Rs.)</label>
                                    <Input
                                        type="number"
                                        value={advancePaid}
                                        onChange={(e) => setAdvancePaid(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium">Balance Amount (Rs.)</label>
                                    <Input
                                        value={formatCurrency(balanceAmount)}
                                        readOnly
                                        className="bg-gray-100 font-semibold cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <Button onClick={handleDownloadPDF} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg" size="lg">
                                    <Download className="h-4 w-4 mr-2" /> Download Invoice PDF
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Preview */}
                    <div className="relative">
                        <div className="sticky top-8 space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">Invoice Preview</h2>

                            <div id="invoice-preview" className="bg-white p-8 shadow-lg border border-gray-200 flex flex-col" style={{ width: '100%', minHeight: '700px' }}>

                                {/* Header */}
                                <div className="text-center mb-4 border-b pb-4">
                                    <div className="mb-3 flex justify-center">
                                        <img src="/new-logo.png" alt="Logo" className="h-24 object-contain" />
                                    </div>
                                </div>

                                {/* Founders */}
                                <div className="flex justify-between items-center px-4 border-b pb-4 mb-4">
                                    <div className="text-left">
                                        <span className="block font-bold text-gray-900">K. Ramakrishna</span>
                                        <span className="text-sm text-gray-600">+91 9494555291</span>
                                    </div>
                                </div>

                                {/* Invoice Title */}
                                <h2 className="text-xl font-bold text-gray-800 mb-4">INVOICE</h2>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                    <div>
                                        <span className="font-semibold text-gray-500">Invoice Date:</span>{' '}
                                        <span className="text-gray-800">{formatDate(invoiceDate)}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-500">Client Name:</span>{' '}
                                        <span className="text-gray-800">{customerName || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-500">Event Date:</span>{' '}
                                        <span className="text-gray-800">{formatDate(eventDate)}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-500">Event Type:</span>{' '}
                                        <span className="text-gray-800">{eventType || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Payment Table */}
                                <div className="mb-8">
                                    <table className="w-full border-collapse border border-gray-300 text-sm">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 p-3 text-left font-semibold">Description</th>
                                                <th className="border border-gray-300 p-3 text-right font-semibold">Amount (Rs.)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 p-3">Total Amount</td>
                                                <td className="border border-gray-300 p-3 text-right">{formatCurrency(amountFinalized)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3">Advance Paid</td>
                                                <td className="border border-gray-300 p-3 text-right">{formatCurrency(advancePaid)}</td>
                                            </tr>
                                            <tr style={{ backgroundColor: '#fefce8' }}>
                                                <td className="border border-gray-300 p-3 font-bold">Balance Due</td>
                                                <td className="border border-gray-300 p-3 text-right font-bold">{formatCurrency(balanceAmount)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Signatures (pushed to bottom) */}
                                <div className="mt-auto grid grid-cols-2 gap-8 pt-8 border-t border-gray-300">
                                    <div className="text-center">
                                        <div className="border-t-2 border-gray-400 mt-16 pt-2">
                                            <p className="text-sm font-semibold text-gray-700">Customer Signature</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-t-2 border-gray-400 mt-16 pt-2">
                                            <p className="text-sm font-semibold text-gray-700">Authorized Signatory</p>
                                            <p className="text-xs text-gray-500 mt-1">SS Taraang Events</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
