/** Company WhatsApp from existing site copy: +976 99 000 000 */
export const WHATSAPP_DISPLAY = "+976 99 000 000";
export const WHATSAPP_E164_DIGITS = "97699000000";
export const WHATSAPP_PREFILL =
  "Hello! I would like to learn more about your Mongolia tours.";

export function whatsappHref(message: string = WHATSAPP_PREFILL) {
  return `https://wa.me/${WHATSAPP_E164_DIGITS}?text=${encodeURIComponent(message)}`;
}

export function vehicleWhatsappHref(name: string) {
  return whatsappHref(`Hello! I would like to learn more about the ${name}.`);
}

export function googleMapsSearchUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function hasCoords(
  location?: { lat: number; lng: number } | null,
): location is { lat: number; lng: number } {
  return Boolean(
    location &&
      Number.isFinite(location.lat) &&
      Number.isFinite(location.lng) &&
      !(location.lat === 0 && location.lng === 0),
  );
}
