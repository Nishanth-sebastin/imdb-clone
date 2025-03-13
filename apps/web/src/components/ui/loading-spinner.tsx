import { Loader2, LucideProps } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface IProps extends LucideProps {
  className?: string;
}

export const LoadingSpinner = ({ className, ...props }: IProps) => {
  return <Loader2 className={cn('animate-spin', className)} {...props} />;
};
