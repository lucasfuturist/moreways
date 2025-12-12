import crypto from "crypto";
import { env } from "@/infra/config/infra.svc.envConfig";

const ALGORITHM = "aes-256-gcm";
// Ensure you add ENCRYPTION_KEY to your .env (32 chars / 64 hex)
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || "0".repeat(64), "hex");

export interface EncryptedPayload {
  iv: string;
  content: string;
  tag: string;
}

export const EncryptionService = {
  encrypt(text: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");

    // Format: iv:tag:content
    return `${iv.toString("hex")}:${tag}:${encrypted}`;
  },

  decrypt(packed: string): string | null {
    try {
      const parts = packed.split(":");
      if (parts.length !== 3) return null; // Not encrypted or malformed

      const [ivHex, tagHex, contentHex] = parts;
      
      const decipher = crypto.createDecipheriv(
        ALGORITHM, 
        ENCRYPTION_KEY, 
        Buffer.from(ivHex, "hex")
      );
      
      decipher.setAuthTag(Buffer.from(tagHex, "hex"));

      let decrypted = decipher.update(contentHex, "hex", "utf8");
      decrypted += decipher.final("utf8");
      
      return decrypted;
    } catch (err) {
      console.error("[Encryption] Decryption failed", err);
      return null;
    }
  }
};