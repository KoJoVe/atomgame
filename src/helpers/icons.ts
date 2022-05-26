import { IconType } from "react-icons";

import {
  BsArrowBarUp,
  BsArrowBarDown, 
  BsBullseye,
  BsFillLightningChargeFill 
} from "react-icons/bs";

export type Icons = 
  "ArrowUpIcon" |
  "ArrowDownIcon" |
  "ViewIcon" |
  "LightiningIcon"

export const iconComponents: { [key in Icons]: IconType } = {
  ArrowUpIcon: BsArrowBarUp,
  ArrowDownIcon: BsArrowBarDown,
  ViewIcon: BsBullseye,
  LightiningIcon: BsFillLightningChargeFill,
}