import { render, screen } from '@testing-library/react';
import ApplicationDetails from '../components/ScholarshipProvider/ApplicationDetails';

jest.mock('@/services/scholarshipProviderApi', () => ({
  scholarshipProviderApi: {
    getApplicationById: jest.fn(),
    updateApplicationStatus: jest.fn(),
  },
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left" />,
  Mail: () => <div data-testid="mail" />,
  Phone: () => <div data-testid="phone" />,
  GraduationCap: () => <div data-testid="graduation-cap" />,
  BookOpen: () => <div data-testid="book-open" />,
  Users: () => <div data-testid="users" />,
  FileText: () => <div data-testid="file-text" />,
  Check: () => <div data-testid="check" />,
  X: () => <div data-testid="x" />,
  Star: () => <div data-testid="star" />,
}));

describe('ApplicationDetails', () => {
  const mockApplication = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone_number: '+1234567890',
    status: 'pending',
    gender: 'Male',
    age: 22,
    school_type: 'Government',
    gpa: 3.5,
    stream: 'Science',
    exam_center: 'Kathmandu',
    province: 'Bagmati',
    created_at: '2025-01-01T00:00:00Z',
    personal_statement: 'My personal statement',
    documents: [
      { name: 'Transcript', url: 'https://example.com/transcript.pdf' },
      { name: 'Certificate', url: 'https://example.com/certificate.pdf' },
    ],
    scholarship: {
      title: 'Test Scholarship',
      value: '10000',
      funding_type: 'Full',
    },
  };

  it('displays personal statement', () => {
    render(
      <ApplicationDetails
        applicationId="1"
        onBack={() => {}}
      />
    );
    expect(screen.getByText('My personal statement')).toBeInTheDocument();
  });

  it('displays documents', () => {
    render(
      <ApplicationDetails
        applicationId="1"
        onBack={() => {}}
      />
    );
    expect(screen.getByText('Transcript')).toBeInTheDocument();
    expect(screen.getByText('Certificate')).toBeInTheDocument();
  });
});