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
    title: 'Cognitive Induction Graphs',
    accent: 'compiles every prompt, tool call, and workflow into one optimizable graph',
    date: 'OCT 10 2026',
    author: 'PROCEPT',
    readTime: '12 MIN',
    tags: ['COGNITIVE INDUCTION', 'MULTI-AGENT', 'CONTINUAL LEARNING'],
    excerpt:
      'Agents that cannot learn from their mistakes are just expensive lego. We introduce Cognitive Induction Graphs, an infrastructure layer that compiles every prompt, tool call, and workflow into one optimizable graph.',
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
