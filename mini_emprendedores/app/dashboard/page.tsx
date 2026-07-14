import type { Metadata } from "next";
import { CaminoView } from "@/components/progress/CaminoView";

export const metadata: Metadata = {
  title: "EmprendeKids · Tu camino emprendedor",
  description:
    "Aprende a emprender paso a paso, con retos divertidos para niños de 10 a 12 años.",
};

export default function Dashboard() {
  return <CaminoView />;
}
