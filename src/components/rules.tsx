import React, { FunctionComponent } from "react";
import { Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, theme, Tr } from "@chakra-ui/react";
import { AddIcon, ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronRightIcon, MinusIcon } from "@chakra-ui/icons";

import { ParticleColor } from "../types/particle";

import { generateParticleInteractions } from "../generators/particle";

export interface RulesProps {};

export const Rules: FunctionComponent<RulesProps> = () => {  
  const interactions = generateParticleInteractions();
  return (
    <Box>
      <Text borderBottom={`1px solid ${theme.colors.gray[200]}`} maxW={250} mt={25} ml={25} fontSize={`sm`}>Interactions Table</Text>
      <TableContainer pt={25} pl={15} pr={25}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th w={25}>
                <Text color={theme.colors.blue[500]}>
                  <ChevronDownIcon /><ArrowUpIcon />P/<ArrowDownIcon />P<ChevronRightIcon />
                </Text>
              </Th>
              {
                Object.keys(interactions).map(k => <Th><Box m={`auto`} w={15} h={15} borderRadius={10} bg={theme.colors[k as ParticleColor][500]} /></Th>)
              }
            </Tr>
          </Thead>
          <Tbody>
            {
              Object.keys(interactions).map(k =>
                <Tr>
                  <Th><Box m={`auto`} w={15} h={15} borderRadius={10} bg={theme.colors[k as ParticleColor][500]} /></Th>
                  {
                    Object.keys(interactions[k as ParticleColor]).map(kk => {
                      const i = interactions[k as ParticleColor][kk as ParticleColor];
                      return <Td>
                        <Text display={`flex`} justifyContent={`center`} alignItems={`center`}>
                          <AddIcon fontSize={8} ml={1} color={i.win}/>
                          <Box w={3} h={3} borderRadius={10} bg={theme.colors[i.win][500]} />
                          <MinusIcon fontSize={8} ml={1} color={i.loss}/>
                          <Box w={3} h={3} borderRadius={10} bg={theme.colors[i.loss][500]} />
                        </Text>
                      </Td>
                    })
                  }
                </Tr>
              )
            }
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Rules;
