export type ParticleColor = "red" | "blue" | "green"
export type ParticleProperties = "vitality" | "power" | "swiftness"

export type Particle = {
  [key in ParticleProperties]: number; 
} 