import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

configure({ asyncUtilTimeout: 400 });
fetchMock.enableMocks();

// gatsbyのnavigateのモックを設定
jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  navigate: jest.fn(),
}));

afterEach(() => {
  fetchMock.resetMocks(); // 各テスト後にモックをリセット
});
