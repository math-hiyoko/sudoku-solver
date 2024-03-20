#include <aws/lambda-runtime/runtime.h>
#include <gtest/gtest.h>

#include <string>

#include "handler/JsonHandler.hpp"

#if defined(SUDOKU_DIM) && SUDOKU_DIM == 3
TEST(JsonHandlerTest, testSuccessResponse) {
  boost::json::object payload = {
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
           {0, 9, 0, 0, 0, 0, 4, 0, 0},
       }},
  };
  std::string aws_request_id = "aws_request_id";

  aws::lambda_runtime::invocation_request request = {
      .payload = boost::json::serialize(payload),
      .request_id = aws_request_id,
  };
  aws::lambda_runtime::invocation_response response = Handler::sudoku_handler(request);

  boost::json::object expected_response = {
      {"answer",
       {
           {8, 3, 2, 4, 7, 1, 6, 9, 5},
           {9, 1, 4, 6, 5, 2, 3, 8, 7},
           {6, 7, 5, 9, 3, 8, 2, 4, 1},
           {4, 5, 9, 3, 8, 7, 1, 2, 6},
           {1, 8, 3, 2, 4, 6, 7, 5, 9},
           {2, 6, 7, 1, 9, 5, 8, 3, 4},
           {3, 4, 1, 7, 2, 9, 5, 6, 8},
           {7, 2, 8, 5, 6, 4, 9, 1, 3},
           {5, 9, 6, 8, 1, 3, 4, 7, 2},
       }},
      {"num_answer", 271710},
      {"is_exact_num_answer", true},
  };

  EXPECT_TRUE(response.is_success());
  EXPECT_EQ(response.get_payload(), boost::json::serialize(expected_response));
}

TEST(JsonHandlerTest, testIncorrectInputResponse) {
  boost::json::object payload = {
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

  aws::lambda_runtime::invocation_request request = {
      .payload = boost::json::serialize(payload),
  };
  aws::lambda_runtime::invocation_response response = Handler::sudoku_handler(request);

  std::string expected_payload = "{\"errorMessage\":\"{\\\"statusCode\\\":400,\\\"errorDetail\\\":\\\"Array size is incorrect or Invalid input type.\\\"}\",\"errorType\":\"InvalidInput\", \"stackTrace\":[]}";

  EXPECT_FALSE(response.is_success());
  EXPECT_EQ(response.get_payload(), expected_payload);
}

TEST(JsonHandlerTest, testOutOfRangeResponse) {
  boost::json::object payload = {
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

  aws::lambda_runtime::invocation_request request = {
      .payload = boost::json::serialize(payload),
  };
  aws::lambda_runtime::invocation_response response = Handler::sudoku_handler(request);

  std::string expected_payload = "{\"errorMessage\":\"{\\\"statusCode\\\":400,\\\"errorDetail\\\":\\\"Input validation error: some numbers are out of the allowed range.\\\",\\\"errors\\\":[{\\\"row\\\":8,\\\"column\\\":7,\\\"number\\\":10},{\\\"row\\\":8,\\\"column\\\":8,\\\"number\\\":-1}]}\",\"errorType\":\"OutOfRangeError\", \"stackTrace\":[]}";

  EXPECT_FALSE(response.is_success());
  EXPECT_EQ(response.get_payload(), expected_payload);
}

TEST(JsonHandlerTest, testConstraintViolationResponse) {
  boost::json::object payload = {
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

  aws::lambda_runtime::invocation_request request = {
      .payload = boost::json::serialize(payload),
  };
  aws::lambda_runtime::invocation_response response = Handler::sudoku_handler(request);

  std::string expected_payload = "{\"errorMessage\":\"{\\\"statusCode\\\":500,\\\"errorDetail\\\":\\\"Input does not meet the required constraints.\\\",\\\"errors\\\":[{\\\"index\\\":6,\\\"number\\\":1,\\\"type\\\":\\\"row\\\"},{\\\"index\\\":3,\\\"number\\\":1,\\\"type\\\":\\\"column\\\"},{\\\"index\\\":3,\\\"number\\\":6,\\\"type\\\":\\\"column\\\"},{\\\"index\\\":1,\\\"number\\\":6,\\\"type\\\":\\\"block\\\"}]}\",\"errorType\":\"ConstraintViolation\", \"stackTrace\":[]}";

  EXPECT_FALSE(response.is_success());
  EXPECT_EQ(response.get_payload(), expected_payload);
}
#endif
