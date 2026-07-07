import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useGetMe, getGetMeQueryKey, useUpdateMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export type Language = "nl" | "fr";

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const UI_STRINGS: Record<string, Record<Language, string>> = {
  "account.title": { nl: "Accountinstellingen", fr: "Paramètres du compte" },
  "account.subtitle": { nl: "Beheer je communityprofiel en voorkeuren.", fr: "Gérez votre profil communautaire et vos préférences." },
  "account.displayName": { nl: "Weergavenaam", fr: "Nom d'affichage" },
  "account.language": { nl: "Taal", fr: "Langue" },
  "account.save": { nl: "Wijzigingen opslaan", fr: "Enregistrer les modifications" },
  "account.signOut": { nl: "Uitloggen", fr: "Se déconnecter" },
  "chat.inputPlaceholder": { nl: "Bericht versturen", fr: "Envoyer un message" },
  "chat.pinned": { nl: "Vastgezet", fr: "Épinglé" },
  "chat.onlyTeamPosts": { nl: "Alleen het VectorVest-team kan hier posten.", fr: "Seule l'équipe VectorVest peut poster ici." },
  "chat.reactOnly": { nl: "Reageer met emoji om mee te doen.", fr: "Réagissez avec un emoji pour participer." },
  "support.title": { nl: "Supportteam", fr: "Équipe d'assistance" },
  "support.email": { nl: "Je e-mailadres", fr: "Votre adresse e-mail" },
  "support.question": { nl: "Je vraag", fr: "Votre question" },
  "support.send": { nl: "Ticket openen in e-mail", fr: "Ouvrir le ticket dans l'e-mail" },
  "support.sent": { nl: "Concept geopend in je e-mailclient", fr: "Brouillon ouvert dans votre client e-mail" },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const updateMe = useUpdateMe();
  const queryClient = useQueryClient();
  const [language, setLanguageState] = useState<Language>("nl");

  useEffect(() => {
    if (me?.language) {
      setLanguageState(me.language as Language);
    }
  }, [me?.language]);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      if (me?.userId) {
        updateMe.mutate(
          { data: { language: lang } },
          {
            onSuccess: (newData) => {
              queryClient.setQueryData(getGetMeQueryKey(), newData);
            },
          },
        );
      }
    },
    [me?.userId, updateMe, queryClient],
  );

  const t = useCallback(
    (key: string) => {
      return UI_STRINGS[key]?.[language] ?? key;
    },
    [language],
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useTranslate() {
  const { language } = useI18n();
  const translate = useCallback(
    async (text: string): Promise<string> => {
      if (!text.trim()) return "";
      const source = language === "nl" ? "fr" : "nl";
      const res = await fetch(`${import.meta.env.BASE_URL}api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: language, sourceLanguage: source }),
      });
      if (!res.ok) {
        throw new Error("Translation failed");
      }
      const data = await res.json();
      return data.translatedText ?? text;
    },
    [language],
  );
  return translate;
}
