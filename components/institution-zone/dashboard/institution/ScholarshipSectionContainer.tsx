"use client";
import React, { useState } from 'react';
import ScholarshipManagePage from './ScholarshipManagePage';
import ScholarshipCreatePage from './ScholarshipCreatePage';

const ScholarshipSectionContainer: React.FC = () => {
  const [view, setView] = useState<'manage' | 'create' | 'edit'>('manage');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleCreateNew = () => {
    setEditingId(null);
    setView('create');
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setView('edit');
  };

  const handleBack = () => {
    setView('manage');
    setEditingId(null);
  };

  if (view === 'create' || view === 'edit') {
    return <ScholarshipCreatePage onBack={handleBack} scholarshipId={editingId} />;
  }

  return <ScholarshipManagePage onCreateNew={handleCreateNew} onEdit={handleEdit} />;
};

export default ScholarshipSectionContainer;
