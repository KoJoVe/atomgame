import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons"

import { moveParticleDown, moveParticleUp } from "../slices/particle";

import { Cell } from "../types/cell";
import { Game } from "../types/game";
import { InteractionChart } from "../types/interaction";
import { Particle, ParticleColor } from "../types/particle";

export const generateParticleInteractions = () => {
  const interactions: InteractionChart = {
    red: {
      red: { win: "red", loss: "red" },
      blue: { win: "red", loss: "blue" },
      green: { win: "red", loss: "green" },
    },
    blue: {
      red: { win: "blue", loss: "red" },
      blue: { win: "blue", loss: "blue" },
      green: { win: "blue", loss: "green" },
    },
    green: {
      red: { win: "green", loss: "red" },
      blue: { win: "green", loss: "blue" },
      green: { win: "green", loss: "green" },
    }
  }
  return interactions;
}

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