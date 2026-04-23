'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { faqCategories } from './faqData'

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id)
  const category = faqCategories.find((item) => item.id === activeCategory) ?? faqCategories[0]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-6">
      <div className="bg-white rounded-md  border border-slate-200 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 text-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-50 p-3 text-indigo-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>
              <p className="text-sm text-slate-500">Answers to common questions about your student dashboard and account settings.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-md w-fit">
            {faqCategories.map((categoryItem) => (
              <button
                key={categoryItem.id}
                type="button"
                onClick={() => setActiveCategory(categoryItem.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  activeCategory === categoryItem.id
                    ? 'bg-white text-primary '
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {categoryItem.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-md bg-slate-50 px-5 py-4 border border-slate-200">
          <p className="text-sm text-slate-600">{category.description}</p>
        </div>

        <div className="space-y-4">
          {category.items.map((item, index) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isLast={index === category.items.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer, isLast }: { question: string; answer: string; isLast?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`${!isLast ? 'border-b border-slate-100' : ''} pb-4`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-slate-800 hover:text-indigo-600"
      >
        <div className="flex items-center gap-3 font-semibold">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>{question}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180 text-indigo-600' : ''}`} />
      </button>
      {open && <p className="pl-12 pr-4 text-sm text-slate-500 leading-7">{answer}</p>}
    </div>
  )
}
