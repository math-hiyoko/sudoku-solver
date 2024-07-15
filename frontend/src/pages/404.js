import React from "react";
import { Link } from "gatsby";
import Footer from "../components/Footer";
import { Container, Content } from "../styles/CommonStyles";

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
