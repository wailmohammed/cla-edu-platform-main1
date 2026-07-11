export const ENV = {
  appId: process.env.VITE_APP_ID ?? "edu-platform",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // Base URL used to build links in emails (password reset, verification).
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  // Direct Anthropic API (replaces the former Manus "forge" LLM proxy)
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
  // Direct S3 / S3-compatible storage (replaces the former manus-storage proxy)
  s3Bucket: process.env.S3_BUCKET ?? "",
  s3Region: process.env.S3_REGION ?? "auto",
  s3Endpoint: process.env.S3_ENDPOINT ?? "",
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  // Fish Audio API for text-to-speech
  fishAudioApiKey: process.env.FISH_AUDIO_API_KEY ?? "",
};
