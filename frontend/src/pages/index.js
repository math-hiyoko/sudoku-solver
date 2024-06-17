import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo'; // SEOコンポーネントのインポート
import styled from 'styled-components';
import Grid from '../components/Grid';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { navigate } from 'gatsby';
import LoadingSpinner from '../components/LoadingSpinner';

const sudokuDim = parseInt(process.env.SUDOKU_DIM, 10) || 3;
const gridSize = sudokuDim * sudokuDim;
const initialBoard = Array(gridSize * gridSize).fill('');

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  margin: 5px;

  @media (max-width: 600px) {
    padding: 8px 16px;
    font-size: 0.9em;
  }
`;

const IndexPage = () => {
  const { t } = useTranslation();
  const [board, setBoard] = useState(initialBoard);
  const [loading, setLoading] = useState(false); // ロード中の状態管理

  const handleSolve = async () => {
    setLoading(true); // 処理前にロードを開始
    try {
      const response = await fetch('https://api.example.com/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board }),
      });
      const data = await response.json();
      setLoading(false); // 処理完了後にロードを終了
      navigate('/result', { state: { solvedBoard: data.solvedBoard } });
    } catch (error) {
      console.error('Error solving sudoku:', error);
      setLoading(false); // エラー時にもロードを終了
    }
  };

  return (
    <Container>
      <Seo title={t('title')} description="Solve Sudoku puzzles quickly and efficiently." />
      <h1>{t('title')}</h1>
      <LanguageSwitcher />
      <Grid board={board} setBoard={setBoard} />
      {loading ? (
        <LoadingSpinner /> // ロード中であればスピナーを表示
      ) : (
        <>
          <Button onClick={handleSolve}>{t('solve')}</Button>
          <Button onClick={() => setBoard(Array(gridSize * gridSize).fill(''))}>{t('clear')}</Button>
          <Button>{t('random')}</Button>
        </>
      )}
    </Container>
  );
};

export default IndexPage;
