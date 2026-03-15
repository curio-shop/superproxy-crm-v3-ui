export interface MockChatMessage {
  id: string;
  sender_type: 'user' | 'support';
  sender_name: string;
  sender_avatar?: string;
  message: string;
  created_at: string;
}

const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

export const mockChatMessages: MockChatMessage[] = [
  {
    id: 'mock-1',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Hi! I have a question about managing my workspace settings.',
    created_at: new Date(twoDaysAgo.setHours(10, 30, 0, 0)).toISOString(),
  },
  {
    id: 'mock-2',
    sender_type: 'support',
    sender_name: 'Sarah Johnson',
    sender_avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'Hello! I\'d be happy to help you with your workspace settings. What would you like to know?',
    created_at: new Date(twoDaysAgo.setHours(10, 32, 0, 0)).toISOString(),
  },
  {
    id: 'mock-3',
    sender_type: 'user',
    sender_name: 'You',
    message: 'I\'m trying to add new team members but I\'m not sure where to find that option.',
    created_at: new Date(twoDaysAgo.setHours(10, 35, 0, 0)).toISOString(),
  },
  {
    id: 'mock-4',
    sender_type: 'support',
    sender_name: 'Sarah Johnson',
    sender_avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'Great question! You can add team members from the Workspaces tab in your Account Profile. Just look for the workspace card and click on "Manage" to see all members and add new ones.',
    created_at: new Date(twoDaysAgo.setHours(10, 36, 0, 0)).toISOString(),
  },
  {
    id: 'mock-5',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Perfect! That worked. Thank you so much!',
    created_at: new Date(twoDaysAgo.setHours(10, 40, 0, 0)).toISOString(),
  },
  {
    id: 'mock-6',
    sender_type: 'support',
    sender_name: 'Sarah Johnson',
    sender_avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'You\'re welcome! Is there anything else I can help you with today?',
    created_at: new Date(twoDaysAgo.setHours(10, 41, 0, 0)).toISOString(),
  },
  {
    id: 'mock-7',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Not at the moment. Have a great day!',
    created_at: new Date(twoDaysAgo.setHours(10, 43, 0, 0)).toISOString(),
  },
  {
    id: 'mock-8',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Hi again! I have another question about the invoicing feature.',
    created_at: new Date(yesterday.setHours(14, 15, 0, 0)).toISOString(),
  },
  {
    id: 'mock-9',
    sender_type: 'support',
    sender_name: 'Michael Chen',
    sender_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'Hi there! I\'m Michael from the support team. What would you like to know about invoicing?',
    created_at: new Date(yesterday.setHours(14, 18, 0, 0)).toISOString(),
  },
  {
    id: 'mock-10',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Can I customize the invoice template with my company logo?',
    created_at: new Date(yesterday.setHours(14, 20, 0, 0)).toISOString(),
  },
  {
    id: 'mock-11',
    sender_type: 'support',
    sender_name: 'Michael Chen',
    sender_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'Absolutely! When creating or editing an invoice, you\'ll see an option to upload your company logo. The system supports PNG, JPG, and SVG formats. Your logo will appear at the top of all your invoices.',
    created_at: new Date(yesterday.setHours(14, 21, 0, 0)).toISOString(),
  },
  {
    id: 'mock-12',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Excellent! One more thing - can I set up automatic payment reminders?',
    created_at: new Date(yesterday.setHours(14, 25, 0, 0)).toISOString(),
  },
  {
    id: 'mock-13',
    sender_type: 'support',
    sender_name: 'Michael Chen',
    sender_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'Yes! In the invoice settings, you can configure automatic reminders. You can set them to go out before the due date, on the due date, and after overdue. You can customize the message content and frequency as well.',
    created_at: new Date(yesterday.setHours(14, 27, 0, 0)).toISOString(),
  },
  {
    id: 'mock-14',
    sender_type: 'user',
    sender_name: 'You',
    message: 'That\'s fantastic! Thanks for all the help, Michael!',
    created_at: new Date(yesterday.setHours(14, 30, 0, 0)).toISOString(),
  },
  {
    id: 'mock-15',
    sender_type: 'support',
    sender_name: 'Michael Chen',
    sender_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'My pleasure! Don\'t hesitate to reach out if you need anything else. Have a wonderful day!',
    created_at: new Date(yesterday.setHours(14, 31, 0, 0)).toISOString(),
  },
  {
    id: 'mock-16',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Hello! Quick question about call tracking.',
    created_at: new Date(now.setHours(9, 45, 0, 0)).toISOString(),
  },
  {
    id: 'mock-17',
    sender_type: 'support',
    sender_name: 'Sarah Johnson',
    sender_avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'Good morning! Happy to help. What would you like to know about call tracking?',
    created_at: new Date(now.setHours(9, 47, 0, 0)).toISOString(),
  },
  {
    id: 'mock-18',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Where can I view my complete call history and analytics?',
    created_at: new Date(now.setHours(9, 50, 0, 0)).toISOString(),
  },
  {
    id: 'mock-19',
    sender_type: 'support',
    sender_name: 'Sarah Johnson',
    sender_avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    message: 'You can find all your call history in the main dashboard. There\'s a "Call History" section that shows all your calls with details like duration, outcome, and notes. You can also filter by date range, contact, or call type.',
    created_at: new Date(now.setHours(9, 52, 0, 0)).toISOString(),
  },
  {
    id: 'mock-20',
    sender_type: 'user',
    sender_name: 'You',
    message: 'Perfect! Thanks Sarah, you\'ve been super helpful.',
    created_at: new Date(now.setHours(9, 55, 0, 0)).toISOString(),
  },
];
