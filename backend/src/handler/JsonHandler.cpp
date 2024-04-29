#include "handler/JsonHandler.hpp"

#include <aws/lambda-runtime/runtime.h>

#include <boost/json.hpp>
#include <vector>

#include "handler/JsonHelper.hpp"
#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"
#include "solver/SudokuValidator.hpp"

namespace Handler {
aws::lambda_runtime::invocation_response success_response(const boost::json::object &payload) {
  // JSON ペイロードを文字列に変換
  std::string payload_str = boost::json::serialize(payload);

  return aws::lambda_runtime::invocation_response::success(payload_str, "application/json");
}

aws::lambda_runtime::invocation_response error_response(const boost::json::object &error_payload,
                                                        const std::string &error_type) {
  // JSON ペイロードを文字列に変換
  std::string error_payload_str = boost::json::serialize(error_payload);

  return aws::lambda_runtime::invocation_response::failure(error_payload_str, error_type);
}

aws::lambda_runtime::invocation_response sudoku_handler(
    const aws::lambda_runtime::invocation_request &request) {
  // リクエストのペイロードをパースして JSON 値を取得
  boost::json::object request_json;
  if (parse_invocation_request(request, request_json) != 0) {
    boost::json::object response_json = {
        {"statusCode", 400},
        {"errorDetail", "Invalid JSON format. Unable to parse the request body."},
    };
    return error_response(response_json, "JSONParseError");
  }

  // リクエストの JSON から Sudoku::Board を取得
  if (!request_json.contains("board") || !request_json.at("board").is_array()) {
    boost::json::object response_json = {
        {"statusCode", 400},
        {"errorDetail", "Missing required array field: board."},
    };
    return error_response(response_json, "MissingField");
  }
  Sudoku::Board input_board;
  if (json_to_sudokuboard(request_json.at("board").as_array(), input_board) != 0) {
    boost::json::object response_json = {
        {"statusCode", 400},
        {"errorDetail", "Array size is incorrect or Invalid input type."},
    };
    return error_response(response_json, "InvalidInput");
  }

  // 値の範囲が正しいか確認
  std::vector<Sudoku::Option> invalid_numbers;
  if (Sudoku::isValidRange(input_board, invalid_numbers) != 0) {
    boost::json::array invalid_numbers_json;
    if (options_to_json(invalid_numbers, invalid_numbers_json) != 0) {
      boost::json::object response_json = {
          {"statusCode", 500},
          {"errorDetail", "An unexpected error occurred."},
      };
      return error_response(response_json, "InternalServerError");
    }

    boost::json::object response_json = {
        {"statusCode", 400},
        {"errorDetail", "Input validation error: some numbers are out of the allowed range."},
        {"errors", invalid_numbers_json},
    };
    return error_response(response_json, "OutOfRangeError");
  }

  // 数独の制約を満たしているか確認
  std::vector<Sudoku::Constraint> invalid_constraints;
  if (Sudoku::isSatisfy(input_board, invalid_constraints) != 0) {
    boost::json::array invalid_constraints_json;
    if (constraints_to_json(invalid_constraints, invalid_constraints_json) != 0) {
      boost::json::object response_json = {
          {"statusCode", 500},
          {"errorDetail", "An unexpected error occurred."},
      };
      return error_response(response_json, "InternalServerError");
    }

    boost::json::object response_json = {
        {"statusCode", 500},
        {"errorDetail", "Input does not meet the required constraints."},
        {"errors", invalid_constraints_json}};
    return error_response(response_json, "ConstraintViolation");
  }

  // 数独を解く
  Sudoku::Board solution_board;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input_board, solution_board, num_solutions, is_exact_num_solutions);

  // 数独の解答を JSON に変換
  boost::json::array solution_json;
  if (sudokuboard_to_json(solution_board, solution_json) != 0) {
    boost::json::object response_json = {
        {"statusCode", 500},
        {"errorDetail", "An unexpected error occurred."},
    };
    return error_response(response_json, "InternalServerError");
  }

  // レスポンスを返す
  boost::json::object response_json = {{"solution", solution_json},
                                       {"num_solutions", num_solutions},
                                       {"is_exact_num_solutions", is_exact_num_solutions}};

  return success_response(response_json);
}
}  // namespace Handler
