#pragma once

#include <aws/lambda-runtime/runtime.h>

#include <boost/json.hpp>

/**
 * @brief 通常のレスポンスを返す
 *
 * @param payload レスポンスのペイロード(boost::json::object)
 * @return aws::lambda_runtime::invocation_response レスポンス
 */
aws::lambda_runtime::invocation_response success_response(const boost::json::object &payload);

/**
 * @brief エラーのレスポンスを返す
 *
 * @param payload レスポンスのペイロード(boost::json::object)
 * @param status_code ステータスコード
 * @return aws::lambda_runtime::invocation_response エラーレスポンス
 */
aws::lambda_runtime::invocation_response error_response(const boost::json::object &payload,
                                                        const int &status_code);

/**
 * @brief 全体を通してのハンドラ
 *
 * @param request AWS Lambdaのリクエスト
 * @return aws::lambda_runtime::invocation_response レスポンス
 */
aws::lambda_runtime::invocation_response sudoku_handler(
    const aws::lambda_runtime::invocation_request &request);
