import { ScenarioConfig, ScenarioId } from '../types/support';

export const SCENARIOS: Record<ScenarioId, ScenarioConfig> = {
  retail: {
    id: 'retail',
    label: 'Retail Store',
    companyName: 'Northwind Goods',
    greeting:
      'Hello, I am Linden for Northwind Goods. Ask about an order like #HB-4092, return windows, or shipping timelines.',
    starterQuestions: [
      'Where is my order #HB-4092?',
      'Can I return an opened ceramic set?',
      'I need a refund exception after 30 days',
    ],
    policyNote: '30-day unused return policy · Sample orders #HB-4092 & #HB-4108 loaded',
  },
  saas: {
    id: 'saas',
    label: 'SaaS Billing',
    companyName: 'RelayDesk',
    greeting:
      'Hello, I am Linden for RelayDesk billing support. Ask about updating payment cards, seat proration, or downloading invoices.',
    starterQuestions: [
      'How do I update my billing card?',
      'What happens if I add 3 seats mid-month?',
      'I spotted a duplicate charge on my invoice',
    ],
    policyNote: 'Prorated seat billing · PDF invoices issued on the 1st',
  },
  booking: {
    id: 'booking',
    label: 'Booking Desk',
    companyName: 'Harbor Studio',
    greeting:
      'Hello, I am Linden for Harbor Studio. Ask about reservation #BK-884, rescheduling rules, or parking before your visit.',
    starterQuestions: [
      'Check details for booking #BK-884',
      'What is the late cancellation fee?',
      'Book a private group session for 6 people',
    ],
    policyNote: 'Free reschedule 12h+ prior · Sample reservation #BK-884 loaded',
  },
};

export const CAPABILITIES = [
  {
    index: '01.',
    title: 'Grounded Order & Account Answers',
    description:
      'Reads your verified shipping records, return windows, and billing rules so customers get accurate answers instead of generic guesses.',
    highlight: 'Connects to order IDs, policy docs, and subscription statuses in real time.',
    wide: true,
  },
  {
    index: '02.',
    title: 'Structured Human Handoff',
    description:
      'Detects refund exceptions, duplicate charges, or direct requests for a specialist and hands off a one-line summary to your inbox.',
    highlight: 'Zero repeated explanations for the customer.',
    wide: false,
  },
  {
    index: '03.',
    title: 'Strict Policy Guardrails',
    description:
      'Respects your refund cutoffs and fee schedules without inventing unapproved credits or promises.',
    highlight: 'Follows written rules on every turn.',
    wide: false,
  },
  {
    index: '04.',
    title: 'Clear Plain-Language Replies',
    description:
      'Keeps answers concise—two to four calm sentences with direct next steps—so people resolve issues on mobile or desktop in seconds.',
    highlight: 'Built for everyday clarity across retail, SaaS, and booking desks.',
    wide: true,
  },
];
