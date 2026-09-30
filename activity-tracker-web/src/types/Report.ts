import type { ActivityUpdate } from "./Activity";
import type { Option, Paginated } from "./Api";

export type ReportQuery = {
  from: string;
  to: string;
  activityId: string;
  userId: string;
  status: "" | "done" | "pending";
  page: number;
  perPage: number;
};

export type ReportTotals = { total: number; done: number; pending: number; personnel: number; days: number };

export type ReportTrendPoint = { date: string; done: number; pending: number };

export type ReportPageData = {
  history: Paginated<ActivityUpdate>;
  totals: ReportTotals;
  trend: ReportTrendPoint[];
  activities: Option[];
  personnel: Option[];
};
