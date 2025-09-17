
export enum Page {
  Home = 'HOME',
  SignIn = 'SIGN_IN',
  PatientForm = 'PATIENT_FORM',
  PatientDashboard = 'PATIENT_DASHBOARD',
  DoctorDashboard = 'DOCTOR_DASHBOARD',
}

export enum UserRole {
  Patient = 'PATIENT',
  Doctor = 'DOCTOR',
}

export interface User {
  uid: string;
  role: UserRole;
  data: any;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    condition: string;
    lastActivity: string;
    progress: number;
    mobilityData: { week: string; score: number }[];
    accuracyData: { day: string; score: number }[];
    gamesPlayedData: { name: string; value: number }[];
}