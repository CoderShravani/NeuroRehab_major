import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Card from './ui/Card';
import { Page } from '../types';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

const TeamMemberCard: React.FC<{ imgSrc: string; name: string; title: string; bio: string }> = ({ imgSrc, name, title, bio }) => (
    <Card className="text-center transition-transform duration-300 hover:-translate-y-2">
        <img src={imgSrc} alt={`Portrait of ${name}`} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" />
        <h4 className="text-xl font-bold text-brand-dark">{name}</h4>
        <p className="text-brand-primary font-semibold mb-2">{title}</p>
        <p className="text-slate-600 text-sm">{bio}</p>
    </Card>
);

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50">
      <Header onNavigate={onNavigate} />
      <main>
        {/* Hero Section */}
        <section className="relative bg-brand-primary text-white py-20 md:py-32 text-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1531525645387-b14d8c6bd920?q=80&w=2070&auto=format&fit=crop')"}}></div>
            <div className="relative container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold">About NeuroRehab</h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-brand-light">Pioneering a new era of neurological recovery through technology, compassion, and innovation.</p>
            </div>
        </section>

        {/* Our Mission & Story Section */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">Our Mission</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            To empower every individual on their path to recovery from neurological conditions by providing an engaging, accessible, and effective digital rehabilitation platform. We believe that recovery should be a journey of hope, motivation, and measurable progress.
                        </p>
                        <h2 className="text-3xl font-bold text-brand-dark mb-4 mt-8">Our Story</h2>
                        <p className="text-slate-600 leading-relaxed">
                            NeuroRehab was born from a shared passion for healthcare and technology. Our founders, a team of clinicians and engineers, witnessed the challenges patients faced with traditional rehabilitation: monotonous exercises, infrequent feedback, and difficulty staying motivated. They envisioned a solution that could transform therapy into an inspiring experience, accessible from the comfort of home. That vision became NeuroRehab.
                        </p>
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop" alt="A team of professionals collaborating" className="rounded-lg shadow-xl w-full h-auto" />
                    </div>
                </div>
            </div>
        </section>

        {/* Our Technology Section */}
         <section className="py-20 bg-brand-light">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Our Technology</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">We leverage cutting-edge technology to create a seamless and powerful rehabilitation experience.</p>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <Card>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">Interactive Gamification</h3>
                        <p className="text-slate-600">Therapeutic exercises are transformed into fun, motivating games that adapt in difficulty based on user performance.</p>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">Real-Time Motion Tracking</h3>
                        <p className="text-slate-600">Using just a standard webcam, our AI models analyze movement to provide instant feedback on accuracy and form.</p>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">Data-Driven Insights</h3>
                        <p className="text-slate-600">We provide clear, visual progress reports for both patients and doctors, making it easy to track improvements and adjust plans.</p>
                    </Card>
                </div>
            </div>
        </section>

        {/* Meet the Team Section */}
        <section className="py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Meet Our Team</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">A passionate group of experts dedicated to making a difference.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
                    <TeamMemberCard 
                        imgSrc="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
                        name="Shubhangi Kashid"
                        title="Backend Developer"
                        bio="Shubhangi is the architect of our secure and scalable backend, ensuring the platform runs smoothly and reliably for all users."
                    />
                    <TeamMemberCard 
                        imgSrc="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop"
                        name="Shravani Kulkarni"
                        title="CEO & Lead Engineer"
                        bio="Shravani combines her expertise in AI and software development to build the technology that powers NeuroRehab."
                    />
                    <TeamMemberCard 
                        imgSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                        name="Shwetal More"
                        title="Game Developer"
                        bio="Shwetal designs and develops the engaging therapeutic games that make recovery an enjoyable and effective experience."
                    />
                </div>
            </div>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default AboutPage;