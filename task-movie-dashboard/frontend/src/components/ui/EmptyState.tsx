import { Film, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  const defaultIcon = <Film className="w-16 h-16 text-white" />;
  return (
    <div className="min-h-screen bg-[#093545] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-[#092C39] rounded-lg p-8 md:p-12 max-w-md mx-auto">
          <div className="flex justify-center mb-6">{icon || defaultIcon}</div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            {title}
          </h2>
          {description && <p className="text-gray-300 mb-6">{description}</p>}
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 bg-[#2BD17E] text-white px-6 py-3 rounded-lg hover:bg-[#25B86A] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{actionText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
