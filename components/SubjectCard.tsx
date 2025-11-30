
import React from 'react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onClick: (subject: Subject) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  return (
    <div 
      onClick={() => onClick(subject)}
      className={`relative overflow-hidden rounded-3xl shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group bg-white border-b-4 ${subject.colorClass}`}
    >
      <div className={`h-32 ${subject.headerColor} flex items-center justify-center relative overflow-hidden`}>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-20"></div>
        
        <div className="relative transform group-hover:scale-110 transition-transform duration-300">
            <span className="text-7xl drop-shadow-md filter grayscale-0 block">
              {subject.icon}
            </span>

            {/* Specific Overlay for English Subject: "DICTIONARY" Label */}
            {subject.id === 'english' && (
                <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 pointer-events-none">
                    <span className="text-black text-[7px] font-black tracking-tighter font-sans opacity-100 transform scale-x-90">
                        DICTIONARY
                    </span>
                </div>
            )}
        </div>
      </div>
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold mb-2 font-handwritten tracking-wide">{subject.title}</h3>
        <span className="text-sm font-semibold opacity-70">Derse Git &rarr;</span>
      </div>
    </div>
  );
};

export default SubjectCard;
