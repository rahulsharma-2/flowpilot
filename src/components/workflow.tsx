const nodes = [
  {
    icon: '↙',
    label: 'New enquiry',
    detail: 'Your website starts the conversation',
  },
  {
    icon: '✳',
    label: 'A little intelligence',
    detail: 'Organise, qualify, and prepare',
  },
  {
    icon: '◎',
    label: 'The right place',
    detail: 'Your CRM. Your inbox. Your team.',
  },
];
export function Workflow() {
  return (
    <div
      className="workflow"
      aria-label="Example workflow: a website enquiry is organised using AI and sent to your business tools"
    >
      {nodes.map((node, index) => (
        <div className="workflow-step" key={node.label}>
          <div className="workflow-node">
            <span className="node-icon" aria-hidden="true">
              {node.icon}
            </span>
            <div>
              <span className="micro">STEP 0{index + 1}</span>
              <h3>{node.label}</h3>
              <p>{node.detail}</p>
            </div>
            <span className="status-dot" aria-hidden="true" />
          </div>
          {index < 2 && (
            <span className="connector" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
