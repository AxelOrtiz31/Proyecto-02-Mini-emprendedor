import Module04Page from "@/components/Module_04/Module_04Page";

interface PageProps {
  searchParams: Promise<{
    lesson?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <Module04Page lessonId={params.lesson ?? "s4-u1-a1"} />;
}
