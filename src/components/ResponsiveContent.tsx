import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface ResponsiveContentProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  mobileCollapsible?: boolean;
}

const ResponsiveContent = ({ 
  title, 
  children, 
  defaultOpen = true,
  className = "",
  mobileCollapsible = true 
}: ResponsiveContentProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // On mobile, use collapsible for content parity
  // On desktop, always show content
  const shouldCollapse = isMobile && mobileCollapsible;

  if (!shouldCollapse) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <div className="space-y-4 leading-relaxed">
          {children}
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <ChevronDown className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 leading-relaxed">
        <div className="pt-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ResponsiveContent;