/** captureRef's result in the browser: a data URL (it has no files). */
export const CAPTURE_RESULT = 'data-uri' as const;

/** The browser's share sheet with the image, or a download where it cannot share files. */
export async function shareImageFile(uri: string) {
  const blob = await (await fetch(uri)).blob();
  const file = new File([blob], 'namaq.png', { type: 'image/png' });
  // Safari may refuse a share that comes long after the tap: then the image is downloaded instead.
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (error) { if ((error as Error).name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
