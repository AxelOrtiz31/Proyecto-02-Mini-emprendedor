import { redirect } from "next/navigation";
import { BackLink } from "@/components/shared/BackLink";

interface LessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;

  const moduleRoute = getModuleRouteFromLessonId(lessonId);

  if (moduleRoute) {
    redirect(moduleRoute);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="font-display text-3xl font-extrabold text-foreground">
        Lección en construcción 🛠️
      </div>

      <p className="max-w-sm text-sm text-muted-foreground">
        Pronto podrás jugar esta actividad. Identificador:{" "}
        <span className="font-bold text-foreground">{lessonId}</span>
      </p>

      <BackLink
        href="/dashboard"
        className="rounded-full bg-primary px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        Volver al camino
      </BackLink>
    </main>
  );
}

function getModuleRouteFromLessonId(lessonId: string) {
  const match = lessonId.match(/^s(\d+)-u1/);
  if (!match) return null;

  const numeroModulo = match[1].padStart(2, "0");
  return `/modules01_06_complete/module${numeroModulo}?lesson=${lessonId}`;
}