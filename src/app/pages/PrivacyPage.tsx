import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: '1. Information We Collect',
    body: [
      'We collect information that you provide directly to us, including your name, email address, company name, and any other information you submit through our website, demo request forms, or communications with our team.',
      'We automatically collect certain technical information when you visit our website, including your IP address, browser type, device information, pages visited, time spent on pages, referring URLs, and other usage data through cookies and similar technologies.',
      'If you use our platform, we collect data related to your account, including configuration settings, uploaded documents, and usage patterns necessary to provide our services.',
    ],
  },
  {
    heading: '2. How We Use Your Information',
    body: [
      'We use the information we collect to provide, maintain, and improve our services, including responding to demo requests and customer inquiries.',
      'We use your information to communicate with you about our products, services, and updates, and to send you marketing communications where you have consented or where permitted by applicable law.',
      'We use technical data to analyze website performance, diagnose technical issues, and improve the user experience.',
      'We do not sell your personal information to third parties.',
    ],
  },
  {
    heading: '3. Cookies and Tracking Technologies',
    body: [
      'We use cookies and similar tracking technologies to remember your preferences, understand how you use our website, and improve our services.',
      'You can control cookies through your browser settings. Disabling cookies may affect the functionality of our website.',
      'We may use analytics services provided by third parties that collect information about your use of our website.',
    ],
  },
  {
    heading: '4. Third-Party Sharing',
    body: [
      'We may share your information with service providers who perform services on our behalf, such as hosting providers, analytics services, and email delivery services. These providers are contractually obligated to protect your information.',
      'We may disclose your information if required by law, legal process, or government request, or to protect the rights, property, or safety of Procept Tech, our users, or others.',
      'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you of any such change in ownership or control of your personal information.',
    ],
  },
  {
    heading: '5. Data Retention',
    body: [
      'We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law.',
      'When we no longer need your information, we will delete or anonymize it in accordance with our internal policies and applicable law.',
    ],
  },
  {
    heading: '6. Data Security',
    body: [
      'We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, disclosure, alteration, and destruction.',
      'No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.',
    ],
  },
  {
    heading: '7. Your Rights',
    body: [
      'Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict the processing of your personal information, as well as the right to data portability.',
      'You may opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.',
      'To exercise any of these rights, please contact us using the information provided below.',
    ],
  },
  {
    heading: '8. Children’s Privacy',
    body: [
      'Our website and services are not directed to children under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it.',
    ],
  },
  {
    heading: '9. Changes to This Policy',
    body: [
      'We may update this privacy policy from time to time. When we make changes, we will update the "Last Updated" date at the top of this page.',
      'We encourage you to review this policy periodically to stay informed about how we protect your information.',
    ],
  },
  {
    heading: '10. Contact Us',
    body: [
      'If you have any questions about this privacy policy or our privacy practices, please contact us at:',
    ],
  },
];

export function PrivacyPage() {
  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-black text-white" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-3">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-6 h-6 rounded-md opacity-70" />
            <span className="text-white/40 text-xs tracking-[0.2em] uppercase">Procept Tech</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-white/30 text-sm">Last Updated July 14, 2026</p>
        </div>

        {/* Metadata block */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Last Updated', value: 'July 14, 2026' },
            { label: 'Jurisdiction', value: 'United States' },
            { label: 'Governing Law', value: 'Commonwealth of Massachusetts' },
            { label: 'Parties', value: 'Procept Tech, Inc. & Website Visitors' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-1.5">{item.label}</p>
              <p className="text-sm text-white/70 leading-snug">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Policy sections */}
        <div className="space-y-12">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-medium text-white mb-4">{section.heading}</h2>
              <div className="space-y-4">
                {section.body.map((para, j) => (
                  <p key={j} className="text-sm text-white/50 leading-relaxed">{para}</p>
                ))}
              </div>
              {section.heading === '10. Contact Us' && (
                <div className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-1.5">
                  <p className="text-sm text-white/60">Procept Tech, Inc.</p>
                  <p className="text-sm text-white/60">hello@procept.tech</p>
                  <p className="text-sm text-white/40">Attn: Privacy</p>
                </div>
              )}
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/20">Copyright Procept Tech Inc. 2026. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <span className="text-white/10">·</span>
            <span className="hover:text-white/60 transition-colors cursor-pointer">Terms & Conditions</span>
            <span className="text-white/10">·</span>
            <span className="hover:text-white/60 transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
