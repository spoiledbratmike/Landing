type IconProps = { className?: string };

export const SunIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const OneToOneIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <circle cx="17.5" cy="6.5" r="2.2" />
    <path d="M15 14.5a4 4 0 0 1 6 3.5" />
  </svg>
);

export const GroupIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="3" />
    <circle cx="5" cy="10" r="2.2" />
    <circle cx="19" cy="10" r="2.2" />
    <path d="M6.5 20a5.5 5.5 0 0 1 11 0M2 18a3.5 3.5 0 0 1 4-3M22 18a3.5 3.5 0 0 0-4-3" />
  </svg>
);

export const CourseIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6.5A2 2 0 0 1 5 5h5v14H5a2 2 0 0 0-2 1.5zM21 6.5A2 2 0 0 0 19 5h-5v14h5a2 2 0 0 1 2 1.5z" />
    <path d="M12 5v14" />
  </svg>
);

export const LotusIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c-4 0-7-2.5-8-6 2 .4 3.6 1.4 4.8 2.6M12 21c4 0 7-2.5 8-6-2 .4-3.6 1.4-4.8 2.6" />
    <path d="M12 21c-2.2-1-3.6-3.4-3.6-6.2 0-1.2.4-2.4 1-3.4M12 21c2.2-1 3.6-3.4 3.6-6.2 0-1.2-.4-2.4-1-3.4" />
    <path d="M12 20c0-4 0-7 0-9 1.6 1.4 2.4 3.6 2.4 5.6M12 20c0-4 0-7 0-9-1.6 1.4-2.4 3.6-2.4 5.6" />
  </svg>
);

export const HeartIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7C19 15.7 12 20 12 20z" />
  </svg>
);

export const CompassIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
);

export const SparkIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M12 8l1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2z" />
  </svg>
);

export const QuoteIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c.3 0 .6 0 .9-.1C7.8 16.7 6.4 18 4.5 18.7l.6 1.3c3-1 5.4-3.5 5.4-7.5V10.5C10.5 8 8.5 6 7.5 6zm11 0C16 6 14 8 14 10.5s2 4.5 4.5 4.5c.3 0 .6 0 .9-.1-.6 1.8-2 3.1-3.9 3.8l.6 1.3c3-1 5.4-3.5 5.4-7.5V10.5C21.5 8 19.5 6 18.5 6z" />
  </svg>
);

export const ArrowIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const CheckIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const MailIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

export const PhoneIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);
