import { useListCourses, getListCoursesQueryKey } from "@workspace/api-client-react";
import { BookOpen, Clock, Lock, PlayCircle, BarChart, ChevronRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function UniversityPage() {
  const { data: courses } = useListCourses({ query: { queryKey: getListCoursesQueryKey() } });
  const { t, language } = useI18n();
  const [filter, setFilter] = useState<string>("all");

  const levels = [
    { id: "all",         label: t("university.allLevels") },
    { id: "beginner",    label: t("university.beginner") },
    { id: "intermediate", label: t("university.intermediate") },
    { id: "advanced",    label: t("university.advanced") },
  ];

  const filteredCourses = courses?.filter(c => filter === "all" || c.level === filter) || [];

  // Assign part numbers to beginner courses by their natural order
  const beginnerCourses = courses?.filter(c => c.level === "beginner") || [];
  const beginnerIds = beginnerCourses.map(c => c.id);

  function getPartLabel(course: typeof filteredCourses[0]): string | null {
    if (course.level !== "beginner") return null;
    const idx = beginnerIds.indexOf(course.id);
    if (idx < 0 || idx > 2) return null;
    const partWord = language === "fr" ? "Partie" : "Deel";
    return `${partWord} ${idx + 1}`;
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div className="border-b border-border pb-10 flex flex-col md:flex-row items-start md:items-end gap-8">
          <div className="flex-1 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">{t("university.title")}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              {t("university.subtitle")}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
              {t("university.description")}
            </p>
            <Button size="default" className="font-semibold mt-2">
              {t("university.resumeLearning")} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex gap-6 shrink-0">
            <div className="text-center">
              <p className="text-3xl font-black font-mono">24+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{t("university.courses")}</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-black font-mono">120h</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{t("university.content")}</p>
            </div>
          </div>
        </div>

        {/* Level filter tabs */}
        <div className="flex gap-1 border-b border-border">
          {levels.map(l => (
            <button
              key={l.id}
              onClick={() => setFilter(l.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                filter === l.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => {
            const partLabel = getPartLabel(course);
            return (
              <div
                key={course.id}
                className="group border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors bg-card flex flex-col"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/9] bg-sidebar relative overflow-hidden shrink-0">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BarChart className="w-10 h-10 text-muted-foreground/20" />
                    </div>
                  )}

                  {/* Part label (Deel 1/2/3) */}
                  {partLabel && (
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded tracking-wide uppercase">
                      {partLabel}
                    </div>
                  )}

                  {/* Level badge — only if no part label */}
                  {!partLabel && (
                    <div className="absolute top-3 left-3">
                      <span className={cn(
                        "text-[11px] font-bold px-2.5 py-1 rounded tracking-wide uppercase",
                        course.level === "beginner" && "bg-emerald-600/90 text-white",
                        course.level === "intermediate" && "bg-blue-600/90 text-white",
                        course.level === "advanced" && "bg-violet-600/90 text-white",
                      )}>
                        {t(`university.${course.level}` as any)}
                      </span>
                    </div>
                  )}

                  {/* Lock overlay */}
                  {course.isLocked && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-background/90 p-3 rounded-full shadow">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {!course.isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                      <PlayCircle className="w-12 h-12 text-white drop-shadow" />
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-3 border-t border-border mt-auto">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {course.instructor}</span>
                    {course.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
