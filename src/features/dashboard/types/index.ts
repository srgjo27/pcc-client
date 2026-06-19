export interface AIDailyBriefing {
  date: string;
  greeting: string;
  quote: {
    text: string;
    author: string;
  };
  focusScore: number;
  tasksSummary: string;
  insights: string[];
}

export interface WeeklyReviewChartPoint {
  day: string;
  tasksCompleted: number;
  focusHours: number;
}

export interface WeeklyReview {
  productivityScore: number;
  focusHours: number;
  tasksCompleted: number;
  reviewSummary: string;
  chartData: WeeklyReviewChartPoint[];
  positives: string[];
  improvements: string[];
}

export interface DashboardData {
  dailyBriefing: AIDailyBriefing;
  weeklyReview: WeeklyReview;
}
