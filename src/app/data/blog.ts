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
  /** Optional direct target, e.g. '/system5'. Defaults to `/blog/${slug}`. */
  href?: string;
}

export const POSTS: BlogPost[] = [
  {
    slug: 'system5',
    num: '004',
    title: 'System 5: Operations, Physical Reality, and User Behavior',
    accent: 'all in one self-improving system',
    date: 'OCT 14 2026',
    author: 'PROCEPT',
    readTime: '12 MIN',
    tags: ['SYSTEM 5', '24/7 OPERATIONS', 'SELF-IMPROVING'],
    excerpt:
      'The operating system for 24/7 Operational Harnesses, one self-improving system that unifies operations, physical reality, and user behavior, from bare metal to the end user.',
    href: '/system5',
  },
  {
    slug: 'rsi_materials_sci',
    num: '003',
    title: 'Physics-Guided Recursive Self-Improvement for LLM-Generated Atomistic Models',
    accent: 'a research proposal by Sam Carozzi and Michael Vega',
    date: 'OCT 13 2026',
    author: 'SAM CAROZZI + MICHAEL VEGA',
    readTime: '9 MIN',
    tags: ['MATERIALS SCIENCE', 'RSI', 'RESEARCH'],
    excerpt:
      'Can physics-guided recursive self-improvement teach an LLM to generate 2D hybrid perovskite structures that are physically coherent and simulation-ready? A preregistered proposal.',
  },
  {
    slug: 'cognitive-induction-graphs',
    num: '002',
    title: 'Cognition Induction Graphs',
    accent: 'escaping compression via unsupervised prompt optimization in multi-agent topologies',
    date: 'OCT 10 2026',
    author: 'MICHAEL VEGA + SAM CAROZZI',
    readTime: '12 MIN',
    tags: ['COGNITION INDUCTION', 'MULTI-AGENT', 'CONTINUAL LEARNING'],
    excerpt:
      'We replace supervised compression with unsupervised inductive generalization. The Cognition Induction Graph traces end-to-end multi-agent topologies and drives a prompt-space Recursive Self-Improvement engine over frozen weights, reaching 95.0 on the ARC-AGI 3 public tests.',
  },
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
