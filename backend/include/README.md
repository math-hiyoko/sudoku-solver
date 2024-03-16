# includeディレクトリ

- solver : 数独を解くためのメインロジック部分
  - ColumnNode.hpp : 行列被覆問題における列を表すクラス
  - DancingNode.hpp : 行列被覆問題における行列内の各要素を表すクラス
  - HeaderNode.hpp : 行列被覆問題における行列全体の状態を表すクラス
  - KnuthsAlgorithm.hpp : 行列被覆問題を解くための関数の宣言
  - RowNode.hpp : 行列被覆問題における行を表すクラス
  - SudokuSolver.hpp : 数独問題を行列被覆問題に変換し、解くための諸関数の宣言
  - SudokuType.hpp : 数独問題を表すためのクラスや定数
  - SUdokuValidator.hpp : 数独の状態を検証するための諸関数の宣言
