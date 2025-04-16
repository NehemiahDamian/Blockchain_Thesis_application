// for fonts and global styling
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Gabarito', sans-serif`,
    body: `'Gabarito', sans-serif`,
  },
  styles: {
    global: {
      "html, body": {
        height: "100%",
        overflow: "auto", 
        margin: 0,
        padding: 0,
        bg: "#f7faff"
      },
    },
  },
});

export default theme;