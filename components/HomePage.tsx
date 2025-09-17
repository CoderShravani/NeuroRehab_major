import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import Button from './ui/Button';
import Card from './ui/Card';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

// Updated slides with more patient-centric and encouraging language
const slides = [
  {
    image: 'https://images.unsplash.com/photo-1599421497821-72680753a393?q=80&w=2070&auto=format&fit=crop',
    alt: 'A patient using a rehabilitation game with a VR headset',
    heading: 'Rediscover Movement Through Play',
    subtext: 'Our therapeutic games make recovery an engaging and motivating experience.',
  },
  {
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
    alt: 'Doctor monitoring progress graphs on a tablet',
    heading: 'See Your Progress, Feel Your Strength',
    subtext: 'Track your improvements in real-time and celebrate every milestone.',
  },
  {
    image: 'https://images.unsplash.com/photo-1551884859-807101e08290?q=80&w=2070&auto=format&fit=crop',
    alt: 'A happy patient giving a thumbs-up during a video call with a doctor',
    heading: 'Guided by Experts, Every Step of the Way',
    subtext: 'Stay connected with your doctor for personalized guidance and support.',
  },
  {
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop',
    alt: 'A team collaborating around a table with laptops',
    heading: 'Your Journey Starts Here',
    subtext: 'Sign in, fill in your details, and access your personalized dashboard.',
    cta: true,
  },
];

// NEW: Success stories for the carousel
const successStories = [
    {
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop',
        alt: 'Portrait of Ravi K.',
        quote: "The games didn't just help my hand, they helped my spirit. For the first time in months, I felt hopeful.",
        name: 'Ravi K.',
        role: 'Stroke Patient',
        details: 'After his stroke, simple tasks were a struggle. Using NeuroRehab daily, Ravi improved his hand mobility by 40% in just 6 weeks, allowing him to cook for his family again.'
    },
    {
        image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop',
        alt: 'Portrait of Maria G.',
        quote: "Seeing the graphs go up was the motivation I needed. It turned a long recovery into a series of small wins.",
        name: 'Maria G.',
        role: 'Post-Surgery Rehab',
        details: 'Following a complex surgery, Maria used NeuroRehab to regain arm strength. The clear progress tracking helped her and her therapist make adjustments, speeding up her recovery by an estimated 25%.'
    }
];


// Simple SVG Icon Components for "Approach" section
const IconEngaging = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconTrackable = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const IconPersonalized = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStory, setCurrentStory] = useState(0); // State for success story carousel

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const nextStory = () => {
    setCurrentStory((prev) => (prev === successStories.length - 1 ? 0 : prev + 1));
  };
  
   const prevStory = () => {
    setCurrentStory((prev) => (prev === 0 ? successStories.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 7000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);
  
  const StarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const ReviewCard: React.FC<{quote: string; name: string; role: string; rating: number}> = ({ quote, name, role, rating }) => (
      <Card className="flex flex-col h-full bg-white transition-transform duration-300 hover:-translate-y-2">
          <div className="flex mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`} />
            ))}
          </div>
          <blockquote className="text-slate-600 italic mb-4 flex-grow">"{quote}"</blockquote>
          <div>
            <p className="font-bold text-brand-dark">{name}</p>
            <p className="text-sm text-slate-500">{role}</p>
          </div>
      </Card>
  );

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
      <Header onNavigate={onNavigate} />
      <main>
        {/* Hero Carousel Section */}
        <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden text-white">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          ))}

          <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left">
             <div className="max-w-xl bg-black/40 backdrop-blur-sm p-8 rounded-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{slides[currentSlide].heading}</h1>
                <p className="text-lg md:text-xl mb-8">{slides[currentSlide].subtext}</p>
                {slides[currentSlide].cta && (
                    <Button onClick={() => onNavigate(Page.SignIn)} variant="primary" className="text-lg">
                        Get Started →
                    </Button>
                )}
             </div>
          </div>
          
           {/* Navigation */}
            <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50'}`}></button>
                ))}
            </div>
        </section>

        {/* A Gentle Path to Recovery Section */}
        <section className="py-20 bg-brand-light animate-fade-in">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">A Gentle Path to Recovery</h2>
                    <p className="mt-4 text-lg text-slate-600">Our approach is built on three core principles to make your rehabilitation journey as smooth and effective as possible.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                    <Card className="transition-transform duration-300 hover:-translate-y-2">
                        <div className="flex justify-center items-center h-16 w-16 bg-blue-100 rounded-full mx-auto mb-4">
                           <IconEngaging />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark">Engaging & Fun</h3>
                        <p className="text-slate-600 mt-2">Therapeutic games designed to keep you motivated and challenged.</p>
                    </Card>
                    <Card className="transition-transform duration-300 hover:-translate-y-2">
                         <div className="flex justify-center items-center h-16 w-16 bg-blue-100 rounded-full mx-auto mb-4">
                           <IconTrackable />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark">Clearly Trackable</h3>
                        <p className="text-slate-600 mt-2">Watch your skills improve with easy-to-understand progress charts.</p>
                    </Card>
                    <Card className="transition-transform duration-300 hover:-translate-y-2">
                         <div className="flex justify-center items-center h-16 w-16 bg-blue-100 rounded-full mx-auto mb-4">
                           <IconPersonalized />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark">Fully Personalized</h3>
                        <p className="text-slate-600 mt-2">Your plan adapts to your unique needs and goals, guided by your doctor.</p>
                    </Card>
                </div>
            </div>
        </section>

        {/* Success Story Spotlight Section */}
        <section className="py-20 bg-white animate-fade-in">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Success Story Spotlight</h2>
                    <p className="mt-4 text-lg text-slate-600">See the real-world impact of a consistent and engaging recovery plan.</p>
                </div>
                <div className="relative mt-12 max-w-4xl mx-auto">
                    <div className="overflow-hidden">
                        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentStory * 100}%)` }}>
                            {successStories.map((story, index) => (
                                <div key={index} className="w-full flex-shrink-0">
                                    <Card className="grid md:grid-cols-3 gap-8 items-center">
                                        <img src={story.image} alt={story.alt} className="w-full h-48 md:h-full object-cover rounded-lg"/>
                                        <div className="md:col-span-2">
                                            <p className="text-lg italic text-slate-700">"{story.quote}"</p>
                                            <p className="font-bold text-brand-dark mt-4">{story.name}, <span className="font-normal text-slate-500">{story.role}</span></p>
                                            <p className="text-slate-600 mt-2">{story.details}</p>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                     <button onClick={prevStory} className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors text-slate-800 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={nextStory} className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors text-slate-800 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </section>


        {/* Words of Encouragement Section */}
        <section className="py-20 bg-slate-50 animate-fade-in">
             <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Words of Encouragement</h2>
                    <p className="mt-4 text-lg text-slate-600">Hear from patients and doctors who have experienced the NeuroRehab difference.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                     <ReviewCard 
                        rating={5}
                        quote="The games kept me motivated throughout my recovery. I can now move my hand much better!"
                        name="Ravi S."
                        role="Stroke Patient"
                    />
                    <ReviewCard 
                        rating={5}
                        quote="It’s so easy to monitor my patients. I can quickly see who needs extra attention."
                        name="Dr. Mehta"
                        role="Physiotherapist"
                    />
                    <ReviewCard 
                        rating={5}
                        quote="NeuroRehab feels like a friendly coach guiding me every day. The AI insights are surprisingly helpful!"
                        name="Anjali P."
                        role="Patient"
                    />
                </div>
             </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
