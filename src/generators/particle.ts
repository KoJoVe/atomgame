import { ParticleColor } from "../helpers/particle";
import { Particle } from "../types/particle";

export const generateEmptyParticle = (): Particle => {
  return {
    vitality: 0,
    power: 0,
    swiftness: 0,
    id: -1
  }
}

export const generateParticleInteractionPrioritySort = (a: Particle, b: Particle) => {
  if (Math.abs(a.swiftness) > Math.abs(b.swiftness)) {
    return -1;
  } else if (Math.abs(a.swiftness) < Math.abs(b.swiftness)) {
    return 1;
  } else if (a.power > b.power) {
    return -1;
  } else if (a.power < b.power) {
    return 1;
  } else if (a.vitality > b.vitality) {
    return -1;
  } else if (a.vitality < b.vitality) {
    return 1;
  }
  return 0;
}

export const generateParticleColor = (particle: Particle): ParticleColor => {
  const swiftness = Math.abs(particle.swiftness);
  if (swiftness > particle.power && swiftness > particle.vitality) {
    return "green";
  } else if (particle.power > particle.vitality) {
    return "blue";
  }
  return "red";
}