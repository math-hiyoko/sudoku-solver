import React from 'react';
import { navigate } from 'gatsby';
import Seo from '../components/Seo'; // SEOコンポーネントのインポート
import Result from '../components/Result';

const ResultPage = ({ location }) => {
  const { state } = location;
  if (!state || !state.solvedBoard) {
    navigate('/');
    return null;
  }

  return (
    <>
      <Seo title="Solution Result" description="View the solved Sudoku puzzle." />
      <Result board={state.solvedBoard} />
    </>
  );
};

export default ResultPage;
