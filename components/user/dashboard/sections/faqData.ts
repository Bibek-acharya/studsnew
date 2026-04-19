'use client'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQCategory {
  id: string
  label: string
  description: string
  items: FAQItem[]
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'account',
    label: 'Account',
    description: 'Manage your profile, login methods, and account preferences.',
    items: [
      {
        question: 'How do I reset my password?',
        answer:
          'Go to the Security section and choose Change Password. If you can’t log in, use the password reset link on the login page and follow the instructions sent to your email.',
      },
      {
        question: 'Can I update my email address?',
        answer:
          'Yes. Navigate to your account settings and update your primary email address. You may need to verify the new address before it becomes active.',
      },
      {
        question: 'How do I change my display name?',
        answer:
          'Open the Profile section and edit your name fields. Save your changes to update how your name appears across the platform.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'Account deletion is available in the Danger Zone section. Follow the prompts carefully, as deletion is permanent and will remove all application history and saved preferences.',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Control your password, two-factor authentication, and account safety settings.',
    items: [
      {
        question: 'What is two-factor authentication?',
        answer:
          'Two-factor authentication adds an extra security step by requiring a code in addition to your password when signing in. This helps protect your account from unauthorized access.',
      },
      {
        question: 'How do I turn on two-factor authentication?',
        answer:
          'Go to the Security tab and enable two-factor authentication. Choose whether to receive codes by email or through an authenticator app, then follow the setup prompts.',
      },
      {
        question: 'How can I tell if my account was accessed from a new device?',
        answer:
          'We send alerts for sign-ins from new devices or locations. Check your email notifications or the Security tab for recent login activity.',
      },
      {
        question: 'What should I do if I suspect a security breach?',
        answer:
          'Immediately reset your password, enable two-factor authentication, and contact support using the Help & Support tab to report the issue.',
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Learn how to manage alerts for applications, scholarships, and platform updates.',
    items: [
      {
        question: 'Can I change my email notification preferences?',
        answer:
          'Yes. Visit the Notifications section to toggle alerts for application updates, messages from colleges, scholarship opportunities, and daily email digests.',
      },
      {
        question: 'How do I stop push notifications?',
        answer:
          'If you are using a mobile device, disable push notifications from your device settings or in the app notification preferences. You can also turn off specific notification types in the Notifications section.',
      },
      {
        question: 'What are scholarship alert notifications?',
        answer:
          'Scholarship alert notifications tell you when a new scholarship matches your profile or when a deadline is approaching. These help you stay on top of new opportunities.',
      },
      {
        question: 'Why am I not receiving notification emails?',
        answer:
          'Check that your email is verified, your notification preferences are enabled, and the messages are not in spam. If the issue persists, contact support through Help & Support.',
      },
    ],
  },
  {
    id: 'applications',
    label: 'Applications',
    description: 'Get answers about applying to colleges, entrance exams, and scholarship tracking.',
    items: [
      {
        question: 'How do I track my application status?',
        answer:
          'Use the Applications page to view the status of each submission, including applied, shortlisted, interview, accepted, or rejected stages.',
      },
      {
        question: 'Can I apply to multiple colleges at once?',
        answer:
          'Yes. You can submit applications to multiple colleges. Each submission is tracked separately in the Applications dashboard.',
      },
      {
        question: 'How do I upload required documents?',
        answer:
          'Open the relevant application and follow the document upload prompts. Accepted file types are listed on the application details page.',
      },
      {
        question: 'What does shortlisted mean?',
        answer:
          'Shortlisted means your application has passed initial review and the institution is considering you for the next stage, such as an interview or final decision.',
      },
    ],
  },
  {
    id: 'scholarships',
    label: 'Scholarships',
    description: 'Find out how scholarship recommendations work and how to apply for awards.',
    items: [
      {
        question: 'How do scholarship recommendations work?',
        answer:
          'We match scholarship opportunities to your profile based on factors like country preference, academic field, budget, and eligibility criteria.',
      },
      {
        question: 'Can I save scholarships for later?',
        answer:
          'Yes. Use the save action in the scholarship results to bookmark opportunities and return to them later from your saved list.',
      },
      {
        question: 'How do I apply for a scholarship?',
        answer:
          'Open the scholarship details page and follow the application instructions. Some scholarships require external forms or provider portals.',
      },
      {
        question: 'How do I know when a scholarship deadline is near?',
        answer:
          'Enable scholarship alerts in Notifications. We also display deadlines prominently on the scholarship details page and in your saved list.',
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    description: 'Contact support, report issues, and find help resources for using the site.',
    items: [
      {
        question: 'How do I contact support?',
        answer:
          'Use the Help & Support section to send a message or report a bug. Our team will respond by email or through your dashboard notifications.',
      },
      {
        question: 'How do I submit a bug report?',
        answer:
          'Open Help & Support, choose Report a Problem, describe the issue, and submit. Include screenshots if possible for faster resolution.',
      },
      {
        question: 'Where can I find user guides?',
        answer:
          'We provide help content within the FAQ and Support sections. For more detailed guidance, check the Help Center or contact support directly.',
      },
      {
        question: 'How long does support take to respond?',
        answer:
          'Response times vary, but support typically replies within 24–48 hours. Urgent issues may receive priority if marked clearly in your message.',
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical',
    description: 'Find help for browser issues, login problems, and compatibility questions.',
    items: [
      {
        question: 'What browsers are supported?',
        answer:
          'The platform works best in the latest versions of Chrome, Edge, Firefox, and Safari. Make sure your browser is up to date for the best experience.',
      },
      {
        question: 'Why is my page loading slowly?',
        answer:
          'Slow performance can be caused by a weak internet connection, too many browser tabs, or an unsupported browser. Clear your cache and try again.',
      },
      {
        question: 'How do I fix broken page layout?',
        answer:
          'Try refreshing the page, clearing browser cache, or using a different browser. If the issue persists, report it through Help & Support.',
      },
      {
        question: 'Can I use the platform on mobile?',
        answer:
          'Yes. The dashboard is responsive and supports mobile browsers, though some features work best on a larger screen.',
      },
    ],
  },
]
