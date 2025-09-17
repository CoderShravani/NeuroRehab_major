import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Card from './ui/Card';
import { Page, BlogPost } from '../types';

interface BlogPageProps {
  onNavigate: (page: Page) => void;
  onSelectPost: (post: BlogPost) => void;
}

const blogPosts: BlogPost[] = [
    {
        slug: '5-exercises-for-hand-mobility',
        title: '5 Simple Exercises to Improve Hand Mobility After a Stroke',
        author: 'Dr. Anya Sharma',
        date: 'July 15, 2024',
        category: 'Recovery Tips',
        image: 'https://images.unsplash.com/photo-1608889940330-99a37c35e39d?q=80&w=2070&auto=format&fit=crop',
        excerpt: 'Regaining hand function is a key goal for many stroke survivors. Here are five gentle exercises you can do at home to improve strength, coordination, and range of motion...',
        content: `
            <p>Regaining hand function is a key goal for many stroke survivors. Here are five gentle exercises you can do at home to improve strength, coordination, and range of motion. Remember to consult your doctor before starting any new exercise program.</p>
            <h3 class="text-xl font-bold mt-6 mb-2">1. Ball Squeeze</h3>
            <p>Gently squeeze a soft stress ball or a piece of foam. Hold for a few seconds, then relax. This helps in rebuilding grip strength. Repeat 10-15 times.</p>
            <h3 class="text-xl font-bold mt-6 mb-2">2. Finger Taps</h3>
            <p>Rest your hand on a table, palm down. One by one, lift each finger off the table as high as you can without straining, then lower it. This isolates and strengthens individual finger muscles.</p>
        `
    },
    {
        slug: 'neuroplasticity-explained',
        title: 'The Magic of Neuroplasticity: How Your Brain Can Rewire Itself',
        author: 'Dr. Ben Carter',
        date: 'July 10, 2024',
        category: 'Neuroscience',
        image: 'https://images.unsplash.com/photo-1530512533230-ae38027b14c1?q=80&w=2070&auto=format&fit=crop',
        excerpt: 'Neuroplasticity is the brain\'s amazing ability to reorganize itself by forming new neural connections. Discover how you can harness this power in your recovery journey...',
        content: `
            <p>Neuroplasticity is the brain's amazing ability to reorganize itself by forming new neural connections. This is the fundamental principle behind recovery from brain injury. Every time you practice a task, you are strengthening new pathways in your brain.</p>
            <h3 class="text-xl font-bold mt-6 mb-2">Consistency is Key</h3>
            <p>The more you repeat an action, the stronger the neural pathway for that action becomes. This is why consistent, daily practice with tools like NeuroRehab is so effective.</p>
        `
    },
    {
        slug: 'staying-motivated-in-rehab',
        title: 'How to Stay Motivated During Your Rehabilitation',
        author: 'Maria Garcia, Patient Advocate',
        date: 'July 5, 2024',
        category: 'Motivation',
        image: 'https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=1974&auto=format&fit=crop',
        excerpt: 'Rehabilitation is a marathon, not a sprint. It\'s normal for motivation to ebb and flow. Here are some practical tips to help you stay focused and positive on your path to recovery...',
        content: `
            <p>Rehabilitation is a marathon, not a sprint. It's normal for motivation to ebb and flow. Here are some practical tips to help you stay focused and positive on your path to recovery.</p>
            <h3 class="text-xl font-bold mt-6 mb-2">Set Small, Achievable Goals</h3>
            <p>Instead of focusing on the final outcome, break your journey down into small, weekly goals. Celebrating these small victories can provide a huge motivational boost.</p>
        `
    }
];


const BlogCard: React.FC<{ post: BlogPost; onClick: () => void }> = ({ post, onClick }) => (
    <Card onClick={onClick} className="cursor-pointer group overflow-hidden">
        <div className="relative">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute top-2 right-2 bg-brand-primary text-white text-xs font-semibold px-2 py-1 rounded-full">{post.category}</span>
        </div>
        <div className="p-4">
            <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{post.title}</h3>
            <p className="text-sm text-slate-500 mt-1">By {post.author} on {post.date}</p>
            <p className="text-slate-600 mt-3">{post.excerpt}</p>
        </div>
    </Card>
);


const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onSelectPost }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Header onNavigate={onNavigate} />
      <main>
        {/* Hero Section */}
        <section className="bg-brand-dark text-white py-20 text-center">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold">NeuroRehab Blog</h1>
                <p className="mt-4 text-lg text-brand-light max-w-2xl mx-auto">Insights, stories, and tips to support your recovery journey.</p>
            </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map(post => (
                        <BlogCard key={post.slug} post={post} onClick={() => onSelectPost(post)} />
                    ))}
                </div>
            </div>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default BlogPage;
