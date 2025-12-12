/**
 * Module: UserTypes
 *
 * Defines the core identity shapes used by the Auth and API layers.
 *
 * Related docs:
 * - 04-data-and-api-spec.md (users table)
 * - 03-security-and-data-handling.md
 */

export type UserRole = "admin" | "staff";

export interface User {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Context usually attached to a request after authentication.
 */
export interface AuthContext {
  user: User | null;
}