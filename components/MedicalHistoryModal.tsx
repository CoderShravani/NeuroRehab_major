import React from 'react';
import { User } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface MedicalHistoryModalProps {
  user: User;
  onClose: () => void;
}

const InfoRow: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">{value || 'Not Provided'}</dd>
    </div>
);

const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({ user, onClose }) => {
  const {
    fullName,
    age,
    gender,
    contact,
    condition,
    diagnosisDate,
    medications,
    allergies,
    affectedParts,
    mobilityLevel,
    pain,
    therapyFrequency,
  } = user.data || {};

  const mobilityMap: { [key: string]: string } = {
    '1': '1 - No movement',
    '2': '2 - Slight movement',
    '3': '3 - Partial movement',
    '4': '4 - Good movement, some difficulty',
    '5': '5 - Full movement',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-brand-dark">Your Medical History</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        
        <dl className="divide-y divide-slate-200">
            <InfoRow label="Full Name" value={fullName} />
            <InfoRow label="Age" value={age} />
            <InfoRow label="Gender" value={gender} />
            <InfoRow label="Contact Info" value={contact} />

            <InfoRow label="Condition" value={condition} />
            <InfoRow label="Date of Diagnosis/Injury" value={diagnosisDate} />
            <InfoRow label="Current Medications" value={medications} />
            <InfoRow label="Allergies" value={allergies} />

            <InfoRow label="Affected Body Parts" value={affectedParts?.join(', ')} />
            <InfoRow label="Current Mobility Level" value={mobilityMap[mobilityLevel]} />
            <InfoRow label="Experiences Pain" value={pain} />
            <InfoRow label="Desired Therapy Frequency" value={therapyFrequency} />
        </dl>

        <div className="mt-6 text-right">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </Card>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MedicalHistoryModal;
