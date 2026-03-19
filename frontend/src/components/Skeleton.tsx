import React from "react";

interface SkeletonProps {
  count?: number;
  className?: string;
  type?: "text" | "avatar" | "card" | "input";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  className = "",
  type = "text",
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 animate-pulse rounded";

  const typeClasses = {
    text: `${baseClasses} h-4 w-full`,
    avatar: `${baseClasses} h-12 w-12 rounded-full`,
    card: `${baseClasses} h-64 w-full rounded-lg`,
    input: `${baseClasses} h-10 w-full rounded-lg`,
  };

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${typeClasses[type]} ${className} mb-2 last:mb-0`}
    />
  ));

  return <>{items}</>;
};

export const SkeletonCard = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <Skeleton type="avatar" className="mb-4" />
    <Skeleton count={3} className="mb-4" />
    <Skeleton type="input" />
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <Skeleton count={lines} />
);
