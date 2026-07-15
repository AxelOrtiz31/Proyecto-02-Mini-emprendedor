import Module07Page from "@/components/Module_07/Module_07Page";

interface PageProps {
  searchParams: Promise<{
    lesson?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <Module07Page lessonId={params.lesson ?? "s7-u1-a1"} />;
}
