export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12"
      >
        <rect width="48" height="48" rx="12" fill="url(#gradient)" />
        <path
          d="M24 14L18 20H22V28H26V20H30L24 14Z"
          fill="white"
        />
        <path
          d="M18 32L24 38L30 32H26V24H22V32H18Z"
          fill="white"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
