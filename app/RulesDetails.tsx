import { ruleCategories } from "./rulesContent";

// Accessible, always-present detail view for the full confirmed rule text.
// Native <details>/<summary> gives keyboard support and a sensible
// no-JS/reduced-motion fallback for free; RulesScene's pinned chips only
// ever summarize what's here, never replace it.
export default function RulesDetails() {
  return (
    <div className="kok-rule-details">
      {ruleCategories.map((rule, index) => (
        <details key={rule.no} open={index === 0}>
          <summary>
            <span>{rule.no}</span>
            <strong>{rule.ja}</strong>
            <small>{rule.en}</small>
          </summary>
          <div className={rule.bodyClassName ? `kok-rule-detail-body ${rule.bodyClassName}` : "kok-rule-detail-body"}>
            {rule.body}
          </div>
        </details>
      ))}
    </div>
  );
}
