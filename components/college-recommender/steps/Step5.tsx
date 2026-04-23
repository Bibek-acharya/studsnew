'use client'

import React from 'react'
import { CollegeRecommenderForm } from '../CollegeRecommenderToolPage'
import StepWrapper from './StepWrapper'

interface Step5Props {
  step: number
  stepImages: Record<number, string>
  form: CollegeRecommenderForm
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void
  stepTitles: Record<number, string>
  canContinue: (step: number) => boolean
  setStep: (step: number) => void
  stepCount?: number
}

const renderOption = (
  checked: boolean,
  onClick: () => void,
  label: string,
) => (
  <button
    type='button'
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center rounded-md border-2 border-[#e2e8f0] bg-white p-5 transition-all duration-200 ${
      checked
        ? 'border-brand-blue bg-brand-blue/10'
        : ''
    }`}
  >
    <div
      className={`mr-4 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-sm border-2 border-[#e2e8f0] transition-all duration-200 ${
        checked ? 'border-brand-blue bg-brand-blue' : 'bg-white'
      }`}
    >
      {checked && (
        <div className='relative h-2.5 w-1 border-white border-r-2 border-b-2' style={{ transform: 'rotate(45deg)', marginBottom: '2px' }} />
      )}
    </div>
    <span
      className={`text-[17px] font-medium text-black' `}
    >
      {label}
    </span>
  </button>
)

export default function Step5({ step, stepImages, form, handleInputChange, stepTitles, canContinue, setStep, stepCount = 10 }: Step5Props) {
  return (
    <StepWrapper step={step} stepImages={stepImages} imageSize={300} maxWidth='max-w-70 lg:max-w-100'>
      <div className='mb-6'>
        <h1 className='mb-2 text-2xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[2rem]'>
          {stepTitles[step]}
        </h1>
      </div>

      <div className='animate-in fade-in slide-in-from-bottom-6 duration-700'>
        <div className='mt-8 space-y-4'>
          {renderOption(
            form.distance_from_home === 'I want to stay at home (Day scholar)',
            () => handleInputChange('distance_from_home', 'I want to stay at home (Day scholar)'),
            'I want to stay at home (Day scholar)',
          )}
          {renderOption(
            form.distance_from_home === 'Within 2–3 hours travel',
            () => handleInputChange('distance_from_home', 'Within 2–3 hours travel'),
            'Within 2–3 hours travel',
          )}
          {renderOption(
            form.distance_from_home === 'Different city but same province',
            () => handleInputChange('distance_from_home', 'Different city but same province'),
            'Different city but same province',
          )}
          {renderOption(
            form.distance_from_home === 'Anywhere in Nepal',
            () => handleInputChange('distance_from_home', 'Anywhere in Nepal'),
            'Anywhere in Nepal',
          )}
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
