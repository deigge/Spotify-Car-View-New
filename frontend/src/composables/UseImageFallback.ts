export function useImageFallback(fallback: string) {
  return (e: Event) => {
    const img = e.target as HTMLImageElement;

    if (!img) return;
    if (img.src === fallback) return;

    img.src = fallback;
  };
}
