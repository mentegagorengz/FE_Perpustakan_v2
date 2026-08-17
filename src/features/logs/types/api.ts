export interface ApiLog {
  id: number;
  created_at: string;
  action: string;
  status: "SUCCESS" | "FAILED";
  ip_address: string;
  device_info: string;
  user?: { full_name: string };
}