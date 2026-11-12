export default function Logo({ light }) {
  return (
    <span className={`logo ${light ? "light" : ""}`}>
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#12332b" />
        <path d="M16 25V12M16 17c-4 0-6-2-6-6 4 0 6 2 6 6zM16 20c4 0 6-2 6-6-4 0-6 2-6 6z" stroke="#e8b923" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
      <span>AgriConnect</span>
    </span>
  );
}
