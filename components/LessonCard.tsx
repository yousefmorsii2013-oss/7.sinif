import React from 'react';
import { Topic } from '../types';

interface LessonCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
  colorClass: string;
}

const LessonCard: React.FC<LessonCardProps> = ({ topic, onClick, colorClass }) => {
  return (
    <div 
      onClick={() => onClick(topic)}
      className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group bg-white`}
    >
      <div className={`h-24 ${colorClass} flex items-center justify-center`}>
        <span className="text-5xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
          {topic.icon}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 font-handwritten">{topic.title}</h3>
        <p className="text-gray-600 text-sm">{topic.description}</p>
        <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm">
          Derse Başla &rarr;
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
