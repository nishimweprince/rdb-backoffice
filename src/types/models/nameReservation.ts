import { AbstractDomain } from ".";
import { User } from "./user";

export interface NameReservation extends AbstractDomain {
    code: string;
    name: string;
    reservationStatus: string;
    comment?: string;
    expiryDate?: Date;
    renewalCount: number;
    assignedApprover: User
} 