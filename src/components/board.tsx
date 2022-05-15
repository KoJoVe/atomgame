import React, { FunctionComponent, useState } from "react";
import { Box, Text, theme } from "@chakra-ui/react";

import { useWindowDimensions } from "../hooks/window";

import { generateParticleColor } from "../generators/particle";

import { polarToCartesian } from "../helpers/coordinates";

import { ColorWeight } from "../types/color";
import { ParticleColor } from "../types/particle";
import { Cell } from "../types/cell";
import { Game } from "../types/game";

export interface BoardUIState {
  cellHovered?: {
    sector: number;
    level: number;
  };
}

export interface BoardProps {
  game: Game;
  onClickCell: (cell: Cell) => void;
}

export const Board: FunctionComponent<BoardProps> = (props) => {
  const [ui, setUi] = useState<BoardUIState>({});
  const { width } = useWindowDimensions();
  
  const radius = width/5;
  const padding = 25;

  const getBoardStyle = () => {
    return { 
      margin: `auto`,
      marginTop: `${50}`
    }
  }
  
  const getCellFillColor = (sector: number, level: number, weight?: ColorWeight) => {
    const cWEmpty = ui.cellHovered?.level === level && ui.cellHovered.sector === sector ? (level%2 !== 0 ? 100 : 200) : (level%2 !== 0 ? 200 : 300);
    const cwColor = Boolean(weight) ? weight! : ui.cellHovered?.level === level && ui.cellHovered.sector === sector ? 200 : 400;
    if (props.game.board[sector][level] && props.game.board[sector][level].particle && generateParticleColor(props.game.board[sector][level].particle!)) {
      return `${theme.colors[generateParticleColor(props.game.board[sector][level].particle!) as ParticleColor][cwColor]}`
    }
    return `${theme.colors.gray[cWEmpty as ColorWeight]}`;
  }

  const getBoardCells = () => {
    if (!props.game.board.length) {
      return [];
    }

    const angle = 360/props.game.board.length;
    const r = radius - padding;
    let cells: any[][] = [];

    for (let i = 0; i < props.game.board.length; i++) {
      cells.push([]);
      for (let j = 0; j < props.game.board[i].length; j++) {
        const cell = props.game.board[i][j];
        const level = cell.level;
        const sector = cell.sector;
        const start = angle * i;
        const end = angle * i + angle;
        const largeArc = end - start <= 180 ? "0" : "1";

        const outerSize = (level + 2)/(props.game.board[i].length + 1);
        const outerStart = polarToCartesian(r, r, r*outerSize, end);
        const outerEnd = polarToCartesian(r, r, r*outerSize, start);

        const innerSize = (level + 1)/(props.game.board[i].length + 1);
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

  const isCellActive = (cell: Cell) => {
    return props.game.current &&
      props.game.current.level === cell.level &&
      props.game.current.sector === cell.sector;
  }
  
  return (
    <Box>
      <Text borderBottom={`1px solid ${theme.colors.gray[200]}`} maxW={250} mt={25} ml={25} fontSize={`sm`}>Formation Framework</Text>
      <Box position={`relative`}>
        <svg style={getBoardStyle()} 
          viewBox={`0 0 ${radius * 2} ${radius * 2}`} 
          width={radius * 2} 
          height={radius * 2} >
            { 
              getBoardCells().map(column => column.map(cell => <>
                <path 
                  d={cell.d}
                  onMouseEnter={() => setUi({ ...ui, cellHovered: isCellActive(cell) ? undefined : { level: cell.level, sector: cell.sector } })} 
                  onMouseLeave={() => setUi({ ...ui, cellHovered: undefined })}
                  onClick={() => props.onClickCell(cell)}
                  fill={getCellFillColor(cell.sector, cell.level)} 
                  stroke={`white`}
                  strokeWidth={1} 
                  fillRule="evenodd"
                  style={({ cursor: "pointer" })} >
                    {
                      (isCellActive(cell) || cell.glow) &&
                        <animate
                          attributeName="fill" 
                          values={`
                            ${cell.glow ? `
                              ${getCellFillColor(cell.sector, cell.level, 300)};
                              ${getCellFillColor(cell.sector, cell.level, 200)};
                              ${getCellFillColor(cell.sector, cell.level, 300)};
                              ${getCellFillColor(cell.sector, cell.level, 300)};
                              ${getCellFillColor(cell.sector, cell.level, 300)};
                              ${getCellFillColor(cell.sector, cell.level, 300)};
                              ${getCellFillColor(cell.sector, cell.level, 300)};
                              ${getCellFillColor(cell.sector, cell.level, 300)};
                              ` : `
                              ${getCellFillColor(cell.sector, cell.level, 400)};
                              ${getCellFillColor(cell.sector, cell.level, 200)};
                              ${getCellFillColor(cell.sector, cell.level, 400)};
                              `}
                          `} 
                          dur={`${cell.glow || 5000}ms`} 
                          repeatCount="indefinite" />
                    }            
                </path>
              </>))
            }
        </svg>
        {
          getBoardCells().map(column => column.map(cell => {
            return cell.icon && <cell.icon 
              pos={`absolute`}
              cursor={`pointer`}
              onClick={() => props.onClickCell(cell)}
              onMouseEnter={() => setUi({ ...ui, cellHovered: isCellActive(cell) ? undefined : { level: cell.level, sector: cell.sector } })} 
              onMouseLeave={() => setUi({ ...ui, cellHovered: undefined })}
              left={`${polarToCartesian(radius, radius, cell.radius, cell.rotation).x}px`} 
              top={`${polarToCartesian(radius, radius, cell.radius, cell.rotation).y}px`}
              transform={`translate(-50%, -50%) rotate(${cell.rotation}deg)`}
              animation={`${cell.glow || 1000}ms infinite icon`}
            />}))
        }
      </Box>
    </Box>
  );
}


export default Board;
