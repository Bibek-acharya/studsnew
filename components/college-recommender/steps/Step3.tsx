'use client'

import React from 'react'
import { CollegeRecommenderForm } from '../CollegeRecommenderToolPage'
import Dropdown from '../Dropdown'
import StepWrapper from './StepWrapper'

interface Step3Props {
  step: number
  stepImages: Record<number, string>
  form: CollegeRecommenderForm
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void
  stepTitles: Record<number, string>
  canContinue: (step: number) => boolean
  setStep: (step: number) => void
  stepCount?: number
}

const renderPillOption = (
  checked: boolean,
  onClick: () => void,
  label: string,
) => (
  <button
    type='button'
    onClick={onClick}
    className={`rounded-md border-2 border-[#e2e8f0] bg-white px-5 py-3 text-base font-medium text-[#0f172a] transition-all duration-200  ${
      checked
        ? 'border-brand-blue bg-brand-blue/10 text-black font-semibold'
        : ''
    }`}
  >
    {label}
  </button>
)

export default function Step3({ step, stepImages, form, handleInputChange, stepTitles, canContinue, setStep, stepCount = 10 }: Step3Props) {
  return (
    <StepWrapper step={step} stepImages={stepImages} imageSize={500} maxWidth='max-w-100 lg:max-w-150'>
      <div className='mb-6'>
        <h1 className='mb-2 text-2xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[2rem]'>
          {stepTitles[step]}
        </h1>
      </div>

      <div className='animate-in fade-in slide-in-from-bottom-6 duration-700'>
        <div className='mt-4 space-y-8'>
          <div className='space-y-4'>
            <p className='text-[17px] font-semibold text-[#0f172a]'>
              Do you know what you want to study?
            </p>
            <div className='flex flex-wrap gap-3'>
              {renderPillOption(
                form.knows_course === 'Yes',
                () => handleInputChange('knows_course', 'Yes'),
                'Yes, I know my course',
              )}
              {renderPillOption(
                form.knows_course === 'Not sure',
                () => {
                  handleInputChange('knows_course', 'Not sure')
                  handleInputChange('preferred_field', '')
                },
                'Not sure yet',
              )}
            </div>
          </div>

          {form.knows_course === 'Yes' && (
            <div className='space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300'>
              <p className='text-[17px] font-semibold text-[#0f172a]'>
                Select your preferred field:
              </p>
              <Dropdown
                value={form.preferred_field || ''}
                onChange={(val) => handleInputChange('preferred_field', val)}
                options={[
                  { value: 'Management & Business', label: 'Management & Business' },
                  { value: 'Accounting & Finance', label: 'Accounting & Finance' },
                  { value: 'Computer Science & Information Technology', label: 'Computer Science & Information Technology' },
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Science & Mathematics', label: 'Science & Mathematics' },
                  { value: 'Medicine & Health Sciences', label: 'Medicine & Health Sciences' },
                  { value: 'Nursing', label: 'Nursing' },
                  { value: 'Pharmacy', label: 'Pharmacy' },
                  { value: 'Dentistry', label: 'Dentistry' },
                  { value: 'Ayurveda & Alternative Medicine', label: 'Ayurveda & Alternative Medicine' },
                  { value: 'Agriculture', label: 'Agriculture' },
                  { value: 'Veterinary & Animal Science', label: 'Veterinary & Animal Science' },
                  { value: 'Forestry & Environmental Studies', label: 'Forestry & Environmental Studies' },
                  { value: 'Education & Teaching', label: 'Education & Teaching' },
                  { value: 'Humanities', label: 'Humanities' },
                  { value: 'Social Sciences', label: 'Social Sciences' },
                  { value: 'Law & Legal Studies', label: 'Law & Legal Studies' },
                  { value: 'Economics', label: 'Economics' },
                  { value: 'Hospitality & Hotel Management', label: 'Hospitality & Hotel Management' },
                  { value: 'Travel & Tourism', label: 'Travel & Tourism' },
                  { value: 'Architecture, Design & Planning', label: 'Architecture, Design & Planning' },
                  { value: 'Media & Communication', label: 'Media & Communication' },
                  { value: 'Arts & Fine Arts', label: 'Arts & Fine Arts' },
                  { value: 'Fashion & Textile', label: 'Fashion & Textile' },
                  { value: 'Aviation', label: 'Aviation' },
                  { value: 'Sports & Physical Education', label: 'Sports & Physical Education' },
                  { value: 'Library & Information Science', label: 'Library & Information Science' },
                  { value: 'Languages & Literature', label: 'Languages & Literature' },
                  { value: 'Public Administration & Governance', label: 'Public Administration & Governance' },
                  { value: 'Development Studies', label: 'Development Studies' },
                  { value: 'Disaster & Risk Management', label: 'Disaster & Risk Management' },
                  { value: 'Maritime / Marine Studies', label: 'Maritime / Marine Studies' },
                  { value: 'Food & Nutrition', label: 'Food & Nutrition' },
                  { value: 'Religious & Cultural Studies', label: 'Religious & Cultural Studies' },
                  { value: 'Security & Defence Studies', label: 'Security & Defence Studies' },
                  { value: 'Technical & Vocational', label: 'Technical & Vocational' },
                  { value: 'Professional Studies', label: 'Professional Studies' },
                  { value: 'Language & Test Preparation', label: 'Language & Test Preparation' },
                  { value: 'Skill & Short-Term Courses', label: 'Skill & Short-Term Courses' },
                  { value: 'Other / Interdisciplinary', label: 'Other / Interdisciplinary' },
                ]}
                placeholder='Search or select your preferred field'
              />
            </div>
          )}

          <div className='space-y-4'>
            <p className='text-[17px] font-semibold text-[#0f172a]'>
              Is college reputation important to you?
            </p>
            <div className='flex flex-wrap gap-3'>
              {renderPillOption(
                form.reputation_importance === 'Yes',
                () => handleInputChange('reputation_importance', 'Yes'),
                'Yes, very important',
              )}
              {renderPillOption(
                form.reputation_importance === 'Somewhat',
                () => handleInputChange('reputation_importance', 'Somewhat'),
                'Somewhat',
              )}
              {renderPillOption(
                form.reputation_importance === 'No',
                () => handleInputChange('reputation_importance', 'No'),
                'Not important',
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 flex items-center gap-4'>
        {step > 1 && (
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className='rounded-md border border-[#cbd5e1] bg-white px-8 py-3.5 text-sm font-semibold text-[#475569] transition-all duration-300 hover:border-[#0f172a] hover:text-[#0f172a]'
          >
            Back
          </button>
        )}
        {step < stepCount ? (
          <button
            onClick={() => setStep(Math.min(stepCount, step + 1))}
            disabled={!canContinue(step)}
            className={`rounded-md px-8 py-3.5 text-sm font-semibold transition-all duration-300 ${
              canContinue(step)
                ? 'cursor-pointer bg-brand-blue text-white hover:bg-brand-hover'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            Continue
          </button>
        ) : (
          <button
            disabled={!canContinue(step)}
            className={`rounded-md px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1d4ed8] ${
              canContinue(step)
                ? 'bg-brand-blue cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Find Colleges
          </button>
        )}
      </div>
    </StepWrapper>
  )
}
