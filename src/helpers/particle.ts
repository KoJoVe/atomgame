export type ParticleColor = "red" | "blue" | "green";
export type ParticleProperties = "vitality" | "power" | "swiftness" | "id";

export const particleColorMap: { [key in ParticleColor]: ParticleProperties } = {
  red: "vitality",
  blue: "power",
  green: "swiftness"
}
