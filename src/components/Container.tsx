import { cn } from "@/lib/utils";

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1400px]`,
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Container;
