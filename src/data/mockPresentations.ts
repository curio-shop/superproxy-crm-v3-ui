export interface Presentation {
  id: string;
  title: string;
  type: 'quote' | 'invoice';
  referenceNumber: string;
  referenceId: string;
  duration: number;
  views: number;
  thumbnailUrl: string;
  createdAt: Date;
  createdBy: {
    name: string;
    avatar: string;
  };
  description: string;
  videoUrl?: string;
}

export const mockPresentations: Presentation[] = [
  {
    id: 'pres-1',
    title: 'Q&A Session: Enterprise Software Solution',
    type: 'quote',
    referenceNumber: 'QUO-2024-001',
    referenceId: 'quote-1',
    duration: 342,
    views: 127,
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    createdAt: new Date('2024-01-15T10:30:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Detailed walkthrough of our enterprise software solution proposal, covering key features, implementation timeline, and pricing breakdown.'
  },
  {
    id: 'pres-2',
    title: 'Invoice Explanation: December Services',
    type: 'invoice',
    referenceNumber: 'INV-2024-089',
    referenceId: 'invoice-1',
    duration: 185,
    views: 89,
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    createdAt: new Date('2024-01-14T14:20:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Comprehensive breakdown of December consulting services, including hourly breakdown and deliverables overview.'
  },
  {
    id: 'pres-3',
    title: 'Project Proposal: Website Redesign',
    type: 'quote',
    referenceNumber: 'QUO-2024-002',
    referenceId: 'quote-2',
    duration: 428,
    views: 203,
    thumbnailUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    createdAt: new Date('2024-01-13T09:15:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Complete website redesign proposal including UX research, design mockups, and development phases.'
  },
  {
    id: 'pres-4',
    title: 'Annual Support Package Overview',
    type: 'quote',
    referenceNumber: 'QUO-2024-003',
    referenceId: 'quote-3',
    duration: 267,
    views: 156,
    thumbnailUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    createdAt: new Date('2024-01-12T16:45:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Annual support and maintenance package presentation with SLA details and response time commitments.'
  },
  {
    id: 'pres-5',
    title: 'January Hosting Invoice Breakdown',
    type: 'invoice',
    referenceNumber: 'INV-2024-090',
    referenceId: 'invoice-2',
    duration: 142,
    views: 67,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    createdAt: new Date('2024-01-11T11:30:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Monthly hosting and infrastructure costs with detailed server specifications and usage metrics.'
  },
  {
    id: 'pres-6',
    title: 'Mobile App Development Proposal',
    type: 'quote',
    referenceNumber: 'QUO-2024-004',
    referenceId: 'quote-4',
    duration: 512,
    views: 289,
    thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    createdAt: new Date('2024-01-10T13:20:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'iOS and Android mobile application development proposal including features, timeline, and team structure.'
  },
  {
    id: 'pres-7',
    title: 'Q4 Marketing Services Invoice',
    type: 'invoice',
    referenceNumber: 'INV-2024-091',
    referenceId: 'invoice-3',
    duration: 223,
    views: 134,
    thumbnailUrl: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&q=80',
    createdAt: new Date('2024-01-09T15:10:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Quarterly marketing services including social media management, content creation, and analytics reporting.'
  },
  {
    id: 'pres-8',
    title: 'Cloud Migration Strategy',
    type: 'quote',
    referenceNumber: 'QUO-2024-005',
    referenceId: 'quote-5',
    duration: 398,
    views: 178,
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    createdAt: new Date('2024-01-08T10:00:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Complete cloud migration strategy covering infrastructure assessment, migration plan, and post-migration support.'
  },
  {
    id: 'pres-9',
    title: 'Custom Integration Development',
    type: 'quote',
    referenceNumber: 'QUO-2024-006',
    referenceId: 'quote-6',
    duration: 315,
    views: 142,
    thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    createdAt: new Date('2024-01-07T14:30:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Custom API integration between CRM and accounting systems with data synchronization capabilities.'
  },
  {
    id: 'pres-10',
    title: 'Training Services Invoice',
    type: 'invoice',
    referenceNumber: 'INV-2024-092',
    referenceId: 'invoice-4',
    duration: 198,
    views: 95,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    createdAt: new Date('2024-01-06T09:45:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'On-site training sessions for team members covering platform usage and best practices.'
  },
  {
    id: 'pres-11',
    title: 'E-commerce Platform Build',
    type: 'quote',
    referenceNumber: 'QUO-2024-007',
    referenceId: 'quote-7',
    duration: 456,
    views: 231,
    thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    createdAt: new Date('2024-01-05T11:20:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Full-featured e-commerce platform with payment processing, inventory management, and customer portal.'
  },
  {
    id: 'pres-12',
    title: 'December Development Sprint',
    type: 'invoice',
    referenceNumber: 'INV-2024-093',
    referenceId: 'invoice-5',
    duration: 276,
    views: 118,
    thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
    createdAt: new Date('2024-01-04T16:00:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Two-week development sprint including feature development, bug fixes, and code reviews.'
  },
  {
    id: 'pres-13',
    title: 'Security Audit Services',
    type: 'quote',
    referenceNumber: 'QUO-2024-008',
    referenceId: 'quote-8',
    duration: 334,
    views: 167,
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    createdAt: new Date('2024-01-03T13:15:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Comprehensive security audit including penetration testing, vulnerability assessment, and remediation plan.'
  },
  {
    id: 'pres-14',
    title: 'Brand Identity Package',
    type: 'quote',
    referenceNumber: 'QUO-2024-009',
    referenceId: 'quote-9',
    duration: 289,
    views: 195,
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    createdAt: new Date('2024-01-02T10:30:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Complete brand identity package including logo design, color palette, typography, and brand guidelines.'
  },
  {
    id: 'pres-15',
    title: 'November Consulting Invoice',
    type: 'invoice',
    referenceNumber: 'INV-2024-094',
    referenceId: 'invoice-6',
    duration: 167,
    views: 73,
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    createdAt: new Date('2024-01-01T15:45:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Monthly consulting retainer including strategic planning sessions and technical advisory.'
  },
  {
    id: 'pres-16',
    title: 'Data Analytics Dashboard',
    type: 'quote',
    referenceNumber: 'QUO-2024-010',
    referenceId: 'quote-10',
    duration: 378,
    views: 209,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    createdAt: new Date('2023-12-31T12:00:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Custom analytics dashboard with real-time data visualization, reporting, and export capabilities.'
  },
  {
    id: 'pres-17',
    title: 'SEO Optimization Services',
    type: 'quote',
    referenceNumber: 'QUO-2024-011',
    referenceId: 'quote-11',
    duration: 245,
    views: 158,
    thumbnailUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&q=80',
    createdAt: new Date('2023-12-30T09:30:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Six-month SEO optimization campaign including keyword research, on-page optimization, and link building.'
  },
  {
    id: 'pres-18',
    title: 'October Maintenance Invoice',
    type: 'invoice',
    referenceNumber: 'INV-2024-095',
    referenceId: 'invoice-7',
    duration: 154,
    views: 81,
    thumbnailUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    createdAt: new Date('2023-12-29T14:20:00'),
    createdBy: {
      name: 'Let Cruz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Let'
    },
    description: 'Monthly maintenance and support services including updates, monitoring, and technical support.'
  }
];

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
