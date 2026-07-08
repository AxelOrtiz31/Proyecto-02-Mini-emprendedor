import Module02Page from "@/components/Module_02/Module_02Page";

interface PageProps {
  searchParams: Promise<{
    lesson?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <Module02Page lessonId={params.lesson ?? "s2-u1-a1"} />;
}