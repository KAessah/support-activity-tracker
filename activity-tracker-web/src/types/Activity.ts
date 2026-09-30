export type ActivityStatus = "done" | "pending";

/** Bio details captured at the moment an update was made. */
export type Personnel = {
  id: number;
  name: string;
  email: string;
  staffId: string;
  phone: string | null;
  position: string | null;
  role: string | null;
};

export type ActivityUpdate = {
  id: number;
  activityId: number;
  activity?: { id: number; title: string; category: string | null };
  activityDate: string;
  status: ActivityStatus;
  remark: string | null;
  personnel: Personnel;
  createdAt: string;
};

export type Activity = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  isActive: boolean;
  updatesCount?: number;
  createdBy?: string | null;
  createdAt: string;
  latestUpdate?: ActivityUpdate | null;
  updates?: ActivityUpdate[];
  can?: { updateStatus: boolean };
};

export type BoardStats = {
  total: number;
  done: number;
  pending: number;
  notUpdated: number;
  progress: number;
};

export type Board = {
  date: string;
  isToday: boolean;
  stats: BoardStats;
  activities: Activity[];
  timeline: ActivityUpdate[];
  carriedOver: ActivityUpdate[];
};

export type ActivityHistory = {
  date: string;
  isToday: boolean;
  activity: Activity;
  stats: { totalUpdates: number; daysDone: number; daysPending: number; daysMissed: number };
  trend: { date: string; status: ActivityStatus | null; updates: number }[];
};

export type ActivityInput = { title: string; category: string | null; description: string | null };

export type StatusUpdateInput = { status: ActivityStatus; remark: string | null };
