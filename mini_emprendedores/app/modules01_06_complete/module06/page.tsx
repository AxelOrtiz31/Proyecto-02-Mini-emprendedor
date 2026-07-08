import Module06Page from "@/components/Module_06/Module_06Page";

interface PageProps {
  searchParams: Promise<{
    lesson?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <Module06Page lessonId={params.lesson ?? "s6-u1-a1"} />;
}