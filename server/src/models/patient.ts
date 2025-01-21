import { Schema, model, connect } from 'mongoose';
import {IPatient} from '../../../shared/interfaces/patient';
import { AdhdStatus } from '../../../shared/adhdStatus';

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  adhdStatus: { type: Number, default: AdhdStatus.MILD },
  notes: { type: String, default: "" },
})

const Patient = model<IPatient>('Patient', patientSchema)
export default Patient