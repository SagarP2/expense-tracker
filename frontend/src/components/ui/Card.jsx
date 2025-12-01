import { twMerge } from 'tailwind-merge';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div 
      className={twMerge(
        'glass rounded-2xl p-6',
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
