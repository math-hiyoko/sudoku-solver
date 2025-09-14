import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 6rem;
  color: #007bff;
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  color: #333;
  margin: 20px 0;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
`;

const HomeLink = styled(Link)`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <Message>
        The page you're looking for doesn't exist.
      </Message>
      <HomeLink to="/">
        Back to Sudoku Solver
      </HomeLink>
    </Container>
  );
};

export default NotFoundPage;