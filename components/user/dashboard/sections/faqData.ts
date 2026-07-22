"use client";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  description: string;
  items: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: "account",
    label: "Account",
    description: "Manage your profile, login methods, and account preferences.",
    items: [
      {
        question: "How do I reset my password?",
        answer:
          "Go to the Security section and choose Change Password. If you can’t log in, use the password reset link on the login page and follow the instructions sent to your email.",
      },
      {
        question: "Can I update my email address?",
        answer:
          "Yes. Navigate to your account settings and update your primary email address. You may need to verify the new address before it becomes active.",
      },
      {
        question: "How do I change my display name?",
        answer:
          "Open the Profile section and edit your name fields. Save your changes to update how your name appears across the platform.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Account deletion is available in the Danger Zone section. Follow the prompts carefully, as deletion is permanent and will remove all application history and saved preferences.",
      },
    ],
  },
  {
    id: "security",
    label: "Security",
    description:
      "Control your password, two-factor authentication, and account safety settings.",
    items: [
      {
        question: "What is two-factor authentication?",
        answer:
          "Two-factor authentication adds an extra security step by requiring a code in addition to your password when signing in. This helps protect your account from unauthorized access.",
      },
      {
        question: "How do I turn on two-factor authentication?",
        answer:
          "Go to the Security tab and enable two-factor authentication. Choose whether to receive codes by email or through an authenticator app, then follow the setup prompts.",
      },
      {
        question:
          "How can I tell if my account was accessed from a new device?",
        answer:
          "We send alerts for sign-ins from new devices or locations. Check your email notifications or the Security tab for recent login activity.",
      },
      {
        question: "What should I do if I suspect a security breach?",
        answer:
          "Immediately reset your password, enable two-factor authentication, and contact support using the Help & Support tab to report the issue.",
      },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    description:
      "Learn how to manage alerts for applications, scholarships, and platform updates.",
    items: [
      {
        question: "Can I change my email notification preferences?",
        answer:
          "Yes. Visit the Notifications section to toggle alerts for application updates, messages from colleges, scholarship opportunities, and daily email digests.",
      },
      {
        question: "How do I stop push notifications?",
        answer:
          "If you are using a mobile device, disable push notifications from your device settings or in the app notification preferences. You can also turn off specific notification types in the Notifications section.",
      },
      {
        question: "What are scholarship alert notifications?",
        answer:
          "Scholarship alert notifications tell you when a new scholarship matches your profile or when a deadline is approaching. These help you stay on top of new opportunities.",
      },
      {
        question: "Why am I not receiving notification emails?",
        answer:
          "Check that your email is verified, your notification preferences are enabled, and the messages are not in spam. If the issue persists, contact support through Help & Support.",
      },
    ],
  },
  {
    id: "applications",
    label: "Applications",
    description:
      "Get answers about applying to colleges, entrance exams, and scholarship tracking.",
    items: [
      {
        question: "How do I track my application status?",
        answer:
          "Use the Applications page to view the status of each submission, including applied, shortlisted, interview, accepted, or rejected stages.",
      },
      {
        question: "Can I apply to multiple colleges at once?",
        answer:
          "Yes. You can submit applications to multiple colleges. Each submission is tracked separately in the Applications dashboard.",
      },
      {
        question: "How do I upload required documents?",
        answer:
          "Open the relevant application and follow the document upload prompts. Accepted file types are listed on the application details page.",
      },
      {
        question: "What does shortlisted mean?",
        answer:
          "Shortlisted means your application has passed initial review and the institution is considering you for the next stage, such as an interview or final decision.",
      },
    ],
  },
  {
    id: "scholarships",
    label: "Scholarships",
    description:
      "Find out how scholarship recommendations work and how to apply for awards.",
    items: [
      {
        question: "How do scholarship recommendations work?",
        answer:
          "We match scholarship opportunities to your profile based on factors like country preference, academic field, budget, and eligibility criteria.",
      },
      {
        question: "Can I save scholarships for later?",
        answer:
          "Yes. Use the save action in the scholarship results to bookmark opportunities and return to them later from your saved list.",
      },
      {
        question: "How do I apply for a scholarship?",
        answer:
          "Open the scholarship details page and follow the application instructions. Some scholarships require external forms or provider portals.",
      },
      {
        question: "How do I know when a scholarship deadline is near?",
        answer:
          "Enable scholarship alerts in Notifications. We also display deadlines prominently on the scholarship details page and in your saved list.",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    description:
      "Get help with account issues, technical problems, and how to contact us.",
    items: [
      {
        question: "How do I contact support?",
        answer:
          "You can reach our support team by clicking the 'Contact Support' button at the top of this page. Fill in the subject and message fields, and we'll respond to your registered email address within 24-48 hours.",
      },
      {
        question: "What are support response times?",
        answer:
          "Our team typically responds within 24 hours during business days. Urgent issues are prioritized and may receive a faster response.",
      },
      {
        question: "How do I report a bug?",
        answer:
          "Click the 'Report Bug' button at the top of this page. Select the problem area and describe the issue in detail, including steps to reproduce it if possible.",
      },
      {
        question: "Can I get phone support?",
        answer:
          "Currently we offer support via email and through our contact form. Phone support is not available at this time.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    description: "Troubleshooting common technical issues with the platform.",
    items: [
      {
        question: "Why am I not receiving email notifications?",
        answer:
          "Check your spam/junk folder first. If nothing is there, verify your email address is correct in your profile settings. You can also check your notification preferences to ensure you have the right notifications enabled.",
      },
      {
        question: "The page is not loading properly. What should I do?",
        answer:
          "Try clearing your browser cache and cookies, then refresh the page. If the issue persists, try a different browser or use incognito/private mode.",
      },
      {
        question: "Why was I logged out unexpectedly?",
        answer:
          "For security purposes, you may be logged out after a period of inactivity. Simply log back in to continue. If this happens frequently, check that your browser allows cookies.",
      },
      {
        question: "How do I update the app?",
        answer:
          "This is a web application, so it updates automatically. Just refresh your browser to get the latest version.",
      },
    ],
  },
];
