'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { CollegeRecommenderForm, studentTypeOptions } from '../CollegeRecommenderToolPage'
import StepWrapper from './StepWrapper'

interface Step1Props {
  step: number
  stepImages: Record<number, string>
  form: CollegeRecommenderForm
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void
  stepTitles: Record<number, string>
  canContinue: (step: number) => boolean
  setStep: (step: number) => void
  stepCount?: number
}

export default function Step1({ step, stepImages, form, handleInputChange, stepTitles, canContinue, setStep, stepCount = 10 }: Step1Props) {
  return (
    <StepWrapper step={step} stepImages={stepImages}>
      <div className='mb-6'>
        <h1 className='mb-2 text-2xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[2rem]'>
          {stepTitles[step]}
        </h1>
      </div>

      <div className='animate-in fade-in slide-in-from-bottom-6 duration-700'>
        <div className='mt-4 grid gap-5 sm:grid-cols-2'>
          {studentTypeOptions.map((option) => (
            <label
              key={option.id}
              className={`group relative flex cursor-pointer flex-col rounded-md border-2 p-7 transition-all duration-300 ${
                form.student_type === option.id
                  ? 'border-brand-blue bg-white'
                  : 'border-slate-100 bg-white hover:border-brand-blue'
              }`}
            >
              <input
                type='radio'
                name='student_type'
                className='sr-only'
                checked={form.student_type === option.id}
                onChange={() =>
                  handleInputChange('student_type', option.id)
                }
              />
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-md transition-all duration-300 ${
                  form.student_type === option.id
                    ? 'bg-brand-blue text-white'
                    : 'bg-slate-50 text-slate-400 group-hover:bg-brand-blue/10 group-hover:text-brand-blue'
                }`}
              >
                <option.icon className='h-7 w-7' />
              </div>
              <h3 className='mt-6 text-xl font-bold text-slate-900 leading-tight'>
                {option.title}
              </h3>
              <p className='mt-3 text-[15px] leading-relaxed text-slate-500 group-hover:text-slate-600 '>
                {option.description}
              </p>
              <div
                className={`absolute top-7 right-7 flex h-7 w-7 items-center justify-center rounded-md border-2 transition-all duration-500 ${
                  form.student_type === option.id
                    ? 'border-brand-blue bg-brand-blue scale-100'
                    : 'border-slate-100 bg-white scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                }`}
              >
                <Check
                  className={`h-4 w-4 text-white transition-all duration-300 ${
                    form.student_type === option.id
                      ? 'scale-100'
                      : 'scale-50 opacity-0'
                  }`}
                />
              </div>
            </label>
          ))}
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
