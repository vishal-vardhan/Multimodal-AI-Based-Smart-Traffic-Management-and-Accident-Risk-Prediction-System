// src/components/navigation/NavButton.jsx
//
// Untitled UI NavButton Component
// Clean icon button with tooltip support and floating badge indicator.

export function NavButton({
  icon: Icon,
  label,
  href,
  onClick,
  badge = null,
  className = '',
  title = ''
}) {
  const content = (
    <>
      {Icon && <Icon size={18} className="nav-btn-icon" />}
      {badge !== null && badge !== undefined && (
        <span className="nav-btn-badge" aria-label={`${badge} unread notifications`}>
          {badge}
        </span>
      )}
    </>
  );

  const buttonTitle = title || label;

  if (href) {
    return (
      <a
        href={href}
        className={`nav-btn ${className}`}
        aria-label={label}
        title={buttonTitle}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`nav-btn ${className}`}
      aria-label={label}
      title={buttonTitle}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
