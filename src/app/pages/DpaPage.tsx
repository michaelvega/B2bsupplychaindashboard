import { Link } from 'react-router';
import { LegalPageLayout } from '../components/marketing/LegalPageLayout';
import { LegalSection } from '../components/marketing/LegalSection';

interface Section {
  num: string;
  heading: string;
  blocks?: { sub?: string; paras: string[] }[];
  paras?: string[];
  list?: string[];
}

const DEFINITIONS: { term: string; text: string }[] = [
  { term: 'Controller', text: '"Controller" shall mean the entity which, alone or jointly with others, determines the purposes and means of the processing of Personal Information.' },
  { term: 'Customer Personal Information', text: '"Customer Personal Information" means electronic data and information submitted by or for Customer to Procept, in connection with the performance of the Services under the Agreement containing Personal Information.' },
  { term: 'Data Protection Laws', text: '"Data Protection Laws and Regulations" means all applicable federal and state laws and regulations binding on a Party with respect to the Party\'s processing, protection, or privacy of the Personal Information, including the CCPA, the Connecticut Data Privacy Act, the Colorado Privacy Act, the Virginia Consumer Data Protection Act, the Utah Consumer Privacy Act, and any corresponding or equivalent United States state or federal laws or regulations.' },
  { term: 'Other Terms', text: '"Consumer" means an identified natural person as defined by applicable Data Protection Laws and Regulations. "Business Purpose," "Processing," "Personal Information," "Sell," "Service Provider," "Share," and "Subcontractor" shall have the same meaning as those terms in the CCPA or other Data Protection Laws and Regulations.' },
];

const SECTIONS: Section[] = [
  {
    num: '01',
    heading: 'Definitions',
    paras: [
      'This Data Processing Addendum ("DPA") forms part of the Master Services Agreement and/or any applicable SOWs, Terms of Service, or Order Forms (together, the "Agreement") between Procept Technologies Corp., a Delaware Corporation ("Procept") and the customer entity that has executed the Agreement ("Customer"). This DPA is an addendum to, and forms part of, the Agreement. It shall be effective and legally binding as of the date the Agreement is executed.',
      'This DPA sets out the terms that apply when Personal Information is Processed by Procept under the Agreement. The purpose of the DPA is to ensure such Processing is conducted in accordance with applicable laws and with due respect for the rights and freedoms of individuals whose Personal Information are Processed.',
    ],
  },
  {
    num: '02',
    heading: 'Purpose',
    paras: [
      'This DPA sets out the terms that apply when Personal Information is Processed by Procept under the Agreement. The purpose of the DPA is to ensure such Processing is conducted in accordance with applicable laws and with due respect for the rights and freedoms of individuals whose Personal Information are Processed.',
    ],
  },
  {
    num: '03',
    heading: 'Processing of Customer Personal Information',
    blocks: [
      {
        sub: '03.1 · Roles of the Parties',
        paras: ['The Parties acknowledge and agree that with regard to the Processing of Customer Personal Information as is necessary for providing the Services, Customer is the Controller, Procept is the Service Provider.'],
      },
      {
        sub: '03.2 · Data Minimization',
        paras: ['Customer shall endeavor to, and shall train its personnel to, exercise all possible care in minimizing Procept\'s access to or Processing of any Customer Personal Information to the extent solely and strictly necessary for the performance of the Services.'],
      },
      {
        sub: '03.3 · Customer\'s Processing of Customer Personal Information',
        paras: ['Customer, as Controller, shall:'],
      },
    ],
    list: [
      'Be responsible for ensuring that it has complied, and will continue to comply, with all applicable Data Protection Laws and Regulations',
      'Ensure it has, and will continue to have, the right to process, transfer, and/or provide access to, the Customer Personal Information to Procept for Processing in accordance with the terms of the Agreement and this DPA',
      'Have sole responsibility for the accuracy, quality, and legality of Customer Personal Information and the means by which Customer acquired Customer Personal Information',
    ],
  },
  {
    num: '03.4',
    heading: 'Procept\'s Processing of Customer Personal Information',
    paras: [
      'Procept shall treat Customer Personal Information as Confidential Information and shall Process Customer Personal Information on behalf of Customer as is necessary for providing the Services and only in accordance with Customer\'s documented instructions as set out in this DPA. Any Processing required outside of the scope of these instructions will require prior written agreement between the Parties.',
      'The Parties acknowledge and agree that Procept\'s Processing of Customer Personal Information is as a Service Provider for a Business Purpose (i.e., performing services on behalf of Customer).',
    ],
  },
  {
    num: '03.5',
    heading: 'Data Protection Impact Assessments',
    paras: [
      'Upon Customer\'s request and if required by applicable Data Protection Laws and Regulations, Procept shall provide Customer with reasonable cooperation and assistance needed to fulfil Customer\'s obligation to carry out a data protection impact assessment related to Customer\'s use of the Services.',
    ],
  },
  {
    num: '04',
    heading: 'Details of Data Processing',
    blocks: [
      {
        sub: '04.1 · Subject Matter',
        paras: ['The subject matter of the Processing under this DPA is the Customer Personal Information.'],
      },
      {
        sub: '04.2 · Frequency and Duration',
        paras: ['Notwithstanding expiration or termination of the Agreement, Procept will Process the Customer Personal Information continuously and until deletion of all Customer Personal Information as described in this DPA.'],
      },
      {
        sub: '04.3 · Nature of the Processing',
        paras: [
          'Procept will perform Processing as needed for the Business Purposes, and to comply with Customer\'s Processing instructions as provided in accordance with the Agreement and this DPA.',
          'The Parties acknowledge and agree that the processing of Personal Information by Procept under this DPA may include the use of automated tools and technologies, including Artificial Intelligence, for purposes that are consistent with the legitimate Business Purposes outlined in the Agreement, such as data analysis, optimization, and service enhancement.',
        ],
      },
      {
        sub: '04.4 · Retention Period',
        paras: ['The period for which Customer Personal Information will be retained and the criteria used to determine that period is determined by Customer during the term of the Agreement via Customer\'s use and configuration of the Service. Upon termination or expiration of the Agreement, Customer may retrieve or delete Customer Personal Information as described in the Agreement.'],
      },
      {
        sub: '04.5 · Categories of Consumers',
        paras: ['The categories of Consumers to which Customer Personal Information relate are determined and controlled by Customer in its sole discretion, and may include, but are not limited to: employees or contact persons of Customer or Customer\'s business partners, and end customers of Customer.'],
      },
      {
        sub: '04.6 · Categories of Personal Information',
        paras: ['The types of Customer Personal Information are determined and controlled by Customer in its sole discretion, and may include, but are not limited to: identification and contact data (name, phone number, email address, mailing address).'],
      },
    ],
  },
  {
    num: '05',
    heading: 'Rights of Consumers',
    blocks: [
      {
        sub: '05.1 · Consumer Request',
        paras: [
          'Procept shall promptly notify Customer if Procept receives a request from a Consumer to exercise the Consumer\'s rights, including to access, correct, obtain a portable copy, or delete Personal Information as allowed by the CCPA or applicable Data Protection Laws and Regulations (each such request being a "Consumer Request").',
          'Taking into account the nature of the Processing, Procept shall assist Customer by appropriate technical and organizational measures for the fulfilment of Customer\'s obligation to respond to a Consumer Request under CCPA or Data Protection Laws and Regulations. In addition, if requested by Customer, Procept shall assist Customer in responding to such Consumer Request.',
        ],
      },
      {
        sub: '05.2 · Procept Personnel Confidentiality',
        paras: ['Procept shall ensure that its personnel engaged in the Processing of Customer Personal Information are informed of the confidential nature of the Customer Personal Information, have received appropriate training on their responsibilities, and have executed written confidentiality agreements.'],
      },
    ],
  },
  {
    num: '06',
    heading: 'Use of Subcontractors',
    blocks: [
      {
        sub: '06.1 · Subcontractor Engagement',
        paras: [
          'Customer acknowledges and agrees that: (i) Procept\'s Affiliates may be retained as subcontractors; and (ii) Procept and Procept\'s Affiliates may engage third-party subcontractors in connection with the provision of the Services.',
          'Procept has entered into a written agreement with each subcontractor containing data protection obligations that comply with the CCPA and are not less protective than those in this Agreement with respect to the protection of Customer Personal Information to the extent applicable to the nature of the Services provided by such subcontractors.',
        ],
      },
      {
        sub: '06.2 · Liability',
        paras: ['Procept shall be liable for its subcontractors to the same extent Procept would be liable if performing the services of each subcontractor directly under the terms of this DPA.'],
      },
    ],
  },
  {
    num: '07',
    heading: 'Security Controls for the Protection of Customer Personal Information',
    blocks: [
      {
        sub: '07.1 · Technical and Organizational Measures',
        paras: ['Procept shall maintain reasonable and appropriate technical and organizational measures for protection of the security (including protection against unauthorized or unlawful Processing and against accidental or unlawful destruction, loss or alteration or damage, unauthorized disclosure of, or access to, Customer Personal Information), confidentiality and integrity of Customer Personal Information.'],
      },
      {
        sub: '07.2 · Personnel',
        paras: ['Procept shall take all reasonable steps to ensure the reliability of any Procept Personnel who may have access to, or are authorized to process, Customer Personal Information. Procept shall ensure that such Procept Personnel are bound by appropriate contractual confidentiality, data protection, and data security obligations in accordance with applicable Data Protection Laws and Regulations and this DPA.'],
      },
      {
        sub: '07.3 · Compliance Monitoring',
        paras: [
          'Upon Customer\'s reasonable request, Procept shall make available to Customer all information in Procept\'s possession necessary to demonstrate Procept\'s compliance with its obligations under this DPA and applicable Data Protection Laws and Regulations.',
          'Customer may monitor Procept\'s compliance with this DPA through reviews, audits, or regular assessments to be conducted in the form of a written questionnaire once per year.',
        ],
      },
    ],
  },
  {
    num: '08',
    heading: 'Security Commitment',
    paras: [
      'Procept is committed to maintaining the highest standards of data security. Our technical and organizational measures are designed to protect Customer Personal Information against unauthorized access, alteration, disclosure, or destruction. We continuously review and improve our security practices.',
    ],
  },
  {
    num: '09',
    heading: 'CCPA Specific Provisions',
    paras: [
      'The following provisions apply to Customer Personal Information that is subject to the CCPA, or to any other Customer Personal Information to the extent required by other Data Protection Laws and Regulations.',
      'Procept shall not:',
    ],
    list: [
      'Sell or Share Customer Personal Information except to perform the Business Purposes specified in this DPA and the Agreement',
      'Combine Customer Personal Information received from or on behalf of Customer with Personal Information received from or on behalf of another person or persons, or collected from its own interaction with a Consumer, except to perform the specified Business Purposes',
      'Retain, use, or disclose Customer Personal Information for any purpose, including any commercial purpose, other than the Business Purposes specified in this DPA, the Agreement, or as otherwise permitted by the CCPA or outside of the direct business relationship between Customer and Procept',
    ],
  },
  {
    num: '10',
    heading: 'Customer Personal Information Incident Management and Notification',
    paras: [
      'Procept shall notify Customer without undue delay after becoming aware of a confirmed accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to Customer Personal Information (a "Customer Personal Information Incident").',
      'To assist Customer in relation to any personal data breach notifications Customer is required to make under the applicable Data Protection Laws and Regulations, Procept shall include in the notification such information about the Customer Personal Information Incident as is required by such Data Protection Laws and Regulations, to the extent that such information is reasonably available to Procept.',
      'Procept shall take all reasonable and necessary steps to remediate the cause of such Customer Personal Information Incident, to preclude further Customer Personal Information Incidents. Where and insofar as Procept cannot provide all the information relevant to a Customer Personal Information Incident at the same time, it may provide such information in phases without undue further delay.',
    ],
  },
  {
    num: '11',
    heading: 'General Provisions',
    paras: [
      'Except as amended by this DPA, the Agreement will remain in full force and effect. If there is a conflict between the Agreement and this DPA, the terms of this DPA will control.',
      'Any claims brought under this DPA shall be subject to the terms and conditions, including but not limited to, the exclusions and limitations set forth in the Agreement. This DPA will automatically terminate on the termination or expiry of the Agreement.',
    ],
  },
];

export function DpaPage() {
  const navItems = SECTIONS.filter(s => /^\d+$/.test(s.num)).map(s => ({ num: s.num, heading: s.heading }));

  return (
    <LegalPageLayout
      docId="DPA-2026-09-16"
      title="Data Processing Addendum"
      subtitle="EFFECTIVE: 2026-09-16"
      wide
      meta={[
        { label: 'Effective Date', value: 'September 16, 2026' },
        { label: 'Jurisdiction', value: 'New Castle County, Delaware' },
        { label: 'Governing Law', value: 'State of Delaware' },
        { label: 'Parties', value: 'Procept Technologies Corp. & Customer' },
      ]}
    >
      {/* In this document */}
      <div className="border border-white/[0.08] bg-ink-800 p-6 mb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-term-400 mb-4">In this document</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {navItems.map(item => (
            <span key={item.num} className="font-mono text-[13px] text-white/50 hover:text-white/80 transition-colors cursor-pointer">
              <span className="text-term-400">{item.num}</span> {item.heading}
            </span>
          ))}
        </div>
      </div>

      {/* DPA sections */}
      <div className="space-y-14">
        {SECTIONS.map((section, i) => (
          <LegalSection key={i} num={section.num} heading={section.heading} paras={section.paras} blocks={section.blocks} list={section.list} />
        ))}
      </div>

      {/* Definitions key block */}
      <div className="mt-16 border border-white/[0.08] bg-ink-800 p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-term-400 mb-6">Key Definitions</p>
        <div className="space-y-6">
          {DEFINITIONS.map(def => (
            <div key={def.term}>
              <h3 className="font-mono text-xs text-white/80 tracking-wider mb-2">{def.term}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{def.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Link to privacy */}
      <div className="mt-12 text-center">
        <Link to="/privacy" className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 hover:text-term-300 transition-colors">
          View the Privacy Policy →
        </Link>
      </div>
    </LegalPageLayout>
  );
}
