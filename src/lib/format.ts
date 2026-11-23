export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const regionLabels: Record<string, string> = {
  gobi: "Gobi",
  altai: "Altai",
  central: "Central",
  north: "North",
  wildlife: "Wildlife",
  mixed: "Gobi & Central",
  anywhere: "Anywhere in Mongolia",
};

export const styleLabels: Record<string, string> = {
  any: "Any style",
  "4x4": "4x4 Expeditions",
  ger: "Ger Camps",
  trek: "Camel & Horse Treks",
  homestay: "Nomad Homestays",
  wildlife: "Wildlife & Photo Tours",
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const driveModeLabels: Record<string, string> = {
  "self-drive": "Self-drive",
  "with-driver": "With driver",
};
