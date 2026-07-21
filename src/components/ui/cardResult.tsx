export const CardResult = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
        <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted-foreground)]">{title}</span>
                  <span className="font-medium">
                    {children}
                  </span>
                </div>
    )
}