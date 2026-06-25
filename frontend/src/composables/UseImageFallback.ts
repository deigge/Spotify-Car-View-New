/**
 * Composable für ein Fallback-Bild bei fehlgeschlagenem Image-Load.
 *
 * Verhalten:
 * - wird als onError Handler für <img> genutzt
 * - ersetzt defektes Bild durch ein Fallback
 * - verhindert Endlosschleife, falls auch das Fallback fehlschlägt
 *
 * @param fallback - URL des Ersatzbildes
 */
export function useImageFallback(fallback: string) {
  return (e: Event) => {
    const img = e.target as HTMLImageElement;

    // Falls kein gültiges Image-Element vorhanden ist → abbrechen
    if (!img) return;

    // Schutz gegen Endlosschleife:
    // wenn das Fallback selbst fehlschlägt, nichts mehr ändern
    if (img.src === fallback) return;

    img.src = fallback;
  };
}
