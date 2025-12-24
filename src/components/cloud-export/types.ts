export type ExportTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  fields: string[];
  groupBy?: string;
  includeCharts: boolean;
};

export type CloudProvider = {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSync?: string;
};

export type ExportHistoryItem = {
  id: string;
  template: string;
  destination: string;
  timestamp: string;
  recordCount: number;
  fileSize: string;
  status: "completed" | "pending" | "failed";
  shareLink?: string;
};

export type ScheduledExport = {
  id: string;
  template: string;
  destination: string;
  frequency: "daily" | "weekly" | "monthly";
  nextRun: string;
  enabled: boolean;
};

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: "tax-report",
    name: "Tax Report",
    description: "Formatted for tax filing with category summaries",
    icon: "📋",
    color: "#0ea5e9",
    fields: ["date", "category", "description", "amount"],
    groupBy: "category",
    includeCharts: false,
  },
  {
    id: "monthly-summary",
    name: "Monthly Summary",
    description: "Month-by-month breakdown with totals",
    icon: "📅",
    color: "#8b5cf6",
    fields: ["date", "category", "description", "amount"],
    groupBy: "month",
    includeCharts: true,
  },
  {
    id: "category-analysis",
    name: "Category Analysis",
    description: "Deep dive into spending patterns by category",
    icon: "📊",
    color: "#f59e0b",
    fields: ["category", "amount", "percentage"],
    groupBy: "category",
    includeCharts: true,
  },
  {
    id: "full-export",
    name: "Full Data Export",
    description: "Complete expense data with all fields",
    icon: "💾",
    color: "#22c55e",
    fields: ["id", "date", "category", "description", "amount", "createdAt"],
    includeCharts: false,
  },
];

export const CLOUD_PROVIDERS: CloudProvider[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    icon: "🔷",
    color: "#4285f4",
    connected: false,
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    icon: "📗",
    color: "#0f9d58",
    connected: false,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    icon: "📦",
    color: "#0061fe",
    connected: false,
  },
  {
    id: "onedrive",
    name: "OneDrive",
    icon: "☁️",
    color: "#0078d4",
    connected: false,
  },
  {
    id: "notion",
    name: "Notion",
    icon: "📝",
    color: "#000000",
    connected: false,
  },
  {
    id: "airtable",
    name: "Airtable",
    icon: "🗃️",
    color: "#18bfff",
    connected: false,
  },
];
