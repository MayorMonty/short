import React, { useEffect, useRef } from "react";

export type VisibleCanaryProps = {
  onVisible: () => void;
  onlyIf?: boolean;
  children: React.ReactNode;
};

const VisibleCanary: React.FC<VisibleCanaryProps> = ({
  onVisible,
  children,
  onlyIf = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && onlyIf) onVisible();
      }
    });

    intersectionObserver.observe(element);

    return () => intersectionObserver.unobserve(element);
  }, [ref, onVisible]);

  return <div ref={ref}>{children}</div>;
};

export default VisibleCanary;
