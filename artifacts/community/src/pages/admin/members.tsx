import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListMembers,
  getListMembersQueryKey,
  useVerifyMember,
  useRejectMember,
  useListAllowlist,
  getListAllowlistQueryKey,
  useAddAllowlistEntry,
  useRemoveAllowlistEntry,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, Trash2, Plus, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

function statusBadge(status: string) {
  if (status === "verified") return <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Verified</Badge>;
  if (status === "rejected") return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="outline">Pending</Badge>;
}

function PendingMembersTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: members, isLoading } = useListMembers(
    { status: "pending" },
    { query: { queryKey: getListMembersQueryKey({ status: "pending" }) } },
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });

  const verify = useVerifyMember({
    mutation: {
      onSuccess: () => {
        invalidate();
        toast({ title: "Member verified", description: "They now have full access to the community." });
      },
      onError: () => toast({ title: "Error", description: "Could not verify member.", variant: "destructive" }),
    },
  });

  const reject = useRejectMember({
    mutation: {
      onSuccess: () => {
        invalidate();
        toast({ title: "Member rejected" });
      },
      onError: () => toast({ title: "Error", description: "Could not reject member.", variant: "destructive" }),
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>;

  if (!members || members.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No members waiting for verification.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.userId}>
            <TableCell className="font-medium">{m.username}</TableCell>
            <TableCell className="text-muted-foreground">{m.email ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{format(new Date(m.createdAt), "MMM d, yyyy")}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                size="sm"
                onClick={() => verify.mutate({ userId: m.userId })}
                disabled={verify.isPending || reject.isPending}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Verify
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => reject.mutate({ userId: m.userId, data: { reason: "Manually rejected by admin" } })}
                disabled={verify.isPending || reject.isPending}
              >
                <XCircle className="w-4 h-4 mr-1.5" /> Reject
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AllMembersTable() {
  const { data: members, isLoading } = useListMembers(undefined, {
    query: { queryKey: getListMembersQueryKey() },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Verified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members?.map((m) => (
          <TableRow key={m.userId}>
            <TableCell className="font-medium">{m.username}</TableCell>
            <TableCell className="text-muted-foreground">{m.email ?? "—"}</TableCell>
            <TableCell className="capitalize text-muted-foreground">{m.role}</TableCell>
            <TableCell>{statusBadge(m.membershipStatus)}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {m.membershipVerifiedAt ? format(new Date(m.membershipVerifiedAt), "MMM d, yyyy") : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AllowlistPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: entries, isLoading } = useListAllowlist({ query: { queryKey: getListAllowlistQueryKey() } });
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListAllowlistQueryKey() });

  const add = useAddAllowlistEntry({
    mutation: {
      onSuccess: () => {
        invalidate();
        setEmail("");
        setNotes("");
        toast({ title: "Added to allowlist", description: "New sign-ins with this email auto-verify." });
      },
      onError: () => toast({ title: "Error", description: "Could not add email — it may already be listed.", variant: "destructive" }),
    },
  });

  const remove = useRemoveAllowlistEntry({
    mutation: {
      onSuccess: () => invalidate(),
      onError: () => toast({ title: "Error", description: "Could not remove entry.", variant: "destructive" }),
    },
  });

  return (
    <div className="space-y-6">
      <form
        className="flex flex-col sm:flex-row gap-3 bg-card border border-border rounded-xl p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim()) return;
          add.mutate({ data: { email: email.trim(), notes: notes.trim() || undefined } });
        }}
      >
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="member@example.com"
          type="email"
          required
          className="sm:max-w-xs"
        />
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="flex-1"
        />
        <Button type="submit" disabled={add.isPending}>
          <Plus className="w-4 h-4 mr-1.5" /> Add
        </Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>
      ) : !entries || entries.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Allowlist is empty.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.email}</TableCell>
                <TableCell className="text-muted-foreground">{e.notes ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{format(new Date(e.addedAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => remove.mutate({ id: e.id })} disabled={remove.isPending}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default function AdminMembersPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Member Verification</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Review pending VectorVest members and manage the auto-verification allowlist.
          </p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="all">All Members</TabsTrigger>
            <TabsTrigger value="allowlist">Allowlist</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="bg-card border border-border rounded-xl p-4 sm:p-6 mt-4">
            <PendingMembersTable />
          </TabsContent>
          <TabsContent value="all" className="bg-card border border-border rounded-xl p-4 sm:p-6 mt-4">
            <AllMembersTable />
          </TabsContent>
          <TabsContent value="allowlist" className="mt-4">
            <AllowlistPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
