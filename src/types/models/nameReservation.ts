import { AbstractDomain } from ".";

export interface NameReservation extends AbstractDomain {
    code: string;
    name: string;
    reservationStatus: string;
    comment?: string;
    expiryDate?: Date;
    renewalCount: number;
    assignedApprover?: {
        id: string;
        fullName: string;
        firstName: string;
        lastName: string;
        email: string;
    };
} 