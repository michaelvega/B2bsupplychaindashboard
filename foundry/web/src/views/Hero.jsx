import React from 'react';
import { Button, Icon } from '../ui/index.js';
import '../styles/onboarding.css';

/**
 * First-visit empty-state intro.
 * Props:
 *  - hasKey: boolean  OpenRouter key saved
 *  - hasCsv: boolean  a dataset is loaded
 *  - onPreset(): scroll/jump to the preset cards ("Start with a preset")
 *  - onUseOwn(): jump to "Use my own data"
 *  - onOpenKey(): open KeyGate (the checklist key item becomes a link when missing)
 */
export function Hero({ hasKey = false, hasCsv = false, onPreset, onUseOwn, onOpenKey }) {
  const Item = ({ ok, children }) => (
    <li><span className={ok ? 'is-ok' : 'is-no'}><Icon name={ok ? 'check' : 'x'} size={14} title={ok ? 'Done' : 'Missing'} /></span>{children}</li>
  );
  return (
    <section className="pfo-hero" aria-labelledby="pfo-hero-h">
      <div className="pf-kicker">PROCEPT RSI / NO-GPU ALTERNATIVE TO LORA</div>
      <h1 id="pfo-hero-h">Fine-tune without the <em>GPUs</em>.</h1>
      <p className="pfo-hero-sub">Give us a CSV. We learn a short list of rules from your examples and hand you a snippet for your system prompt. No training run. No weights to host.</p>
      <ul className="pfo-bullets">
        <li><strong>No GPUs</strong>An optimization loop over prompts, not a training job. It runs in this tab.</li>
        <li><strong>Rules you can read</strong>Every rule is a plain sentence, tested on held-out rows before it is kept.</li>
        <li><strong>A snippet you own</strong>Paste the output into any system prompt. Works with any model.</li>
      </ul>
      <div className="pfo-cta">
        <Button variant="primary" size="lg" icon="arrow-right" onClick={onPreset}>Start with a preset</Button>
        <Button size="lg" onClick={onUseOwn}>Use my data</Button>
      </div>
      <div className="pf-kicker" style={{ marginBottom: 10 }}>WHAT YOU NEED</div>
      <ul className="pfo-need">
        <Item ok={hasKey}>{hasKey ? 'OpenRouter key saved' : <>OpenRouter key. <button type="button" onClick={onOpenKey}>Add it</button></>}</Item>
        <Item ok={hasCsv}>{hasCsv ? 'Dataset loaded' : 'A CSV with an input column and a way to grade answers (or pick a preset)'}</Item>
      </ul>
    </section>
  );
}
export default Hero;
