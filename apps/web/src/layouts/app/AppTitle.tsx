type AppTitleProps = {
  title: string;
  subtitle?: string;
};

export function AppTitle({ title, subtitle }: AppTitleProps) {
  return (
    <div className="flex min-w-0 flex-col">
      <h1 className="truncate font-display text-title-sm font-bold tracking-tight">{title}</h1>
      {subtitle === undefined ? null : <span className="truncate text-caption text-(--text-muted)">{subtitle}</span>}
    </div>
  );
}
