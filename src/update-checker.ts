export const isNewerVersion = (latest: string, current: string): boolean => {
  const l = latest.split(".").map(Number);
  const c = current.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((l[i] ?? 0) > (c[i] ?? 0)) return true;
    if ((l[i] ?? 0) < (c[i] ?? 0)) return false;
  }
  return false;
};

export const checkForUpdate = async (
  packageName: string,
  currentVersion: string,
): Promise<void> => {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${packageName}/latest`,
    );
    if (!response.ok) return;
    const data = (await response.json()) as { version: string };
    if (isNewerVersion(data.version, currentVersion)) {
      process.stderr.write(
        `\n  Update available: ${currentVersion} → ${data.version}\n` +
          `  Run: npm install -g ${packageName}@latest\n\n`,
      );
    }
  } catch {
    // Best-effort — silently ignore network errors
  }
};
