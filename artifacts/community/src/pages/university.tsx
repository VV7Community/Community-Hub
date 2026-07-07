import { useListCourses, getListCoursesQueryKey } from "@workspace/api-client-react";
import { BookOpen, Clock, Lock, PlayCircle, BarChart, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function UniversityPage() {
  const { data: courses } = useListCourses({ query: { queryKey: getListCoursesQueryKey() }});
  const [filter, setFilter] = useState<string>("all");

  const levels = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" }
  ];

  const filteredCourses = courses?.filter(c => filter === "all" || c.level === filter) || [];

  return (
    <div className="h-full w-full overflow-y-auto bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex-1 space-y-4 relative z-10">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">VectorVest University</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Master the Art of Investing</h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Access our comprehensive library of trading strategies, market analysis techniques, and platform tutorials to elevate your investing game.
            </p>
            <div className="pt-2">
              <Button size="lg" className="font-bold">Resume Learning <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-1/3 grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <div className="text-2xl font-bold">24+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Courses</div>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <Clock className="w-8 h-8 text-primary" />
              <div className="text-2xl font-bold">120h</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Content</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {levels.map(l => (
            <button
              key={l.id}
              onClick={() => setFilter(l.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                filter === l.id 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col">
              <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-sidebar">
                    <BarChart className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                
                <div className="absolute top-3 left-3">
                  <Badge variant={course.level === 'beginner' ? 'default' : course.level === 'intermediate' ? 'secondary' : 'destructive'} className="capitalize shadow-md">
                    {course.level}
                  </Badge>
                </div>
                
                {course.isLocked && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-background/90 p-3 rounded-full shadow-lg">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                )}

                {!course.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{course.description}</p>
                
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-4 border-t border-border mt-auto">
                  <span className="flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5" /> {course.instructor}</span>
                  {course.duration && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inline UserIcon since it wasn't imported from lucide
function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
