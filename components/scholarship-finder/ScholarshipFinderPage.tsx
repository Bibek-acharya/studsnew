import React from "react";
import ScholarshipMainPage from "./ScholarshipMainPage";

interface ScholarshipFinderPageProps {
  onNavigate: (view: any, data?: any) => void;
}

const ScholarshipFinderPage: React.FC<ScholarshipFinderPageProps> = ({ onNavigate }) => {
  return <ScholarshipMainPage onNavigate={onNavigate} />;
};

export default ScholarshipFinderPage;
