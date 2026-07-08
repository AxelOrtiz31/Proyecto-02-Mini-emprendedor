import Module03Page from "@/components/Module_03/Module_03Page";

interface PageProps {
  searchParams: Promise<{
    lesson?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <Module03Page lessonId={params.lesson ?? "s3-u1-a1"} />;
}
