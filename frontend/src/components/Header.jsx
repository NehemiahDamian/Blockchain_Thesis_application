/* eslint-disable react/prop-types */
import { Center, VStack, Heading, Text} from "@chakra-ui/react"

function Header({ title }) {
  return (
    <Center>
      <VStack 
        w="1100px" bg="red.600" color="white" h={"100px"}
        p="4" ml={150} mt={5} backgroundColor="red.500" 
        borderRadius="20px" 
        padding={8} pb={20} align="start">
        <Heading as="h2" size="2xl">
          <Text fontSize={"44px"}>{title}</Text>
        </Heading>
      </VStack>
    </Center>
  );
}

export default Header