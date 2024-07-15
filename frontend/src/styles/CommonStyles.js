import styled from "styled-components";

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  margin: 5px;
`;

export const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  flex: 1;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-top: 20px;
`;
