import { UUID } from "crypto";

export interface PersonRole {
  id: UUID;
  roleName?: string;
  roleDescription?: string;
}
