// for fonts and global styling
import { extendTheme } from "@chakra-ui/react";
import { Global } from "@emotion/react";

export const Fonts = () => (
  <Global
    styles={`
      @import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&display=swap');
    `}
  />
);


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