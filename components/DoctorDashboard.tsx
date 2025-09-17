
import React, { useState } from 'react';
import { User, Patient } from '../types';
import Header from './Header';
import Card from './ui/Card';
import Input from './ui/Input';
import MobilityChart from './charts/MobilityChart';
import AccuracyChart from './charts/AccuracyChart';
import Button from './ui/Button';
import Select from './ui/Select';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

const mockPatients: Patient[] = [
    {
        id: '1',
        name: 'John Doe',
        age: 68,
        condition: 'Stroke',
        lastActivity: '30 mins ago',
        progress: 85,
        mobilityData: [{ week: 'W1', score: 2.1 }, { week: 'W2', score: 2.4 }, { week: 'W3', score: 2.9 }, { week: 'W4', score: 3.1 }],
        accuracyData: [{ day: 'Mon', score: 70 }, { day: 'Tue', score: 75 }, { day: 'Wed', score: 72 }, { day: 'Thu', score: 80 }, { day: 'Fri', score: 81 }],
        gamesPlayedData: []
    },
    {
        id: '2',
        name: 'Jane Smith',
        age: 45,
        condition: 'Post-Surgery Rehab',
        lastActivity: '2 hours ago',
        progress: 60,
        mobilityData: [{ week: 'W1', score: 1.5 }, { week: 'W2', score: 1.8 }, { week: 'W3', score: 2.2 }, { week: 'W4', score: 2.8 }],
        accuracyData: [{ day: 'Mon', score: 85 }, { day: 'Tue', score: 88 }, { day: 'Wed', score: 90 }, { day: 'Thu', score: 87 }, { day: 'Fri', score: 92 }],
        gamesPlayedData: []
    },
    {
        id: '3',
        name: 'Peter Jones',
        age: 72,
        condition: 'Traumatic Brain Injury',
        lastActivity: '1 day ago',
        progress: 75,
        mobilityData: [{ week: 'W1', score: 3.0 }, { week: 'W2', score: 3.1 }, { week: 'W3', score: 3.3 }, { week: 'W4', score: 3.6 }],
        accuracyData: [{ day: 'Mon', score: 65 }, { day: 'Tue', score: 68 }, { day: 'Wed', score: 71 }, { day: 'Thu', score: 75 }, { day: 'Fri', score: 78 }],
        gamesPlayedData: []
    }
];


const PatientListItem: React.FC<{patient: Patient, onSelect: (p: Patient) => void, isSelected: boolean}> = ({patient, onSelect, isSelected}) => (
    <div onClick={() => onSelect(patient)} className={`p-4 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-brand-primary text-white shadow-lg' : 'bg-slate-100 hover:bg-brand-light'}`}>
        <div className="flex justify-between items-center">
            <p className="font-bold">{patient.name}</p>
            <p className={`text-sm ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>{patient.lastActivity || 'N/A'}</p>
        </div>
        <p className={`text-sm ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>{patient.condition}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${patient.progress || 75}%` }}></div>
        </div>
    </div>
);

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, onLogout }) => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(mockPatients.length > 0 ? mockPatients[0] : null);
  const [searchTerm, setSearchTerm] = useState('');


  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-100 min-h-screen">
      <Header onNavigate={() => {}} onLogout={onLogout} isLoggedIn={true} />
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Patient List Sidebar */}
          <div className="lg:col-span-1 xl:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-bold text-brand-dark mb-4">My Patients ({filteredPatients.length})</h2>
              <Input
                id="search-patients"
                label=""
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {loading ? (
                  <p className="text-slate-500">Loading patients...</p>
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map(p => (
                    <PatientListItem
                      key={p.id}
                      patient={p}
                      onSelect={setSelectedPatient}
                      isSelected={selectedPatient?.id === p.id}
                    />
                  ))
                ) : (
                  <p className="text-slate-500">No patients found.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Patient Details View */}
          <div className="lg:col-span-2 xl:col-span-3">
            {selectedPatient ? (
              <div className="space-y-6">
                <Card>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h1 className="text-3xl font-bold text-brand-dark">{selectedPatient.name}</h1>
                      <p className="text-slate-600 mt-1">{selectedPatient.age} years old • {selectedPatient.condition}</p>
                    </div>
                    <Button variant="outline" className="mt-4 md:mt-0">View Full History</Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">Performance Overview</h3>
                  <p className="bg-brand-light text-brand-dark p-3 rounded-lg mb-6">
                    💡 <span className="font-semibold">AI Insight:</span> {selectedPatient.name}'s accuracy has been consistently above 80%. Consider increasing game difficulty.
                  </p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-center">Mobility Improvement</h4>
                      <MobilityChart data={selectedPatient.mobilityData} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-center">Recent Accuracy</h4>
                      <AccuracyChart data={selectedPatient.accuracyData} />
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">Doctor's Actions</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Add a Note</label>
                      <textarea id="notes" rows={4} className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder={`Leave a note for ${selectedPatient.name}...`}></textarea>
                      <Button className="w-full">Save Note</Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="game-plan" className="block text-sm font-medium text-slate-700">Adjust Game Plan</label>
                        <Select id="game-plan" label="">
                          <option>Increase 'Hand Flex' difficulty</option>
                          <option>Decrease 'Trace &amp; Train' speed</option>
                          <option>Recommend 'Balance Quest'</option>
                        </Select>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="secondary" className="flex-1">Update Plan</Button>
                        <Button variant="outline" className="flex-1">Send Message</Button>
                      </div>
                    </div>
                  </div>
                </Card>

              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center text-center h-[60vh]">
                <h2 className="text-2xl font-bold text-brand-dark">
                  {loading ? 'Loading Patients...' : 'No Patient Selected'}
                </h2>
                <p className="text-slate-600 mt-2">
                  {loading ? 'Please wait a moment.' : 'Please select a patient from the list to view their details.'}
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;