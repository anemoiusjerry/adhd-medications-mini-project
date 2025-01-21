import {forwardRef, useState} from 'react'
import { Box, Button, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { IPatient } from '../../../shared/interfaces/patient'

interface IPatientFormProps {
  data?: IPatient;
  close: () => void;
  submit: (data: IPatient) => void;
}

const PatientForm = forwardRef<HTMLDivElement, IPatientFormProps>(({data, close, submit}, ref) => {
  const [name, setName] = useState<string>(data ? data.name : "")
  const [dob, setDob] = useState<Dayjs | null>(data ? dayjs(data.dateOfBirth): null)
  const [email, setEmail] = useState<string>(data ? data.email : "")
  const [phone, setPhone] = useState<string>(data ? data.phoneNumber : "")
  const [status, setStatus] = useState<number>(data ? data.adhdStatus : 0)
  const [notes, setNotes] = useState<string>(data ? data.notes : "")

  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)

  const _handleSubmit = () => {
    // create object containing only changes
    const patientData: IPatient = {
      id: data?.id,
      name: name,
      dateOfBirth: dob?.toDate() ?? new Date(), 
      email: email,
      phoneNumber: phone,
      adhdStatus: status,
      notes: notes
    }
    if (!invalidEmail) {
      submit(patientData)
      close()
    }
  }

  const _handleEmailChange = (newEmail: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setInvalidEmail(!emailRegex.test(newEmail))
    setEmail(newEmail)
  }

  return (
    <Box ref={ref} className='modal' sx={{bgcolor: 'background.paper'}} tabIndex={-1}>
      <Typography variant='h5' sx={{marginBottom: 2}}>New Patient Details</Typography>

   
        <TextField label="Your Name" value={name} onChange={e => setName(e.target.value)} className="form-field"/>
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date of Birth" value={dob} onChange={(value) => setDob(value)} className="form-field"/>
        </LocalizationProvider>

        <Box className="form-field" sx={{display: 'flex'}}>
          <TextField 
          sx={{marginRight: 2}}
          label="Email" value={email} 
          onChange={e => _handleEmailChange(e.target.value)} 
          error={invalidEmail}
          helperText={invalidEmail && "Not a valid email."}
          />
          <TextField label="Contact Number" value={phone} onChange={e => {
            if (/^\d*$/.test(e.target.value)) {
              setPhone(e.target.value)
            }
          }} />
        </Box>

        <Box className="form-field" sx={{display: 'flex', alignItems: 'center'}}>
          <Typography>ADHD Diagnosis</Typography>
          <ToggleButtonGroup exclusive value={status} onChange={(_, newStatus) => setStatus(newStatus)} sx={{width:'100%'}}>
            <ToggleButton sx={{flex:1}} value={0} color='success'>Mild</ToggleButton>
            <ToggleButton sx={{flex:1}} value={1} color='warning'>Moderate</ToggleButton>
            <ToggleButton sx={{flex:1}} value={2} color='error'>Severe</ToggleButton>
          </ToggleButtonGroup> 
        </Box>

        <TextField label="Additional Notes" multiline minRows={4} value={notes} onChange={e => setNotes(e.target.value)} className="form-field"/>
        
        <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
          <Button variant='outlined' color='error' onClick={close}>Cancel</Button>
          <Button variant='outlined' onClick={_handleSubmit}>Submit</Button>
        </Box>
   
    </Box>    
  )
})

export default PatientForm