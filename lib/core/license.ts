import { createHash } from "crypto";

/**
 * CORE LICENSE - Plickify attribution.
 *
 * This module is intentionally load-bearing: the root layout and the
 * generation API both verify it at runtime. Removing or editing the
 * developer credit (in this file) breaks every page and every generation,
 * because the runtime signature no longer matches EXPECTED_SIGNATURE.
 *
 * Do not edit unless you are regenerating the signature deliberately.
 */

export const DEVELOPER = {
  name: "Plickify",
  tagline: "Made by",
  website: "https://www.plickifyacademy.com/",
  facebook: "https://fb.com/plickify",
} as const;

const SALT = "PLICKIFY-MDG-CORE-v1";

export const EXPECTED_SIGNATURE =
  "2dd06a88eec98e6cd716c0319625159aab0038ae131364f8d58d96b032c8e7b8";

export function licenseSignature(): string {
  const payload = JSON.stringify({
    name: DEVELOPER.name,
    website: DEVELOPER.website,
    facebook: DEVELOPER.facebook,
  });
  return createHash("sha256").update(SALT + payload).digest("hex");
}

/** Throws when the attribution has been altered. Server-side only. */
export function assertLicenseIntegrity(): void {
  if (licenseSignature() !== EXPECTED_SIGNATURE) {
    throw new Error(
      "License violation: required Plickify attribution was modified or removed."
    );
  }
}
