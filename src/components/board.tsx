import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Text, theme } from "@chakra-ui/react";

import { polarToCartesian } from "../helpers/coordinates";
import { Color, ColorWeight } from "../helpers/color";

import { Cell } from "../types/cell";
import { Nucleus } from "../types/nucleus";
import { Card } from "../types/card";

export interface BoardProps {
  mode?: 'board' | 'card';
  cells: Cell[][];
  nucleus: Nucleus;
  current?: Card;
  deleting?: boolean;
  middleButton?: 'extracting' | 'fusing';
  onClickCell?: (cell: Cell) => void;
  onEnterCell?: (cell: Cell) => void;
  onLeaveCell?: (cell: Cell) => void;
  onClickButton?: () => void;
  onClickNucleus?: () => void;
  onEnterNucleus?: () => void;
  onLeaveNucleus?: () => void;
  w?: number;
}

export const Board: FunctionComponent<BoardProps> = (props) => {
  const [rotation, setRotation] = useState(0);

  // let animRefs = {} as any;
  // for (let i = 0; i < COLUMNS; i++) {
  //   for (let j = 0; j < LEVELS; j++) {
  //     animRefs[`${i}-${j}`] = useRef(null); // eslint-disable-line react-hooks/rules-of-hooks
  //   }
  // }
  
  const boardMode = props.mode || "board";
  const width = props.w || 0;  
  const padding = boardMode === "card" ? 10 : 10;
  const textOffset = 8;
  const border = boardMode === "card" ? 1 : 2;
  const wideBorder = 3;
  const dashArray = "5,5";
  const nucleusSize = width * (boardMode === "card" ? 0.15 : 0.15);
  const iconScale = 0.03;

  const radius = width/2 - (padding);
  const time = 0; //useAnimationFrame(); (Create a separate boardNucleus component that uses requestAnimationFrame and one that does not)

  useEffect(() => {
    if (boardMode === "card") {
      return;
    }
    const timeConstant = 0.1;
    const newRotation = rotation + time*timeConstant;
    setRotation(newRotation > 360 ? newRotation - 360 : newRotation);
  }, [time, boardMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const getBoardStyle = () => {
    return {
      position: `relative` as any,
      left: `${padding}px`,
      top: `${padding}px`,
    }
  }
  
  const getCellFillColor = (cell: Cell, weight?: ColorWeight) => {
    const cWEmpty = cell.highlighted ? 500 : (cell.level%2 !== 0 ? 600 : 700);
    const cwColor = Boolean(weight) ? weight! : cell.highlighted ? 300 : 400;
    if (!props.cells[cell.sector] || !props.cells[cell.sector][cell.level]) {
      if (!cell.particle) {
        return `${theme.colors.gray[cWEmpty as ColorWeight]}`;
      }
      return `${theme.colors[cell.particle!.color as Color][cwColor]}`;
    }

    if (props.cells[cell.sector][cell.level] && props.cells[cell.sector][cell.level].particle) {
      return `${theme.colors[props.cells[cell.sector][cell.level].particle!.color as Color][cwColor]}`;
    }
    return `${theme.colors.gray[cWEmpty as ColorWeight]}`;
  }

  const getNucleusAngles = (nucleus?: Nucleus) => {
    const n = nucleus || props.nucleus;
    const allParticles = Object.keys(n.particles).reduce((acc, curr) => acc + n.particles[curr as Color], 0);
    return Object.keys(n.particles).reduce((acc, curr) => acc.concat([{
      key: curr as Color,
      start: ((acc[acc.length - 1] && acc[acc.length - 1].end) || 0),
      end: 360 * n.particles[curr as Color] / allParticles + ((acc[acc.length - 1] && acc[acc.length - 1].end) || 0),
    }]), [] as { key: Color; start: number; end: number; }[]);
  }

  const getAnimatedNucleus = () => {
    return props.current && props.current.nucleus.particles && ({ 
      ...props.current.nucleus, 
      particles: Object.keys(props.current.nucleus.particles)
        .reduce((obj, key) => ({
          ...obj, 
          [key]: props.current!.nucleus.particles[key as Color] + props.nucleus.particles[key as Color] 
        }),
      {} as { [key in Color]: number; })
    });
  }

  const getBoardCells = () => {
    if (!props.cells.length) {
      return [];
    }

    const angle = 360/props.cells.length;
    const r = radius - nucleusSize;
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

        const outerSize = ((level + 1)/(props.cells[i].length));
        const outerStart = polarToCartesian(radius, radius, r*outerSize + nucleusSize, end);
        const outerEnd = polarToCartesian(radius, radius, r*outerSize + nucleusSize, start);

        const innerSize = ((level)/(props.cells[i].length));
        const innerStart = polarToCartesian(radius, radius, r*innerSize + nucleusSize, end);
        const innerEnd = polarToCartesian(radius, radius, r*innerSize + nucleusSize, start);
    
        const d = [
          "M", outerStart.x, outerStart.y,
          "A", r*outerSize + nucleusSize, r*outerSize + nucleusSize, 0, largeArc, 0, outerEnd.x, outerEnd.y,
          "L", innerEnd.x, innerEnd.y,
          "A", r*innerSize + nucleusSize, r*innerSize + nucleusSize, 0, largeArc, 1, innerStart.x, innerStart.y,
          "Z"
        ].join(" ");   

        cells[i].push({
          ...cell,
          d,
          level,
          sector,
          radius: (r*innerSize + nucleusSize) + (r*outerSize + nucleusSize)/2 - (r*innerSize + nucleusSize)/2,
          rotation: start + end/2 - start/2
        });
      }
    }   
    return cells;
  }

  const getNucleusDString = (nucleus: Nucleus, type?: Color) => {
    const angles = getNucleusAngles(nucleus);
    const r = radius || 0;
    const start = type ? Math.floor(angles.find(a => a.key === type)!.start) : 0;
    const end = type ? Math.floor(angles.find(a => a.key === type)!.end) : 360;
    const largeArc = end - start <= 180 ? "0" : "1";
    const fullCircle = end - start >= 360;
    const size = nucleusSize;
    const outerStart = fullCircle ? polarToCartesian(r, r, size, 0) : polarToCartesian(r, r, size, end + rotation > 360 ? end + rotation - 360 : end + rotation);
    const outerEnd = fullCircle ? polarToCartesian(r, r, size, 180) : polarToCartesian(r, r, size,  start + rotation > 360 ? start + rotation - 360 : start + rotation);

    return fullCircle ? [
      "M", outerStart.x, outerStart.y,
      "A", size, size, 0, 1, 0, outerEnd.x, outerEnd.y,
      "A", size, size, 0, 1, 0, outerStart.x, outerStart.y,
      "Z"
    ].join(" ") : [
      "M", outerStart.x, outerStart.y,
      "A", size, size, 0, largeArc, 0, outerEnd.x, outerEnd.y,
      "L", r, r,
      "Z"
    ].join(" ");  
  }

  const getMiddleAngle = (key: Color, nucleus?: Nucleus) => {
    const angles = getNucleusAngles(nucleus);
    return ((
      Math.abs(angles.find(a => a.key === key)?.end || 0) - 
      Math.abs(angles.find(a => a.key === key)?.start || 0))
    /2) + Math.abs(angles.find(a => a.key === key)?.start || 0);
  }

  const animatedNucleus = getAnimatedNucleus();

  return (
    <Box w={width} h={width - 25} margin={`auto`}>
      <Box>
        <svg viewBox={`0 0 ${Math.abs(radius * 2)} ${Math.abs(radius * 2)}`} 
          style={getBoardStyle()}
          width={Math.abs(radius * 2)} 
          height={Math.abs(radius * 2)} >
            {
              getBoardCells().map((column, i) => column.map((cell, j) => {
                const animatedCell = !!(props.current && props.current.cells.find(c => c.sector === i && c.level === j));
                return animatedCell ? undefined : <path
                  key={`cell-${i}-${j}`} 
                  d={cell.d}
                  onMouseEnter={() => props.onEnterCell && props.onEnterCell(cell) } 
                  onMouseLeave={() => props.onLeaveCell && props.onLeaveCell(cell) }
                  onClick={() => props.onClickCell && props.onClickCell(cell)}
                  fill={getCellFillColor(cell)} 
                  stroke={theme.colors.gray[800]}
                  strokeWidth={border} 
                  fillRule="evenodd"
                  style={({ cursor: "pointer" })} >
                </path>
              }))
            }
            {
              getBoardCells().map((column, i) => column.map((cell, j) => {
                return boardMode === "board" && cell.icon &&
                  <g key={`overlay-${i}-${j}`} 
                    fill="white" 
                    transform={` 
                      translate(
                        ${(polarToCartesian(radius, radius, cell.radius, cell.rotation).x) - (512/2 * iconScale)} 
                        ${(polarToCartesian(radius, radius, cell.radius, cell.rotation).y) - (512/2 * iconScale)}
                      ) scale(${iconScale})`}>
                    <path
                      d={"m256,21c-129.7869,0-235,105.2131-235,235s105.2131,235 235,235 235-105.2131 235-235-105.2131-235-235-235zm0,34.9562c110.5145,0 200.0437,89.5292 200.0437,200.0438s-89.5292,200.0438-200.0437,200.0438-200.1906-89.5292-200.1906-200.0438 89.6761-200.0438 200.1906-200.0438zm0,23.2063c-17.4369,0-31.5781,14.1412-31.5781,31.5781s14.1412,31.5781 31.5781,31.5781 31.5782-14.1412 31.5782-31.5781-14.1413-31.5781-31.5782-31.5781zm-73.5844,19.5344c-5.0904.1321-10.1153,1.5349-14.8343,4.2594-15.1009,8.7184-20.3217,28.0805-11.6031,43.1812s27.9335,20.0279 43.0343,11.3094 20.3216-27.7867 11.6031-42.8875c-5.994-10.3818-17.0011-16.1527-28.2-15.8625zm147.1688,0c-11.1989-.29-22.2061,5.4807-28.2,15.8625-8.7185,15.1008-3.6445,34.3159 11.4562,43.0344s34.4628,3.6446 43.1813-11.4563 3.4977-34.4628-11.6032-43.1812c-4.719-2.7245-9.744-4.1275-14.8343-4.2594zm-198.575,53.1688c-11.1989-.29-22.2061,5.4807-28.2,15.8625-8.7184,15.1008-3.4977,34.3159 11.6031,43.0344s34.169,3.4977 42.8875-11.6031 3.7914-34.316-11.3093-43.0344c-4.719-2.7245-9.8909-4.1275-14.9813-4.2594zm249.9812,0c-5.0904.1321-10.2623,1.5349-14.9812,4.2594-15.1008,8.7184-20.1747,28.0805-11.4563,43.1812s27.9336,20.1747 43.0344,11.4563 20.3215-27.9336 11.6032-43.0344c-5.994-10.3818-17.0012-16.1527-28.2001-15.8625zm-124.9906,14.3938c-49.5575,0-89.7406,40.1831-89.7406,89.7406s40.1831,89.7406 89.7406,89.7406 89.7407-40.1831 89.7407-89.7406-40.1831-89.7406-89.7407-89.7406zm-145.4063,58.3094c-17.4369,0-31.4312,14.1412-31.4312,31.5781s13.9943,31.5782 31.4312,31.5781 31.4313-14.1412 31.4313-31.5781-13.9944-31.5781-31.4313-31.5781zm290.8125,0c-17.4369,0-31.5781,14.1413-31.5781,31.5781s14.1413,31.5781 31.5781,31.5781 31.4313-14.1412 31.4313-31.5781-13.9944-31.5782-31.4313-31.5781zm-272.1593,72.7031c-5.0733.1222-10.1154,1.5349-14.8344,4.2594-15.1008,8.7185-20.3216,27.9336-11.6031,43.0344s28.0804,20.3216 43.1813,11.6031 20.0277-27.9336 11.3093-43.0344c-5.9939-10.3818-16.8918-16.131-28.0531-15.8625zm250.4219,0c-10.1124.7151-19.6667,6.2776-25.1157,15.7156-8.7184,15.1008-3.6445,34.4628 11.4563,43.1812s34.4628,3.4977 43.1813-11.6031 3.4977-34.316-11.6032-43.0344c-5.6629-3.2694-11.8514-4.6884-17.9187-4.2594zm-198.575,53.1687c-10.0909.6782-19.6666,6.1308-25.1156,15.5688-8.7185,15.1008-3.4978,34.4628 11.6031,43.1813s34.3159,3.4977 43.0343-11.6032 3.4977-34.169-11.6031-42.8875c-5.6628-3.2694-11.8643-4.6661-17.9187-4.2594zm146.7281,0c-5.0904.1319-10.2623,1.5349-14.9813,4.2594-15.1008,8.7184-20.1747,27.9335-11.4562,43.0343s27.9336,20.3216 43.0343,11.6032 20.3217-28.0805 11.6032-43.1813c-5.994-10.3819-17.0011-16.0058-28.2-15.7157zm-71.8219,19.3875c-17.4369,0-31.5781,13.9943-31.5781,31.4312s14.1412,31.5782 31.5781,31.5782 31.5782-14.1412 31.5782-31.5782-14.1413-31.4312-31.5782-31.4312z"}
                      onClick={() => props.onClickCell && props.onClickCell(cell)}
                      onMouseEnter={() => props.onEnterCell && props.onEnterCell(cell) } 
                      onMouseLeave={() => props.onLeaveCell && props.onLeaveCell(cell) } >
                    </path>
                  </g>
                }
              ))
            }
            <path
              d={getNucleusDString(props.nucleus)}
              onMouseEnter={() => props.onEnterNucleus && props.onEnterNucleus() } 
              onMouseLeave={() => props.onLeaveNucleus && props.onLeaveNucleus() }
              onClick={() => props.onClickNucleus && props.onClickNucleus()}
              fill={`${theme.colors.gray[800]}`}
              style={({ cursor: "pointer" })} >
            </path>
            {
              Object.keys(props.nucleus.particles).map((key, i) => {
                return props.nucleus.particles[key as Color] > 0 && <path
                  key={`nucleus-${i}`} 
                  d={getNucleusDString(props.nucleus, key as Color)}
                  onMouseEnter={() => props.onEnterNucleus && props.onEnterNucleus() } 
                  onMouseLeave={() => props.onLeaveNucleus && props.onLeaveNucleus() }
                  onClick={() => props.onClickNucleus && props.onClickNucleus()}
                  fill={props.nucleus.highlighted ? theme.colors[key as Color][300] : theme.colors[key as Color][400]} 
                  stroke={theme.colors.gray[800]}
                  strokeWidth={props.current && Object.keys(props.current!.nucleus.particles).find(k => props.current!.nucleus.particles[k as Color] > 0) ? wideBorder : border}
                  strokeLinecap={"round"}
                  strokeDasharray={props.current && Object.keys(props.current!.nucleus.particles).find(k => props.current!.nucleus.particles[k as Color] > 0) ? dashArray : ""}  
                  fillRule="evenodd"
                  style={({ cursor: "pointer" })} >
                </path>
              })
            }
            {
              boardMode === "board" && Object.keys(props.nucleus.particles).map((key, i) => {
                return <text
                  style={{ userSelect: "none" }}
                  pointerEvents={`none`}
                  fill={`white`}
                  fontSize={`1.5em`}
                  key={`nucleus-text-${i}`} 
                  cursor={`pointer`}
                  x={`${polarToCartesian(radius, radius, nucleusSize/1.5, getMiddleAngle(key as Color)).x}`} 
                  y={`${polarToCartesian(radius, radius, nucleusSize/1.5, getMiddleAngle(key as Color)).y + textOffset}`}
                  textAnchor={`middle`}
                >
                  { props.nucleus.particles[key as Color] > 0 ? props.nucleus.particles[key as Color] : "" }
                </text>
              })
            }
            {
              getBoardCells().map((column, i) => column.map((cell, j) => {
                const animatedCell = (props.current && props.current.cells.find(c => c.sector === i && c.level === j)) as any;
                return animatedCell ? <path
                  key={`cellA-${i}-${j}`} 
                  d={cell.d}
                  onMouseEnter={() => props.onEnterCell && props.onEnterCell(cell) } 
                  onMouseLeave={() => props.onLeaveCell && props.onLeaveCell(cell) }
                  onClick={() => props.onClickCell && props.onClickCell(cell)}
                  fill={getCellFillColor(cell)} 
                  stroke={theme.colors.gray[800]}
                  strokeWidth={wideBorder}
                  strokeLinecap={"round"}
                  strokeDasharray={dashArray} 
                  fillRule="evenodd"
                  style={({ cursor: "pointer" })} >
                    { 
                      boardMode === "board" && animatedCell && <animate
                        dur="1.5s"
                        attributeName="fill"
                        values={`
                          ${getCellFillColor(cell)};
                          ${theme.colors[animatedCell.particle!.color as Color][400]};
                          ${theme.colors[animatedCell.particle!.color as Color][400]};
                          ${getCellFillColor(cell)}
                        `}  
                        repeatCount="indefinite"/>
                    }
                </path> : undefined;
              }))
            }
            {
              boardMode === "board" && props.current && animatedNucleus && Object.keys(animatedNucleus.particles).map((key, i) => {
                return animatedNucleus.particles[key as Color] > 0 && Object.keys(props.current!.nucleus.particles).find(k => props.current!.nucleus.particles[k as Color] > 0) && <path
                  key={`nucleus-${i}A`} 
                  d={getNucleusDString(animatedNucleus, key as Color)}
                  onMouseEnter={() => props.onEnterNucleus && props.onEnterNucleus() } 
                  onMouseLeave={() => props.onLeaveNucleus && props.onLeaveNucleus() }
                  onClick={() => props.onClickNucleus && props.onClickNucleus()}
                  fill={theme.colors[key as Color][400]} 
                  stroke={theme.colors.gray[800]}
                  strokeWidth={wideBorder}
                  strokeLinecap={"round"}
                  strokeDasharray={dashArray}
                  fillRule="evenodd"
                  style={({ cursor: "pointer" })} >
                    <animate dur="1.5s" attributeName="fill-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/>
                    <animate dur="1.5s" attributeName="stroke-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/>
                </path>
              })
            }
             {
              boardMode === "board" && props.current && animatedNucleus && Object.keys(animatedNucleus.particles).map((key, i) => {
                return <text
                  style={{ userSelect: "none" }}
                  pointerEvents={`none`}
                  fill={`white`}
                  fontSize={`1.5em`}
                  key={`nucleus-text-${i}A`} 
                  cursor={`pointer`}
                  x={`${polarToCartesian(radius, radius, nucleusSize/1.5, getMiddleAngle(key as Color, animatedNucleus)).x}`} 
                  y={`${polarToCartesian(radius, radius, nucleusSize/1.5, getMiddleAngle(key as Color, animatedNucleus)).y + textOffset}`}
                  textAnchor={`middle`}
                >
                  { animatedNucleus.particles[key as Color] > 0 ? animatedNucleus.particles[key as Color] : "" }
                  <animate dur="1.5s" attributeName="fill-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/>
                </text>
              })
            }
        </svg>
      </Box>
      {
        boardMode === "board" && 
        <Box
          _hover={{
            bgColor: `${props.deleting ? theme.colors.blackAlpha[500] : theme.colors.blackAlpha[700]}`
          }} 
          cursor={`pointer`}
          onClick={() => props.onClickButton && props.onClickButton()} 
          bgColor={`${props.deleting ? theme.colors.blackAlpha[400] : theme.colors.blackAlpha[600]}`}
          position={`absolute`}
          transform={`translate(-50%, -50%)`}
          top={`${radius + padding}px`}
          left={`${radius + padding}px`}
          borderRadius={100}
          borderWidth={`1px`}
          borderColor={`white`}
          borderStyle={`solid`} 
          width={`${width/8}px`} 
          height={`${width/8}px`} > 
            <Text userSelect={`none`} fontSize={`1.8em`} color={`white`} textAlign={`center`} lineHeight={`${width/8 - 5}px`}>{ props.deleting ? "-" : "+" }</Text> 
        </Box> 
      }
    </Box>
  );
}


export default Board;
