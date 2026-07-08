import Module01Page from "@/components/Module_01/Module_01Page";

interface PageProps {
  searchParams: Promise<{
    lesson?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <Module01Page lessonId={params.lesson ?? "s1-u1-a1"} />;
}