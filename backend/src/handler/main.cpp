#include <aws/lambda-runtime/runtime.h>

#include "handler/JsonHandler.hpp"

int main() {
  aws::lambda_runtime::run_handler(sudoku_handler);
  return 0;
}