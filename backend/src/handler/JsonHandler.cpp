#include "handler/JsonHandler.hpp"

#include <aws/lambda-runtime/runtime.h>

#include <boost/json.hpp>
#include <vector>

#include "handler/JsonHelper.hpp"
#include "solver/SudokuSolver.hpp"
#include "solver/SudokuType.hpp"
#include "solver/SudokuValidator.hpp"

namespace {
/**
 * @brief 通常のレスポンスを返す
 *
 * @param payload レスポンスのペイロード(boost::json::object)
 * @return aws::lambda_runtime::invocation_response レスポンス
 */
aws::lambda_runtime::invocation_response success_response(const boost::json::object &body) {
  // ペイロードを作成
  boost::json::object response_payload = {
      {"statusCode", 200},
      {"headers",
       {
           {"content-type", "application/json"},
       }},
      {"body", boost::json::serialize(body)},
      {"isBase64Encoded", false},
  };
  // JSON ペイロードを文字列に変換
  std::string response_payload_str = boost::json::serialize(response_payload);

  return aws::lambda_runtime::invocation_response::success(response_payload_str,
                                                           "application/json");
}

/**
 * @brief エラーのレスポンスを返す
 *
 * @param payload レスポンスのペイロード(boost::json::object)
 * @param status_code ステータスコード
 * @return aws::lambda_runtime::invocation_response エラーレスポンス
 */
aws::lambda_runtime::invocation_response error_response(const int &status_code,
                                                        const boost::json::object &error_json) {
  // ペイロードを作成
  boost::json::object response_payload = {
      {"statusCode", status_code},
      {"headers",
       {
           {"content-type", "application/json"},
       }},
      {"body", boost::json::serialize(error_json)},
      {"isBase64Encoded", false},
  };
  // JSON ペイロードを文字列に変換
  std::string response_payload_str = boost::json::serialize(response_payload);

  return aws::lambda_runtime::invocation_response::success(response_payload_str,
                                                           "application/json");
}
};  // namespace

namespace Handler {
aws::lambda_runtime::invocation_response sudoku_handler(
    const aws::lambda_runtime::invocation_request &request) {
  // リクエストのペイロードをパースして JSON 値を取得
  boost::json::object request_json;
  if (HandlerHelper::parse_invocation_request(request, request_json) != 0) {
    boost::json::object error_json = {
        {"error",
         {
             {"type", "JSONParseError"},
             {"message", "Invalid JSON format. Unable to parse the request body."},
         }},
    };
    return error_response(400, error_json);
  }

  // リクエストの JSON から Sudoku::Board を取得
  if (!request_json.contains("board") || !request_json.at("board").is_array()) {
    boost::json::object error_json = {
        {"error",
         {
             {"type", "MissingField"},
             {"message", "Missing required array field: board."},
         }},
    };
    return error_response(400, error_json);
  }
  Sudoku::Board input_board;
  if (HandlerHelper::json_to_sudokuboard(request_json.at("board").as_array(), input_board) != 0) {
    boost::json::object error_json = {
        {"error",
         {
             {"type", "InvalidInput"},
             {"message", "Array size is incorrect or Invalid input type."},
         }},
    };
    return error_response(400, error_json);
  }

  // 値の範囲が正しいか確認
  std::vector<Sudoku::Option> invalid_numbers;
  if (Sudoku::isValidRange(input_board, invalid_numbers) != 0) {
    boost::json::array invalid_numbers_json;
    if (HandlerHelper::options_to_json(invalid_numbers, invalid_numbers_json) != 0) {
      boost::json::object error_json = {
          {"error",
           {
               {"type", "InternalServerError"},
               {"message", "An unexpected error occurred."},
           }},
      };
      return error_response(500, error_json);
    }

    boost::json::object error_json = {
        {"error",
         {
             {"type", "OutOfRangeError"},
             {"message", "Input validation error: some numbers are out of the allowed range."},
             {"detail", invalid_numbers_json},
         }},
    };
    return error_response(400, error_json);
  }

  // 数独の制約を満たしているか確認
  std::vector<Sudoku::Option> invalid_options;
  if (Sudoku::isSatisfy(input_board, invalid_options) != 0) {
    boost::json::array invalid_options_json;
    if (HandlerHelper::options_to_json(invalid_options, invalid_options_json) != 0) {
      boost::json::object error_json = {
          {"error",
           {
               {"type", "InternalServerError"},
               {"message", "An unexpected error occurred."},
           }},
      };
      return error_response(500, error_json);
    }

    boost::json::object error_json = {
        {"error",
         {
             {"type", "ConstraintViolation"},
             {"message", "Input does not meet the required constraints."},
             {"detail", invalid_options_json},
         }},
    };
    return error_response(400, error_json);
  }

  // 数独を解く
  Sudoku::Board solution_board;
  int num_solutions;
  bool is_exact_num_solutions;
  Sudoku::solve(input_board, solution_board, num_solutions, is_exact_num_solutions);

  // 数独の解答を JSON に変換
  boost::json::array solution_json;
  if (HandlerHelper::sudokuboard_to_json(solution_board, solution_json) != 0) {
    boost::json::object error_json = {
        {"error",
         {
             {"type", "InternalServerError"},
             {"message", "An unexpected error occurred."},
         }},
    };
    return error_response(500, error_json);
  }

  // レスポンスを返す
  boost::json::object response_json = {{"solution", solution_json},
                                       {"num_solutions", num_solutions},
                                       {"is_exact_num_solutions", is_exact_num_solutions}};

  return success_response(response_json);
}
}  // namespace Handler
