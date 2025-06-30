export interface UserModel {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role?: "user" | "admin";
  status: "active" | "inactive";
  canViewLogs?: boolean;
  canManageScheduling?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
