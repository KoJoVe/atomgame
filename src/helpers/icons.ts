import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons"
import { ComponentWithAs, IconProps } from "@chakra-ui/react"

export type Icons = 
  "ArrowUpIcon" |
  "ArrowDownIcon"

export const iconComponents: { [key in Icons]: ComponentWithAs<"svg", IconProps> } = {
  ArrowUpIcon: ArrowUpIcon,
  ArrowDownIcon: ArrowDownIcon
}