export type StatTone = "primary" | "success" | "info";
export type StatIcon = "zap" | "target" | "timer";

export interface LessonStat {
  id: string;
  label: string;
  value: string;
  tone: StatTone;
  icon: StatIcon;
}
