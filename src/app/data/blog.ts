export interface BlogPost {
  slug: string;
  num: string;
  title: string;
  /** Serif-italic tail of the headline, e.g. the parenthetical. */
  accent: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
  excerpt: string;
}

export const POSTS: BlogPost[] = [
  {
    slug: 'enterprise-ai-at-scale-2026',
    num: '001',
    title: 'How the Enterprise is Deploying AI at Scale in 2026',
    accent: 'and why infrastructure is lacking',
    date: 'SEP 22 2026',
    author: 'PROCEPT',
    readTime: '8 MIN',
    tags: ['ENTERPRISE AI', 'INFRASTRUCTURE', 'AGENTS'],
    excerpt:
      'Model intelligence is no longer the bottleneck. The 2026 data shows deployment has become a plumbing problem: integration, governance, and the cost of building it yourself.',
  },
];
