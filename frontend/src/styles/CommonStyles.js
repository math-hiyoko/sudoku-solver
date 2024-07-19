import styled from "styled-components";

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  margin: 5px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  p {
    margin: 4px 0; /* 段落間の間隔を小さくする */
    line-height: 1.2; /* 行の高さを少し縮小 */
  }
`;

export const Content = styled.div`
  flex: 1;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-top: 20px;
`;
