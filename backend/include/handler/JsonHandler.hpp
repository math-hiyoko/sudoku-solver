#pragma once

#include <aws/lambda-runtime/runtime.h>

#include <boost/json.hpp>

namespace Handler {
/**
 * @brief 全体を通してのハンドラ
 *
 * @param request AWS Lambdaのリクエスト
 * @return aws::lambda_runtime::invocation_response レスポンス
 */
aws::lambda_runtime::invocation_response sudoku_handler(
    const aws::lambda_runtime::invocation_request &request);
}  // namespace Handler
