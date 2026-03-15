import React, { useEffect, useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BlogCard = ({ title, content }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-600">{title}</h3>
            <div className="prose max-w-none text-sm sm:text-base">
                <p className="mb-4">{content.introduction}</p>
                {content.codeExample && (
                    <div className="bg-gray-100 p-3 sm:p-4 rounded-md mb-4 overflow-x-auto">
                        <pre className="text-xs sm:text-sm">
                            <code>{content.codeExample}</code>
                        </pre>
                    </div>
                )}
                {content.keyPoints && (
                    <>
                        <p>Key points:</p>
                        <ul className="list-disc pl-6 mb-4">
                            {content.keyPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </>
                )}
                {content.useCases && (
                    <>
                        <p>Common use cases:</p>
                        <ul className="list-disc pl-6 mb-4">
                            {content.useCases.map((useCase, index) => (
                                <li key={index}>{useCase}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    useDocumentTitle('Blogs');

    useEffect(() => {
        fetch('/Data/blogs.json')
            .then(res => res.json())
            .then(data => {
                setBlogs(data.blogs);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-bars loading-lg text-blue-600"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
            <h2 className="text-xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">React Concepts Explained</h2>
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                {blogs.map(blog => (
                    <BlogCard key={blog.id} title={blog.title} content={blog.content} />
                ))}
            </div>
        </div>
    );
};

export default Blogs;