"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/admin-auth";
import {
  eventTypes,
  vegSweets,
  vegHotItems,
  vegPappu,
  vegCurry,
  vegFry,
  vegStaples,
  vegPickles,
  iceCreamFlavors,
  nonVegStarters,
  nonVegGravy,
  nonVegFry,
  nonVegBiryani,
  initialFormState,
  EventFormState,
} from "@/lib/event-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LogOut,
  Eye,
  Download,
  Share2,
  Building2,
  UtensilsCrossed,
  Calculator,
  Leaf,
  Drumstick,
  IceCream,
  Calendar,
  Users,
  Phone,
  User,
  FileText,
  IndianRupee,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { MultiSelectCurry } from "@/components/ui/multi-select-curry";

// Type for extra charges
interface ExtraCharge {
  id: string;
  name: string;
  amount: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [formData, setFormData] = useState<EventFormState>(initialFormState);
  const [showPreview, setShowPreview] = useState(false);
  
  // Extra charges state
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState<number | "">("");
  
  // Custom input state for "Other" options
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({
    vegSweet: "",
    vegHotItem: "",
    vegPappu: "",
    vegCurry: "",
    vegFry: "",
    vegPickle: "",
    vegIceCream: "",
    nonVegStarter: "",
    nonVegGravy: "",
    nonVegFry: "",
    nonVegBiryani: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  // Calculate extra charges total
  const extraChargesTotal = useMemo(() => {
    return extraCharges.reduce((sum, item) => sum + item.amount, 0);
  }, [extraCharges]);

  // Calculate grand total (including extra charges and new charge fields)
  const grandTotal = useMemo(() => {
    return (
      (formData.decorationCharges || 0) +
      (formData.entryCharges || 0) +
      (formData.foodBill || 0) +
      (formData.functionHallCharges || 0) +
      (formData.tentHouseCharges || 0) +
      (formData.photographyCharges || 0) +
      (formData.lightingCharges || 0) +
      (formData.flexiBannerCharges || 0) +
      extraChargesTotal
    );
  }, [
    formData.decorationCharges,
    formData.entryCharges,
    formData.foodBill,
    formData.functionHallCharges,
    formData.tentHouseCharges,
    formData.photographyCharges,
    formData.lightingCharges,
    formData.flexiBannerCharges,
    extraChargesTotal
  ]);

  // Add extra charge
  const handleAddExtraCharge = () => {
    if (!newItemName.trim() || !newItemAmount) return;
    
    const newCharge: ExtraCharge = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      amount: Number(newItemAmount),
    };
    
    setExtraCharges((prev) => [...prev, newCharge]);
    setNewItemName("");
    setNewItemAmount("");
  };

  // Remove extra charge
  const handleRemoveExtraCharge = (id: string) => {
    setExtraCharges((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const updateVegMenu = (key: string, value: string | boolean | string[] | Record<string, boolean>) => {
    setFormData((prev) => ({
      ...prev,
      vegMenu: {
        ...prev.vegMenu,
        [key]: value,
      },
    }));
  };

  const updateNonVegMenu = (key: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      nonVegMenu: {
        ...prev.nonVegMenu,
        [key]: value,
      },
    }));
  };

  // Helper function to add item to a food category array
  const addFoodItem = (category: keyof VegMenuState | keyof NonVegMenuState, item: string, isVeg: boolean) => {
    if (!item.trim()) return;
    
    if (isVeg) {
      const currentItems = formData.vegMenu[category as keyof VegMenuState] as string[];
      if (Array.isArray(currentItems) && currentItems.length < 10) {
        updateVegMenu(category as string, [...currentItems, item.trim()]);
      }
    } else {
      const currentItems = formData.nonVegMenu[category as keyof NonVegMenuState] as string[];
      if (Array.isArray(currentItems) && currentItems.length < 10) {
        updateNonVegMenu(category as string, [...currentItems, item.trim()]);
      }
    }
  };

  // Helper function to remove item from a food category array
  const removeFoodItem = (category: keyof VegMenuState | keyof NonVegMenuState, index: number, isVeg: boolean) => {
    if (isVeg) {
      const currentItems = formData.vegMenu[category as keyof VegMenuState] as string[];
      if (Array.isArray(currentItems)) {
        updateVegMenu(category as string, currentItems.filter((_, i) => i !== index));
      }
    } else {
      const currentItems = formData.nonVegMenu[category as keyof NonVegMenuState] as string[];
      if (Array.isArray(currentItems)) {
        updateNonVegMenu(category as string, currentItems.filter((_, i) => i !== index));
      }
    }
  };

  // Helper function to update item in a food category array
  const updateFoodItem = (category: keyof VegMenuState | keyof NonVegMenuState, index: number, value: string, isVeg: boolean) => {
    if (isVeg) {
      const currentItems = formData.vegMenu[category as keyof VegMenuState] as string[];
      if (Array.isArray(currentItems)) {
        const updated = [...currentItems];
        updated[index] = value;
        updateVegMenu(category as string, updated);
      }
    } else {
      const currentItems = formData.nonVegMenu[category as keyof NonVegMenuState] as string[];
      if (Array.isArray(currentItems)) {
        const updated = [...currentItems];
        updated[index] = value;
        updateNonVegMenu(category as string, updated);
      }
    }
  };

  const toggleStaple = (stapleId: string) => {
    setFormData((prev) => ({
      ...prev,
      vegMenu: {
        ...prev.vegMenu,
        staples: {
          ...prev.vegMenu.staples,
          [stapleId]: !prev.vegMenu.staples[stapleId],
        },
      },
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSelectedStaples = () => {
    return vegStaples
      .filter((s) => formData.vegMenu.staples[s.id])
      .map((s) => s.label)
      .join(", ");
  };

  // Helper function to filter out "Other" from arrays when displaying
  const filterOther = (items: string[]): string[] => {
    return items.filter(item => item !== "Other" && item.trim() !== "");
  };

  // Helper function to get display value (removes "Other" if present)
  const getDisplayValue = (value: string): string => {
    return value === "Other" ? "" : value;
  };

  const generateSummaryText = () => {
    let summary = `*SS TARAANG EVENTS - INVOICE*\n\n`;
    summary += `📅 *Event Details*\n`;
    summary += `Customer: ${formData.customerName || "N/A"}\n`;
    summary += `Phone: ${formData.customerPhone || "N/A"}\n`;
    summary += `Event Date: ${formData.eventDate || "N/A"}\n`;
    summary += `Venue: ${formData.venue || "N/A"}\n`;
    summary += `Event Type: ${formData.eventType || "N/A"}\n`;
    summary += `Guests: ${formData.guestCount || "N/A"}\n\n`;

    summary += `💰 *Charges*\n`;
    summary += `Decoration: ${formatCurrency(formData.decorationCharges)}\n`;
    summary += `Entry: ${formatCurrency(formData.entryCharges)}\n`;
    summary += `Food Bill: ${formatCurrency(formData.foodBill)}\n`;
    if (formData.functionHallCharges > 0) summary += `Function Hall: ${formatCurrency(formData.functionHallCharges)}\n`;
    if (formData.tentHouseCharges > 0) summary += `Tent House: ${formatCurrency(formData.tentHouseCharges)}\n`;
    if (formData.photographyCharges > 0) summary += `Photography: ${formatCurrency(formData.photographyCharges)}\n`;
    if (formData.lightingCharges > 0) summary += `Lighting: ${formatCurrency(formData.lightingCharges)}\n`;
    if (formData.flexiBannerCharges > 0) summary += `Flexi / Banner: ${formatCurrency(formData.flexiBannerCharges)}\n`;
    
    // Add extra charges to summary
    if (extraCharges.length > 0) {
      summary += `\n✨ *Additional Items*\n`;
      extraCharges.forEach((item) => {
        summary += `${item.name}: ${formatCurrency(item.amount)}\n`;
      });
    }
    summary += `\n`;

    summary += `🥗 *Veg Menu*\n`;
    const vegSweets = formData.vegMenu.sweet.filter(item => item.trim() !== "");
    if (vegSweets.length > 0) summary += `*Sweets:* ${vegSweets.join(", ")}\n`;
    const vegHotItems = formData.vegMenu.hotItem.filter(item => item.trim() !== "");
    if (vegHotItems.length > 0) summary += `*Hot Items:* ${vegHotItems.join(", ")}\n`;
    const vegPappu = formData.vegMenu.pappu.filter(item => item.trim() !== "");
    if (vegPappu.length > 0) summary += `*Pappu:* ${vegPappu.join(", ")}\n`;
    const vegCurries = formData.vegMenu.curry.filter(item => item.trim() !== "");
    if (vegCurries.length > 0) summary += `*Curry:* ${vegCurries.join(", ")}\n`;
    const vegFry = formData.vegMenu.fry.filter(item => item.trim() !== "");
    if (vegFry.length > 0) summary += `*Fry:* ${vegFry.join(", ")}\n`;
    const vegPickle = formData.vegMenu.pickle.filter(item => item.trim() !== "");
    if (vegPickle.length > 0) summary += `*Pickle:* ${vegPickle.join(", ")}\n`;
    const staples = getSelectedStaples();
    if (staples) summary += `*Staples:* ${staples}\n`;
    if (formData.vegMenu.iceCream) {
      const iceCreamFlavor = formData.vegMenu.iceCreamFlavor.filter(item => item.trim() !== "");
      if (iceCreamFlavor.length > 0) {
        summary += `*Ice Cream:* ${iceCreamFlavor.join(", ")}\n`;
      } else {
        summary += `*Ice Cream:* Yes\n`;
      }
    }

    summary += `\n🍗 *Non-Veg Menu*\n`;
    const nonVegStarter = formData.nonVegMenu.starter.filter(item => item.trim() !== "");
    if (nonVegStarter.length > 0) summary += `*Starters:* ${nonVegStarter.join(", ")}\n`;
    const nonVegGravies = formData.nonVegMenu.gravy.filter(item => item.trim() !== "");
    if (nonVegGravies.length > 0) summary += `*Gravy:* ${nonVegGravies.join(", ")}\n`;
    const nonVegFry = formData.nonVegMenu.fry.filter(item => item.trim() !== "");
    if (nonVegFry.length > 0) summary += `*Fry:* ${nonVegFry.join(", ")}\n`;
    const nonVegBiryani = formData.nonVegMenu.biryani.filter(item => item.trim() !== "");
    if (nonVegBiryani.length > 0) summary += `*Biryani:* ${nonVegBiryani.join(", ")}\n`;

    summary += `\n━━━━━━━━━━━━━━━━\n`;
    summary += `*GRAND TOTAL: ${formatCurrency(grandTotal)}*`;

    return summary;
  };

  const handleWhatsAppShare = () => {
    const summary = generateSummaryText();
    const encodedMessage = encodeURIComponent(summary);
    const phoneNumber = formData.customerPhone?.replace(/[^0-9]/g, "") || "";
    const whatsappUrl = phoneNumber
      ? `https://wa.me/91${phoneNumber}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDownloadPDF = async () => {
    // Dynamic import of html2canvas and jspdf for PDF generation
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const previewContent = document.getElementById("preview-content");
    if (!previewContent) return;

    try {
      // Clone the node to capture full content without scroll limitations
      const clonedNode = previewContent.cloneNode(true) as HTMLElement;
      
      // ==========================================
      // FIX 1: FORCE REPLACE ₹ WITH "Rs." (CRITICAL)
      // ==========================================
      // Use innerHTML replacement as a robust fallback
      clonedNode.innerHTML = clonedNode.innerHTML.replace(/₹/g, "Rs.");
      
      // Also traverse text nodes to catch any missed instances
      const replaceRupeeInTextNodes = (element: HTMLElement) => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent && node.textContent.includes("₹")) {
            node.textContent = node.textContent.replace(/₹/g, "Rs.");
          }
        }
      };
      replaceRupeeInTextNodes(clonedNode);
      
      // ==========================================
      // HIDE REDUNDANT TEXT HEADER AND OTHER ELEMENTS
      // ==========================================
      const companyTitle = clonedNode.querySelector('[data-company-title]') as HTMLElement;
      if (companyTitle) {
        companyTitle.style.cssText = `display: none !important;`;
      }
      
      // Also hide the tagline paragraph if it exists right after the title
      const headerSection = clonedNode.querySelector('.text-center') as HTMLElement;
      if (headerSection) {
        headerSection.style.cssText += `text-align: center !important;`;
        // Hide tagline paragraph if it's the next sibling
        const tagline = headerSection.querySelector('p.text-slate-500');
        if (tagline) {
          (tagline as HTMLElement).style.cssText = `display: none !important;`;
        }
      }
      
      // Hide "ADD ITEMS" INPUT FORM IN PDF
      const addItemsForm = clonedNode.querySelector('.hide-in-pdf') as HTMLElement;
      if (addItemsForm) {
        addItemsForm.style.cssText = `display: none !important;`;
      }
      
      // ==========================================
      // STYLE CLONED NODE FOR FULL CAPTURE
      // ==========================================
      clonedNode.style.cssText = `
        position: absolute !important;
        left: -9999px !important;
        top: 0 !important;
        width: 800px !important;
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        background: white !important;
        background-color: white !important;
        font-family: Arial, Helvetica, sans-serif !important;
        padding: 40px !important;
      `;
      
      // Append to body first to get accurate scrollHeight
      document.body.appendChild(clonedNode);
      
      // ==========================================
      // FIX 2: REPLACEMENT STRATEGY FOR LOGO IN PDF (PREVENT ALL CLIPPING)
      // ==========================================
      // Find the Logo Container and replace with fresh image (after appending to DOM)
      const logoContainer = clonedNode.querySelector('[data-pdf-logo]') as HTMLElement;
      if (logoContainer) {
        // Get the logo URL from the existing image or use the known path
        const existingImg = logoContainer.querySelector('img') as HTMLImageElement;
        const logoUrl = existingImg?.src || existingImg?.getAttribute('src') || window.location.origin + '/new-logo.png';
        
        // Clear the container completely
        logoContainer.innerHTML = '';
        
        // Remove all classes and styles to start fresh
        logoContainer.removeAttribute('class');
        logoContainer.setAttribute('style', '');
        
        // Style the container
        logoContainer.style.cssText = `
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          overflow: visible !important;
          padding: 20px 0 !important;
          margin: 0 auto !important;
          background: transparent !important;
        `;
        
        // Create a fresh image element programmatically
        const freshImg = document.createElement('img');
        freshImg.src = logoUrl;
        freshImg.alt = 'Taraang Events Logo';
        freshImg.style.width = '300px';
        freshImg.style.height = 'auto';
        freshImg.style.objectFit = 'contain';
        freshImg.style.margin = '0 auto';
        freshImg.style.display = 'block';
        freshImg.style.maxWidth = '100%';
        
        // Append the fresh image to the cleared container
        logoContainer.appendChild(freshImg);
        
        // Wait for image to load before capturing
        await new Promise((resolve) => {
          if (freshImg.complete) {
            resolve(null);
          } else {
            freshImg.onload = () => resolve(null);
            freshImg.onerror = () => resolve(null); // Continue even if image fails to load
          }
        });
      }
      
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // ==========================================
      // FIX 3: ENSURE FULL HEIGHT CAPTURE
      // ==========================================
      // Get the actual full height after DOM insertion
      const fullHeight = clonedNode.scrollHeight;
      const fullWidth = clonedNode.scrollWidth;
      
      const canvas = await html2canvas(clonedNode, {
        scale: 3, // Higher resolution for crisp text and logo
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: fullWidth,
        height: fullHeight,
        windowWidth: 1200, // Force desktop viewport for enough room for logo
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: 0,
        allowTaint: false,
        removeContainer: false,
        imageTimeout: 0,
        // Ensure colors are preserved - no grayscale filters
      });

      // Remove the cloned node after capture
      document.body.removeChild(clonedNode);

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Create PDF with custom height to fit all content
      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Taraang_Invoice_${formData.customerName || "Event"}_${Date.now()}.pdf`);
      
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md overflow-hidden">
              <Image
                src="/new-logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          <div>
            <h1 className="text-lg font-headline font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-xs text-slate-500">Taraang Events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 text-slate-600 hover:text-blue-600 hover:border-blue-300"
          >
            <Link href="/invoice">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Invoice Generator</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-slate-600 hover:text-red-600 hover:border-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Customer & Event Details */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-headline text-slate-800">
                <Calendar className="w-5 h-5 text-primary" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-slate-600 flex items-center gap-2">
                    <User className="w-4 h-4" /> Customer Name
                  </Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="text-slate-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-slate-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Event Date
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestCount" className="text-slate-600 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Number of Guests
                  </Label>
                  <Input
                    id="guestCount"
                    type="number"
                    placeholder="Expected guests"
                    value={formData.guestCount || ""}
                    onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Venue
                  </Label>
                  <Input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Enter venue name..."
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Event Type
                  </Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charges Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-headline text-slate-800">
                <IndianRupee className="w-5 h-5 text-amber-600" />
                Charges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decoration" className="text-slate-600">
                    Decoration Charges
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="decoration"
                      type="number"
                      placeholder="0"
                      value={formData.decorationCharges || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, decorationCharges: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry" className="text-slate-600">
                    Entry Charges
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="entry"
                      type="number"
                      placeholder="0"
                      value={formData.entryCharges || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, entryCharges: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foodBill" className="text-slate-600">
                    Food Bill
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="foodBill"
                      type="number"
                      placeholder="0"
                      value={formData.foodBill || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, foodBill: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="functionHall" className="text-slate-600">
                    Function Hall Charges
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="functionHall"
                      type="number"
                      placeholder="0"
                      value={formData.functionHallCharges || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, functionHallCharges: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tentHouse" className="text-slate-600">
                    Tent House Charges
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="tentHouse"
                      type="number"
                      placeholder="0"
                      value={formData.tentHouseCharges || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, tentHouseCharges: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photography" className="text-slate-600">
                    Photography Charges
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="photography"
                      type="number"
                      placeholder="0"
                      value={formData.photographyCharges || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, photographyCharges: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lighting" className="text-slate-600">
                    Lighting Charges
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="lighting"
                      type="number"
                      placeholder="0"
                      value={formData.lightingCharges || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, lightingCharges: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flexiBanner" className="text-slate-600">
                    Flexi / Banner Charges
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="flexiBanner"
                      type="number"
                      placeholder="0"
                      value={formData.flexiBannerCharges || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, flexiBannerCharges: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Menu Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-headline text-slate-800">
                <UtensilsCrossed className="w-5 h-5 text-green-600" />
                Food Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="veg" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-slate-100">
                  <TabsTrigger
                    value="veg"
                    className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white h-10"
                  >
                    <Leaf className="w-4 h-4" />
                    Veg
                  </TabsTrigger>
                  <TabsTrigger
                    value="nonveg"
                    className="gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white h-10"
                  >
                    <Drumstick className="w-4 h-4" />
                    Non-Veg
                  </TabsTrigger>
                </TabsList>

                {/* Veg Menu Tab */}
                <TabsContent value="veg" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sweets */}
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-semibold">Sweets</Label>
                      {formData.vegMenu.sweet.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateFoodItem("sweet", index, e.target.value, true)}
                            placeholder="Enter sweet name..."
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFoodItem("sweet", index, true)}
                            className="h-10 w-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.vegMenu.sweet.length < 10 && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add sweet..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const input = e.target as HTMLInputElement;
                                addFoodItem("sweet", input.value, true);
                                input.value = "";
                              }
                            }}
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                              if (input) {
                                addFoodItem("sweet", input.value, true);
                                input.value = "";
                              }
                            }}
                            className="h-10 w-10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* Hot Items */}
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-semibold">Hot Items</Label>
                      {formData.vegMenu.hotItem.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateFoodItem("hotItem", index, e.target.value, true)}
                            placeholder="Enter hot item name..."
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFoodItem("hotItem", index, true)}
                            className="h-10 w-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.vegMenu.hotItem.length < 10 && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add hot item..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const input = e.target as HTMLInputElement;
                                addFoodItem("hotItem", input.value, true);
                                input.value = "";
                              }
                            }}
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                              if (input) {
                                addFoodItem("hotItem", input.value, true);
                                input.value = "";
                              }
                            }}
                            className="h-10 w-10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Course */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Main Course
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pappu */}
                      <div className="space-y-2">
                        <Label className="text-slate-600 text-sm font-semibold">Pappu</Label>
                        {formData.vegMenu.pappu.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => updateFoodItem("pappu", index, e.target.value, true)}
                              placeholder="Enter pappu name..."
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeFoodItem("pappu", index, true)}
                              className="h-10 w-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {formData.vegMenu.pappu.length < 10 && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add pappu..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement;
                                  addFoodItem("pappu", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                                if (input) {
                                  addFoodItem("pappu", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 w-10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {/* Curry */}
                      <div className="space-y-2">
                        <Label className="text-slate-600 text-sm font-semibold">Curry</Label>
                        {formData.vegMenu.curry.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => updateFoodItem("curry", index, e.target.value, true)}
                              placeholder="Enter curry name..."
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeFoodItem("curry", index, true)}
                              className="h-10 w-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {formData.vegMenu.curry.length < 10 && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add curry..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement;
                                  addFoodItem("curry", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                                if (input) {
                                  addFoodItem("curry", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 w-10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {/* Fry */}
                      <div className="space-y-2">
                        <Label className="text-slate-600 text-sm font-semibold">Fry</Label>
                        {formData.vegMenu.fry.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => updateFoodItem("fry", index, e.target.value, true)}
                              placeholder="Enter fry name..."
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeFoodItem("fry", index, true)}
                              className="h-10 w-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {formData.vegMenu.fry.length < 10 && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add fry..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement;
                                  addFoodItem("fry", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                                if (input) {
                                  addFoodItem("fry", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 w-10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {/* Pickle */}
                      <div className="space-y-2">
                        <Label className="text-slate-600 text-sm font-semibold">Pickle</Label>
                        {formData.vegMenu.pickle.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => updateFoodItem("pickle", index, e.target.value, true)}
                              placeholder="Enter pickle name..."
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeFoodItem("pickle", index, true)}
                              className="h-10 w-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {formData.vegMenu.pickle.length < 10 && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add pickle..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement;
                                  addFoodItem("pickle", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                                if (input) {
                                  addFoodItem("pickle", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 w-10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Staples */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Staples
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {vegStaples.map((staple) => (
                        <div key={staple.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={staple.id}
                            checked={formData.vegMenu.staples[staple.id]}
                            onCheckedChange={() => toggleStaple(staple.id)}
                            className="h-5 w-5"
                          />
                          <Label
                            htmlFor={staple.id}
                            className="text-sm font-normal text-slate-600 cursor-pointer"
                          >
                            {staple.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ice Cream Toggle */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IceCream className="w-5 h-5 text-pink-500" />
                        <Label htmlFor="icecream" className="font-medium text-slate-700">
                          Ice Cream
                        </Label>
                      </div>
                      <Switch
                        id="icecream"
                        checked={formData.vegMenu.iceCream}
                        onCheckedChange={(checked) => updateVegMenu("iceCream", checked)}
                      />
                    </div>
                    {formData.vegMenu.iceCream && (
                      <div className="mt-4 animate-in slide-in-from-top-2 space-y-2">
                        <Label className="text-slate-600 text-sm font-semibold">Ice Cream Flavors</Label>
                        {formData.vegMenu.iceCreamFlavor.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => updateFoodItem("iceCreamFlavor", index, e.target.value, true)}
                              placeholder="Enter flavor name..."
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeFoodItem("iceCreamFlavor", index, true)}
                              className="h-10 w-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {formData.vegMenu.iceCreamFlavor.length < 10 && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add flavor..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement;
                                  addFoodItem("iceCreamFlavor", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                                if (input) {
                                  addFoodItem("iceCreamFlavor", input.value, true);
                                  input.value = "";
                                }
                              }}
                              className="h-10 w-10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Non-Veg Menu Tab */}
                <TabsContent value="nonveg" className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Starters */}
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-semibold">Starters</Label>
                      {formData.nonVegMenu.starter.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateFoodItem("starter", index, e.target.value, false)}
                            placeholder="Enter starter name..."
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFoodItem("starter", index, false)}
                            className="h-10 w-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.nonVegMenu.starter.length < 10 && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add starter..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const input = e.target as HTMLInputElement;
                                addFoodItem("starter", input.value, false);
                                input.value = "";
                              }
                            }}
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                              if (input) {
                                addFoodItem("starter", input.value, false);
                                input.value = "";
                              }
                            }}
                            className="h-10 w-10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* Gravy */}
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-semibold">Gravy</Label>
                      {formData.nonVegMenu.gravy.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateFoodItem("gravy", index, e.target.value, false)}
                            placeholder="Enter gravy name..."
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFoodItem("gravy", index, false)}
                            className="h-10 w-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.nonVegMenu.gravy.length < 10 && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add gravy..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const input = e.target as HTMLInputElement;
                                addFoodItem("gravy", input.value, false);
                                input.value = "";
                              }
                            }}
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                              if (input) {
                                addFoodItem("gravy", input.value, false);
                                input.value = "";
                              }
                            }}
                            className="h-10 w-10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* Fry */}
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-semibold">Fry</Label>
                      {formData.nonVegMenu.fry.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateFoodItem("fry", index, e.target.value, false)}
                            placeholder="Enter fry name..."
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFoodItem("fry", index, false)}
                            className="h-10 w-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.nonVegMenu.fry.length < 10 && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add fry..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const input = e.target as HTMLInputElement;
                                addFoodItem("fry", input.value, false);
                                input.value = "";
                              }
                            }}
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                              if (input) {
                                addFoodItem("fry", input.value, false);
                                input.value = "";
                              }
                            }}
                            className="h-10 w-10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* Biryani */}
                    <div className="space-y-2">
                      <Label className="text-slate-600 font-semibold">Biryani</Label>
                      {formData.nonVegMenu.biryani.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateFoodItem("biryani", index, e.target.value, false)}
                            placeholder="Enter biryani name..."
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFoodItem("biryani", index, false)}
                            className="h-10 w-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.nonVegMenu.biryani.length < 10 && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add biryani..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const input = e.target as HTMLInputElement;
                                addFoodItem("biryani", input.value, false);
                                input.value = "";
                              }
                            }}
                            className="h-10 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).closest("div")?.querySelector("input") as HTMLInputElement;
                              if (input) {
                                addFoodItem("biryani", input.value, false);
                                input.value = "";
                              }
                            }}
                            className="h-10 w-10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Grand Total Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white overflow-hidden">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-amber-100 text-sm">Grand Total</p>
                    <p className="text-3xl font-bold">{formatCurrency(grandTotal)}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-amber-100 hidden sm:block">
                  <p>Decoration: {formatCurrency(formData.decorationCharges)}</p>
                  <p>Entry: {formatCurrency(formData.entryCharges)}</p>
                  <p>Food: {formatCurrency(formData.foodBill)}</p>
                  {formData.functionHallCharges > 0 && <p>Function Hall: {formatCurrency(formData.functionHallCharges)}</p>}
                  {formData.tentHouseCharges > 0 && <p>Tent House: {formatCurrency(formData.tentHouseCharges)}</p>}
                  {formData.photographyCharges > 0 && <p>Photography: {formatCurrency(formData.photographyCharges)}</p>}
                  {formData.lightingCharges > 0 && <p>Lighting: {formatCurrency(formData.lightingCharges)}</p>}
                  {formData.flexiBannerCharges > 0 && <p>Flexi/Banner: {formatCurrency(formData.flexiBannerCharges)}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-8">
            <Button
              onClick={() => setShowPreview(true)}
              className="h-12 gap-2 bg-slate-800 hover:bg-slate-700 text-white shadow-lg"
            >
              <Eye className="w-5 h-5" />
              Preview
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="h-12 gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              className="h-12 gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              Share on WhatsApp
            </Button>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2 text-xl font-headline">
              <FileText className="w-5 h-5 text-primary" />
              Invoice Preview
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div id="preview-content" className="p-6 bg-white">
              {/* Invoice Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-amber-500">
                <div className="flex justify-center mb-4">
                  <div 
                    data-pdf-logo
                    className="w-40 h-auto flex items-center justify-center"
                  >
                    <Image
                      src="/new-logo.png"
                      alt="Taraang Events"
                      width={160}
                      height={160}
                      className="object-contain w-full h-auto"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-headline font-bold text-slate-800" data-company-title>TARAANG EVENTS</h2>
                <p className="text-slate-500 text-sm">Your Event, Our Passion</p>
              </div>

              {/* Customer Details */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Name:</span>
                    <span className="ml-2 text-slate-800 font-medium">
                      {formData.customerName || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>
                    <span className="ml-2 text-slate-800 font-medium">
                      {formData.customerPhone || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Event Date:</span>
                    <span className="ml-2 text-slate-800 font-medium">
                      {formData.eventDate || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Guests:</span>
                    <span className="ml-2 text-slate-800 font-medium">
                      {formData.guestCount || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="mb-6">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Venue:</span>
                    <span className="ml-2 text-slate-800">{formData.venue || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Event Type:</span>
                    <span className="ml-2 text-slate-800">{formData.eventType || "N/A"}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Food Menu */}
              <div className="mb-6">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-green-600" />
                  Food Menu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Veg Section */}
                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      Veg Items
                    </h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      {formData.vegMenu.sweet.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Sweets:</span> {formData.vegMenu.sweet.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {formData.vegMenu.hotItem.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Hot Items:</span> {formData.vegMenu.hotItem.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {formData.vegMenu.pappu.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Pappu:</span> {formData.vegMenu.pappu.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {formData.vegMenu.curry.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Curry:</span> {formData.vegMenu.curry.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {formData.vegMenu.fry.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Fry:</span> {formData.vegMenu.fry.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {formData.vegMenu.pickle.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Pickle:</span> {formData.vegMenu.pickle.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {getSelectedStaples() && <li><span className="font-bold">Staples:</span> {getSelectedStaples()}</li>}
                      {formData.vegMenu.iceCream && (
                        <li>
                          <span className="font-bold">Ice Cream:</span> {
                            formData.vegMenu.iceCreamFlavor.filter(item => item.trim() !== "").length > 0
                              ? formData.vegMenu.iceCreamFlavor.filter(item => item.trim() !== "").join(", ")
                              : "Yes"
                          }
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Non-Veg Section */}
                  <div className="bg-red-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                      <Drumstick className="w-3 h-3" />
                      Non-Veg Items
                    </h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      {formData.nonVegMenu.starter.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Starters:</span> {formData.nonVegMenu.starter.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {formData.nonVegMenu.gravy.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Gravy:</span> {formData.nonVegMenu.gravy.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {formData.nonVegMenu.fry.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Fry:</span> {formData.nonVegMenu.fry.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                      {formData.nonVegMenu.biryani.filter(item => item.trim() !== "").length > 0 && (
                        <li><span className="font-bold">Biryani:</span> {formData.nonVegMenu.biryani.filter(item => item.trim() !== "").join(", ")}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Charges Breakdown */}
              <div className="mb-6">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-amber-600" />
                  Charges Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Decoration Charges</span>
                    <span className="font-medium">{formatCurrency(formData.decorationCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Entry Charges</span>
                    <span className="font-medium">{formatCurrency(formData.entryCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Food Bill</span>
                    <span className="font-medium">{formatCurrency(formData.foodBill)}</span>
                  </div>
                  {formData.functionHallCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Function Hall Charges</span>
                      <span className="font-medium">{formatCurrency(formData.functionHallCharges)}</span>
                    </div>
                  )}
                  {formData.tentHouseCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tent House Charges</span>
                      <span className="font-medium">{formatCurrency(formData.tentHouseCharges)}</span>
                    </div>
                  )}
                  {formData.photographyCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Photography Charges</span>
                      <span className="font-medium">{formatCurrency(formData.photographyCharges)}</span>
                    </div>
                  )}
                  {formData.lightingCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Lighting Charges</span>
                      <span className="font-medium">{formatCurrency(formData.lightingCharges)}</span>
                    </div>
                  )}
                  {formData.flexiBannerCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Flexi / Banner Charges</span>
                      <span className="font-medium">{formatCurrency(formData.flexiBannerCharges)}</span>
                    </div>
                  )}
                  
                  {/* Extra Charges List */}
                  {extraCharges.length > 0 && (
                    <>
                      <Separator className="my-2" />
                      {extraCharges.map((item) => (
                        <div key={item.id} className="flex justify-between items-center group">
                          <span className="text-slate-600 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExtraCharge(item.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full transition-all"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Additional Items Section - Add Form */}
              <div className="mb-6 bg-purple-50 rounded-lg p-4 border border-purple-100 hide-in-pdf">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Additional Items
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Add miscellaneous charges like DJ, Magic Show, Generator, etc.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Item name (e.g., Magic Show)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 h-11 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddExtraCharge();
                      }
                    }}
                  />
                  <div className="relative flex-1 sm:max-w-[140px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value ? parseInt(e.target.value) : "")}
                      className="h-11 pl-8 bg-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddExtraCharge();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddExtraCharge}
                    disabled={!newItemName.trim() || !newItemAmount}
                    className="h-11 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Quick summary of extra charges */}
                {extraCharges.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700 font-medium">
                        Additional Items ({extraCharges.length})
                      </span>
                      <span className="text-purple-700 font-bold">
                        {formatCurrency(extraChargesTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Grand Total</span>
                  <span className="text-2xl font-bold">{formatCurrency(grandTotal)}</span>
                </div>
                {extraCharges.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/20 text-sm text-amber-100">
                    <div className="flex justify-between">
                      <span>Base Total</span>
                      <span>{formatCurrency(grandTotal - extraChargesTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Items</span>
                      <span>+ {formatCurrency(extraChargesTotal)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-xs text-slate-400">
                <p>Thank you for choosing SS Taraang Events!</p>
                <p className="mt-1">Generated on {new Date().toLocaleDateString("en-IN")}</p>
              </div>
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-slate-50 flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
