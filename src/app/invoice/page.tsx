"use client";

import React, { useState, useMemo } from "react";
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
import { Download, FileText } from "lucide-react";
import Image from "next/image";

const eventTypes = [
  "Wedding",
  "Engagement",
  "Birthday Party",
  "Corporate Event",
  "Anniversary",
  "Baby Shower",
  "Reception",
  "Haldi & Mehendi",
  "Other",
];

export default function InvoiceGeneratorPage() {
  const [invoiceDate, setInvoiceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [customerName, setCustomerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [amountFinalized, setAmountFinalized] = useState<number | "">("");
  const [advancePaid, setAdvancePaid] = useState<number | "">("");

  // Calculate balance amount
  const balanceAmount = useMemo(() => {
    const finalized = Number(amountFinalized) || 0;
    const advance = Number(advancePaid) || 0;
    return Math.max(0, finalized - advance);
  }, [amountFinalized, advancePaid]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "Rs.");
  };

  const handleDownloadInvoice = async () => {
    // Validation
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }
    if (!eventDate) {
      alert("Please select event date");
      return;
    }
    if (!eventType) {
      alert("Please select event type");
      return;
    }
    if (!amountFinalized || Number(amountFinalized) <= 0) {
      alert("Please enter a valid finalized amount");
      return;
    }
    if (Number(advancePaid) > Number(amountFinalized)) {
      alert("Advance paid cannot be greater than finalized amount");
      return;
    }

    // Dynamic import of html2canvas and jspdf
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const invoiceContent = document.getElementById("invoice-content");
    if (!invoiceContent) return;

    try {
      // Clone the node to capture full content
      const clonedNode = invoiceContent.cloneNode(true) as HTMLElement;

      // Replace ₹ with "Rs."
      clonedNode.innerHTML = clonedNode.innerHTML.replace(/₹/g, "Rs.");

      // ==========================================
      // NUCLEAR FIX FOR LOGO IN PDF
      // ==========================================
      const logoContainer = clonedNode.querySelector('[data-invoice-logo]') as HTMLElement;
      if (logoContainer) {
        // Get the logo URL
        const existingImg = logoContainer.querySelector("img") as HTMLImageElement;
        const logoUrl =
          existingImg?.src ||
          existingImg?.getAttribute("src") ||
          window.location.origin + "/new-logo.png";

        // Clear the container completely
        logoContainer.innerHTML = "";

        // Remove all classes and styles
        logoContainer.removeAttribute("class");
        logoContainer.setAttribute("style", "");

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

        // Create a fresh image element
        const freshImg = document.createElement("img");
        freshImg.src = logoUrl;
        freshImg.alt = "SS Taraang Events Logo";
        freshImg.style.width = "250px";
        freshImg.style.height = "auto";
        freshImg.style.objectFit = "contain";
        freshImg.style.margin = "0 auto";
        freshImg.style.display = "block";
        freshImg.style.maxWidth = "100%";

        // Append the fresh image
        logoContainer.appendChild(freshImg);

        // Wait for image to load
        await new Promise((resolve) => {
          if (freshImg.complete) {
            resolve(null);
          } else {
            freshImg.onload = () => resolve(null);
            freshImg.onerror = () => resolve(null);
          }
        });
      }

      // Style the cloned node
      clonedNode.style.cssText = `
        position: absolute !important;
        left: -9999px !important;
        top: 0 !important;
        width: 800px !important;
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        background: white !important;
        font-family: Arial, Helvetica, sans-serif !important;
        padding: 40px !important;
      `;

      // Append to body
      document.body.appendChild(clonedNode);

      // Wait for DOM update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Get dimensions
      const fullHeight = clonedNode.scrollHeight;
      const fullWidth = clonedNode.scrollWidth;

      // Generate canvas with desktop viewport
      const canvas = await html2canvas(clonedNode, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: fullWidth,
        height: fullHeight,
        windowWidth: 1200, // Desktop viewport for logo
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: 0,
        allowTaint: false,
        removeContainer: false,
        imageTimeout: 0,
      });

      // Remove cloned node
      document.body.removeChild(clonedNode);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Invoice_${customerName.replace(/\s+/g, "_")}_${Date.now()}.pdf`
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-4 px-3 sm:py-8 sm:px-4 md:py-12">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              Invoice Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="invoiceDate" className="text-sm sm:text-base">Invoice Date *</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="customerName" className="text-sm sm:text-base">Customer Name *</Label>
                  <Input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="eventDate" className="text-sm sm:text-base">Event Date *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="eventType" className="text-sm sm:text-base">Event Type *</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base" id="eventType">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-sm sm:text-base">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="amountFinalized" className="text-sm sm:text-base">Amount Finalized (Rs.) *</Label>
                  <Input
                    id="amountFinalized"
                    type="number"
                    value={amountFinalized}
                    onChange={(e) =>
                      setAmountFinalized(
                        e.target.value ? parseFloat(e.target.value) : ""
                      )
                    }
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="advancePaid" className="text-sm sm:text-base">Advance Paid (Rs.)</Label>
                  <Input
                    id="advancePaid"
                    type="number"
                    value={advancePaid}
                    onChange={(e) =>
                      setAdvancePaid(
                        e.target.value ? parseFloat(e.target.value) : ""
                      )
                    }
                    placeholder="0"
                    min="0"
                    max={Number(amountFinalized) || undefined}
                    step="0.01"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                  <Label htmlFor="balanceAmount" className="text-sm sm:text-base">Balance Amount (Rs.)</Label>
                  <Input
                    id="balanceAmount"
                    type="text"
                    value={formatCurrency(balanceAmount)}
                    readOnly
                    className="h-10 sm:h-11 bg-slate-100 font-semibold text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Preview Section */}
              <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Invoice Preview</h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div
                    id="invoice-content"
                    className="bg-white p-4 sm:p-6 md:p-8 border-2 border-slate-200 rounded-lg min-w-[600px] sm:min-w-0"
                  >
                    {/* Header with Logo */}
                    <div className="text-center mb-4 sm:mb-6">
                      <div data-invoice-logo className="flex justify-center mb-3 sm:mb-4">
                        <Image
                          src="/new-logo.png"
                          alt="SS Taraang Events Logo"
                          width={200}
                          height={200}
                          className="object-contain w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                        />
                      </div>
                    </div>

                    {/* Founder Details */}
                    <div className="flex justify-between items-center w-full mt-4 px-4 border-b pb-4 mb-4">
                      <div className="text-left">
                        <span className="font-bold text-gray-900 block">K. Ramakrishna</span>
                        <span className="text-gray-600 text-sm">+91 9494555291</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">P. Sai</span>
                        <span className="text-gray-600 text-sm">+91 9666554474</span>
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                        INVOICE
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="break-words">
                          <span className="font-semibold text-slate-600 block sm:inline">
                            Invoice Date:
                          </span>
                          <span className="ml-0 sm:ml-2 text-slate-800 block sm:inline">
                            {invoiceDate
                              ? new Date(invoiceDate).toLocaleDateString("en-IN")
                              : "N/A"}
                          </span>
                        </div>
                        <div className="break-words">
                          <span className="font-semibold text-slate-600 block sm:inline">
                            Customer Name:
                          </span>
                          <span className="ml-0 sm:ml-2 text-slate-800 block sm:inline">
                            {customerName || "N/A"}
                          </span>
                        </div>
                        <div className="break-words">
                          <span className="font-semibold text-slate-600 block sm:inline">
                            Event Date:
                          </span>
                          <span className="ml-0 sm:ml-2 text-slate-800 block sm:inline">
                            {eventDate
                              ? new Date(eventDate).toLocaleDateString("en-IN")
                              : "N/A"}
                          </span>
                        </div>
                        <div className="break-words">
                          <span className="font-semibold text-slate-600 block sm:inline">
                            Event Type:
                          </span>
                          <span className="ml-0 sm:ml-2 text-slate-800 block sm:inline">
                            {eventType || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Table */}
                    <div className="mb-6 sm:mb-8 overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-300 p-2 sm:p-3 text-left font-semibold">
                              Description
                            </th>
                            <th className="border border-slate-300 p-2 sm:p-3 text-right font-semibold">
                              Amount (Rs.)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-slate-300 p-2 sm:p-3">
                              Total Amount
                            </td>
                            <td className="border border-slate-300 p-2 sm:p-3 text-right">
                              {formatCurrency(Number(amountFinalized) || 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-300 p-2 sm:p-3">
                              Advance Paid
                            </td>
                            <td className="border border-slate-300 p-2 sm:p-3 text-right">
                              {formatCurrency(Number(advancePaid) || 0)}
                            </td>
                          </tr>
                          <tr className="bg-amber-50">
                            <td className="border border-slate-300 p-2 sm:p-3 font-bold">
                              Balance Due
                            </td>
                            <td className="border border-slate-300 p-2 sm:p-3 text-right font-bold">
                              {formatCurrency(balanceAmount)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-300">
                      <div className="text-center">
                        <div className="border-t-2 border-slate-400 mt-8 sm:mt-12 md:mt-16 pt-2">
                          <p className="text-xs sm:text-sm font-semibold text-slate-700">
                            Customer Signature
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="border-t-2 border-slate-400 mt-8 sm:mt-12 md:mt-16 pt-2">
                          <p className="text-xs sm:text-sm font-semibold text-slate-700">
                            Authorized Signatory
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                            SS Taraang Events
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-center mt-4 sm:mt-6">
                <Button
                  onClick={handleDownloadInvoice}
                  className="h-11 sm:h-12 px-6 sm:px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg text-sm sm:text-base w-full sm:w-auto"
                  size="lg"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Download Invoice PDF</span>
                  <span className="sm:hidden">Download PDF</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

