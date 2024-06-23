import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Footer from "../components/Footer";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
`;

const NotFoundPage = () => {
  return (
    <Container>
      <Content>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Go to Home</Link>
      </Content>
      <Footer />
    </Container>
  );
};

export default NotFoundPage;
