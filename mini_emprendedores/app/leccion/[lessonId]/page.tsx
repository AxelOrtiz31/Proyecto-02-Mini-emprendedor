import { TemporaryLessonView } from "@/components/Lesson_Temp/TemporaryLessonView";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;

  return <TemporaryLessonView lessonId={lessonId} />;
}
