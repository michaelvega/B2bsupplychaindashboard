import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

interface Block {
  sub?: string;
  paras: string[];
  list?: string[];
}

interface TermSection {
  num: string;
  heading: string;
  blocks: Block[];
}

const SECTIONS: TermSection[] = [
  {
    num: '01',
    heading: 'Services Provided',
    blocks: [
      {
        sub: '01.1 · Binding Agreement and Acceptance',
        paras: [
          'You accept these Terms of Service by checking the acceptance box and completing checkout, or by executing an Order Form that references these Terms. The individual accepting these Terms represents and warrants that they are authorized to bind Customer to this Agreement. If you do not agree to these Terms, do not accept them and do not use the Services. Your access to or use of the Services also constitutes acceptance of these Terms.',
          'The parties consent to transact electronically. Customer\'s electronic acceptance of these Terms, together with the records maintained by Procept and its third-party payment processor (e.g., Stripe), satisfies any legal requirement that this Agreement be signed or be in writing, and constitutes admissible evidence of the parties\' agreement and of the date and time of acceptance.',
        ],
      },
      {
        sub: '01.2 · Services and Orders',
        paras: [
          'Procept will provide the services identified in each Order Form (the "Services") entered into by the parties under this Agreement. The parties may agree to enter into additional engagements for additional or different Services in separate Orders.',
          '"Order Form" (also "Order") means either (a) a written order document executed by the parties, or (b) an online subscription order placed by Customer through Procept\'s platform or its third-party payment processor (e.g., Stripe). For an online subscription order, the plan, seat quantity, Fees, billing frequency, and start date presented to Customer at checkout constitute the commercial terms of that Order. The Services included in each plan are described in the applicable Service Description, available at https://www.procept.tech/plans, which forms part of this Agreement and is incorporated by reference.',
        ],
      },
    ],
  },
  {
    num: '02',
    heading: 'Term and Termination',
    blocks: [
      {
        sub: '02.1 · Term',
        paras: [
          'These Terms commence on the date you first accept them and remain in effect as long as any Order Form is active. Each Order Form will have the start date, and where applicable the end date, specified therein or presented at checkout (an "Order Term"). For month-to-month subscriptions, the Order Term is determined under Section 2.5.',
        ],
      },
      {
        sub: '02.2 · Termination for Cause',
        paras: ['Either party may terminate this Agreement or any specific Order Form upon written notice if the other party:'],
        list: [
          'Assigns or attempts to assign this Agreement or its obligations in violation of this Agreement',
          'Fails to correct a material breach within thirty (30) days after receipt of written notification',
          'Ceases to carry on business as a going concern',
          'Initiates bankruptcy, reorganization, or insolvency proceeding not dismissed within sixty (60) days',
        ],
      },
      {
        sub: '02.3 · Effect of Termination',
        paras: [
          'Upon expiration or termination of this Agreement, all active Order Forms shall continue in full force and effect. Upon termination of a specific Order Form, that Order Form terminates but this Agreement and all other active Order Forms remain in full force.',
          'In the event of any termination, Customer shall pay for all services performed and expenses incurred up to the effective date of termination.',
        ],
      },
      {
        sub: '02.4 · Survival',
        paras: ['Sections 2.3, 2.4, 4.3, 4.4, 5, 6, 7, 9, 10, 12, and 14 survive termination or expiration of this Agreement.'],
      },
      {
        sub: '02.5 · Month-to-Month Orders',
        paras: [
          'Where an Order specifies a month-to-month subscription, the Order Term consists of an initial one-month period beginning on the start date and automatically renews for successive one-month periods until terminated. Customer may terminate a month-to-month Order for convenience at any time, with termination effective at the end of the then-current monthly period, through the account portal (when available) or by written notice to Procept. Procept may terminate a month-to-month Order for convenience upon thirty (30) days\' written notice. Fees for the current monthly period are non-refundable and are not prorated, and Services continue through the end of the paid period.',
        ],
      },
    ],
  },
  {
    num: '03',
    heading: 'Notice',
    blocks: [
      {
        paras: [
          'Procept may provide notices via email to the email address specified on the applicable Order Form or provided by Customer at subscription signup, or through your account portal. Notices sent by email are deemed given upon the first business day after sending.',
          'Legal notices to Procept must be sent by overnight courier or certified mail to the address below. Email alone is not sufficient for Legal Notice.',
        ],
      },
      {
        sub: 'Legal Notice Address',
        paras: [
          'Procept Technologies Corp.',
          'Attn: Finance Team',
          '222 Third Street, Suite 1130',
          'Wilmington, DE 19801',
          'accounting@procept.tech',
        ],
      },
    ],
  },
  {
    num: '04',
    heading: 'Fees and Payment Terms',
    blocks: [
      {
        sub: '04.1 · Fees',
        paras: ['Customer shall pay Procept the fees, charges, and expenses specified in each applicable Order Form (the "Fees").'],
      },
      {
        sub: '04.2 · Payment Method',
        paras: [
          'Fees may be paid either (a) via manually-paid invoice or (b) via automated payment method. Unless otherwise specified in an Order Form, all invoices are due and payable within thirty (30) days of the invoice date ("Due Date").',
          'If Customer elects to pay via automated payment method (e.g., credit card, ACH transfer), Customer authorizes Procept and its third-party payment processor (e.g., Stripe) to store Payment Method information and automatically charge such Payment Method for all Fees as they become due. Customer represents and warrants that it is authorized to use the designated Payment Method and shall keep such Payment Method information current, complete, and valid.',
          'For subscriptions paid via automated payment method, Procept (through its payment processor) charges the Payment Method in advance at the start of each billing period for the Fees due for that period.',
        ],
      },
      {
        sub: '04.3 · Late Payments',
        paras: ['Any Fees not paid by the Due Date or that are declined/reversed shall be subject to a late charge equal to the lesser of 1.5% per month or the maximum amount permitted by applicable law. Procept may, without limiting its other rights, suspend the performance of Services if any undisputed invoice or failed automated charge remains unpaid for more than thirty (30) days after Customer is notified.'],
      },
      {
        sub: '04.4 · Taxes',
        paras: ['All Fees are exclusive of any sales, use, value-added, or other applicable taxes, tariffs, or duties ("Taxes"). Customer is solely responsible for the payment of all Taxes, excluding only taxes based on Procept\'s net income.'],
      },
      {
        sub: '04.5 · Fee Changes',
        paras: ['Procept may change its standard rates for Services upon sixty (60) days prior written notice. Fee changes shall not apply to any Order Form in effect during its then-current Order Term. New rates apply only to (i) new Order Forms executed after the sixty (60) day notice period, or (ii) any renewal terms of an existing Order Form. For month-to-month Orders, each monthly renewal is treated as a renewal term for purposes of this Section, and a fee change applies at the first monthly renewal occurring after the sixty (60) day notice period.'],
      },
    ],
  },
  {
    num: '05',
    heading: 'Confidential Information',
    blocks: [
      {
        sub: '05.1 · Definition',
        paras: [
          '"Confidential Information" includes any information, technical data, or know-how concerning either party including research, products, services, customers, markets, business policies or practices, unreleased software, developments, inventions, processes, designs, drawings, engineering, marketing, reports and audits, business plans or finances. Also includes any materials or information identified by the disclosing party as confidential or proprietary. The terms and conditions of this Agreement are considered Confidential Information of both parties.',
          'However, the publicly posted version of these Terms of Service is not Confidential Information. The commercial terms set forth in any Order Form, including pricing and seat quantities, remain Confidential Information of both parties.',
        ],
      },
      {
        sub: '05.2 · Exclusions',
        paras: ['Confidential Information does not include information that:'],
        list: [
          'Was in the public domain at the time received',
          'Comes into the public domain after received through no fault of the receiving party',
          'The receiving party received from a third party without breach of confidentiality obligations',
          'Is independently developed by the receiving party without use of or reference to the Confidential Information',
          'The receiving party is required by law to disclose',
        ],
      },
      {
        sub: '05.3 · Obligations',
        paras: [
          'Each party agrees to use the Confidential Information solely for the purpose of exercising its rights and performing its obligations under this Agreement. Will use the same degree of care to protect the Confidential Information as it uses to protect its own Confidential Information of like nature (but in no case less than a reasonable degree of care).',
          'May disclose only to employees, directors, consultants, and subcontractors (collectively, "Representatives") who have a "need to know" such information, provided that such Representatives are bound by written confidentiality obligations at least as restrictive. The Receiving Party shall be responsible and liable for any breach of these confidentiality obligations by any of its Representatives.',
        ],
      },
      {
        sub: '05.4 · Compelled Disclosure',
        paras: ['If required by law, regulation, or a valid court order to disclose any Confidential Information, shall (to the extent legally permitted) provide prompt written notice before the disclosure. Shall only disclose the minimum portion legally required and shall cooperate with the Disclosing Party, at the Disclosing Party\'s expense, in any efforts to obtain a protective order.'],
      },
      {
        sub: '05.5 · Return or Destruction',
        paras: ['Upon termination or expiration of this Agreement, or upon written request, the Receiving Party shall promptly (i) return to the Disclosing Party or (ii) destroy all tangible materials containing Confidential Information. May retain one copy in its secure, confidential legal files solely for archival or compliance purposes.'],
      },
      {
        sub: '05.6 · Duration',
        paras: ['The obligations of confidentiality shall survive and continue for a period of five (5) years following termination or expiration of this Agreement. For any Confidential Information that constitutes a "trade secret" under applicable law, the obligations shall continue for as long as such information remains a trade secret.'],
      },
    ],
  },
  {
    num: '06',
    heading: 'Data Protection and Privacy',
    blocks: [
      {
        sub: '06.1 · Roles and Compliance',
        paras: ['The parties acknowledge that in the performance of this Agreement, each party may be a "Data Controller" or "Data Processor." Each party agrees to comply with all applicable data protection laws and regulations.'],
      },
      {
        sub: '06.2 · Processing of Customer Data',
        paras: [
          'To the extent that Procept processes any Personal Data on behalf of Customer (the "Customer Data"), Customer is the Data Controller and Procept is the Data Processor. Procept shall only process Customer Data in accordance with the DPA and Customer\'s lawful instructions.',
        ],
      },
      {
        sub: '06.3 · Procept Privacy Policy',
        paras: ['Procept\'s Privacy Policy describes how Procept collects, uses, and protects Personal Data for which Procept is a Data Controller.'],
      },
      {
        sub: '06.4 · Security',
        paras: ['Procept shall implement and maintain appropriate technical and organizational security measures designed to protect Customer Data from unauthorized access, use, alteration, or disclosure.'],
      },
    ],
  },
  {
    num: '07',
    heading: 'Intellectual Property',
    blocks: [
      {
        sub: '07.1 · Customer Intellectual Property',
        paras: ['Customer retains all right, title, and interest in and to all data and information provided by Customer to Procept ("Customer Data") as well as any other intellectual property owned by Customer (e.g., logos, trademarks) (collectively, "Customer IP"). Customer grants Procept a non-exclusive, worldwide, royalty-free license to use, copy, modify, process, and create derivative works of the Customer IP solely for the purpose of performing the Services.'],
      },
      {
        sub: '07.2 · Procept Intellectual Property',
        paras: ['Procept retains all right, title, and interest in and to its proprietary platform, user interface (UI), software, tools, methodologies, pre-existing data models, and all intellectual property rights therein, including any modifications or enhancements thereto (the "Procept IP").'],
      },
      {
        sub: '07.3 · Custom Models',
        paras: ['Customer acknowledges and agrees that any and all data models, algorithms, or other software developed, trained, or modified by Procept in the performance of the Services, even if developed specifically for Customer (the "Custom Models"), are the sole and exclusive property of Procept and shall be considered part of the Procept IP.'],
      },
      {
        sub: '07.4 · Ownership of Outputs',
        paras: ['Customer shall own and retain all right, title, and interest in and to the specific reports, scores, insights, and other data outputs generated by the Custom Models from the Customer Data (the "Outputs"). Procept shall have no rights to use, disclose, or resell the Outputs and shall treat such Outputs as Customer\'s Confidential Information.'],
      },
      {
        sub: '07.5 · License to Customer',
        paras: ['Subject to Customer\'s compliance with this Agreement and payment of all applicable Fees, Procept grants Customer a limited, non-exclusive, non-sublicensable, non-transferable license during the applicable Order Term to access and use the Procept IP and the Custom Models solely via Procept\'s platform/UI for the purpose of generating, accessing, and downloading its Outputs.'],
      },
      {
        sub: '07.6 · Use of Outputs',
        paras: ['Customer\'s ownership rights in its Outputs are perpetual. Customer may use such Outputs for its internal business purposes indefinitely, surviving the expiration or termination of any Order Term.'],
      },
      {
        sub: '07.7 · Feedback',
        paras: ['Customer grants Procept a worldwide, perpetual, irrevocable, royalty-free license to use and incorporate into the Services any suggestion, enhancement request, recommendation, correction, or other feedback provided by Customer or Users.'],
      },
    ],
  },
  {
    num: '08',
    heading: 'Publicity',
    blocks: [
      {
        paras: [
          'Customer grants Procept a non-exclusive, worldwide, royalty-free license to use Customer\'s name, logo, and trademarks (collectively, "Customer Marks") on Procept\'s website, in customer lists, and in other marketing, sales, and investor presentations.',
          'Procept\'s use of the Customer Marks shall be in accordance with any reasonable trademark usage guidelines that Customer may provide. Procept agrees that it will not use the Customer Marks in any manner that would harm, disparage, or reflect negatively upon Customer\'s brand or reputation.',
        ],
      },
    ],
  },
  {
    num: '09',
    heading: 'Liability and Indemnification',
    blocks: [
      {
        sub: '09.1 · Indemnification by Procept',
        paras: [
          'Procept shall defend, indemnify, and hold harmless Customer and its officers, directors, and employees from and against any third-party claims, liabilities, damages, and costs (including reasonable attorneys\' fees) alleging that the Procept IP or Custom Models, when used as permitted by this Agreement, infringe upon any third-party\'s U.S. patent, copyright, or trademark.',
          'Procept\'s obligations under this section are contingent upon Customer: (a) providing prompt written notice of the claim; (b) granting Procept sole control of the defense and settlement of the claim; and (c) providing reasonable cooperation in the defense.',
        ],
      },
      {
        sub: '09.2 · Indemnification by Customer',
        paras: ['Customer shall defend, indemnify, and hold harmless Procept and its officers, directors, and employees from and against any third-party claims, liabilities, damages, and costs (including reasonable attorneys\' fees) arising from or related to:'],
        list: [
          'The Customer IP (e.g., alleging that Customer Data infringes a third party\'s privacy or intellectual property rights)',
          'Customer\'s use of the Outputs in a manner that violates applicable law or in breach of this Agreement',
          'Customer\'s gross negligence or willful misconduct',
        ],
      },
      {
        sub: '09.3 · Disclaimer of Consequential Damages',
        paras: ['EXCEPT FOR LIABILITY ARISING FROM A PARTY\'S BREACH OF ITS CONFIDENTIALITY OBLIGATIONS (SECTION 5) OR A PARTY\'S INDEMNIFICATION OBLIGATIONS (SECTIONS 9.1 AND 9.2), NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, SPECIAL, EXEMPLARY, PUNITIVE, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND (INCLUDING, BUT NOT LIMITED TO, LOSS OF BUSINESS, REVENUE, OR PROFITS), WHETHER ARISING IN CONTRACT, TORT, OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.'],
      },
      {
        sub: '09.4 · Limitation of Liability',
        paras: [
          'THE TOTAL AGGREGATE LIABILITY OF EITHER PARTY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER TO PROCEPT DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM. Excluded Claims include: indemnification obligations under Section 9, gross negligence or willful misconduct, and Customer\'s obligation to pay undisputed Fees. The Super Cap for confidentiality or data protection breaches is three times (3x) the twelve-month fee total.',
          'Customer acknowledges that Procept has set its fees and entered into this Agreement in reliance upon the limitations of liability and the disclaimers of damages set forth herein, and that these limitations form an essential basis of the bargain between the parties.',
        ],
      },
    ],
  },
  {
    num: '10',
    heading: 'Disclaimer',
    blocks: [
      {
        paras: [
          'EXCEPT FOR THE EXPRESS WARRANTIES AND OBLIGATIONS SET FORTH IN THIS AGREEMENT, THE SERVICES PROVIDED BY PROCEPT ARE PROVIDED ON AN "AS-IS," "AS AVAILABLE," AND "WITH ALL FAULTS" BASIS. PROCEPT HEREBY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WARRANTIES OF QUALITY, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE.',
          'Procept does not warrant that the Services or Customer\'s use of the Services will be uninterrupted, error-free, secure, will meet Customer\'s requirements, or operate in combination with third-party services. No advice or information, whether oral or written, obtained by Customer from Procept or through the Services shall create any warranty not expressly stated in this Agreement.',
        ],
      },
    ],
  },
  {
    num: '11',
    heading: 'Force Majeure',
    blocks: [
      {
        paras: [
          'Neither party shall be liable for any failure or delay in performance under this Agreement (other than for a party\'s payment obligations) due to any cause beyond its reasonable control, including, but not limited to, acts of God, acts of war or terrorism, acts of government, riots, labor strikes, fire, flood, earthquake, or pandemic (a "Force Majeure Event").',
          'The delayed party shall give the other party prompt written notice of such event and use reasonable efforts to resume performance. If a Force Majeure Event continues for more than thirty (30) days, the non-delayed party may terminate this Agreement or the affected Order Form upon written notice.',
        ],
      },
    ],
  },
  {
    num: '12',
    heading: 'Governing Law and Jurisdiction',
    blocks: [
      {
        sub: 'Jurisdiction Detail',
        paras: ['This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles. The parties agree that the exclusive jurisdiction and venue for any dispute resolution proceeding (including arbitration or any permitted court action) shall be in New Castle County, Delaware.'],
      },
    ],
  },
  {
    num: '13',
    heading: 'Assignment',
    blocks: [
      {
        paras: ['Customer may not assign this Agreement without the prior written consent of Procept. Procept may freely assign this Agreement in connection with a merger, reorganization, or sale of all or substantially all of its assets.'],
      },
    ],
  },
  {
    num: '14',
    heading: 'Miscellaneous',
    blocks: [
      {
        sub: '14.1 · Changes to Terms',
        paras: ['Procept may modify these Terms at any time by posting the updated version to its website and updating the "Effective Date." Procept will provide 30 days\' notice of material changes (e.g., by email). Your continued use of the Services after such changes constitutes your acceptance.'],
      },
      {
        sub: '14.2 · Entire Agreement',
        paras: [
          'These Terms, together with all active Order Forms (including online Orders) and the DPA, constitute the entire agreement between the parties regarding its subject matter and supersede all prior negotiations, agreements, and undertakings. This Agreement may be amended only as set forth in Section 14.1.',
          'No provision of this Agreement shall be construed against any party by reason of such party having drafted it. A waiver by either party of a breach of any provision shall not constitute a waiver of the provision itself or any subsequent breach.',
        ],
      },
      {
        sub: '14.3 · Severability',
        paras: ['If any provision of this Agreement is held by a court of competent jurisdiction to be invalid or unenforceable, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions of this Agreement shall remain in full force and effect.'],
      },
      {
        sub: '14.4 · Dispute Resolution by Binding Arbitration',
        paras: [
          'All disputes, claims, or controversies arising out of or relating to this Agreement shall be determined by binding arbitration in New Castle County, Delaware, before one arbitrator. The arbitration shall be administered by JAMS pursuant to its Comprehensive Arbitration Rules and Procedures.',
          'The parties agree that any arbitration shall be conducted in their individual capacities only and not as a class action or other representative action. The arbitrator may not consolidate more than one person\'s or entity\'s claims, and may not otherwise preside over any form of a representative or class proceeding.',
          'The arbitrator shall issue a reasoned written decision and award. The award of the arbitrator shall be final and binding, and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof.',
          'The parties shall share equally the fees and costs of the arbitrator. Each party shall be responsible for its own attorneys\' fees and costs, unless the arbitrator determines that a claim was frivolous or brought for an improper purpose.',
          'Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of its copyrights, trademarks, trade secrets, patents, or other intellectual property rights.',
        ],
      },
    ],
  },
];

const NAV_ITEMS = SECTIONS.map(s => ({ num: s.num, heading: s.heading }));

export function TermsPage() {
  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-black text-white" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-3">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-6 h-6 rounded-md opacity-70" />
            <span className="text-white/40 text-xs tracking-[0.2em] uppercase">Procept Technologies Corp.</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Terms of Service</h1>
          <p className="text-white/30 text-sm">Effective September 16, 2026</p>
        </div>

        {/* Metadata block */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Effective Date', value: 'September 16, 2026' },
            { label: 'Jurisdiction', value: 'New Castle County, Delaware' },
            { label: 'Governing Law', value: 'State of Delaware' },
            { label: 'Parties', value: 'Procept Technologies Corp. & Customer' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-1.5">{item.label}</p>
              <p className="text-sm text-white/70 leading-snug">{item.value}</p>
            </div>
          ))}
        </div>

        {/* In this document */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-12">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-4">In this document</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {NAV_ITEMS.map(item => (
              <span key={item.num} className="text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer">
                {item.heading} <span className="text-white/20">· Section {item.num}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Terms sections */}
        <div className="space-y-14">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <div className="flex items-baseline gap-4 mb-5">
                <span className="text-white/20 font-mono text-sm tabular-nums shrink-0">{section.num}</span>
                <h2 className="text-xl font-medium text-white">{section.heading}</h2>
              </div>

              <div className="space-y-6">
                {section.blocks.map((block, j) => (
                  <div key={j}>
                    {block.sub && (
                      <h3 className="text-sm font-medium text-white/80 mb-3">{block.sub}</h3>
                    )}
                    <div className="space-y-3">
                      {block.paras.map((para, k) => (
                        <p key={k} className="text-sm text-white/50 leading-relaxed">{para}</p>
                      ))}
                    </div>
                    {block.list && (
                      <ul className="space-y-2.5 mt-4">
                        {block.list.map((item, k) => (
                          <li key={k} className="flex items-start gap-3 text-sm text-white/50 leading-relaxed">
                            <span className="w-1 h-1 rounded-full bg-white/30 mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Link to DPA */}
        <div className="mt-12 text-center space-y-2">
          <Link to="/data-processing-addendum" className="block text-sm text-white/40 hover:text-white/70 transition-colors">
            View the Data Processing Addendum →
          </Link>
          <Link to="/privacy" className="block text-sm text-white/40 hover:text-white/70 transition-colors">
            View the Privacy Policy →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/20">Copyright Procept Technologies Corp. 2026. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <span className="text-white/10">·</span>
            <Link to="/data-processing-addendum" className="hover:text-white/60 transition-colors">Data Processing Addendum</Link>
            <span className="text-white/10">·</span>
            <Link to="/terms-of-service" className="hover:text-white/60 transition-colors">Terms & Conditions</Link>
            <span className="text-white/10">·</span>
            <span className="hover:text-white/60 transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
