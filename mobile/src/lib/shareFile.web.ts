/** captureRef's result in the browser: a data URL (it has no files). */
export const CAPTURE_RESULT = 'data-uri' as const;

/** The browser's share sheet with the image, or a download where it cannot share files. */
export async function shareImageFile(uri: string) {
  const file = await fileOf(uri, 'namaq.png');
  // Safari may refuse a share that comes long after the tap: then the image is downloaded instead.
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (error) { if ((error as Error).name === 'AbortError') return; }
  }
  download(file);
}

const fileOf = async (uri: string, name: string) => new File([await (await fetch(uri)).blob()], name, { type: 'image/png' });

function download(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The browser has no photos: each picture is downloaded, numbered in order. */
export async function saveImageFiles(uris: string[]): Promise<boolean> {
  for (const [i, uri] of uris.entries()) download(await fileOf(uri, `namaq-${i + 1}.png`));
  return true;
}
