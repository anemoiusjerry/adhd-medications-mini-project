import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid"
import { IPatient } from "../../../shared/interfaces/patient"
import { Delete, Edit } from "@mui/icons-material";
import { AdhdStatus } from "../../../shared/adhdStatus";

interface IPatientTableProps {
  patients: IPatient[];
  showModal: (data: IPatient) => void
  deletePatient: (id: string) => void
}

const PatientTable = ({patients, showModal, deletePatient}: IPatientTableProps) => {
  const cols: GridColDef[] = [
    {field: 'name', headerName: 'Patient Name', flex:1},
    {field: 'dateOfBirth', headerName: 'Date of Birth', valueFormatter: (value: string) => {
      const dob = new Date(value)
      // MMM dd, yyyy
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short',
        day: '2-digit' 
      };
      return dob.toLocaleDateString('en-US', options)
    }, flex:1},
    {field: 'email', headerName: 'Email', flex:1},
    {field: 'phoneNumber', headerName: 'Contact Number', flex:1},
    {field: 'adhdStatus', headerName: 'ADHD Diagnosis', valueFormatter:(value: number) => {
      return AdhdStatus[value]
    }, flex:1},
    {field: 'actions', type: 'actions', getActions: (params: GridRowParams) => [
      <GridActionsCellItem showInMenu icon={<Edit />} label="Edit" onClick={() => showModal(params.row)} />,
      <GridActionsCellItem showInMenu icon={<Delete />} label="Delete" onClick={() => deletePatient(params.row.id)} />
    ]}
  ]

  return (
    <DataGrid columns={cols} rows={patients} />
  )
}

export default PatientTable