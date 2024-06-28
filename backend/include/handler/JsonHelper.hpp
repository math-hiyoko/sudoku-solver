#pragma once

#include <aws/lambda-runtime/runtime.h>

#include <boost/json.hpp>
#include <vector>

#include "solver/SudokuType.hpp"

namespace HandlerHelper {
/**
 * @brief AWS LambdaのリクエストからSudoku::boardに変換する
 *
 * @param request AWS Lambdaのリクエスト
 * @param board 変換先のSudoku::board
 * @return int 正常に変換できたら0, それ以外は1(invalid syntax)
 */
int parse_invocation_request(const aws::lambda_runtime::invocation_request &request,
                             boost::json::object &json);

/**
 * @brief JSONからSudoku::boardに変換する
 *
 * @param json 配列の配列を表すJSON、json::array
 * @param board 変換先のSudoku::board
 * @return int 正常に変換できたら0, それ以外は1
 */
int json_to_sudokuboard(const boost::json::array &json, Sudoku::Board &board);

/**
 * @brief Sudoku::boardからJSONに変換する
 *
 * @param board 変換元のSudoku::board
 * @param json 変換後のJSON
 * @return int 正常に変換できたら0, それ以外は1
 */
int sudokuboard_to_json(const Sudoku::Board &board, boost::json::array &json);

/**
 * @brief Sudoku::OptionからJSONに変換する
 *
 * @param options 変換元のSudoku::Option
 * @param json 変換後のJSON Array
 * @return int 正常に変換できたら0, それ以外は1
 */
int options_to_json(const std::vector<Sudoku::Option> &options, boost::json::array &json);
}  // namespace HandlerHelper
