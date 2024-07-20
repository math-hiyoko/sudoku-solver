import React from "react";
import Footer from "./common/Footer";
import { Container, Content } from "../styles/CommonStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Content>
          {children}
          <Footer />
        </Content>
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
