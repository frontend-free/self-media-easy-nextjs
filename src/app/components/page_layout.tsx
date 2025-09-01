import cn from 'classnames';

interface PageLayoutProps {
  direction?: 'horizontal' | 'vertical';
  start?: React.ReactNode;
  children?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
  startClassName?: string;
  childrenClassName?: string;
  endClassName?: string;
}

function PageLayout({
  direction = 'horizontal',
  start,
  children,
  end,
  className,
  startClassName,
  childrenClassName,
  endClassName,
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        'flex w-full h-full',
        {
          'flex-row': direction === 'horizontal',
          'flex-col': direction === 'vertical',
        },
        className,
      )}
    >
      <div className={cn('flex-none', startClassName)}>{start}</div>
      <div className={cn('flex-1 overflow-auto', childrenClassName)}>{children}</div>
      <div className={cn('flex-none', endClassName)}>{end}</div>
    </div>
  );
}

export { PageLayout };
