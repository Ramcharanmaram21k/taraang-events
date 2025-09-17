import { cn } from "@/lib/utils";

const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={cn("h-10 w-10 text-primary", className)}
    {...props}
  >
    <g transform="translate(10, 10)">
      <path d="M40 0 L40 15" stroke="currentColor" strokeWidth="8" fill="none" />
      <path d="M10 0 L70 0" stroke="currentColor" strokeWidth="8" fill="none" />
      <path d="M40 15 C40 50, 80 50, 80 80" stroke="hsl(var(--primary))" strokeWidth="8" fill="none" />
      <path d="M40 15 C40 50, 0 50, 0 80" stroke="hsl(var(--accent))" strokeWidth="8" fill="none" />
    </g>
  </svg>
);

export default Logo;
