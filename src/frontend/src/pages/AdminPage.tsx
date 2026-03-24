import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useClearAllBookings,
  useGetAllBookings,
  useIsCallerAdmin,
} from "@/hooks/useQueries";
import { useEffect } from "react";
import { toast } from "sonner";
import type { PreBooking } from "../backend.d";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function exportCSV(bookings: PreBooking[]) {
  const headers = ["Name", "Phone", "Email", "Order Interest", "Date/Time"];
  const rows = bookings.map((b) => [
    b.name,
    b.phone,
    b.email,
    b.orderInterest,
    formatTimestamp(b.timestamp),
  ]);
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cheesoria-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const {
    data: bookings,
    isLoading: bookingsLoading,
    refetch,
  } = useGetAllBookings();
  const clearMutation = useClearAllBookings();

  useEffect(() => {
    if (isLoggedIn) refetch();
  }, [isLoggedIn, refetch]);

  const handleClear = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all bookings? This cannot be undone.",
      )
    )
      return;
    try {
      await clearMutation.mutateAsync();
      toast.success("All bookings cleared.");
    } catch {
      toast.error("Failed to clear bookings.");
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground" data-ocid="admin.loading_state">
          Loading...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="text-center space-y-5 p-8 bg-card rounded-2xl shadow-card max-w-sm w-full"
          data-ocid="admin.modal"
        >
          <div className="font-serif text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <span>🫙</span> Cheesoria
          </div>
          <p className="text-muted-foreground text-sm">
            Admin access only. Please log in to continue.
          </p>
          <Button
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-primary text-primary-foreground hover:opacity-90 uppercase tracking-widest text-sm font-semibold rounded-full"
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground" data-ocid="admin.loading_state">
          Checking permissions...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="text-center space-y-4 p-8 bg-card rounded-2xl shadow-card max-w-sm w-full"
          data-ocid="admin.error_state"
        >
          <p className="text-destructive font-semibold">Access Denied</p>
          <p className="text-muted-foreground text-sm">
            You don't have admin privileges.
          </p>
          <Button
            variant="outline"
            onClick={() => clear()}
            data-ocid="admin.cancel_button"
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
          <a href="/" className="flex items-center gap-2" data-ocid="nav.link">
            <span>🫙</span> Cheesoria
          </a>
          <span className="text-muted-foreground font-sans font-normal text-sm ml-2">
            / Admin
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => clear()}
          className="text-xs uppercase tracking-wider"
          data-ocid="admin.cancel_button"
        >
          Log Out
        </Button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Pre-Booking Submissions
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {bookings?.length ?? 0} total submission
              {(bookings?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => bookings && exportCSV(bookings)}
              disabled={!bookings || bookings.length === 0}
              className="uppercase tracking-wider text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              data-ocid="admin.primary_button"
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={
                clearMutation.isPending || !bookings || bookings.length === 0
              }
              className="uppercase tracking-wider text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              data-ocid="admin.delete_button"
            >
              {clearMutation.isPending ? "Clearing..." : "Clear All"}
            </Button>
          </div>
        </div>

        {bookingsLoading ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="admin.loading_state"
          >
            Loading bookings...
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div
            className="text-center py-20 bg-card rounded-2xl border border-border"
            data-ocid="admin.empty_state"
          >
            <p className="text-muted-foreground">No bookings yet.</p>
          </div>
        ) : (
          <div
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
            data-ocid="admin.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Order Interest
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Date/Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b, i) => (
                  <TableRow
                    key={`${b.email}-${b.timestamp}`}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <TableCell className="text-muted-foreground text-sm">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {b.name}
                    </TableCell>
                    <TableCell className="text-sm">{b.phone}</TableCell>
                    <TableCell className="text-sm">{b.email}</TableCell>
                    <TableCell className="text-sm max-w-xs">
                      {b.orderInterest}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(b.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
