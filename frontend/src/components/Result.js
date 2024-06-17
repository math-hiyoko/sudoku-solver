import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { navigate } from 'gatsby';

const ResultContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr); /* 必要な場合は動的に変更 */
  gap: 5px;
  margin-top: 20px;

  @media (max-width: 600px) {
    gap: 2px;
  }
`;

const Cell = styled.div`
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 1.5em;
  background: #e0e0e0;

  @media (max-width: 600px) {
    width: 30px;
    height: 30px;
    font-size: 1em;
    line-height: 30px;
  }
`;

const Result = ({ board }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('result')}</h1>
      <ResultContainer>
        {board.map((cell, index) => (
          <Cell key={index}>{cell}</Cell>
        ))}
      </ResultContainer>
      <button onClick={() => navigate('/')}>{t('back_to_start')}</button>
    </div>
  );
};

export default Result;
