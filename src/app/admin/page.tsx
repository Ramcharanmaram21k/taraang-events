"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/admin-auth";
import {
  venues,
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

  // Calculate grand total (including extra charges)
  const grandTotal = useMemo(() => {
    return (
      (formData.decorationCharges || 0) +
      (formData.entryCharges || 0) +
      (formData.foodBill || 0) +
      extraChargesTotal
    );
  }, [formData.decorationCharges, formData.entryCharges, formData.foodBill, extraChargesTotal]);

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
    
    // Add extra charges to summary
    if (extraCharges.length > 0) {
      summary += `\n✨ *Additional Items*\n`;
      extraCharges.forEach((item) => {
        summary += `${item.name}: ${formatCurrency(item.amount)}\n`;
      });
    }
    summary += `\n`;

    summary += `🥗 *Veg Menu*\n`;
    const vegSweets = filterOther(formData.vegMenu.sweet);
    if (vegSweets.length > 0) summary += `Sweet: ${vegSweets.join(", ")}\n`;
    const vegHotItems = filterOther(formData.vegMenu.hotItem);
    if (vegHotItems.length > 0) summary += `Hot Item: ${vegHotItems.join(", ")}\n`;
    const vegPappu = getDisplayValue(formData.vegMenu.pappu);
    if (vegPappu) summary += `Pappu: ${vegPappu}\n`;
    const vegCurries = filterOther(formData.vegMenu.curry);
    if (vegCurries.length > 0) summary += `Curry: ${vegCurries.join(", ")}\n`;
    const vegFry = getDisplayValue(formData.vegMenu.fry);
    if (vegFry) summary += `Fry: ${vegFry}\n`;
    const vegPickle = getDisplayValue(formData.vegMenu.pickle);
    if (vegPickle) summary += `Pickle: ${vegPickle}\n`;
    const staples = getSelectedStaples();
    if (staples) summary += `Staples: ${staples}\n`;
    if (formData.vegMenu.iceCream) {
      const iceCreamFlavor = getDisplayValue(formData.vegMenu.iceCreamFlavor);
      summary += `Ice Cream: ${iceCreamFlavor || "Yes"}\n`;
    }

    summary += `\n🍗 *Non-Veg Menu*\n`;
    const nonVegStarter = getDisplayValue(formData.nonVegMenu.starter);
    if (nonVegStarter) summary += `Starter: ${nonVegStarter}\n`;
    const nonVegGravies = filterOther(formData.nonVegMenu.gravy);
    if (nonVegGravies.length > 0) summary += `Gravy: ${nonVegGravies.join(", ")}\n`;
    const nonVegFry = getDisplayValue(formData.nonVegMenu.fry);
    if (nonVegFry) summary += `Fry: ${nonVegFry}\n`;
    const nonVegBiryani = getDisplayValue(formData.nonVegMenu.biryani);
    if (nonVegBiryani) summary += `Biryani: ${nonVegBiryani}\n`;

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
                  <Select
                    value={formData.venue}
                    onValueChange={(value) => setFormData({ ...formData, venue: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue} value={venue}>
                          {venue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <div className="space-y-2">
                      <Label className="text-slate-600">Sweets (Select up to 2)</Label>
                      <MultiSelectCurry
                        options={[...vegSweets, "Other"]}
                        selected={formData.vegMenu.sweet}
                        onChange={(selected) => {
                          // If "Other" was removed, clear custom input
                          if (!selected.includes("Other") && formData.vegMenu.sweet.includes("Other")) {
                            setCustomInputs(prev => ({ ...prev, vegSweet: "" }));
                          }
                          updateVegMenu("sweet", selected);
                        }}
                        placeholder="Select sweets..."
                        maxSelections={2}
                        itemLabel="sweets"
                      />
                      {formData.vegMenu.sweet.includes("Other") && (
                        <Input
                          placeholder="Type your own sweet..."
                          value={customInputs.vegSweet}
                          onChange={(e) => {
                            const customValue = e.target.value;
                            setCustomInputs(prev => ({ ...prev, vegSweet: customValue }));
                            // Replace "Other" with custom text in the array
                            const updated = formData.vegMenu.sweet.map(item => 
                              item === "Other" ? (customValue || "Other") : item
                            );
                            updateVegMenu("sweet", updated);
                          }}
                          className="h-11 mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-600">Hot Items (Select up to 2)</Label>
                      <MultiSelectCurry
                        options={[...vegHotItems, "Other"]}
                        selected={formData.vegMenu.hotItem}
                        onChange={(selected) => {
                          // If "Other" was removed, clear custom input
                          if (!selected.includes("Other") && formData.vegMenu.hotItem.includes("Other")) {
                            setCustomInputs(prev => ({ ...prev, vegHotItem: "" }));
                          }
                          updateVegMenu("hotItem", selected);
                        }}
                        placeholder="Select hot items..."
                        maxSelections={2}
                        itemLabel="hot items"
                      />
                      {formData.vegMenu.hotItem.includes("Other") && (
                        <Input
                          placeholder="Type your own hot item..."
                          value={customInputs.vegHotItem}
                          onChange={(e) => {
                            const customValue = e.target.value;
                            setCustomInputs(prev => ({ ...prev, vegHotItem: customValue }));
                            // Replace "Other" with custom text in the array
                            const updated = formData.vegMenu.hotItem.map(item => 
                              item === "Other" ? (customValue || "Other") : item
                            );
                            updateVegMenu("hotItem", updated);
                          }}
                          className="h-11 mt-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* Main Course */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Main Course
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-600 text-sm">Pappu</Label>
                        <Select
                          value={formData.vegMenu.pappu}
                          onValueChange={(value) => {
                            if (value === "Other") {
                              updateVegMenu("pappu", "Other");
                            } else {
                              updateVegMenu("pappu", value);
                              setCustomInputs(prev => ({ ...prev, vegPappu: "" }));
                            }
                          }}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select pappu" />
                          </SelectTrigger>
                          <SelectContent>
                            {vegPappu.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other...</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.vegMenu.pappu === "Other" && (
                          <Input
                            placeholder="Type your own pappu..."
                            value={customInputs.vegPappu}
                            onChange={(e) => {
                              const customValue = e.target.value;
                              setCustomInputs(prev => ({ ...prev, vegPappu: customValue }));
                              updateVegMenu("pappu", customValue || "Other");
                            }}
                            className="h-11 mt-2"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-600 text-sm">Curry (Select up to 2)</Label>
                        <MultiSelectCurry
                          options={[...vegCurry, "Other"]}
                          selected={formData.vegMenu.curry}
                          onChange={(selected) => {
                            // If "Other" was removed, clear custom input
                            if (!selected.includes("Other") && formData.vegMenu.curry.includes("Other")) {
                              setCustomInputs(prev => ({ ...prev, vegCurry: "" }));
                            }
                            updateVegMenu("curry", selected);
                          }}
                          placeholder="Select curries..."
                          maxSelections={2}
                          itemLabel="curries"
                        />
                        {formData.vegMenu.curry.includes("Other") && (
                          <Input
                            placeholder="Type your own curry..."
                            value={customInputs.vegCurry}
                            onChange={(e) => {
                              const customValue = e.target.value;
                              setCustomInputs(prev => ({ ...prev, vegCurry: customValue }));
                              // Replace "Other" with custom text in the array
                              const updated = formData.vegMenu.curry.map(item => 
                                item === "Other" ? (customValue || "Other") : item
                              );
                              updateVegMenu("curry", updated);
                            }}
                            className="h-11 mt-2"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-600 text-sm">Fry</Label>
                        <Select
                          value={formData.vegMenu.fry}
                          onValueChange={(value) => {
                            if (value === "Other") {
                              updateVegMenu("fry", "Other");
                            } else {
                              updateVegMenu("fry", value);
                              setCustomInputs(prev => ({ ...prev, vegFry: "" }));
                            }
                          }}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select fry" />
                          </SelectTrigger>
                          <SelectContent>
                            {vegFry.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other...</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.vegMenu.fry === "Other" && (
                          <Input
                            placeholder="Type your own fry..."
                            value={customInputs.vegFry}
                            onChange={(e) => {
                              const customValue = e.target.value;
                              setCustomInputs(prev => ({ ...prev, vegFry: customValue }));
                              updateVegMenu("fry", customValue || "Other");
                            }}
                            className="h-11 mt-2"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-600 text-sm">Pickle</Label>
                        <Select
                          value={formData.vegMenu.pickle}
                          onValueChange={(value) => {
                            if (value === "Other") {
                              updateVegMenu("pickle", "Other");
                            } else {
                              updateVegMenu("pickle", value);
                              setCustomInputs(prev => ({ ...prev, vegPickle: "" }));
                            }
                          }}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select pickle" />
                          </SelectTrigger>
                          <SelectContent>
                            {vegPickles.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other...</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.vegMenu.pickle === "Other" && (
                          <Input
                            placeholder="Type your own pickle..."
                            value={customInputs.vegPickle}
                            onChange={(e) => {
                              const customValue = e.target.value;
                              setCustomInputs(prev => ({ ...prev, vegPickle: customValue }));
                              updateVegMenu("pickle", customValue || "Other");
                            }}
                            className="h-11 mt-2"
                          />
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
                      <div className="mt-4 animate-in slide-in-from-top-2">
                        <Label className="text-slate-600 text-sm">Select Flavor</Label>
                        <Select
                          value={formData.vegMenu.iceCreamFlavor}
                          onValueChange={(value) => {
                            if (value === "Other") {
                              updateVegMenu("iceCreamFlavor", "Other");
                            } else {
                              updateVegMenu("iceCreamFlavor", value);
                              setCustomInputs(prev => ({ ...prev, vegIceCream: "" }));
                            }
                          }}
                        >
                          <SelectTrigger className="h-11 mt-2 bg-white">
                            <SelectValue placeholder="Choose flavor" />
                          </SelectTrigger>
                          <SelectContent>
                            {iceCreamFlavors.map((flavor) => (
                              <SelectItem key={flavor} value={flavor}>
                                {flavor}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other...</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.vegMenu.iceCreamFlavor === "Other" && (
                          <Input
                            placeholder="Type your own flavor..."
                            value={customInputs.vegIceCream}
                            onChange={(e) => {
                              const customValue = e.target.value;
                              setCustomInputs(prev => ({ ...prev, vegIceCream: customValue }));
                              updateVegMenu("iceCreamFlavor", customValue || "Other");
                            }}
                            className="h-11 mt-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Non-Veg Menu Tab */}
                <TabsContent value="nonveg" className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-600">Starters</Label>
                      <Select
                        value={formData.nonVegMenu.starter}
                        onValueChange={(value) => {
                          if (value === "Other") {
                            updateNonVegMenu("starter", "Other");
                          } else {
                            updateNonVegMenu("starter", value);
                            setCustomInputs(prev => ({ ...prev, nonVegStarter: "" }));
                          }
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select starter" />
                        </SelectTrigger>
                        <SelectContent>
                          {nonVegStarters.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.nonVegMenu.starter === "Other" && (
                        <Input
                          placeholder="Type your own starter..."
                          value={customInputs.nonVegStarter}
                          onChange={(e) => {
                            const customValue = e.target.value;
                            setCustomInputs(prev => ({ ...prev, nonVegStarter: customValue }));
                            updateNonVegMenu("starter", customValue || "Other");
                          }}
                          className="h-11 mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-600">Gravy (Select up to 2)</Label>
                      <MultiSelectCurry
                        options={[...nonVegGravy, "Other"]}
                        selected={formData.nonVegMenu.gravy}
                        onChange={(selected) => {
                          // If "Other" was removed, clear custom input
                          if (!selected.includes("Other") && formData.nonVegMenu.gravy.includes("Other")) {
                            setCustomInputs(prev => ({ ...prev, nonVegGravy: "" }));
                          }
                          updateNonVegMenu("gravy", selected);
                        }}
                        placeholder="Select gravies..."
                        maxSelections={2}
                        itemLabel="gravies"
                      />
                      {formData.nonVegMenu.gravy.includes("Other") && (
                        <Input
                          placeholder="Type your own gravy..."
                          value={customInputs.nonVegGravy}
                          onChange={(e) => {
                            const customValue = e.target.value;
                            setCustomInputs(prev => ({ ...prev, nonVegGravy: customValue }));
                            // Replace "Other" with custom text in the array
                            const updated = formData.nonVegMenu.gravy.map(item => 
                              item === "Other" ? (customValue || "Other") : item
                            );
                            updateNonVegMenu("gravy", updated);
                          }}
                          className="h-11 mt-2"
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-600">Fry</Label>
                      <Select
                        value={formData.nonVegMenu.fry}
                        onValueChange={(value) => {
                          if (value === "Other") {
                            updateNonVegMenu("fry", "Other");
                          } else {
                            updateNonVegMenu("fry", value);
                            setCustomInputs(prev => ({ ...prev, nonVegFry: "" }));
                          }
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select fry" />
                        </SelectTrigger>
                        <SelectContent>
                          {nonVegFry.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.nonVegMenu.fry === "Other" && (
                        <Input
                          placeholder="Type your own fry..."
                          value={customInputs.nonVegFry}
                          onChange={(e) => {
                            const customValue = e.target.value;
                            setCustomInputs(prev => ({ ...prev, nonVegFry: customValue }));
                            updateNonVegMenu("fry", customValue || "Other");
                          }}
                          className="h-11 mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-600">Biryani</Label>
                      <Select
                        value={formData.nonVegMenu.biryani}
                        onValueChange={(value) => {
                          if (value === "Other") {
                            updateNonVegMenu("biryani", "Other");
                          } else {
                            updateNonVegMenu("biryani", value);
                            setCustomInputs(prev => ({ ...prev, nonVegBiryani: "" }));
                          }
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select biryani" />
                        </SelectTrigger>
                        <SelectContent>
                          {nonVegBiryani.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.nonVegMenu.biryani === "Other" && (
                        <Input
                          placeholder="Type your own biryani..."
                          value={customInputs.nonVegBiryani}
                          onChange={(e) => {
                            const customValue = e.target.value;
                            setCustomInputs(prev => ({ ...prev, nonVegBiryani: customValue }));
                            updateNonVegMenu("biryani", customValue || "Other");
                          }}
                          className="h-11 mt-2"
                        />
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
                      {filterOther(formData.vegMenu.sweet).length > 0 && <li>Sweet: {filterOther(formData.vegMenu.sweet).join(", ")}</li>}
                      {filterOther(formData.vegMenu.hotItem).length > 0 && <li>Hot Item: {filterOther(formData.vegMenu.hotItem).join(", ")}</li>}
                      {getDisplayValue(formData.vegMenu.pappu) && <li>Pappu: {getDisplayValue(formData.vegMenu.pappu)}</li>}
                      {filterOther(formData.vegMenu.curry).length > 0 && <li>Curry: {filterOther(formData.vegMenu.curry).join(", ")}</li>}
                      {getDisplayValue(formData.vegMenu.fry) && <li>Fry: {getDisplayValue(formData.vegMenu.fry)}</li>}
                      {getDisplayValue(formData.vegMenu.pickle) && <li>Pickle: {getDisplayValue(formData.vegMenu.pickle)}</li>}
                      {getSelectedStaples() && <li>Staples: {getSelectedStaples()}</li>}
                      {formData.vegMenu.iceCream && (
                        <li>Ice Cream: {getDisplayValue(formData.vegMenu.iceCreamFlavor) || "Yes"}</li>
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
                      {getDisplayValue(formData.nonVegMenu.starter) && (
                        <li>Starter: {getDisplayValue(formData.nonVegMenu.starter)}</li>
                      )}
                      {filterOther(formData.nonVegMenu.gravy).length > 0 && <li>Gravy: {filterOther(formData.nonVegMenu.gravy).join(", ")}</li>}
                      {getDisplayValue(formData.nonVegMenu.fry) && <li>Fry: {getDisplayValue(formData.nonVegMenu.fry)}</li>}
                      {getDisplayValue(formData.nonVegMenu.biryani) && (
                        <li>Biryani: {getDisplayValue(formData.nonVegMenu.biryani)}</li>
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
