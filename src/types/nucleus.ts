import { Color } from "../helpers/color";

export type Nucleus = {
  particles: {
    [key in Color]: number;
  }
  highlighted?: boolean;
}