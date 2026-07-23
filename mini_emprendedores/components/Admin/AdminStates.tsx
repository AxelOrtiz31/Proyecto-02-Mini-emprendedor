export function AdminLoading() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}

export function AdminError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="grid min-h-[40vh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-lg font-extrabold text-foreground">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-(--shadow-node) transition-transform active:translate-y-0.5"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
