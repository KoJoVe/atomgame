import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Text, theme, useBreakpointValue } from "@chakra-ui/react";

import { polarToCartesian } from "../helpers/coordinates";
import { Color, ColorWeight } from "../helpers/color";

import { Cell } from "../types/cell";
import { Nucleus } from "../types/nucleus";

export interface BoardProps {
  mode?: 'board' | 'card';
  cells: Cell[][];
  nucleus: Nucleus;
  nextCells?: Cell[][];
  nextNucleus?: Nucleus;
  deleting?: boolean;
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
  const padding = 10;
  const textOffset = 8;
  const iconScale = useBreakpointValue({ base: 0.03, sm: 0.03, md: 0.08, lg: 0.08 }) || 0 ;
  const dashArray = "1,1";
  const border = boardMode === "card" ? 1 : 2;
  const wideBorder = 3;
  const nucleusSize = width * (boardMode === "card" ? 0.15 : 0.15);

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
    if (cell.particle) {
      return `${theme.colors[cell.particle!.color as Color][cwColor]}`;
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

  const renderBoardEmptyNucleus = () => <path
    d={getNucleusDString(props.nucleus)}
    onMouseEnter={() => props.onEnterNucleus && props.onEnterNucleus() } 
    onMouseLeave={() => props.onLeaveNucleus && props.onLeaveNucleus() }
    onClick={() => props.onClickNucleus && props.onClickNucleus()}
    fill={`${theme.colors.gray[800]}`}
    style={({ cursor: "pointer" })} >
  </path>

  const renderBoardCells = () => getBoardCells().map((column, i) => column.map((cell, j) => {
    return <path
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
  }));

  const renderBoardAnimatedCells = () => getBoardCells().map((column, i) => column.map((cell, j) => {
    const animatedCell = props.nextCells && props.nextCells[i][j];
    return animatedCell && animatedCell.particle && animatedCell._new ? <path
      key={`cellA-${i}-${j}`} 
      d={cell.d}
      onMouseEnter={() => props.onEnterCell && props.onEnterCell(cell) } 
      onMouseLeave={() => props.onLeaveCell && props.onLeaveCell(cell) }
      onClick={() => props.onClickCell && props.onClickCell(cell)}
      fill={getCellFillColor({ ...animatedCell, highlighted: undefined })} 
      stroke={theme.colors.white}
      strokeWidth={wideBorder}
      strokeLinecap={"round"}
      strokeDasharray={dashArray} 
      fillRule="evenodd"
      style={({ cursor: "pointer" })} >
        <animate dur="1.5s" attributeName="fill-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/>
    </path> : undefined;
  }));

  const renderBoardCellsSymbols = () => getBoardCells().map((column, i) => column.map((cell, j) => {
    return boardMode === "board" && cell._icon &&
      <g key={`overlay-${i}-${j}`} 
        fill="white" 
        transform={` 
          translate(
            ${(polarToCartesian(radius, radius, cell.radius, cell.rotation).x) - (512/2 * iconScale)} 
            ${(polarToCartesian(radius, radius, cell.radius, cell.rotation).y) - (512/2 * iconScale)}
          ) scale(${iconScale})`}>
        <path
          d={cell._icon}
          onClick={() => props.onClickCell && props.onClickCell(cell)}
          onMouseEnter={() => props.onEnterCell && props.onEnterCell(cell) } 
          onMouseLeave={() => props.onLeaveCell && props.onLeaveCell(cell) } >
        </path>
      </g>
    }
  ));

  const renderBoardAnimatedCellsSymbols = () => getBoardCells().map((column, i) => column.map((cell, j) => {
    const animatedCell = props.nextCells && props.nextCells[i][j] as any;
    return boardMode === "board" && animatedCell && animatedCell._icon &&
      <g key={`overlay-${i}-${j}`} 
        fill="white" 
        transform={` 
          translate(
            ${(polarToCartesian(radius, radius, cell.radius, cell.rotation).x) - (512/2 * iconScale)} 
            ${(polarToCartesian(radius, radius, cell.radius, cell.rotation).y) - (512/2 * iconScale)}
          ) scale(${iconScale})`}>
        <path
          d={animatedCell._icon}
          onClick={() => props.onClickCell && props.onClickCell(cell)}
          onMouseEnter={() => props.onEnterCell && props.onEnterCell(cell) } 
          onMouseLeave={() => props.onLeaveCell && props.onLeaveCell(cell) } >
            <animate dur="1.5s" attributeName="fill-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/>
        </path>
      </g>
    }
  ));

  const renderBoardNucleus = () => Object.keys(props.nucleus.particles).map((key, i) => {
    const p = props.nextNucleus && Object.keys(props.nextNucleus.particles).find(color => props.nextNucleus!.particles[color as Color] !== props.nucleus.particles[color as Color]);
    return props.nucleus.particles[key as Color] > 0 && <path
      key={`nucleus-${i}`} 
      d={getNucleusDString(props.nucleus, key as Color)}
      onMouseEnter={() => props.onEnterNucleus && props.onEnterNucleus()} 
      onMouseLeave={() => props.onLeaveNucleus && props.onLeaveNucleus()}
      onClick={() => props.onClickNucleus && props.onClickNucleus()}
      fill={props.nucleus.highlighted ? theme.colors[key as Color][300] : theme.colors[key as Color][400]} 
      stroke={ p ? `white` : theme.colors.gray[800] }
      strokeWidth={ p ? wideBorder : border }
      strokeDasharray={ p ? dashArray : "" }  
      strokeLinecap="round"
      fillRule="evenodd"
      style={({ cursor: "pointer" })} >
    </path>
  });

  const renderBoardAnimatedNucleus = () => 
    boardMode === "board" && 
    props.nextNucleus && 
    Object.keys(props.nextNucleus.particles).find(color => props.nextNucleus!.particles[color as Color] !== props.nucleus.particles[color as Color]) && 
    Object.keys(props.nextNucleus.particles).map((key, i) => {
    
    return props.nextNucleus!.particles[key as Color] > 0 && Object.keys(props.nextNucleus!.particles).find(k => props.nextNucleus!.particles[k as Color] > 0) && <path
      key={`nucleus-${i}A`} 
      d={getNucleusDString(props.nextNucleus!, key as Color)}
      onMouseEnter={() => props.onEnterNucleus && props.onEnterNucleus() } 
      onMouseLeave={() => props.onLeaveNucleus && props.onLeaveNucleus() }
      onClick={() => props.onClickNucleus && props.onClickNucleus()}
      fill={theme.colors[key as Color][400]} 
      stroke={theme.colors.white}
      strokeWidth={wideBorder}
      strokeLinecap={"round"}
      strokeDasharray={dashArray}
      fillRule="evenodd"
      style={({ cursor: "pointer" })} >
        <animate dur="1.5s" attributeName="fill-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/>
        {/* <animate dur="1.5s" attributeName="stroke-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/> */}
    </path>
  });

  const renderBoardEmptyAnimatedNucleus = () => props.nextNucleus && !Object.keys(props.nextNucleus!.particles).find(k => props.nextNucleus!.particles[k as Color] > 0) && <path
    d={getNucleusDString(props.nucleus)}
    onMouseEnter={() => props.onEnterNucleus && props.onEnterNucleus() } 
    onMouseLeave={() => props.onLeaveNucleus && props.onLeaveNucleus() }
    onClick={() => props.onClickNucleus && props.onClickNucleus()}
    fill={`${theme.colors.gray[800]}`}
    style={({ cursor: "pointer" })} >
      <animate dur="1.5s" attributeName="fill-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/>
  </path>

  const renderBoardNucleusSymbols = () => boardMode === "board" && Object.keys(props.nucleus.particles).map((key, i) => {
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
  });

  const renderBoardAnimatedNucleusSymbols = () => boardMode === "board" && props.nextNucleus && Object.keys(props.nextNucleus.particles).map((key, i) => {
    return <text
      style={{ userSelect: "none" }}
      pointerEvents={`none`}
      fill={`white`}
      fontSize={`1.5em`}
      key={`nucleus-text-${i}A`} 
      cursor={`pointer`}
      x={`${polarToCartesian(radius, radius, nucleusSize/1.5, getMiddleAngle(key as Color, props.nextNucleus!)).x}`} 
      y={`${polarToCartesian(radius, radius, nucleusSize/1.5, getMiddleAngle(key as Color, props.nextNucleus!)).y + textOffset}`}
      textAnchor={`middle`}
    >
      { props.nextNucleus!.particles[key as Color] > 0 ? props.nextNucleus!.particles[key as Color] : "" }
      <animate dur="1.5s" attributeName="fill-opacity" values={`${0};${1};${1};${0};`} repeatCount="indefinite"/>
    </text>
  });

  const renderMiddleButton = () => boardMode === "board" && <Box
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
      <Text 
        userSelect={`none`} 
        fontSize={`1.8em`} 
        color={`white`} 
        textAlign={`center`} 
        lineHeight={`${width/8 - 5}px`}>
          { props.deleting ? "-" : "+" }
      </Text> 
  </Box>;

  return (
    <Box w={width} h={width - 25} margin={`auto`}>
      <Box>
        <svg 
          viewBox={`0 0 ${Math.abs(radius * 2)} ${Math.abs(radius * 2)}`} 
          style={getBoardStyle()}
          width={Math.abs(radius * 2)} 
          height={Math.abs(radius * 2)} >

            { renderBoardEmptyNucleus() }

            { renderBoardCells() }
            { renderBoardCellsSymbols() }
            { renderBoardNucleus()}
            { renderBoardNucleusSymbols() }

            { renderBoardAnimatedCells() }
            { renderBoardAnimatedCellsSymbols() }
            { renderBoardAnimatedNucleus() }
            { renderBoardEmptyAnimatedNucleus() }
            { renderBoardAnimatedNucleusSymbols()}

        </svg>
      </Box>
      { renderMiddleButton() }
    </Box>
  );
}


export default Board;
