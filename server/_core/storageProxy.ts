// Serves /storage/{key} by redirecting to a signed S3 URL.
// Replaces the former Manus /manus-storage/* proxy.
import { storageGetSignedUrl } from "../storage";

export function registerStorageProxy(app: any) {
  app.get("/storage/*", async (req: any, res: any) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    try {
      const url = await storageGetSignedUrl(key);
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
