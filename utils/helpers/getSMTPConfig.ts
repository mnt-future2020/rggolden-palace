import emailConfigurationSchema from "@/utils/model/settings/emailConfiguration/emailConfigurationSchema";
import { getModel } from "@/utils/helpers/getModel";

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

/**
 * Get SMTP configuration from database or fallback to .env
 */
export async function getSMTPConfig(): Promise<SMTPConfig> {
  try {
    const EmailConfig = getModel(
      "EmailConfiguration",
      emailConfigurationSchema
    );
    const dbConfig = await EmailConfig.findOne();

    if (
      dbConfig &&
      dbConfig.smtpHost &&
      dbConfig.smtpPort &&
      dbConfig.smtpUsername &&
      dbConfig.smtpPassword
    ) {
      return {
        host: dbConfig.smtpHost,
        port: parseInt(dbConfig.smtpPort),
        secure: parseInt(dbConfig.smtpPort) === 465,
        auth: {
          user: dbConfig.smtpUsername,
          pass: dbConfig.smtpPassword,
        },
        from: dbConfig.senderEmail || process.env.SMTP_FROM_EMAIL || "",
      };
    }
  } catch (error: unknown) {
    console.warn(
      "Failed to fetch SMTP config from database, falling back to .env",
      error instanceof Error ? error.message : String(error)
    );
  }

  // Fallback to .env configuration
  return {
    host: process.env.SMTP_HOST || "",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: parseInt(process.env.SMTP_PORT || "587") === 465,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    from: process.env.SMTP_FROM_EMAIL || "",
  };
}
