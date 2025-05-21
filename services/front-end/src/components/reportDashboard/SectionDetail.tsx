import React from 'react';
import { Section } from '../createAuditForm/types';
import SubsectionDetail from './SubsectionDetail';

interface SectionDetailProps {
  section: Section;
}

const SectionDetail: React.FC<SectionDetailProps> = ({ section }) => {
  return (
    <div className="mb-6 p-4 border rounded-lg">
      <h3 className="text-xl font-semibold mb-3">
        {section.section}: {section.title}
      </h3>
      
      {section.subsections.map((subsection) => (
        <SubsectionDetail key={subsection.subsection} subsection={subsection} />
      ))}
    </div>
  );
};

export default SectionDetail;