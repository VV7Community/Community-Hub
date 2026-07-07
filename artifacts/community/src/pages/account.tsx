import { useGetMe, getGetMeQueryKey, useUpdateMe } from "@workspace/api-client-react";
import { useClerk } from "@/lib/clerk";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User, Save, Loader2, Languages } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "@/lib/i18n";

export default function AccountPage() {
  const { data: me, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const updateMe = useUpdateMe();
  const { signOut } = useClerk();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, language, setLanguage } = useI18n();

  const [username, setUsername] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const initRef = useRef<string | null>(null);

  useEffect(() => {
    if (me && initRef.current !== me.userId) {
      setUsername(me.username);
      setSelectedLanguage((me.language as "nl" | "fr") ?? "nl");
      initRef.current = me.userId;
    }
  }, [me]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: { username?: string; language?: "nl" | "fr" } = {};
    if (username.trim() && username !== me?.username) data.username = username;
    if (selectedLanguage !== me?.language) data.language = selectedLanguage;
    if (Object.keys(data).length === 0) return;
    updateMe.mutate(
      { data },
      {
        onSuccess: (newData) => {
          queryClient.setQueryData(getGetMeQueryKey(), newData);
          toast({ title: "Profile updated", description: "Your preferences have been saved." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!me) return null;

  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("account.title")}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{t("account.subtitle")}</p>
        </div>

        {/* Profile card */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-8 space-y-6 sm:space-y-8">

          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-border text-center sm:text-left">
            <Avatar className="w-16 h-16 sm:w-24 sm:h-24 border-2 border-border shadow-md shrink-0">
              {me.avatarUrl && <AvatarImage src={me.avatarUrl} />}
              <AvatarFallback className="text-xl sm:text-2xl">{me.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{me.username}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary uppercase tracking-wider">
                  {me.role}
                </span>
                <span className="text-xs sm:text-sm font-mono text-muted-foreground">
                  ID: {me.userId.split("_")[1] || me.userId}
                </span>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                {t("account.displayName")}
              </label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter a display name"
                className="bg-background h-11"
              />
              <p className="text-xs text-muted-foreground">This is how you appear to others in the community rooms.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Languages className="w-4 h-4 text-muted-foreground" />
                {t("account.language")}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLanguage("nl")}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${selectedLanguage === "nl" ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"}`}
                >
                  Nederlands
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage("fr")}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${selectedLanguage === "fr" ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-accent"}`}
                >
                  Français
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={(username === me.username || !username.trim()) && selectedLanguage === me.language || updateMe.isPending}
              className="w-full sm:w-auto"
            >
              {updateMe.isPending
                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                : <Save className="w-4 h-4 mr-2" />}
              {t("account.save")}
            </Button>
          </form>
        </div>

        {/* Sign out card */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-foreground">{t("account.signOut")}</h3>
            <p className="text-sm text-muted-foreground">Log out of your VectorVest account on this device.</p>
          </div>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => signOut({ redirectUrl: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("account.signOut")}
          </Button>
        </div>

      </div>
    </div>
  );
}
