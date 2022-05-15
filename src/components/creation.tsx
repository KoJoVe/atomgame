import React, { FunctionComponent } from "react";
import { Box } from "@chakra-ui/react";

export interface CreationProps {}

export const Creation: FunctionComponent<CreationProps> = (props) => {
  // const [particle, setParticle] = useState<Particle>({ color: "red", vitality: 1, power: 1, swiftness: 1 });
  return (
    <Box>
      {/* <Text borderBottom={`1px solid ${theme.colors.gray[200]}`} maxW={250} mt={25} ml={25} fontSize={`sm`}>Create Particles</Text>
      <FormControl ml={25} mt={25}>
        <FormLabel mt={2}><Text color={theme.colors.red[500]} fontSize={`md`} >vitality: {particle.vitality}</Text></FormLabel>
        <Slider onChange={(v) => setParticle({ ...particle, vitality: v })} maxW={250} max={10} min={0} step={1} value={particle.vitality} defaultValue={particle.vitality}>
          <SliderTrack bg={theme.colors.red[100]}>
            <SliderFilledTrack bg={theme.colors.red[500]}/>
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Text color={theme.colors.red[500]}>V</Text>
          </SliderThumb>
        </Slider>
        <FormLabel mt={2}><Text color={theme.colors.blue[500]} fontSize={`md`} >power: {particle.power}</Text></FormLabel>
        <Slider onChange={(p) => setParticle({ ...particle, power: p })} maxW={250} max={10} min={0} step={1} value={particle.power} defaultValue={particle.power}>
          <SliderTrack bg={theme.colors.blue[100]}>
            <SliderFilledTrack bg={theme.colors.blue[500]}/>
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Text color={theme.colors.blue[500]}>P</Text>
          </SliderThumb>
        </Slider>
        <FormLabel mt={2}><Text color={theme.colors.green[500]} fontSize={`md`} >swiftness: {particle.swiftness}</Text></FormLabel>
        <Slider onChange={(s) => setParticle({ ...particle, swiftness: s })} maxW={250} max={10} min={0} step={1} value={particle.swiftness} defaultValue={particle.swiftness}>
          <SliderTrack bg={theme.colors.green[100]}>
            <SliderFilledTrack bg={theme.colors.green[500]}/>
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Text color={theme.colors.green[500]}>S</Text>
          </SliderThumb>
        </Slider>
      </FormControl>
      <Button ml={25} mt={25} leftIcon={<AddIcon />} variant="outline">
        Add
      </Button> */}
    </Box>
  );
}

export default Creation;
