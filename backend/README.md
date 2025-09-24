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
$ cmake -S extern/aws-lambda-cpp/ -B extern/aws-lambda-cpp/build -DCMAKE_INSTALL_PREFIX=.
$ cmake --build extern/aws-lambda-cpp/build -j
$ cmake --install extern/aws-lambda-cpp/build
# SudokuSolberのビルド
$ cmake -S . -B build -DCMAKE_PREFIX_PATH=.
$ cmake --build build -j
$ ctest --test-dir build --verbose --output-on-failure -j # testsディレクトリ内のテストを行う
$ ./bin/bench  # ベンチマークテスト
$ cmake --build build --target format-all -j  # clang-formatが使えるとき有効、全てのC++ファイルのフォーマットをする
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
271710 solutions exist
Solution:
8 1 2 | 7 3 9 | 5 4 6
4 3 5 | 6 2 8 | 1 7 9
6 7 9 | 4 1 5 | 2 8 3
---------------------
3 5 4 | 2 8 7 | 6 9 1
1 8 6 | 9 4 3 | 7 2 5
9 2 7 | 1 5 6 | 8 3 4
---------------------
5 4 1 | 3 7 2 | 9 6 8
7 6 8 | 5 9 4 | 3 1 2
2 9 3 | 8 6 1 | 4 5 7
Solution:
8 1 2 | 7 3 9 | 5 4 6
4 3 5 | 6 2 8 | 1 7 9
6 7 9 | 4 1 5 | 2 8 3
---------------------
3 5 4 | 9 8 7 | 6 2 1
1 8 6 | 2 4 3 | 7 9 5
9 2 7 | 1 5 6 | 8 3 4
---------------------
5 4 1 | 3 7 2 | 9 6 8
7 6 8 | 5 9 4 | 3 1 2
2 9 3 | 8 6 1 | 4 5 7
Solution:
8 1 2 | 7 3 9 | 5 4 6
4 3 5 | 6 2 8 | 1 7 9
6 7 9 | 4 1 5 | 2 8 3
---------------------
3 5 4 | 9 8 7 | 6 2 1
1 8 6 | 3 4 2 | 7 9 5
9 2 7 | 1 5 6 | 8 3 4
---------------------
5 4 1 | 2 7 3 | 9 6 8
7 6 8 | 5 9 4 | 3 1 2
2 9 3 | 8 6 1 | 4 5 7
```
