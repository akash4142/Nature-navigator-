"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, Eye, X } from "lucide-react";

interface Booking {
  id: string;
  pickup: string;
  drop: string;
  date: Date;
  car: string;
  status: string;
  payment50: boolean;
  payment100: boolean;
  totalPrice: number | null;
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export default function AdminDashboardClient({ bookings }: { bookings: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const handleCompleteRide = async (bookingId: string) => {
    if (!confirm("Are you sure you want to mark this ride as completed?")) return;

    setLoadingId(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/complete`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        alert("Success! Final payment link generated.");
        window.location.reload();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to complete ride");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-950">
            <TableRow className="border-zinc-800 hover:bg-zinc-950">
              <TableHead className="text-zinc-400">Booking ID</TableHead>
              <TableHead className="text-zinc-400">Customer</TableHead>
              <TableHead className="text-zinc-400">Vehicle</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-mono text-xs text-zinc-500">
                  {booking.id.slice(-8)}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-zinc-200">
                    {booking.user.name || "Guest"}
                  </div>
                  <div className="text-xs text-zinc-500">{booking.user.email}</div>
                  {booking.user.phone && (
                    <div className="text-xs text-zinc-500 mt-0.5">
                      📞 {booking.user.phone}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-zinc-300">{booking.car}</TableCell>
                <TableCell className="text-zinc-300">
                  {format(new Date(booking.date), "MMM d, p")}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      booking.status === "Completed"
                        ? "bg-green-900/20 text-green-400 border-green-900/50"
                        : booking.status === "Approved"
                        ? "bg-blue-900/20 text-blue-400 border-blue-900/50"
                        : booking.status === "AwaitingFinalPayment"
                        ? "bg-yellow-900/20 text-yellow-400 border-yellow-900/50"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    {booking.status === "Approved" && (
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-black"
                        onClick={() => handleCompleteRide(booking.id)}
                        disabled={loadingId === booking.id}
                      >
                        {loadingId === booking.id ? "Processing..." : "Complete Ride"}
                      </Button>
                    )}
                    {booking.status === "AwaitingFinalPayment" && (
                      <span className="text-xs text-yellow-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Awaiting Payment
                      </span>
                    )}
                    {booking.status === "Completed" && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Done
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-luxury text-yellow-500">Booking Details</h2>
                <p className="text-sm text-zinc-500 font-mono mt-1">#{selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-yellow-500 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase mb-1">Name</p>
                    <p className="text-zinc-200">{selectedBooking.user.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase mb-1">Email</p>
                    <p className="text-zinc-200">{selectedBooking.user.email || "N/A"}</p>
                  </div>
                  {selectedBooking.user.phone && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase mb-1">Phone</p>
                      <p className="text-zinc-200">{selectedBooking.user.phone}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Trip Details */}
              <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-yellow-500 mb-4">Trip Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase mb-1">Pickup Location</p>
                    <p className="text-zinc-200">{selectedBooking.pickupAddress || selectedBooking.pickup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase mb-1">Drop-off Location</p>
                    <p className="text-zinc-200">{selectedBooking.dropAddress || selectedBooking.drop}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase mb-1">Date & Time</p>
                      <p className="text-zinc-200">{format(new Date(selectedBooking.date), "PPpp")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase mb-1">Vehicle</p>
                      <p className="text-zinc-200">{selectedBooking.car}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase mb-1">Status</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
                          selectedBooking.status === "Completed"
                            ? "bg-green-900/20 text-green-400 border-green-900/50"
                            : selectedBooking.status === "Approved"
                            ? "bg-blue-900/20 text-blue-400 border-blue-900/50"
                            : selectedBooking.status === "AwaitingFinalPayment"
                            ? "bg-yellow-900/20 text-yellow-400 border-yellow-900/50"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                  {selectedBooking.passengerCount && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase mb-1">Passengers</p>
                        <p className="text-zinc-200">{selectedBooking.passengerCount}</p>
                      </div>
                      {selectedBooking.luggageCount !== null && (
                        <div>
                          <p className="text-xs text-zinc-500 uppercase mb-1">Luggage Items</p>
                          <p className="text-zinc-200">{selectedBooking.luggageCount}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase mb-1">Special Notes</p>
                      <p className="text-zinc-200">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Payment Information */}
              <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-yellow-500 mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBooking.totalPrice && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase mb-1">Total Price</p>
                      <p className="text-zinc-200 text-xl font-semibold">
                        ${selectedBooking.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {selectedBooking.depositAmount && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase mb-1">Deposit Amount</p>
                      <p className="text-zinc-200">${selectedBooking.depositAmount.toFixed(2)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-zinc-500 uppercase mb-1">Deposit Payment (30%)</p>
                    <p className={selectedBooking.payment50 ? "text-green-400" : "text-red-400"}>
                      {selectedBooking.payment50 ? "✓ Paid" : "✗ Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase mb-1">Final Payment (70%)</p>
                    <p className={selectedBooking.payment100 ? "text-green-400" : "text-red-400"}>
                      {selectedBooking.payment100 ? "✓ Paid" : "✗ Pending"}
                    </p>
                  </div>
                  {selectedBooking.stripePaymentIntentId && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-zinc-500 uppercase mb-1">Payment ID</p>
                      <p className="text-zinc-400 font-mono text-xs">{selectedBooking.stripePaymentIntentId}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Timestamps */}
              <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-yellow-500 mb-4">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase mb-1">Created At</p>
                    <p className="text-zinc-200">{format(new Date(selectedBooking.createdAt), "PPpp")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase mb-1">Last Updated</p>
                    <p className="text-zinc-200">{format(new Date(selectedBooking.updatedAt), "PPpp")}</p>
                  </div>
                  {selectedBooking.completedAt && (
                    <div>
                      <p className="text-xs text-zinc-500 uppercase mb-1">Completed At</p>
                      <p className="text-zinc-200">{format(new Date(selectedBooking.completedAt), "PPpp")}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-4">
              <Button
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
