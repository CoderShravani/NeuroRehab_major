import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Card from './ui/Card';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { Page } from '../types';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
}

const ContactInfoIcon: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-brand-light text-brand-primary rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h4 className="text-lg font-semibold text-brand-dark">{title}</h4>
            <p className="text-slate-600">{children}</p>
        </div>
    </div>
);

const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Form submitted:', formState);
        setSubmitMessage('Thank you for your message! We will get back to you shortly.');
        setFormState({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };


  return (
    <div className="bg-slate-50">
      <Header onNavigate={onNavigate} />
      <main className="py-20">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-brand-dark">Get In Touch</h1>
                <p className="mt-4 text-lg text-slate-600">
                    We're here to help. Whether you're a patient with a question, a doctor interested in our platform, or just want to say hello, we'd love to hear from you.
                </p>
            </div>

            <Card className="mt-16 grid md:grid-cols-2 gap-12 items-start">
                {/* Contact Form */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-brand-dark">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input id="name" name="name" label="Full Name" type="text" value={formState.name} onChange={handleChange} required />
                        <Input id="email" name="email" label="Email Address" type="email" value={formState.email} onChange={handleChange} required />
                        <Input id="subject" name="subject" label="Subject" type="text" value={formState.subject} onChange={handleChange} required />
                        <Textarea id="message" name="message" label="Your Message" rows={5} value={formState.message} onChange={handleChange} required />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                        {submitMessage && <p className="text-green-600 mt-4 text-center">{submitMessage}</p>}
                    </form>
                </div>
                
                {/* Contact Details */}
                <div className="space-y-8 bg-brand-light p-8 rounded-lg">
                     <h2 className="text-2xl font-bold text-brand-dark">Contact Information</h2>
                     <ContactInfoIcon icon={<LocationIcon />} title="Our Office">
                        123 Health St, Wellness City, 12345
                     </ContactInfoIcon>
                     <ContactInfoIcon icon={<EmailIcon />} title="Email Us">
                        General: info@neurorehab.com<br/>
                        Support: support@neurorehab.com
                     </ContactInfoIcon>
                     <ContactInfoIcon icon={<PhoneIcon />} title="Call Us">
                        Patient Line: (123) 456-7890<br/>
                        Doctor Line: (123) 456-7891
                     </ContactInfoIcon>
                </div>
            </Card>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default ContactPage;
