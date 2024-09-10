import { AbstractDomain } from ".";

export interface NameReservation extends AbstractDomain {
    code: string;
    name: string;
    reservationStatus: string;
    comment?: string;
    expiryDate?: Date;
    renewalCount: number;
} 