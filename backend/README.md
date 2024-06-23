# backendディレクトリ

## ディレクトリ構成
- extern : 使用するsubmodule置き場
- include : ソルバーやハンドラーが使用するヘッダーファイル置き場
- sample : ローカルで試しに動かすためのスクリプトのソースコード
- src : バックエンド側機能の主な実装
- tests : テスト実行のためのコード

## ローカルで試す
### .envファイル
- SUDOKU_MAX_NUM_ANSWER : 探索する解の個数の最大値を表します
- SUDOKU_DIM : 解く数独のサイズを表します。3なら9x9、4なら16x16

### 環境構築
```
$ pwd
sudoku-solver/backend
# aws-lambda-cppのインストール
$ cd extern/aws-lambda-cpp
$ mkdir build && cd build
$ cmake .. -DCMAKE_INSTALL_PREFIX=../../..
$ make && make install
$ cd ../../..
# SudokuSolberのビルド
$ mkdir build && cd build
$ cmake .. -DCMAKE_PREFIX_PATH=..
$ make
$ ctest  # testsディレクトリ内のテストを行う
$ make format-all  # clang-formatが使えるとき有効、全てのC++ファイルのフォーマットをする
```

### 動かしてみる
```
(環境構築をした後)
$ pwd
sudoku-solver/backend
$ echo -n "8 0 0 0 0 0 0 0 0
0 0 0 6 0 0 0 0 0
0 7 0 0 0 0 2 0 0
0 5 0 0 0 7 0 0 0
0 0 0 0 4 0 7 0 0
0 0 0 1 0 0 0 3 0
0 0 1 0 0 0 0 6 8
0 0 8 5 0 0 0 1 0
0 9 0 0 0 0 4 0 0
" | ./bin/SudokuSolverSample
271710 answers exist
8 3 2 4 7 1 6 9 5
9 1 4 6 5 2 3 8 7
6 7 5 9 3 8 2 4 1
4 5 9 3 8 7 1 2 6
1 8 3 2 4 6 7 5 9
2 6 7 1 9 5 8 3 4
3 4 1 7 2 9 5 6 8
7 2 8 5 6 4 9 1 3
5 9 6 8 1 3 4 7 2
```
