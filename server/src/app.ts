import express, { Express, Request, Response } from "express"
import Patient from './models/patient'
import { IPatient } from "../../shared/interfaces/patient"
import cors from 'cors'

const app: Express = express()
app.use(express.json())
// allow complex objects in query
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: 'http://localhost:5173',
}))

app.get('/', (req: Request, res: Response) => {
  res.send("Backend API")
})

app.get('/all', async (req: Request, res: Response) => {
  const query = await Patient.find().lean();
  const patients: IPatient[] = query.map(p => ({
    id: p._id.toString(),
    name: p.name,
    dateOfBirth: p.dateOfBirth,
    email: p.email,
    phoneNumber: p.phoneNumber,
    adhdStatus: p.adhdStatus,
    notes: p.notes
  }))
  res.status(200).json(patients)
})

app.post('/new', async (req: Request, res: Response) => {
  try {
    let patientData = req.body
    patientData.dateOfBirth = new Date(patientData.dateOfBirth)
    const newPatient = new Patient(req.body)
    await newPatient.save()
    res.status(201).json({id: newPatient._id})
  } catch(err) {
    console.error(err)
    res.status(500).end()
  }
}) 

app.route("/:patientId")
.get(async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (patient) {
      res.status(200).json(patient)
    }
    res.status(404).json({error: "Patient not found"})
  } catch(err) {
    res.status(500).json({error: err})
  }
})
.put(async (req: Request, res: Response) => {
  try {
    await Patient.findByIdAndUpdate(req.params.patientId, req.body)
    res.status(200).end()
  } catch (err) {
    res.status(500).end()
  }
})
.delete(async (req: Request, res: Response) => {
  try {
    await Patient.findByIdAndDelete(req.params.patientId)
    res.status(204).end()
  } catch(err) {
    res.status(500).end()
  }
})

export default app