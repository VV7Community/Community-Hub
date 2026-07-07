import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useGetMe, getGetMeQueryKey, useUpdateMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export type Language = "nl" | "fr";

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const UI_STRINGS: Record<string, Record<Language, string>> = {
  // Account
  "account.title": { nl: "Accountinstellingen", fr: "Paramètres du compte" },
  "account.subtitle": { nl: "Beheer je communityprofiel en voorkeuren.", fr: "Gérez votre profil communautaire et vos préférences." },
  "account.displayName": { nl: "Weergavenaam", fr: "Nom d'affichage" },
  "account.language": { nl: "Taal", fr: "Langue" },
  "account.save": { nl: "Wijzigingen opslaan", fr: "Enregistrer les modifications" },
  "account.signOut": { nl: "Uitloggen", fr: "Se déconnecter" },
  "account.displayNamePlaceholder": { nl: "Voer een weergavenaam in", fr: "Entrez un nom d'affichage" },
  "account.displayNameHint": { nl: "Zo verschijn je in de communityruimtes.", fr: "C'est ainsi que vous apparaissez dans les salons communautaires." },
  "account.profileUpdated": { nl: "Profiel bijgewerkt", fr: "Profil mis à jour" },
  "account.preferencesSaved": { nl: "Je voorkeuren zijn opgeslagen.", fr: "Vos préférences ont été enregistrées." },
  "account.updateError": { nl: "Fout", fr: "Erreur" },
  "account.updateFailed": { nl: "Profiel bijwerken mislukt.", fr: "Échec de la mise à jour du profil." },
  "account.signOutDescription": { nl: "Log uit van je VectorVest-account op dit apparaat.", fr: "Déconnectez-vous de votre compte VectorVest sur cet appareil." },
  "language.nl": { nl: "Nederlands", fr: "Néerlandais" },
  "language.fr": { nl: "Français", fr: "Français" },

  // Navigation
  "nav.mainRoom": { nl: "Hoofdkanaal", fr: "Salon principal" },
  "nav.webinar": { nl: "Webinar", fr: "Webinaire" },
  "nav.university": { nl: "Universiteit", fr: "Université" },
  "nav.events": { nl: "Evenementen", fr: "Événements" },
  "nav.support": { nl: "Support", fr: "Assistance" },
  "nav.account": { nl: "Account", fr: "Compte" },
  "nav.room": { nl: "Kanaal", fr: "Salon" },
  "nav.memberVerification": { nl: "Ledenverificatie", fr: "Vérification des membres" },
  "nav.brandRegion": { nl: "België & Nederland", fr: "Belgique & Pays-Bas" },
  "nav.menu": { nl: "Menu", fr: "Menu" },
  "nav.closeMenu": { nl: "Menu sluiten", fr: "Fermer le menu" },
  "nav.openMenu": { nl: "Menu openen", fr: "Ouvrir le menu" },
  "nav.home": { nl: "Home", fr: "Accueil" },
  "nav.back": { nl: "Terug", fr: "Retour" },

  // Chat sidebar
  "sidebar.info": { nl: "Info", fr: "Info" },
  "sidebar.community": { nl: "Community", fr: "Communauté" },
  "sidebar.resources": { nl: "Bronnen", fr: "Ressources" },
  "sidebar.slides": { nl: "Dia's", fr: "Diapositives" },
  "sidebar.files": { nl: "Bestanden", fr: "Fichiers" },
  "sidebar.directMessages": { nl: "Directe berichten", fr: "Messages directs" },
  "sidebar.supportTeam": { nl: "Supportteam", fr: "Équipe d'assistance" },
  "sidebar.staff": { nl: "staff", fr: "équipe" },
  "sidebar.unreadMessages": { nl: "Ongelezen berichten", fr: "Messages non lus" },
  "sidebar.sidebar": { nl: "Zijbalk", fr: "Barre latérale" },
  "sidebar.sidebarDescription": { nl: "Toont de mobiele zijbalk.", fr: "Affiche la barre latérale mobile." },
  "sidebar.toggleSidebar": { nl: "Zijbalk wisselen", fr: "Basculer la barre latérale" },

  // Chat room
  "chat.inputPlaceholder": { nl: "Bericht versturen", fr: "Envoyer un message" },
  "chat.pinned": { nl: "Vastgezet", fr: "Épinglé" },
  "chat.pinnedBy": { nl: "Vastgezet · {username}", fr: "Épinglé · {username}" },
  "chat.onlyTeamPosts": { nl: "Alleen het VectorVest-team kan hier posten.", fr: "Seule l'équipe VectorVest peut poster ici." },
  "chat.reactOnly": { nl: "Reageer met emoji om mee te doen.", fr: "Réagissez avec un emoji pour participer." },
  "chat.dailyUpdateReactOnly": { nl: "Alleen het VectorVest-team plaatst hier het dagelijkse update — reageer met emoji om mee te doen.", fr: "Seule l'équipe VectorVest publie ici la mise à jour quotidienne — réagissez avec un emoji pour participer." },
  "chat.startOfChannel": { nl: "Dit is het begin van het kanaal.", fr: "C'est le début de ce canal." },
  "chat.welcomeTo": { nl: "Welkom bij #{name}", fr: "Bienvenue dans #{name}" },
  "chat.teamBadge": { nl: "VectorVest Team", fr: "Équipe VectorVest" },
  "chat.online": { nl: "Online", fr: "En ligne" },
  "chat.pin": { nl: "Vastmaken", fr: "Épingler" },
  "chat.unpin": { nl: "Losmaken", fr: "Désépingler" },
  "chat.translateToNL": { nl: "Vertalen naar Nederlands", fr: "Traduire en néerlandais" },
  "chat.translateToFR": { nl: "Vertalen naar Frans", fr: "Traduire en français" },
  "chat.translationFailed": { nl: "Vertaling mislukt.", fr: "La traduction a échoué." },
  "chat.officialChannel": { nl: "Dit is een officieel kanaal — alleen het VectorVest-team kan hier posten.", fr: "Ceci est un canal officiel — seule l'équipe VectorVest peut publier ici." },
  "chat.messagePlaceholder": { nl: "Bericht #{name}", fr: "Message #{name}" },
  "chat.emojiReaction": { nl: "Reageren met emoji", fr: "Réagir avec un emoji" },
  "chat.loadingHistory": { nl: "Geschiedenis laden...", fr: "Chargement de l'historique..." },

  // Support ticket
  "supportTicket.title": { nl: "Supportteam", fr: "Équipe d'assistance" },
  "supportTicket.replyByEmail": { nl: "We reageren per e-mail binnen één werkdag.", fr: "Nous répondons par e-mail sous un jour ouvrable." },
  "supportTicket.draftOpened": { nl: "Concept geopend in je e-mailclient", fr: "Brouillon ouvert dans votre client e-mail" },
  "supportTicket.emailFallback": { nl: "Als je e-mailapp niet opent, kopieer dan onderstaande gegevens en stuur ze rechtstreeks naar", fr: "Si votre application e-mail ne s'ouvre pas, copiez les détails ci-dessous et envoyez-les directement à" },
  "supportTicket.from": { nl: "Van:", fr: "De :" },
  "supportTicket.question": { nl: "Vraag:", fr: "Question :" },
  "supportTicket.sendAnother": { nl: "Stuur een andere vraag", fr: "Envoyer une autre question" },
  "supportTicket.yourEmail": { nl: "Je e-mailadres", fr: "Votre adresse e-mail" },
  "supportTicket.yourQuestion": { nl: "Je vraag", fr: "Votre question" },
  "supportTicket.emailPlaceholder": { nl: "jij@voorbeeld.com", fr: "vous@exemple.com" },
  "supportTicket.questionPlaceholder": { nl: "Beschrijf je probleem of vraag...", fr: "Décrivez votre problème ou votre question..." },
  "supportTicket.openTicket": { nl: "Ticket openen in e-mail", fr: "Ouvrir le ticket dans l'e-mail" },
  "supportTicket.subject": { nl: "VectorVest Community Support Ticket", fr: "Ticket d'assistance VectorVest Community" },
  "supportTicket.sentFrom": { nl: "Verzonden via VectorVest Community Support Ticket", fr: "Envoyé via le ticket d'assistance VectorVest Community" },

  // Support page
  "support.title": { nl: "Support", fr: "Assistance" },
  "support.subtitle": { nl: "Neem contact op met het VectorVest Europe-team — we staan voor je klaar.", fr: "Contactez l'équipe VectorVest Europe — nous sommes là pour vous aider." },
  "support.emailLabel": { nl: "E-mail", fr: "E-mail" },
  "support.emailValue": { nl: "belgium@vectorvest.com", fr: "belgium@vectorvest.com" },
  "support.emailDescription": { nl: "Stuur ons een bericht — we reageren binnen één werkdag", fr: "Envoyez-nous un message — nous répondons sous un jour ouvrable" },
  "support.freephoneLabel": { nl: "Gratis nummer", fr: "Numéro gratuit" },
  "support.freephoneValue": { nl: "0800 261 88", fr: "0800 261 88" },
  "support.freephoneDescription": { nl: "Gratis vanuit België — ma–vr, 9:00–17:00", fr: "Gratuit depuis la Belgique — lun–ven, 9h00–17h00" },
  "support.platformLabel": { nl: "Platform", fr: "Plateforme" },
  "support.platformValue": { nl: "anywhere.vectorvest.com", fr: "anywhere.vectorvest.com" },
  "support.platformDescription": { nl: "Toegang tot VectorVest vanuit elke browser", fr: "Accédez à VectorVest depuis n'importe quel navigateur" },
  "support.gdprTitle": { nl: "Privacy & GDPR-voorkeuren", fr: "Confidentialité & préférences RGPD" },
  "support.gdprDescription": { nl: "Beheer je gegevens en toestemminginstellingen in overeenstemming met de EU privacywetgeving.", fr: "Gérez vos données et paramètres de consentement conformément à la réglementation européenne sur la protection de la vie privée." },
  "support.gdprRequest": { nl: "GDPR-verzoek", fr: "Demande RGPD" },
  "support.footer": { nl: "VectorVest Europe · Geregistreerd in België", fr: "VectorVest Europe · Enregistré en Belgique" },
  "support.chatTitle": { nl: "Live Chat", fr: "Chat en direct" },
  "support.chatDescription": { nl: "Chat is beschikbaar tijdens live sessies.", fr: "Le chat est disponible pendant les sessions en direct." },
  "support.upNext": { nl: "Hierna", fr: "À venir" },
  "support.noWebinars": { nl: "Geen webinars gepland.", fr: "Aucun webinaire prévu." },

  // Events
  "events.title": { nl: "Aankomende evenementen", fr: "Événements à venir" },
  "events.subtitle": { nl: "Doe mee met lokale meetups, grote conferenties en speciale uitzendingen.", fr: "Participez à des meetups locaux, des grandes conférences et des diffusions spéciales." },
  "events.onDemand": { nl: "Op aanvraag", fr: "Sur demande" },
  "events.any": { nl: "Altijd", fr: "Tout le temps" },
  "events.noEvents": { nl: "Geen aankomende evenementen", fr: "Aucun événement à venir" },
  "events.checkBackLater": { nl: "Kom later terug voor nieuwe meetups en conferenties.", fr: "Revenez plus tard pour de nouveaux meetups et conférences." },
  "events.event": { nl: "Evenement", fr: "Événement" },
  "events.type": { nl: "Type", fr: "Type" },

  // Webinars
  "webinar.liveNow": { nl: "Live nu", fr: "En direct maintenant" },
  "webinar.starts": { nl: "Start {date}", fr: "Commence {date}" },
  "webinar.watchReplay": { nl: "Replay bekijken", fr: "Voir le replay" },
  "webinar.setReminder": { nl: "Herinnering instellen", fr: "Définir un rappel" },
  "webinar.pastSessions": { nl: "Eerdere sessies", fr: "Sessions précédentes" },
  "webinar.replay": { nl: "Replay", fr: "Replay" },
  "webinar.hostedBy": { nl: "Gepresenteerd door", fr: "Présenté par" },
  "webinar.noWebinars": { nl: "Geen webinars gepland.", fr: "Aucun webinaire prévu." },
  "webinar.liveChat": { nl: "Live Chat", fr: "Chat en direct" },
  "webinar.chatDuringLive": { nl: "Chat is beschikbaar tijdens live sessies.", fr: "Le chat est disponible pendant les sessions en direct." },
  "webinar.upNext": { nl: "Hierna", fr: "À venir" },

  // University
  "university.title": { nl: "VectorVest University", fr: "VectorVest University" },
  "university.subtitle": { nl: "Beheers de kunst van beleggen", fr: "Maîtrisez l'art de l'investissement" },
  "university.description": { nl: "Toegang tot onze uitgebreide bibliotheek met handelsstrategieën, marktanalysetechnieken en platformhandleidingen om je beleggingsvaardigheden te versterken.", fr: "Accédez à notre bibliothèque complète de stratégies de trading, de techniques d'analyse de marché et de tutoriels sur la plateforme pour élever votre niveau d'investissement." },
  "university.resumeLearning": { nl: "Leren hervatten", fr: "Reprendre l'apprentissage" },
  "university.courses": { nl: "Cursussen", fr: "Cours" },
  "university.content": { nl: "Content", fr: "Contenu" },
  "university.allLevels": { nl: "Alle niveaus", fr: "Tous niveaux" },
  "university.beginner": { nl: "Beginner", fr: "Débutant" },
  "university.intermediate": { nl: "Gevorderd", fr: "Intermédiaire" },
  "university.advanced": { nl: "Expert", fr: "Avancé" },
  "university.locked": { nl: "Vergrendeld", fr: "Verrouillé" },
  "university.open": { nl: "Open", fr: "Ouvrir" },
  "university.instructor": { nl: "Instructeur", fr: "Instructeur" },
  "university.duration": { nl: "Duur", fr: "Durée" },

  // Admin
  "admin.title": { nl: "Ledenverificatie", fr: "Vérification des membres" },
  "admin.subtitle": { nl: "Beoordeel lopende VectorVest-leden en beheer de automatische verificatie-allowlist.", fr: "Examinez les membres VectorVest en attente et gérez la liste d'autorisation de vérification automatique." },
  "admin.pendingReview": { nl: "Lopende beoordeling", fr: "Examen en attente" },
  "admin.allMembers": { nl: "Alle leden", fr: "Tous les membres" },
  "admin.allowlist": { nl: "Allowlist", fr: "Liste d'autorisation" },
  "admin.username": { nl: "Gebruikersnaam", fr: "Nom d'utilisateur" },
  "admin.email": { nl: "E-mail", fr: "E-mail" },
  "admin.joined": { nl: "Lid sinds", fr: "Rejoint le" },
  "admin.actions": { nl: "Acties", fr: "Actions" },
  "admin.role": { nl: "Rol", fr: "Rôle" },
  "admin.status": { nl: "Status", fr: "Statut" },
  "admin.verified": { nl: "Geverifieerd", fr: "Vérifié" },
  "admin.rejected": { nl: "Afgewezen", fr: "Rejeté" },
  "admin.pending": { nl: "In afwachting", fr: "En attente" },
  "admin.noPending": { nl: "Geen leden die wachten op verificatie.", fr: "Aucun membre en attente de vérification." },
  "admin.loading": { nl: "Laden...", fr: "Chargement..." },
  "admin.verify": { nl: "Goedkeuren", fr: "Vérifier" },
  "admin.reject": { nl: "Afwijzen", fr: "Rejeter" },
  "admin.memberVerified": { nl: "Lid goedgekeurd", fr: "Membre vérifié" },
  "admin.memberVerifiedDescription": { nl: "Ze hebben nu volledige toegang tot de community.", fr: "Ils ont maintenant un accès complet à la communauté." },
  "admin.memberRejected": { nl: "Lid afgewezen", fr: "Membre rejeté" },
  "admin.verifyError": { nl: "Kon lid niet goedkeuren.", fr: "Impossible de vérifier le membre." },
  "admin.rejectError": { nl: "Kon lid niet afwijzen.", fr: "Impossible de rejeter le membre." },
  "admin.allowlistPlaceholder": { nl: "lid@voorbeeld.com", fr: "membre@exemple.com" },
  "admin.allowlistNotesPlaceholder": { nl: "Notities (optioneel)", fr: "Notes (optionnel)" },
  "admin.add": { nl: "Toevoegen", fr: "Ajouter" },
  "admin.addedToAllowlist": { nl: "Toegevoegd aan allowlist", fr: "Ajouté à la liste d'autorisation" },
  "admin.addedToAllowlistDescription": { nl: "Nieuwe aanmeldingen met dit e-mailadres worden automatisch goedgekeurd.", fr: "Les nouvelles inscriptions avec cet e-mail seront automatiquement vérifiées." },
  "admin.allowlistError": { nl: "Kon e-mail niet toevoegen — mogelijk staat het al in de lijst.", fr: "Impossible d'ajouter l'e-mail — il est peut-être déjà listé." },
  "admin.removeError": { nl: "Kon item niet verwijderen.", fr: "Impossible de supprimer l'élément." },
  "admin.allowlistEmpty": { nl: "Allowlist is leeg.", fr: "La liste d'autorisation est vide." },
  "admin.notes": { nl: "Notities", fr: "Notes" },
  "admin.added": { nl: "Toegevoegd", fr: "Ajouté" },
  "admin.rejectedReason": { nl: "Handmatig afgewezen door beheerder", fr: "Rejeté manuellement par l'administrateur" },

  // Membership pending
  "membership.rejectedTitle": { nl: "We konden je VectorVest-lidmaatschap niet verifiëren", fr: "Nous n'avons pas pu vérifier votre adhésion VectorVest" },
  "membership.rejectedDescription": { nl: "Het e-mailadres op dit account komt niet overeen met een actief VectorVest Europe-abonnement. Als je denkt dat dit een fout is, neem dan contact op met support en we kijken opnieuw.", fr: "L'adresse e-mail de ce compte ne correspond pas à un abonnement VectorVest Europe actif. Si vous pensez qu'il s'agit d'une erreur, contactez l'assistance et nous examinerons à nouveau." },
  "membership.pendingTitle": { nl: "Je VectorVest-lidmaatschap verifiëren", fr: "Vérification de votre adhésion VectorVest" },
  "membership.pendingDescription": { nl: "Deze communityruimte is exclusief voor klanten van VectorVest Europe. We controleren of het e-mailadres op dit account overeenkomt met een actief abonnement — dit duurt meestal even, maar kan langer duren als een handmatige controle nodig is.", fr: "Cette salle communautaire est exclusive aux clients de VectorVest Europe. Nous vérifions que l'e-mail de ce compte correspond à un abonnement actif — cela prend généralement un moment, mais peut prendre plus longtemps si une vérification manuelle est nécessaire." },
  "membership.autoUpdate": { nl: "Deze pagina wordt automatisch bijgewerkt", fr: "Cette page se met à jour automatiquement" },
  "membership.notCustomer": { nl: "Nog geen klant van VectorVest Europe?", fr: "Pas encore client de VectorVest Europe ?" },
  "membership.learnMore": { nl: "Lees meer op vectorvest.eu", fr: "En savoir plus sur vectorvest.eu" },
  "membership.signOut": { nl: "Uitloggen", fr: "Se déconnecter" },

  // Not found
  "notFound.title": { nl: "404", fr: "404" },
  "notFound.description": { nl: "De pagina die je zoekt bestaat niet.", fr: "La page que vous recherchez n'existe pas." },
  "notFound.returnHome": { nl: "Terug naar home", fr: "Retour à l'accueil" },

  // Resources
  "resources.notFound": { nl: "Resource niet gevonden.", fr: "Ressource introuvable." },
  "resources.backToChat": { nl: "Terug naar chat", fr: "Retour au chat" },
  "resources.subtitle": { nl: "Resources van de VectorVest-community.", fr: "Ressources de la communauté VectorVest." },
  "resources.noResources": { nl: "Nog geen resources geüpload.", fr: "Aucune ressource téléchargée pour l'instant." },
  "resources.open": { nl: "Openen", fr: "Ouvrir" },
  "resources.slides": { nl: "Dia's", fr: "Diapositives" },
  "resources.files": { nl: "Bestanden", fr: "Fichiers" },
  "resources.slideIntro": { nl: "Basisprincipes van VectorVest in 20 slides.", fr: "Principes de base de VectorVest en 20 diapositives." },
  "resources.slideColorGuard": { nl: "Hoe de markttiming-indicators werken.", fr: "Comment fonctionnent les indicateurs de timing du marché." },
  "resources.slideUniSearch": { nl: "Slides van de laatste UniSearch-sessie.", fr: "Diapositives de la dernière session UniSearch." },
  "resources.fileCheatSheet": { nl: "Snelle referentiegids voor VectorVest-scores.", fr: "Guide de référence rapide pour les scores VectorVest." },
  "resources.fileWatchlist": { nl: "CSV-template om je eigen watchlist te importeren.", fr: "Modèle CSV pour importer votre propre watchlist." },
  "resources.fileChecklist": { nl: "PDF met een checklist voor elke strategie.", fr: "PDF avec une checklist pour chaque stratégie." },

  // Landing page
  "landing.tagline": { nl: "Live Community · België & Nederland", fr: "Live Community · Belgique & Pays-Bas" },
  "landing.heading": { nl: "VectorVest", fr: "VectorVest" },
  "landing.headingAccent": { nl: "Community", fr: "Community" },
  "landing.description": { nl: "De besloten community voor serieuze beleggers. Realtime discussie, webinars en dagelijkse VectorVest-analyses — allemaal op één plek.", fr: "La communauté privée pour les investisseurs sérieux. Discussion en temps réel, webinaires et analyses VectorVest quotidiennes — tout en un seul endroit." },
  "landing.signUp": { nl: "Word lid", fr: "Rejoindre" },
  "landing.signIn": { nl: "Inloggen", fr: "Se connecter" },
  "landing.experience": { nl: "37 JAAR ERVARING", fr: "37 ANS D'EXPÉRIENCE" },
  "landing.investors": { nl: "1M+ BELEGGERS", fr: "1M+ INVESTISSEURS" },
  "landing.region": { nl: "BE · NL", fr: "BE · NL" },
  "landing.copyright": { nl: "© {year} VectorVest Community België & Nederland.", fr: "© {year} VectorVest Community Belgique & Pays-Bas." },
  "landing.loginArrow": { nl: "Inloggen →", fr: "Se connecter →" },

  // Auth layout
  "auth.heading": { nl: "De thuisbasis voor {accent}.", fr: "Le foyer pour {accent}." },
  "auth.headingAccent": { nl: "serieuze beleggers", fr: "les investisseurs sérieux" },
  "auth.subtitle": { nl: "Realtime discussie, wekelijkse webinars en dagelijkse VectorVest-analyses — alles op één plek, exclusief voor de BE/NL community.", fr: "Discussion en temps réel, webinaires hebdomadaires et analyses VectorVest quotidiennes — tout en un seul endroit, exclusivement pour la communauté BE/NL." },
  "auth.highlightSignals": { nl: "Dagelijkse marktsignalen", fr: "Signaux de marché quotidiens" },
  "auth.highlightSignalsBody": { nl: "ColorGuard, MTI en Primary Wave — elke handelsdag.", fr: "ColorGuard, MTI et Primary Wave — chaque jour de bourse." },
  "auth.highlightCommunity": { nl: "Actieve community", fr: "Communauté active" },
  "auth.highlightCommunityBody": { nl: "Deel aandelen, UniSearch-recepten en stel je vragen.", fr: "Partagez des actions, des recettes UniSearch et posez vos questions." },
  "auth.highlightExclusive": { nl: "Exclusief voor klanten", fr: "Exclusif pour les clients" },
  "auth.highlightExclusiveBody": { nl: "Enkel geverifieerde VectorVest-abonnees krijgen toegang.", fr: "Seuls les abonnés VectorVest vérifiés ont accès." },
  "auth.experience": { nl: "37 JAAR ERVARING", fr: "37 ANS D'EXPÉRIENCE" },
  "auth.investors": { nl: "1M+ BELEGGERS WERELDWIJD", fr: "1M+ INVESTISSEURS DANS LE MONDE" },
  "auth.tagline": { nl: "Community · België & Nederland", fr: "Community · Belgique & Pays-Bas" },
  "auth.mobileTagline": { nl: "Community · BE & NL", fr: "Community · BE & NL" },

  // Common / UI
  "common.loading": { nl: "Laden...", fr: "Chargement..." },
  "common.previous": { nl: "Vorige", fr: "Précédent" },
  "common.next": { nl: "Volgende", fr: "Suivant" },
  "common.morePages": { nl: "Meer pagina's", fr: "Plus de pages" },
  "common.save": { nl: "Opslaan", fr: "Enregistrer" },
  "common.cancel": { nl: "Annuleren", fr: "Annuler" },
  "common.close": { nl: "Sluiten", fr: "Fermer" },
  "common.open": { nl: "Openen", fr: "Ouvrir" },
  "common.send": { nl: "Versturen", fr: "Envoyer" },
  "common.error": { nl: "Fout", fr: "Erreur" },
  "common.retry": { nl: "Opnieuw", fr: "Réessayer" },
  "common.avatar": { nl: "Avatar", fr: "Avatar" },
  "common.welcome": { nl: "Welkom", fr: "Bienvenue" },

  // Clerk theme overrides (kept English in original, translated here)
  "clerk.signInTitle": { nl: "Welkom terug", fr: "Bon retour" },
  "clerk.signInSubtitle": { nl: "Log in om toegang te krijgen tot de community", fr: "Connectez-vous pour accéder à la communauté" },
  "clerk.signUpTitle": { nl: "Word lid van VectorVest", fr: "Rejoignez VectorVest" },
  "clerk.signUpSubtitle": { nl: "Word onderdeel van de community", fr: "Devenez membre de la communauté" },
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
    (key: string, values?: Record<string, string | number>) => {
      let text = UI_STRINGS[key]?.[language] ?? key;
      if (values) {
        text = text.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
      }
      return text;
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
