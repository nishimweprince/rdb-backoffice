import { UUID } from 'crypto';
import { AbstractDomain } from '.';
import { User } from './user';

export interface BusinessAmendmentReviewComment extends AbstractDomain {
  amendmentDetailId: UUID;
  comment: string;
  createdBy: User;
  status: string;
}
