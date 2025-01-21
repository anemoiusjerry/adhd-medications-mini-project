import {AdhdStatus} from '../adhdStatus'

export interface IPatient {
  id?: string;
  name: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  adhdStatus: AdhdStatus;
  notes: string;
}