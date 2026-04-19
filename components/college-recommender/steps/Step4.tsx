'use client'

import React from 'react'
import { CollegeRecommenderForm } from '../CollegeRecommenderToolPage'
import Dropdown from '../Dropdown'
import StepWrapper from './StepWrapper'
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from '@/lib/location-data'

interface Step4Props {
  step: number
  stepImages: Record<number, string>
  form: CollegeRecommenderForm
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void
  stepTitles: Record<number, string>
  canContinue: (step: number) => boolean
  setStep: (step: number) => void
  stepCount?: number
}

export default function Step4({ step, stepImages, form, handleInputChange, stepTitles, canContinue, setStep, stepCount = 10 }: Step4Props) {
  return (
    <StepWrapper step={step} stepImages={stepImages} imageSize={300} maxWidth='max-w-70 lg:max-w-100'>
      <div className='mb-6'>
        <h1 className='mb-2 text-2xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[2rem]'>
          {stepTitles[step]}
        </h1>
      </div>

      <div className='animate-in fade-in slide-in-from-bottom-6 duration-700'>
        <div className='mt-8 space-y-8'>
          <div className='space-y-4'>
            <p className='text-[17px] font-semibold text-[#0f172a]'>
              Which province do you prefer?
            </p>
            <Dropdown
              value={form.province || ''}
              onChange={(val) => {
                handleInputChange('province', val)
                handleInputChange('district', '')
              }}
              options={[...NEPAL_PROVINCES, 'No preference']}
              placeholder='Search or select your province'
            />
          </div>

          <div className='space-y-4'>
            <p className='text-[17px] font-semibold text-[#0f172a]'>
              Which district is closest to your preference?
            </p>
            <Dropdown
              value={form.district || ''}
              onChange={(val) => handleInputChange('district', val)}
              options={
                form.province && form.province !== 'No preference'
                  ? NEPAL_DISTRICTS[form.province as keyof typeof NEPAL_DISTRICTS] || []
                  : []
              }
              placeholder={
                form.province && form.province !== 'No preference'
                  ? 'Search or select your district'
                  : 'Select province first'
              }
            />
          </div>

        </div>
      </div>

      <div className='mt-8 flex items-center gap-4'>
        {step > 1 && (
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className='rounded-lg border border-[#cbd5e1] bg-white px-8 py-3.5 text-sm font-semibold text-[#475569] transition-all duration-300 hover:border-[#0f172a] hover:text-[#0f172a]'
          >
            Back
          </button>
        )}
        {step < stepCount ? (
          <button
            onClick={() => setStep(Math.min(stepCount, step + 1))}
            disabled={!canContinue(step)}
            className={`rounded-lg px-8 py-3.5 text-sm font-semibold transition-all duration-300 ${
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
            className={`rounded-lg px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1d4ed8] ${
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
