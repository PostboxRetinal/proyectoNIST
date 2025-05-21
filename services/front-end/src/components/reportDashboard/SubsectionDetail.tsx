import React from 'react';
import { Subsection } from '../createAuditForm/types';
import QuestionItem from './QuestionItem';

interface SubsectionDetailProps {
  subsection: Subsection;
}

const SubsectionDetail: React.FC<SubsectionDetailProps> = ({ subsection }) => {
  return (
    <div className="mb-4 pl-4 border-l-2 border-gray-200">
      <h4 className="text-lg font-medium mb-2">
        {subsection.subsection}: {subsection.title}
      </h4>
      
      <ul className="space-y-3">
        {subsection.questions.map((question) => (
          <QuestionItem key={question.id} question={question} />
        ))}
      </ul>
    </div>
  );
};

export default SubsectionDetail;