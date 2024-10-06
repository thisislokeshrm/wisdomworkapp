// src/components/Card.tsx
"use client";

interface CardProps {
    title: string;
    description: string;
    progress?: number; // Optional for progress display
    category: 'courses' | 'projects' | 'jobs';
  }
  
  const Card = ({ title, description, progress, category }: CardProps) => {
    return (
      <div className="card border rounded-lg p-4 bg-white shadow-md">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        
        {category === 'courses' && progress !== undefined && (
          <div className="progress mt-2">
            <label className="text-sm text-gray-500">Progress: {progress}%</label>
            <div className="w-full bg-gray-300 rounded-full h-2.5 mt-1">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
        
        <button className="mt-4 text-blue-500">View Details</button>
      </div>
    );
  };
  
  export default Card;
  