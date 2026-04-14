'use client'

import React from 'react'
import Image from 'next/image'

interface StepWrapperProps {
  step: number
  stepImages: Record<number, string>
  children: React.ReactNode
  imageSize?: number
  maxWidth?: string
}

export default function StepWrapper({ step, stepImages, children, imageSize = 400, maxWidth = 'max-w-80 lg:max-w-120' }: StepWrapperProps) {
  return (
    <div className='flex flex-col overflow-visible bg-white text-slate-800 lg:flex-row w-full max-w-350 mx-auto'>
      <div className='hidden h-full items-center justify-start bg-white lg:flex lg:w-1/2'>
        <div className={`relative z-10 w-full ${maxWidth} flex items-center justify-center h-full`}>
          <Image
            src={stepImages[step] || '/foucs.svg'}
            alt='Step illustration'
            width={imageSize}
            height={imageSize}
            className='h-auto w-full object-contain transition-all duration-500'
          />
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-between overflow-y-visible pl-4 py-8 lg:pt-20 w-full'>
        <div className='w-full'>
          {children}
        </div>
      </div>
    </div>
  )
}
