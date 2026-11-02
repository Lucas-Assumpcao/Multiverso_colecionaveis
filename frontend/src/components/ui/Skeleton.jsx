import { classNames } from './classNames';

function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={classNames(
        'animate-shimmer rounded-md bg-borda',
        className,
      )}
      {...props}
    />
  );
}

export function ProdutoCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-card border border-borda bg-white p-4 shadow-card"
    >
      <Skeleton className="mb-4 aspect-square w-full" />
      <Skeleton className="mb-3 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  );
}

export default Skeleton;
