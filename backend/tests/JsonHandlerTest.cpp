#include <aws/lambda-runtime/runtime.h>
#include <gtest/gtest.h>

#include <string>

#include "handler/JsonHandler.hpp"
#include "solver/SudokuType.hpp"

#if defined(SUDOKU_DIM) && SUDOKU_DIM == 3
TEST(JsonHandlerTest, testSuccessResponse) {
  boost::json::object board_json = {
      {"board",
       {
           {8, 0, 0, 0, 0, 0, 0, 0, 0},
           {0, 0, 3, 6, 0, 0, 0, 0, 0},
           {0, 7, 0, 0, 9, 0, 2, 0, 0},
           {0, 5, 0, 0, 0, 7, 0, 0, 0},
           {0, 0, 0, 0, 4, 5, 7, 0, 0},
           {0, 0, 0, 1, 0, 0, 0, 3, 0},
           {0, 0, 1, 0, 0, 0, 0, 6, 8},
           {0, 0, 8, 5, 0, 0, 0, 1, 0},
           {0, 9, 0, 0, 0, 0, 4, 0, 0},
       }},
  };
  boost::json::object payload = {
      {"body", boost::json::serialize(board_json)},
  };

  aws::lambda_runtime::invocation_request request = {
      .payload = boost::json::serialize(payload),
      .request_id = "aws_request_id",
  };
  aws::lambda_runtime::invocation_response response = Handler::sudoku_handler(request);

  boost::json::object expected_body = {
      {"solution",
       {
           {8, 6, 2, 4, 3, 9, 1, 7, 5},
           {5, 1, 9, 6, 7, 2, 3, 8, 4},
           {3, 7, 4, 8, 1, 5, 2, 9, 6},
           {2, 5, 6, 3, 9, 7, 8, 4, 1},
           {1, 8, 3, 2, 4, 6, 7, 5, 9},
           {9, 4, 7, 1, 5, 8, 6, 3, 2},
           {7, 3, 1, 9, 2, 4, 5, 6, 8},
           {4, 2, 8, 5, 6, 3, 9, 1, 7},
           {6, 9, 5, 7, 8, 1, 4, 2, 3},
       }},
      {"num_solutions", std::min(271'710, Sudoku::MAX_NUM_SOLUTIONS)},
      {"is_exact_num_solutions", 271'710 <= Sudoku::MAX_NUM_SOLUTIONS ? true : false},
  };
  boost::json::object expected_payload = {
      {"statusCode", 200},
      {"headers",
       {
           {"content-type", "application/json"},
       }},
      {"body", boost::json::serialize(expected_body)},
      {"isBase64Encoded", false},
  };

  EXPECT_TRUE(response.is_success());
  EXPECT_EQ(response.get_payload(), boost::json::serialize(expected_payload));
}

TEST(JsonHandlerTest, testIncorrectInputResponse) {
  boost::json::object board_json = {
      {"board",
       {
           {8, 0, 0, 0, 0, 0, 0, 0, 0},
           {0, 0, 0, 6, 0, 0, 0, 0, 0},
           {0, 7, 0, 0, 0, 0, 2, 0, 0},
           {0, 5, 0, 0, 0, 7, 0, 0, 0},
           {0, 0, 0, 0, 4, 0, 7, 0, 0},
           {0, 0, 0, 1, 0, 0, 0, 3, 0},
           {0, 0, 1, 0, 0, 0, 0, 6, 8},
           {0, 0, 8, 5, 0, 0, 0, 1, 0},
           {0, 9, 0, 0, 0, 0, 4, 0},
       }},
  };
  boost::json::object payload = {
      {"body", boost::json::serialize(board_json)},
  };

  aws::lambda_runtime::invocation_request request = {
      .payload = boost::json::serialize(payload),
      .request_id = "aws_request_id",
  };
  aws::lambda_runtime::invocation_response response = Handler::sudoku_handler(request);

  boost::json::object expected_body = {
      {"error",
       {
           {"type", "InvalidInput"},
           {"message", "Array size is incorrect or Invalid input type."},
       }},
  };
  boost::json::object expected_payload = {
      {"statusCode", 400},
      {"headers",
       {
           {"content-type", "application/json"},
       }},
      {"body", boost::json::serialize(expected_body)},
      {"isBase64Encoded", false},
  };

  EXPECT_TRUE(response.is_success());
  EXPECT_EQ(response.get_payload(), boost::json::serialize(expected_payload));
}

TEST(JsonHandlerTest, testOutOfRangeResponse) {
  boost::json::object board_json = {
      {"board",
       {
           {8, 0, 0, 0, 0, 0, 0, 0, 0},
           {0, 0, 0, 6, 0, 0, 0, 0, 0},
           {0, 7, 0, 0, 0, 0, 2, 0, 0},
           {0, 5, 0, 0, 0, 7, 0, 0, 0},
           {0, 0, 0, 0, 4, 0, 7, 0, 0},
           {0, 0, 0, 1, 0, 0, 0, 3, 0},
           {0, 0, 1, 0, 0, 0, 0, 6, 8},
           {0, 0, 8, 5, 0, 0, 0, 1, 0},
           {0, 9, 0, 0, 0, 0, 4, 10, -1},
       }},
  };
  boost::json::object payload = {
      {"body", boost::json::serialize(board_json)},
  };

  aws::lambda_runtime::invocation_request request = {
      .payload = boost::json::serialize(payload),
      .request_id = "aws_request_id",
  };
  aws::lambda_runtime::invocation_response response = Handler::sudoku_handler(request);

  boost::json::object expected_body = {
      {"error",
       {
           {"type", "OutOfRangeError"},
           {"message", "Input validation error: some numbers are out of the allowed range."},
           {"detail",
            {
                {
                    {"row", 8},
                    {"column", 7},
                    {"number", 10},
                },
                {
                    {"row", 8},
                    {"column", 8},
                    {"number", -1},
                },
            }},
       }},
  };
  boost::json::object expected_payload = {
      {"statusCode", 400},
      {"headers",
       {
           {"content-type", "application/json"},
       }},
      {"body", boost::json::serialize(expected_body)},
      {"isBase64Encoded", false},
  };

  EXPECT_TRUE(response.is_success());
  EXPECT_EQ(response.get_payload(), boost::json::serialize(expected_payload));
}

TEST(JsonHandlerTest, testConstraintViolationResponse) {
  boost::json::object board_json = {
      {"board",
       {
           {8, 0, 0, 0, 0, 0, 0, 0, 0},
           {0, 0, 0, 6, 0, 0, 0, 0, 0},
           {0, 7, 0, 6, 0, 0, 2, 0, 0},
           {0, 5, 0, 0, 0, 7, 0, 0, 0},
           {0, 0, 0, 0, 4, 0, 7, 0, 0},
           {0, 0, 0, 1, 0, 0, 0, 3, 0},
           {0, 0, 1, 1, 0, 0, 0, 6, 8},
           {0, 0, 8, 5, 0, 0, 0, 1, 0},
           {0, 9, 0, 0, 0, 0, 4, 0, 0},
       }},
  };
  boost::json::object payload = {
      {"body", boost::json::serialize(board_json)},
  };

  aws::lambda_runtime::invocation_request request = {
      .payload = boost::json::serialize(payload),
      .request_id = "aws_request_id",
  };
  aws::lambda_runtime::invocation_response response = Handler::sudoku_handler(request);

  boost::json::object expected_body = {
      {"error",
       {
           {"type", "ConstraintViolation"},
           {"message", "Input does not meet the required constraints."},
           {"detail",
            {
                {
                    {"index", 6},
                    {"number", 1},
                    {"type", "row"},
                },
                {
                    {"index", 3},
                    {"number", 1},
                    {"type", "column"},
                },
                {
                    {"index", 3},
                    {"number", 6},
                    {"type", "column"},
                },
                {
                    {"index", 1},
                    {"number", 6},
                    {"type", "block"},
                },
            }},
       }},
  };
  boost::json::object expected_payload = {
      {"statusCode", 400},
      {"headers",
       {
           {"content-type", "application/json"},
       }},
      {"body", boost::json::serialize(expected_body)},
      {"isBase64Encoded", false},
  };

  EXPECT_TRUE(response.is_success());
  EXPECT_EQ(response.get_payload(), boost::json::serialize(expected_payload));
}
#endif
