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
      className="flex h-full flex-col overflow-hidden rounded-card border border-borda bg-white shadow-card"
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col p-4">
        <div className="min-h-12">
          <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="mt-2 h-10 w-full" />
        <div className="mt-auto pt-4">
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
      <div className="px-4 pb-4">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default Skeleton;
