#include "handler/JsonHandler.hpp"

#include <aws/lambda-runtime/runtime.h>

#include <boost/json.hpp>
#include <vector>

#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"
#include "solver/SudokuValidator.hpp"

aws::lambda_runtime::invocation_response success_response(const boost::json::object &payload) {
  // JSON ペイロードを文字列に変換
  std::string payload_str = boost::json::serialize(payload);

  return aws::lambda_runtime::invocation_response::success(payload_str, "application/json");
}

aws::lambda_runtime::invocation_response error_response(const boost::json::object &payload,
                                                        const int &status_code) {
  // JSON ペイロードを文字列に変換
  std::string error_payload_str = boost::json::serialize(error_payload);

  return aws::lambda_runtime::invocation_response::failure(error_payload_str, status_code);
}

aws::lambda_runtime::invocation_response sudoku_handler(
    const aws::lambda_runtime::invocation_request &request) {
  // リクエストのペイロードをパースして JSON 値を取得
  boost::json::object request_json;
  if (parse_invocation_request(request, request_json) != 0) {
    return error_response({{"error", "Invalid syntax"}}, 400);
  }

  // リクエストの JSON から Sudoku::Board を取得
  Sudoku::Board input_board;
  if (json_to_sudokuboard(request_json, input_board) != 0) {
    return error_response({{"error", "Invalid Input Type"}}, 400);
  }

  // 値の範囲が正しいか確認
  std::vector<Option> invalid_numbers;
  if (Sudoku::isValidRange(input_board, invalid_numbers) != 0) {
    boost::json::array invalid_numbers_json;
    if (options_to_json(invalid_numbers, invalid_numbers_json) != 0) {
      return error_response({{"error", "Internal server error"}}, 500);
    }

    boost::json::object response_json = {
      {"error", "Out of range numbers"},
      {"invalid numbers", invalid_numbers_json}
    } return success_response(response_json, 422);
  }

  // 数独の制約を満たしているか確認
  std::vector<Constraint> invalid_constraints;
  if (Sudoku::isSatisfy(input_board, invalid_constraints) != 0) {
    boost::json::array invalid_constraints_json;
    if (constraints_to_json(invalid_constraints, invalid_constraints_json) != 0) {
      return error_response({{"error", "Internal server error"}}, 500);
    }

    boost::json::object response_json = {
      {"error", "Invalid constraints"},
      {"invalid constraints", invalid_constraints_json}
    } return success_response(response_json, 422);
  }

  // 数独を解く
  Sudoku::Board answer_board;
  int num_answer;
  bool is_exact_num_answe Sudoku::solve(input_board, answer_board, num_answer, is_exact_num_answer);

  // 数独の解答を JSON に変換
  boost::json::array answer_json;
  if (sudokuboard_to_json(solver.get_board(), answer_json) != 0) {
    return error_response("Internal server error", 500);
  }

  // レスポンスを返す
  boost::json::object response_json = {{"answer", answer_json},
                                       {"num_answer", num_answer},
                                       {"is_exact_num_answer", is_exact_num_answer}};

  return success_response(response_json);
}
