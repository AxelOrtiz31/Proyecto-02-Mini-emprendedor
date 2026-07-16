import type { Metadata } from "next";
import AchievementsPage from "@/components/Achievements/AchievementsPage";

export const metadata: Metadata = {
  title: "EmprendeKids · Logros",
  description: "Tus logros e insignias de EmprendeKids.",
};

export default function Page() {
  return <AchievementsPage />;
}
