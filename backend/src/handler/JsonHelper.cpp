#include "handler/JsonHelper.hpp"

#include <aws/lambda-runtime/runtime.h>

#include <boost/json.hpp>
#include <vector>

#include "solver/SudokuType.hpp"

namespace HandlerHelper {
int parse_invocation_request(const aws::lambda_runtime::invocation_request &request,
                             boost::json::object &json) {
  // リクエストのペイロードをパースして JSON 値を取得
  const boost::json::value parsed_json = boost::json::parse(request.payload);

  // JSON 値がオブジェクトかどうか確認
  if (!parsed_json.is_object()) {
    return 1;
  }
  const boost::json::object payload_json = parsed_json.as_object();

  // body要素にstring形式で入力が入っている
  if (!payload_json.contains("body") || !payload_json.at("body").is_string()) {
    return 1;
  }
  json = boost::json::parse(payload_json.at("body").as_string()).as_object();

  return 0;
}

int json_to_sudokuboard(const boost::json::array &json, Sudoku::Board &board) {
  // Sudoku::SIZEと一致する大きさの配列の配列でなければいけない
  if (json.size() != Sudoku::SIZE) {
    return 1;
  }
  for (int i = 0; i < Sudoku::SIZE; i++) {
    const boost::json::value &inner_json = json.at(i);
    // Sudoku::SIZEと一致する大きさの配列でなければいけない
    if (!inner_json.is_array() || inner_json.as_array().size() != Sudoku::SIZE) {
      return 1;
    }
    for (int j = 0; j < Sudoku::SIZE; j++) {
      const boost::json::value &number = inner_json.as_array().at(j);
      if (number.is_int64()) {
        board[i][j] = number.as_int64();
      } else if (number.is_null()) {
        // null(空欄)は0として扱う
        board[i][j] = 0;
      } else {
        // 整数もしくはnullでなければいけない
        return 1;
      }
    }
  }
  return 0;
}

int sudokuboard_to_json(const Sudoku::Board &board, boost::json::array &json) {
  for (int i = 0; i < Sudoku::SIZE; i++) {
    boost::json::array inner_json;
    for (int j = 0; j < Sudoku::SIZE; j++) {
      inner_json.emplace_back(board[i][j]);
    }
    json.emplace_back(inner_json);
  }
  return 0;
}

int options_to_json(const std::vector<Sudoku::Option> &options, boost::json::array &json) {
  for (const Sudoku::Option &option : options) {
    json.emplace_back(boost::json::object{
        {"row", option.row},
        {"column", option.column},
        {"number", option.number},
    });
  }
  return 0;
}
}  // namespace HandlerHelper
