export default function GamisSvg({ className, ...props }) {
  return (
    <svg
      width="96"
      height="120"
      viewBox="0 0 96 120"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M34 8h28l10 16 14 30-10 6-6-10v58H26V50l-6 10-10-6 14-30z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M42 8c2 8 10 8 12 0" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}