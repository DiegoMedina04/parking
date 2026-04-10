import { BackButton } from '../common/BackButton';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, showBack = true, action }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="space-y-4">
        {showBack && <BackButton />}
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 mt-1 font-medium">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <div className="flex items-center">
          {action}
        </div>
      )}
    </div>
  );
};
