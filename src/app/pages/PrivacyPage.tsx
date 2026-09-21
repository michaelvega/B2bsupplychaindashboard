import { LegalPageLayout } from '../components/marketing/LegalPageLayout';
import { LegalSection } from '../components/marketing/LegalSection';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: '1. Information We Collect',
    body: [
      'Website & Communications: We collect information that you provide directly to us, including your name, email address, company name, and any other information you submit through our website, demo request forms, or communications with our team. We automatically collect certain technical information when you visit our website, including your IP address, browser type, device information, pages visited, time spent on pages, referring URLs, and other usage data through cookies and similar technologies.',
      'Procept Hosted Platform: If you use our fully hosted multi-tenant platform, we collect data related to your account, including configuration settings, uploaded documents, and usage patterns necessary to provide our services.',
      'Procept Enterprise (BYOC) Deployments: If you deploy Procept via our Bring Your Own Cloud (BYOC) enterprise architecture, Procept does not ingest, host, or collect your proprietary documents or training data. In these deployments, your data remains entirely within your secure infrastructure, and our data processing is strictly governed by your specific Master Services Agreement (MSA) and Data Processing Addendum (DPA).',
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
      'We may disclose your information if required by law, legal process, or government request, or to protect the rights, property, or safety of Procept Technologies Corp., our users, or others.',
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
    <LegalPageLayout
      docId="PRIVACY-POLICY"
      title="Privacy Policy"
      subtitle="EFFECTIVE: 2026-09-16"
      meta={[
        { label: 'Last Updated', value: 'September 16, 2026' },
        { label: 'Jurisdiction', value: 'United States' },
        { label: 'Governing Law', value: 'State of Delaware' },
        { label: 'Parties', value: 'Procept Technologies Corp. & Website Visitors' },
      ]}
    >
      <div className="space-y-12">
        {SECTIONS.map((section, i) => (
          <div key={i}>
            <LegalSection heading={section.heading} paras={section.body} />
            {section.heading === '10. Contact Us' && (
              <div className="mt-4 border border-white/[0.08] bg-ink-800 p-5 space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-term-400 mb-3">CONTACT //</p>
                <p className="text-sm text-white/60">Procept Technologies Corp.</p>
                <p className="text-sm text-white/60">hello@procept.tech</p>
                <p className="text-sm text-white/40">Attn: Privacy</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </LegalPageLayout>
  );
}
