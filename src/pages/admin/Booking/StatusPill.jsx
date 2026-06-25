
const StatusPill = ({ color, text }) => {
  return (
    <span className={`custom-badge ${color}`}>
      <span className="dot"></span>
      {text}
    </span>
  );
};

export default StatusPill;