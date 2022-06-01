import React, { FunctionComponent } from "react";
import { Box, Icon, Text, theme, Tooltip } from "@chakra-ui/react";

import { generateParticleColor } from "../generators/particle";

import { polarToCartesian } from "../helpers/coordinates";
import { ParticleColor } from "../helpers/particle";
import { iconComponents } from "../helpers/icons";
import { ColorWeight } from "../helpers/color";
import { Icons } from "../helpers/icons";

import { Cell } from "../types/cell";

export interface BoardProps {
  cells: Cell[][];
  current?: number;
  hoveredCell?: { sector: number; level: number; }
  onClickCell: (cell: Cell) => void;
  onEnterCell: (cell: Cell) => void;
  onLeaveCell: (cell: Cell) => void;
}

export const Board: FunctionComponent<BoardProps> = (props) => {
  const width = (props as any).w || 0;  
  const padding = 10;
  const radius = width/2 - (2*padding);

  const getBoardStyle = () => {
    return {
      left: `${padding}px`,
      top: `${padding}px`,
    }
  }
  
  const getCellFillColor = (sector: number, level: number, weight?: ColorWeight) => {
    const cWEmpty = props.hoveredCell?.level === level && props.hoveredCell?.sector === sector ? (level%2 !== 0 ? 100 : 200) : (level%2 !== 0 ? 200 : 300);
    const cwColor = Boolean(weight) ? weight! : props.hoveredCell?.level === level && props.hoveredCell?.sector === sector ? 200 : 400;

    if (props.cells[sector][level] && props.cells[sector][level].particle && generateParticleColor(props.cells[sector][level].particle!)) {
      return `${theme.colors[generateParticleColor(props.cells[sector][level].particle!) as ParticleColor][cwColor]}`
    }

    return `${theme.colors.gray[cWEmpty as ColorWeight]}`;
  }

  const getBoardCells = () => {
    if (!props.cells.length) {
      return [];
    }

    const angle = 360/props.cells.length;
    const r = radius || 0;
    let cells: any[][] = [];

    for (let i = 0; i < props.cells.length; i++) {
      cells.push([]);
      for (let j = 0; j < props.cells[i].length; j++) {
        const cell = props.cells[i][j];
        const level = cell.level;
        const sector = cell.sector;
        const start = angle * i;
        const end = angle * i + angle;
        const largeArc = end - start <= 180 ? "0" : "1";

        const outerSize = (level + 2)/(props.cells[i].length + 1);
        const outerStart = polarToCartesian(r, r, r*outerSize, end);
        const outerEnd = polarToCartesian(r, r, r*outerSize, start);

        const innerSize = (level + 1)/(props.cells[i].length + 1);
        const innerStart = polarToCartesian(r, r, r*innerSize, end);
        const innerEnd = polarToCartesian(r, r, r*innerSize, start);
    
        const d = [
          "M", outerStart.x, outerStart.y,
          "A", r * outerSize, r * outerSize, 0, largeArc, 0, outerEnd.x, outerEnd.y,
          "L", innerEnd.x, innerEnd.y,
          "A", r * innerSize, r * innerSize, 0, largeArc, 1, innerStart.x, innerStart.y,
          "Z"
        ].join(" ");   

        cells[i].push({
          ...cell,
          d,
          level,
          sector,
          radius: r*(innerSize + (outerSize - innerSize)/2),
          rotation: start + (end - start)/2
        });
      }
    }   
    return cells;
  }
  
  return (
    <Box>
      <Text borderBottom={`1px solid ${theme.colors.gray[200]}`} maxW={250} mt={25} ml={25} fontSize={`sm`}>Formation Framework</Text>
      <Box position={`relative`} style={getBoardStyle()} >
        <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`} 
          width={radius * 2} 
          height={radius * 2} >
            { 
              getBoardCells().map((column, i) => column.map((cell, j) => 
                <Tooltip key={`tooltip-${i}-${j}`}  label={cell.particle && `V:${cell.particle.vitality} P:${cell.particle.power} S:${cell.particle.swiftness}`}>
                  <path
                    key={`cell-${i}-${j}`} 
                    d={cell.d}
                    onMouseEnter={() => props.onEnterCell(cell) } 
                    onMouseLeave={() => props.onLeaveCell(cell) }
                    onClick={() => props.onClickCell(cell)}
                    fill={getCellFillColor(cell.sector, cell.level)} 
                    stroke={`white`}
                    strokeWidth={1} 
                    fillRule="evenodd"
                    style={({ cursor: "pointer" })} >
                  </path>
                </Tooltip>
              ))
            }
        </svg>
        {
          getBoardCells().map((column, i) => column.map((cell, j) => {
            let icon = { component: cell.icon && iconComponents[cell.icon as Icons] };

            const isCurrent = props.current !== undefined && (cell as Cell).particle?.id === props.current;
            if (isCurrent) {
              icon = { component: iconComponents["ViewIcon"] };
            }
            
            return (cell.icon || isCurrent) ? <Icon
              as={icon.component}

              color={ isCurrent || cell.particle ? `white` : `black` }
              key={`overlay-${i}-${j}`} 
              pos={`absolute`}
              cursor={`pointer`}
              left={`${polarToCartesian(radius, radius, cell.radius, cell.rotation).x}px`} 
              top={`${polarToCartesian(radius, radius, cell.radius, cell.rotation).y}px`}
              transform={`translate(-50%, -50%) rotate(${cell.rotation}deg)`}
              animation={!isCurrent ? `${cell.glow || 1000}ms infinite icon` : ``}

              onClick={() => props.onClickCell(cell)}
              onMouseEnter={() => props.onEnterCell(cell) } 
              onMouseLeave={() => props.onLeaveCell(cell) }
            /> :  
            cell.particle && <Box
              userSelect={`none`}
              color={ isCurrent || cell.particle ? `white` : `black` }
              key={`overlay-${i}-${j}`} 
              pos={`absolute`}
              cursor={`pointer`}
              left={`${polarToCartesian(radius, radius, cell.radius, cell.rotation).x}px`} 
              top={`${polarToCartesian(radius, radius, cell.radius, cell.rotation).y}px`}
              transform={`translate(-50%, -50%)`}

              onClick={() => props.onClickCell(cell)}
              onMouseEnter={() => props.onEnterCell(cell) } 
              onMouseLeave={() => props.onLeaveCell(cell) }
            >
              <Text fontSize={14} textAlign={`center`}>
                {`${
                  cell.particle.vitality +
                  cell.particle.power +
                  Math.abs(cell.particle.swiftness)
                }`}
              </Text>
              {/* <Text fontSize={6}>
                { `${cell.particle.vitality}/${cell.particle.power}/${Math.abs(cell.particle.swiftness)}` }                
              </Text> */}
            </Box>
          }))
        }
      </Box>
    </Box>
  );
}


export default Board;
