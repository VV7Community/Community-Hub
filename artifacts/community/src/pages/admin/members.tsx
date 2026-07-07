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
import { useI18n } from "@/lib/i18n";

function statusBadge(status: string, t: (key: string) => string) {
  if (status === "verified") return <Badge className="bg-primary/20 text-primary hover:bg-primary/20">{t("admin.verified")}</Badge>;
  if (status === "rejected") return <Badge variant="destructive">{t("admin.rejected")}</Badge>;
  return <Badge variant="outline">{t("admin.pending")}</Badge>;
}

function PendingMembersTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const { data: members, isLoading } = useListMembers(
    { status: "pending" },
    { query: { queryKey: getListMembersQueryKey({ status: "pending" }) } },
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });

  const verify = useVerifyMember({
    mutation: {
      onSuccess: () => {
        invalidate();
        toast({ title: t("admin.memberVerified"), description: t("admin.memberVerifiedDescription") });
      },
      onError: () => toast({ title: t("common.error"), description: t("admin.verifyError"), variant: "destructive" }),
    },
  });

  const reject = useRejectMember({
    mutation: {
      onSuccess: () => {
        invalidate();
        toast({ title: t("admin.memberRejected") });
      },
      onError: () => toast({ title: t("common.error"), description: t("admin.rejectError"), variant: "destructive" }),
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-8 text-center">{t("admin.loading")}</p>;

  if (!members || members.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t("admin.noPending")}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("admin.username")}</TableHead>
          <TableHead>{t("admin.email")}</TableHead>
          <TableHead>{t("admin.joined")}</TableHead>
          <TableHead className="text-right">{t("admin.actions")}</TableHead>
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
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> {t("admin.verify")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => reject.mutate({ userId: m.userId, data: { reason: t("admin.rejectedReason") } })}
                disabled={verify.isPending || reject.isPending}
              >
                <XCircle className="w-4 h-4 mr-1.5" /> {t("admin.reject")}
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
  const { t } = useI18n();

  if (isLoading) return <p className="text-sm text-muted-foreground py-8 text-center">{t("admin.loading")}</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("admin.username")}</TableHead>
          <TableHead>{t("admin.email")}</TableHead>
          <TableHead>{t("admin.role")}</TableHead>
          <TableHead>{t("admin.status")}</TableHead>
          <TableHead>{t("admin.verified")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members?.map((m) => (
          <TableRow key={m.userId}>
            <TableCell className="font-medium">{m.username}</TableCell>
            <TableCell className="text-muted-foreground">{m.email ?? "—"}</TableCell>
            <TableCell className="capitalize text-muted-foreground">{m.role}</TableCell>
            <TableCell>{statusBadge(m.membershipStatus, t)}</TableCell>
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
  const { t } = useI18n();
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
        toast({ title: t("admin.addedToAllowlist"), description: t("admin.addedToAllowlistDescription") });
      },
      onError: () => toast({ title: t("common.error"), description: t("admin.allowlistError"), variant: "destructive" }),
    },
  });

  const remove = useRemoveAllowlistEntry({
    mutation: {
      onSuccess: () => invalidate(),
      onError: () => toast({ title: t("common.error"), description: t("admin.removeError"), variant: "destructive" }),
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
          placeholder={t("admin.allowlistPlaceholder")}
          type="email"
          required
          className="sm:max-w-xs"
        />
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("admin.allowlistNotesPlaceholder")}
          className="flex-1"
        />
        <Button type="submit" disabled={add.isPending}>
          <Plus className="w-4 h-4 mr-1.5" /> {t("admin.add")}
        </Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">{t("admin.loading")}</p>
      ) : !entries || entries.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">{t("admin.allowlistEmpty")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.email")}</TableHead>
              <TableHead>{t("admin.notes")}</TableHead>
              <TableHead>{t("admin.added")}</TableHead>
              <TableHead className="text-right">{t("admin.actions")}</TableHead>
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
  const { t } = useI18n();
  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("admin.title")}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t("admin.subtitle")}
          </p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">{t("admin.pendingReview")}</TabsTrigger>
            <TabsTrigger value="all">{t("admin.allMembers")}</TabsTrigger>
            <TabsTrigger value="allowlist">{t("admin.allowlist")}</TabsTrigger>
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
