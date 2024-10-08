import { UUID } from 'crypto';

export type AbstractDomain = {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
  state: string;
  version: number;
  createdByAudit?: string;
  lastModifiedBy?: string;
};
