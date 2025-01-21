import './App.css'
import { useState, useEffect } from 'react'
import { Button, Modal, Paper, } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { IPatient } from '../../shared/interfaces/patient'
import PatientForm from './components/patientForm';
import PatientTable from './components/PatientTable';

function App() {
  const baseUrl = 'http://127.0.0.1:3000'
  const [showModal, setShowModal] = useState<boolean>(false)
  const [patients, setPatients] = useState<IPatient[]>([])
  const [patientData, setPatientData] = useState<IPatient | undefined>()

 

  // load all data
  useEffect(() => {
    fetch(baseUrl + '/all').then(res => res.json()).then(patients => 
      setPatients(patients)
    )
  }, [])

  const _handleSubmit = (patientData: IPatient) => {
    // patient does not exist: create new
    if (patientData.id == null) {
      fetch(baseUrl + '/new', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(patientData)
      }).then(res => {
        if (res.ok) {
          return res.json()
        }
      }).then(message => {
        setPatients([
          ...patients,
          {...patientData, id: message.id}
        ])
      }).catch(err => console.error("Create failed"))
    } else {
      // update existing user
      const {id, ...patientNoId} = patientData
      fetch(`${baseUrl}/${patientData.id}`, {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(patientNoId)
      }).then(res => {
        if (res.ok) {
          // update table with new settings
          setPatients([...patients.map(p => p.id === id ? patientData : p)])
        }
      })
    }
  }

  const _deletePatient = (id: string) => {
    fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {'Content-type': 'application/json'},
    }).then(res => {
      if (res.ok) {
        setPatients(patients.filter(p => p.id !== id))
      }
    })
  }

  const _showEditModal = (patientData: IPatient) => {
    setPatientData(patientData)
    setShowModal(true)
  }

  return (
    <>
      <Button 
      sx={{marginBottom: 5}} 
      variant='contained' 
      endIcon={<AddIcon/>}
      onClick={() => {
        // clear patient data
        setPatientData(undefined)
        setShowModal(true)
      }}
      >
        New Patient
      </Button>

      <Paper sx={{width:'100%'}}>
        <PatientTable patients={patients} showModal={_showEditModal} deletePatient={_deletePatient}/>
      </Paper>

      <Modal disableEnforceFocus open={showModal} onClose={() => setShowModal(false)}>
        <PatientForm data={patientData} close={() => setShowModal(false)} submit={_handleSubmit} />
      </Modal>
    </>
  )
}

export default App
