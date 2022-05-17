import { Particle, ParticleColor } from "../types/particle";

export const generateParticleInteractionPrioritySort = (a: Particle, b: Particle) => {
  if (a.swiftness > b.swiftness) {
    return 1;
  } else if (a.swiftness < b.swiftness) {
    return -1;
  } else if (a.power > b.power) {
    return 1;
  } else if (a.power < b.power) {
    return -1;
  } else if (a.vitality > b.vitality) {
    return 1;
  } else if (a.vitality < b.vitality) {
    return -1;
  }
  return 0;
}

export const generateParticleColor = (particle: Particle): ParticleColor => {
  if (particle.swiftness > particle.power && particle.swiftness > particle.vitality) {
    return "green";
  } else if (particle.power > particle.vitality) {
    return "blue";
  }
  return "red";
}