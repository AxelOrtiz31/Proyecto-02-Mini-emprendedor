import Module05Page from "@/components/Module_05/Module_05Page";

interface PageProps {
  searchParams: Promise<{
    lesson?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <Module05Page lessonId={params.lesson ?? "s5-u1-a1"} />;
}