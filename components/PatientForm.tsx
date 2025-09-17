import React, { useState } from 'react';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import Card from './ui/Card';
import { User } from '../types';

interface PatientFormProps {
  user: User;
  onFormSubmitted: (data: any) => void;
}

const FormSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
  <div className="mt-8">
      <h3 className="text-xl font-semibold text-brand-dark border-b-2 border-brand-light pb-2 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
      </div>
  </div>
);

const affectedPartOptions = ['Hand', 'Wrist', 'Fingers', 'Arm', 'Shoulder', 'Neck', 'Upper Body', 'Face', 'Speech', 'Cognitive'];

const PatientForm: React.FC<PatientFormProps> = ({ user, onFormSubmitted }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    condition: '',
    diagnosisDate: '',
    affectedParts: [] as string[],
    mobilityLevel: '3',
    pain: 'No',
    therapyFrequency: 'Daily',
    medications: '',
    allergies: '',
    contact: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentParts = prev.affectedParts;
      if (checked) {
        return { ...prev, affectedParts: [...currentParts, value] };
      } else {
        return { ...prev, affectedParts: currentParts.filter(part => part !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      onFormSubmitted(formData);
    } catch (error) {
      console.error("Error submitting form: ", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-dark">Patient Medical History</h2>
            <p className="text-slate-600 mt-2">Please fill out this form to personalize your recovery plan.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <FormSection title="Personal Information">
              <Input id="fullName" name="fullName" label="Full Name" type="text" value={formData.fullName} onChange={handleChange} required />
              <Input id="age" name="age" label="Age" type="number" value={formData.age} onChange={handleChange} required />
              <Select id="gender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
              <Input id="contact" name="contact" label="Contact Info" type="text" value={formData.contact} onChange={handleChange} required />
            </FormSection>

            <FormSection title="Medical Background">
              <Select id="condition" name="condition" label="Condition" value={formData.condition} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="Stroke">Stroke</option>
                <option value="Injury">Traumatic Brain Injury</option>
                <option value="Surgery">Post-Surgery Rehab</option>
                <option value="Other">Other</option>
              </Select>
              <Input id="diagnosisDate" name="diagnosisDate" label="Date of Diagnosis/Injury" type="date" value={formData.diagnosisDate} onChange={handleChange} required />
              <Textarea id="medications" name="medications" label="Current Medications (if any)" rows={3} value={formData.medications} onChange={handleChange} />
              <Textarea id="allergies" name="allergies" label="Any Allergies?" rows={3} value={formData.allergies} onChange={handleChange} />
            </FormSection>

            <FormSection title="Rehabilitation Information">
               <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Affected Body Parts (select all that apply)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border border-slate-300 rounded-md bg-white">
                  {affectedPartOptions.map((part) => (
                    <div key={part} className="flex items-center">
                      <input
                        id={`part-${part}`}
                        name="affectedParts"
                        type="checkbox"
                        value={part}
                        onChange={handleCheckboxChange}
                        checked={formData.affectedParts.includes(part)}
                        className="h-4 w-4 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
                      />
                      <label htmlFor={`part-${part}`} className="ml-2 block text-sm text-slate-900">{part}</label>
                    </div>
                  ))}
                </div>
               </div>
               <Select id="mobilityLevel" name="mobilityLevel" label="Current Mobility Level (1-5)" value={formData.mobilityLevel} onChange={handleChange}>
                    <option value="1">1 - No movement</option>
                    <option value="2">2 - Slight movement</option>
                    <option value="3">3 - Partial movement</option>
                    <option value="4">4 - Good movement, some difficulty</option>
                    <option value="5">5 - Full movement</option>
               </Select>
               <Select id="pain" name="pain" label="Do you experience pain while moving?" value={formData.pain} onChange={handleChange}>
                   <option value="No">No</option>
                   <option value="Yes">Yes</option>
               </Select>
               <Select id="therapyFrequency" name="therapyFrequency" label="Desired Therapy Frequency" value={formData.therapyFrequency} onChange={handleChange}>
                   <option value="Daily">Daily</option>
                   <option value="3-per-week">3 times a week</option>
                   <option value="Weekly">Weekly</option>
               </Select>
            </FormSection>

            <div className="mt-10 text-center">
              <Button type="submit" variant="primary" className="w-full md:w-auto" disabled={loading}>
                {loading ? 'Saving...' : 'Create My Dashboard'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PatientForm;