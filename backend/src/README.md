# srcディレクトリ

- solver : 数独を解くためのメインロジック部分
  - ColumnNode.cpp : 行列被覆問題における列を表すクラス
  - DancingNode.cpp : 行列被覆問題における行列内の各要素を表すクラス
  - HeaderNode.cpp : 行列被覆問題における行列全体の状態を表すクラス
  - KnuthsAlgorithm.cpp : 行列被覆問題を解くための関数の定義
  - RowNode.cpp : 行列被覆問題における行を表すクラス
  - SudokuSolver.cpp : 数独問題を行列被覆問題に変換し、解くための諸関数の定義
  - SUdokuValidator.cpp : 数独の状態を検証するための諸関数の定義
