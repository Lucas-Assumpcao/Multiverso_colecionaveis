import { PackageOpen } from 'lucide-react';

function EmptyState({
  icon: Icon = PackageOpen,
  title,
  text,
  action,
  headingLevel = 2,
}) {
  const Heading = headingLevel === 1 ? 'h1' : headingLevel === 3 ? 'h3' : 'h2';

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <Icon aria-hidden="true" className="mb-4 size-12 text-roxo-claro" />
      <Heading className="mb-2 text-xl font-bold text-roxo">{title}</Heading>
      {text && <p className="max-w-md text-suave">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;
