import { sealData, unsealData } from "iron-session";

if (!process.env.ENCRYPTION_ALGORITHM) {
  throw new Error("No encryption algorithm present");
}

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("No encryption key present");
}

const KEY = process.env.ENCRYPTION_KEY;

export async function encrypt(text: string) {
  return await sealData(text, { password: KEY });
}

export async function decrypt(sealed: string) {
  return await unsealData(sealed, { password: KEY });
}
