import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Button from './ui/Button';
import { Page, BlogPost } from '../types';

interface BlogPostPageProps {
  post: BlogPost;
  onNavigate: (page: Page) => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onNavigate }) => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header onNavigate={onNavigate} />
      <main className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Button variant="outline" onClick={() => onNavigate(Page.Blog)} className="mb-8">
              &larr; Back to Blog
            </Button>
            
            {/* Post Header */}
            <div className="text-center mb-10">
              <p className="text-brand-primary font-semibold">{post.category}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2">{post.title}</h1>
              <p className="text-slate-500 mt-4">
                By <span className="font-medium text-slate-700">{post.author}</span> &bull; Published on {post.date}
              </p>
            </div>
            
            {/* Featured Image */}
            <img src={post.image} alt={post.title} className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg mb-10" />
            
            {/* Post Content */}
            <article 
              className="prose lg:prose-xl max-w-none text-slate-700 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-12 border-t pt-8 text-center">
                 <Button onClick={() => onNavigate(Page.Blog)}>
                    Explore More Articles
                </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
      <style>{`
        .prose h3 {
            color: #03045e;
        }
        .prose p {
            margin-bottom: 1.25em;
        }
      `}</style>
    </div>
  );
};

export default BlogPostPage;
