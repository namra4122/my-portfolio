import { content } from "./content"

/** Canonical origin of the site, without a trailing slash. */
export const SITE_URL = (content.contact.website ?? "https://maniarnamra.com").replace(/\/+$/, "")
