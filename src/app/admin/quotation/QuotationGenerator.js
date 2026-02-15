'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/admin-auth';
import { Plus, Trash2, Download, FileText, Check, X, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- UI Components (Embedded for stability) ---

const Input = ({ className, ...props }) => (
    <input
        className={`flex h-10 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

const Button = ({ children, variant = 'primary', size = 'default', className, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        icon: "h-10 w-10",
    };
    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Checkbox = ({ id, checked, onCheckedChange, label }) => (
    <div className="flex items-center space-x-2">
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={`peer h-5 w-5 shrink-0 rounded border border-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'
                }`}
        >
            {checked && <Check className="h-3.5 w-3.5 mx-auto" />}
        </button>
        <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer" onClick={() => onCheckedChange(!checked)}>
            {label}
        </label>
    </div>
);

// --- Main Component ---

// --- Event Types ---
const eventTypes = [
    'Wedding', 'Engagement', 'Birthday Party', 'Corporate Event',
    'Anniversary', 'Baby Shower', 'Reception', 'Haldi & Mehendi', 'Other',
];

export default function QuotationGenerator() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isAuthenticated, router]);

    const [activeTab, setActiveTab] = useState('veg');
    const printRef = useRef(null);

    // --- New Pricing States ---
    const [includedServices, setIncludedServices] = useState([]); // Array of strings
    const [isManualTotal, setIsManualTotal] = useState(false); // Boolean
    const [manualTotalAmount, setManualTotalAmount] = useState(0); // Number

    // --- State Management ---

    // Customer & Event Details
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        phone: '',
        eventDate: '',
        guests: '',
        venue: '', // Custom Text Input
        eventType: 'Wedding',
    });

    // Charges
    const [charges, setCharges] = useState({
        decoration: 0,
        entry: 0,
        food: 0,
        functionHall: 0,
        tentHouse: 0,
        photography: 0,
        lighting: 0,
        flexiBanner: 0,
    });

    // Food Menu: Veg
    const [vegItems, setVegItems] = useState({
        welcomeDrinks: [],
        snacks: [],
        sweets: [],
        hotItems: [],
        pappu: [],
        curry: [],
        fry: [],
        pickle: [],
    });

    // Food Menu: Non-Veg
    const [nonVegItems, setNonVegItems] = useState({
        starters: [],
        gravy: [],
        fry: [],
        biryani: [],
    });

    // Staples & Ice Cream
    const [staples, setStaples] = useState({
        sambar: false,
        rasam: false,
        curd: false,
        biriyani: false, // Veg Biryani/Rice
        killi: false,
        ghee: false,
        waterBottles: false,
        dalcha: false,
        peruguChutney: false,
        pulka: false,
        butterNaan: false,
        raagiSangati: false,
    });

    const [customStaples, setCustomStaples] = useState([]); // Array of strings
    const [iceCreams, setIceCreams] = useState([]); // Array of strings

    // --- Handlers ---

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleChargeChange = (e) => {
        const { name, value } = e.target;
        setCharges(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleStapleCheck = (key) => {
        setStaples(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Generic List Handler (Add/Remove)
    const addItem = (category, isNonVeg = false) => {
        const inputId = `input-${category}`;
        const input = document.getElementById(inputId);
        if (input && input.value.trim()) {
            const newItem = input.value.trim();
            if (isNonVeg) {
                setNonVegItems(prev => ({ ...prev, [category]: [...prev[category], newItem] }));
            } else {
                setVegItems(prev => ({ ...prev, [category]: [...prev[category], newItem] }));
            }
            input.value = '';
        }
    };

    const removeItem = (category, index, isNonVeg = false) => {
        if (isNonVeg) {
            setNonVegItems(prev => ({
                ...prev,
                [category]: prev[category].filter((_, i) => i !== index)
            }));
        } else {
            setVegItems(prev => ({
                ...prev,
                [category]: prev[category].filter((_, i) => i !== index)
            }));
        }
    };

    // Specific Handlers for separate states (Ice Cream, Custom Staples)
    const addIceCream = () => {
        const input = document.getElementById('input-icecream');
        if (input && input.value.trim()) {
            setIceCreams(prev => [...prev, input.value.trim()]);
            input.value = '';
        }
    };
    const removeIceCream = (index) => setIceCreams(prev => prev.filter((_, i) => i !== index));

    const addCustomStaple = () => {
        const input = document.getElementById('input-custom-staple');
        if (input && input.value.trim()) {
            setCustomStaples(prev => [...prev, input.value.trim()]);
            input.value = '';
        }
    };
    const removeCustomStaple = (index) => setCustomStaples(prev => prev.filter((_, i) => i !== index));

    // Included Services Handlers
    const addIncludedService = () => {
        const input = document.getElementById('input-included-service');
        if (input && input.value.trim()) {
            const newService = input.value.trim();
            if (!includedServices.includes(newService)) {
                setIncludedServices(prev => [...prev, newService]);
            }
            input.value = '';
        }
    };
    const addPresetService = (service) => {
        if (!includedServices.includes(service)) {
            setIncludedServices(prev => [...prev, service]);
        }
    };
    const removeIncludedService = (index) => setIncludedServices(prev => prev.filter((_, i) => i !== index));

    const calculateTotal = () => {
        if (isManualTotal) return parseFloat(manualTotalAmount) || 0;
        return Object.values(charges).reduce((a, b) => a + b, 0);
    };

    // --- PDF Generation (The Nuclear Method) ---
    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff', // Clean white base
                onclone: (documentClone) => {
                    // This function runs on the CLONE before the screenshot is taken
                    // We use this to FORCE the styles that React/Tailwind might be hiding

                    // 1. Force Veg Section Colors
                    const vegSection = documentClone.getElementById('print-veg-section');
                    if (vegSection) {
                        vegSection.style.setProperty('background-color', '#f0fdf4', 'important'); // Green-50
                        vegSection.style.setProperty('border-color', '#bbf7d0', 'important');     // Green-200
                        vegSection.style.setProperty('border-width', '1px', 'important');
                        vegSection.style.opacity = '1';
                    }

                    // 2. Force Non-Veg Section Colors
                    const nonVegSection = documentClone.getElementById('print-non-veg-section');
                    if (nonVegSection) {
                        nonVegSection.style.setProperty('background-color', '#fef2f2', 'important'); // Red-50
                        nonVegSection.style.setProperty('border-color', '#fecaca', 'important');     // Red-200
                        nonVegSection.style.setProperty('border-width', '1px', 'important');
                        nonVegSection.style.opacity = '1';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png');

            // Calculate dimensions based on A4 width (210mm)
            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Use custom page size matching the content height
            const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Quotation_${customerDetails.name || 'Event'}.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    // --- Render Helpers ---
    const renderInputList = (label, items, onRemove, inputId, onAdd) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex gap-2 mb-2">
                <Input id={inputId} placeholder={`Add ${label.toLowerCase()}...`} />
                <Button onClick={onAdd} type="button" variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {item}
                        <button onClick={() => onRemove(idx)} className="text-gray-500 hover:text-red-600"><X className="h-3 w-3" /></button>
                    </span>
                ))}
            </div>
        </div>
    );

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Dashboard
                        </Link>
                        <span className="text-gray-300">|</span>
                        <h1 className="text-lg font-bold text-gray-800">Quotation Generator</h1>
                    </div>
                    <Link href="/admin/invoice" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md px-3 py-1.5 transition-colors hover:border-blue-300">
                        <FileText className="h-4 w-4" /> Simple Invoice
                    </Link>
                </div>
            </header>

            <div className="p-4 md:p-8">
                {/* --- ADMIN DASHBOARD --- */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: EDITOR */}
                    <div className="space-y-6">

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" /> Event Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-sm font-medium">Customer Name</label><Input name="name" value={customerDetails.name} onChange={handleDetailChange} /></div>
                                <div><label className="text-sm font-medium">Phone</label><Input name="phone" value={customerDetails.phone} onChange={handleDetailChange} /></div>
                                <div><label className="text-sm font-medium">Event Date</label><Input type="date" name="eventDate" value={customerDetails.eventDate} onChange={handleDetailChange} /></div>
                                <div><label className="text-sm font-medium">Guests</label><Input type="number" name="guests" value={customerDetails.guests} onChange={handleDetailChange} /></div>
                                <div>
                                    <label className="text-sm font-medium">Event Type</label>
                                    <select
                                        name="eventType"
                                        value={customerDetails.eventType}
                                        onChange={handleDetailChange}
                                        className="flex h-10 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {eventTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Custom Venue Input */}
                                <div className="md:col-span-2"><label className="text-sm font-medium">Venue</label><Input name="venue" placeholder="Enter venue name (e.g., Mourya Grand)" value={customerDetails.venue} onChange={handleDetailChange} /></div>
                            </div>
                        </div>

                        {/* --- SERVICES INCLUDED (No Pricing) --- */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Check className="h-5 w-5 text-blue-600" /> Services Included (No Pricing)
                            </h2>
                            <p className="text-xs text-gray-500 mb-3">These will appear as a list on the quotation without individual prices.</p>

                            {/* Custom Service Input */}
                            <div className="flex gap-2 mb-3">
                                <Input id="input-included-service" placeholder="Type a service..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIncludedService(); } }} />
                                <Button onClick={addIncludedService} type="button" variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                            </div>

                            {/* Quick-Add Preset Buttons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['Photography', 'Function Hall', 'Decoration', 'Tent House', 'Lighting', 'Catering'].map(service => (
                                    <button
                                        key={service}
                                        type="button"
                                        onClick={() => addPresetService(service)}
                                        disabled={includedServices.includes(service)}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${includedServices.includes(service)
                                            ? 'bg-blue-50 text-blue-400 border-blue-200 cursor-not-allowed opacity-60'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700'
                                            }`}
                                    >
                                        + {service}
                                    </button>
                                ))}
                            </div>

                            {/* Chips Display */}
                            {includedServices.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                    {includedServices.map((service, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200">
                                            {service}
                                            <button onClick={() => removeIncludedService(idx)} className="text-blue-400 hover:text-red-600 transition-colors"><X className="h-3.5 w-3.5" /></button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- CHARGES SECTION --- */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Charges</h2>

                            {/* Manual Total Toggle */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <Checkbox
                                    id="manual-total-toggle"
                                    checked={isManualTotal}
                                    onCheckedChange={setIsManualTotal}
                                    label="Enter Grand Total Manually (Hide Itemized Prices)"
                                />
                            </div>

                            {isManualTotal ? (
                                /* Manual Total Input */
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Manual Grand Total (Rs.)</label>
                                    <Input
                                        type="number"
                                        value={manualTotalAmount}
                                        onChange={(e) => setManualTotalAmount(parseFloat(e.target.value) || 0)}
                                        placeholder="Enter total amount..."
                                        className="text-lg font-semibold"
                                    />
                                </div>
                            ) : (
                                /* Standard Itemized Charges */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium">Decoration</label><Input type="number" name="decoration" value={charges.decoration} onChange={handleChargeChange} /></div>
                                    <div><label className="text-sm font-medium">Entry Charges</label><Input type="number" name="entry" value={charges.entry} onChange={handleChargeChange} /></div>
                                    <div><label className="text-sm font-medium">Food Bill</label><Input type="number" name="food" value={charges.food} onChange={handleChargeChange} /></div>
                                    <div><label className="text-sm font-medium">Function Hall</label><Input type="number" name="functionHall" value={charges.functionHall} onChange={handleChargeChange} /></div>
                                    <div><label className="text-sm font-medium">Tent House</label><Input type="number" name="tentHouse" value={charges.tentHouse} onChange={handleChargeChange} /></div>
                                    <div><label className="text-sm font-medium">Photography</label><Input type="number" name="photography" value={charges.photography} onChange={handleChargeChange} /></div>
                                    <div><label className="text-sm font-medium">Lighting</label><Input type="number" name="lighting" value={charges.lighting} onChange={handleChargeChange} /></div>
                                    <div><label className="text-sm font-medium">Flexi / Banner</label><Input type="number" name="flexiBanner" value={charges.flexiBanner} onChange={handleChargeChange} /></div>
                                </div>
                            )}

                            <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200 flex justify-between items-center">
                                <span className="font-bold text-orange-900">Grand Total</span>
                                <span className="text-2xl font-bold text-orange-600">₹{calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Food Menu</h2>

                            {/* Tabs */}
                            <div className="flex space-x-2 mb-6 border-b border-gray-200 pb-1">
                                <button onClick={() => setActiveTab('veg')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'veg' ? 'bg-green-50 text-green-700 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}>Veg Items</button>
                                <button onClick={() => setActiveTab('nonveg')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'nonveg' ? 'bg-red-50 text-red-700 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}>Non-Veg Items</button>
                            </div>

                            {/* Veg Section (Green Theme in Editor) */}
                            {activeTab === 'veg' && (
                                <div className="space-y-6 bg-green-50/50 p-4 rounded-lg border border-green-100">
                                    {/* Dynamic Lists */}
                                    {renderInputList("Welcome Drinks", vegItems.welcomeDrinks, (i) => removeItem('welcomeDrinks', i), 'input-welcomeDrinks', () => addItem('welcomeDrinks'))}
                                    {renderInputList("Snacks", vegItems.snacks, (i) => removeItem('snacks', i), 'input-snacks', () => addItem('snacks'))}
                                    {renderInputList("Sweets", vegItems.sweets, (i) => removeItem('sweets', i), 'input-sweets', () => addItem('sweets'))}
                                    {renderInputList("Hot Items", vegItems.hotItems, (i) => removeItem('hotItems', i), 'input-hotItems', () => addItem('hotItems'))}
                                    {renderInputList("Pappu", vegItems.pappu, (i) => removeItem('pappu', i), 'input-pappu', () => addItem('pappu'))}
                                    {renderInputList("Curry", vegItems.curry, (i) => removeItem('curry', i), 'input-curry', () => addItem('curry'))}
                                    {renderInputList("Fry", vegItems.fry, (i) => removeItem('fry', i), 'input-fry', () => addItem('fry'))}

                                    {/* Staples Checkboxes */}
                                    <div className="space-y-3 pt-4 border-t border-green-200">
                                        <h3 className="font-semibold text-green-800">Staples</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Checkbox id="sambar" label="Sambar" checked={staples.sambar} onCheckedChange={() => handleStapleCheck('sambar')} />
                                            <Checkbox id="rasam" label="Rasam" checked={staples.rasam} onCheckedChange={() => handleStapleCheck('rasam')} />
                                            <Checkbox id="curd" label="Curd" checked={staples.curd} onCheckedChange={() => handleStapleCheck('curd')} />
                                            <Checkbox id="biriyani" label="Biriyani/Rice" checked={staples.biriyani} onCheckedChange={() => handleStapleCheck('biriyani')} />
                                            <Checkbox id="killi" label="Killi" checked={staples.killi} onCheckedChange={() => handleStapleCheck('killi')} />
                                            <Checkbox id="ghee" label="Ghee" checked={staples.ghee} onCheckedChange={() => handleStapleCheck('ghee')} />
                                            <Checkbox id="water" label="Water Bottles" checked={staples.waterBottles} onCheckedChange={() => handleStapleCheck('waterBottles')} />
                                            <Checkbox id="dalcha" label="Dalcha" checked={staples.dalcha} onCheckedChange={() => handleStapleCheck('dalcha')} />
                                            <Checkbox id="perugu" label="Perugu Chutney" checked={staples.peruguChutney} onCheckedChange={() => handleStapleCheck('peruguChutney')} />
                                            <Checkbox id="pulka" label="Pulka" checked={staples.pulka} onCheckedChange={() => handleStapleCheck('pulka')} />
                                            <Checkbox id="naan" label="Butter Naan" checked={staples.butterNaan} onCheckedChange={() => handleStapleCheck('butterNaan')} />
                                            <Checkbox id="raagi" label="Raagi Sangati" checked={staples.raagiSangati} onCheckedChange={() => handleStapleCheck('raagiSangati')} />
                                        </div>

                                        {/* Custom Staples Input */}
                                        <div className="mt-2">
                                            <label className="text-xs font-medium text-gray-600">Other Staples</label>
                                            <div className="flex gap-2">
                                                <Input id="input-custom-staple" placeholder="E.g., Special Roti" />
                                                <Button onClick={addCustomStaple} variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {customStaples.map((item, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-300">
                                                        {item} <button onClick={() => removeCustomStaple(idx)}><X className="h-3 w-3" /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ice Cream List */}
                                    <div className="pt-4 border-t border-green-200">
                                        {renderInputList("Ice Cream", iceCreams, removeIceCream, 'input-icecream', addIceCream)}
                                    </div>
                                </div>
                            )}

                            {/* Non-Veg Section (Red Theme in Editor) */}
                            {activeTab === 'nonveg' && (
                                <div className="space-y-6 bg-red-50/50 p-4 rounded-lg border border-red-100">
                                    {renderInputList("Non-Veg Starters", nonVegItems.starters, (i) => removeItem('starters', i, true), 'input-starters', () => addItem('starters', true))}
                                    {renderInputList("Non-Veg Gravy", nonVegItems.gravy, (i) => removeItem('gravy', i, true), 'input-gravy', () => addItem('gravy', true))}
                                    {renderInputList("Non-Veg Fry", nonVegItems.fry, (i) => removeItem('fry', i, true), 'input-fry', () => addItem('fry', true))}
                                    {renderInputList("Non-Veg Biryani", nonVegItems.biryani, (i) => removeItem('biryani', i, true), 'input-biryani', () => addItem('biryani', true))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PREVIEW */}
                    <div className="relative">
                        <div className="sticky top-8 space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-gray-800">Live Preview</h2>
                                <Button onClick={handleDownloadPDF}><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
                            </div>

                            {/* --- INVOICE CANVAS (What gets printed) --- */}
                            <div ref={printRef} className="bg-white p-8 shadow-lg border border-gray-200 min-h-[800px] flex flex-col justify-between" style={{ width: '100%' }}>

                                {/* Header */}
                                <div className="text-center border-b pb-6 mb-6">
                                    {/* Logo */}
                                    <div className="mb-4 flex justify-center">
                                        <img src="/new-logo.png" alt="Logo" className="h-24 object-contain" />
                                    </div>
                                </div>

                                {/* Event & Customer Info */}
                                <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Customer</p>
                                        <p className="font-semibold text-lg">{customerDetails.name || 'N/A'}</p>
                                        <p>{customerDetails.phone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Details</p>
                                        <p><span className="font-medium">Date:</span> {customerDetails.eventDate || 'N/A'}</p>
                                        <p><span className="font-medium">Guests:</span> {customerDetails.guests || '0'}</p>
                                        <p><span className="font-medium">Event:</span> {customerDetails.eventType || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                                        <p><span className="font-medium text-gray-500">Venue:</span> <span className="font-semibold">{customerDetails.venue || 'N/A'}</span></p>
                                    </div>
                                </div>

                                {/* Food Menu Display */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Food Menu</h3>
                                    <div className="flex gap-4 items-start">

                                        {/* Veg Column (Green in Print) */}
                                        <div id="print-veg-section" className="flex-1 p-4 rounded-lg" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                            <h4 className="font-bold text-green-800 mb-2 border-b border-green-200 pb-1">Veg Items</h4>
                                            <div className="space-y-2 text-sm text-gray-700">
                                                {vegItems.welcomeDrinks.length > 0 && <p><span className="font-semibold text-green-900">Welcome Drinks:</span> {vegItems.welcomeDrinks.join(', ')}</p>}
                                                {vegItems.snacks.length > 0 && <p><span className="font-semibold text-green-900">Snacks:</span> {vegItems.snacks.join(', ')}</p>}
                                                {vegItems.sweets.length > 0 && <p><span className="font-semibold text-green-900">Sweets:</span> {vegItems.sweets.join(', ')}</p>}
                                                {vegItems.hotItems.length > 0 && <p><span className="font-semibold text-green-900">Hot Items:</span> {vegItems.hotItems.join(', ')}</p>}
                                                {vegItems.pappu.length > 0 && <p><span className="font-semibold text-green-900">Pappu:</span> {vegItems.pappu.join(', ')}</p>}
                                                {vegItems.curry.length > 0 && <p><span className="font-semibold text-green-900">Curry:</span> {vegItems.curry.join(', ')}</p>}
                                                {vegItems.fry.length > 0 && <p><span className="font-semibold text-green-900">Fry:</span> {vegItems.fry.join(', ')}</p>}

                                                {/* Staples Compilation */}
                                                <div className="mt-2 pt-2 border-t border-green-200">
                                                    <span className="font-semibold text-green-900">Staples: </span>
                                                    {[
                                                        staples.sambar && 'Sambar', staples.rasam && 'Rasam', staples.curd && 'Curd',
                                                        staples.biriyani && 'Biriyani/Rice', staples.killi && 'Killi', staples.ghee && 'Ghee',
                                                        staples.waterBottles && 'Water Bottles', staples.dalcha && 'Dalcha',
                                                        staples.peruguChutney && 'Perugu Chutney', staples.pulka && 'Pulka',
                                                        staples.butterNaan && 'Butter Naan', staples.raagiSangati && 'Raagi Sangati',
                                                        ...customStaples
                                                    ].filter(Boolean).join(', ')}
                                                </div>

                                                {iceCreams.length > 0 && <p className="mt-2 pt-2 border-t border-green-200"><span className="font-semibold text-green-900">Ice Cream:</span> {iceCreams.join(', ')}</p>}
                                            </div>
                                        </div>

                                        {/* Non-Veg Column (Red in Print) */}
                                        <div id="print-non-veg-section" className="flex-1 p-4 rounded-lg" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                                            <h4 className="font-bold text-red-800 mb-2 border-b border-red-200 pb-1">Non-Veg Items</h4>
                                            <div className="space-y-2 text-sm text-gray-700">
                                                {nonVegItems.starters.length > 0 && <p><span className="font-semibold text-red-900">Starters:</span> {nonVegItems.starters.join(', ')}</p>}
                                                {nonVegItems.gravy.length > 0 && <p><span className="font-semibold text-red-900">Gravy:</span> {nonVegItems.gravy.join(', ')}</p>}
                                                {nonVegItems.fry.length > 0 && <p><span className="font-semibold text-red-900">Fry:</span> {nonVegItems.fry.join(', ')}</p>}
                                                {nonVegItems.biryani.length > 0 && <p><span className="font-semibold text-red-900">Biryani:</span> {nonVegItems.biryani.join(', ')}</p>}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Services Included List (Preview) */}
                                {includedServices.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Services Included</h3>
                                        <div className="space-y-1">
                                            {includedServices.map((service, idx) => (
                                                <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                                                    {service}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Charges Table */}
                                <div className="mt-auto">
                                    {!isManualTotal && (
                                        <>
                                            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Charges Breakdown</h3>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between"><span>Decoration</span><span>₹{charges.decoration}</span></div>
                                                <div className="flex justify-between"><span>Entry Charges</span><span>₹{charges.entry}</span></div>
                                                <div className="flex justify-between"><span>Food Bill</span><span>₹{charges.food}</span></div>
                                                <div className="flex justify-between"><span>Function Hall</span><span>₹{charges.functionHall}</span></div>
                                                <div className="flex justify-between"><span>Tent House</span><span>₹{charges.tentHouse}</span></div>
                                                <div className="flex justify-between"><span>Photography</span><span>₹{charges.photography}</span></div>
                                                <div className="flex justify-between"><span>Lighting</span><span>₹{charges.lighting}</span></div>
                                                <div className="flex justify-between"><span>Flexi / Banner</span><span>₹{charges.flexiBanner}</span></div>
                                            </div>
                                        </>
                                    )}
                                    <div className="mt-4 p-3 bg-orange-500 text-white rounded flex justify-between items-center print:bg-orange-500">
                                        <span className="font-bold">Grand Total</span>
                                        <span className="text-xl font-bold">₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="text-center mt-6 text-xs text-gray-400">
                                        Thank you for choosing Taraang Events!
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