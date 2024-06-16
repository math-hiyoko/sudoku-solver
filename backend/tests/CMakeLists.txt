# subdirectoryなのでインデントする
set(indent "- ")

message(STATUS "${indent}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

# ライブラリターゲット名を指定
set(target_name "unittest")

add_executable(
  ${target_name}
  JsonHandlerTest.cpp Solve4x4SudokuTest.cpp Solve9x9SudokuTest.cpp
  Solve16x16SudokuTest.cpp ValidateSudokuTest.cpp)

target_compile_features(${target_name} PRIVATE cxx_std_20)
target_include_directories(${target_name} PRIVATE ${PROJECT_SOURCE_DIR}/include
                                                  ${Boost_INCLUDE_DIRS})
target_link_directories(${target_name} PRIVATE ${PROJECT_SOURCE_DIR}/lib)
target_link_libraries(
  ${target_name}
  gtest_main
  AWS::aws-lambda-runtime
  Boost::json
  DancingLinks
  SudokuSolver
  HandlerTools)
foreach(env_var IN LISTS env_vars)
  target_compile_definitions(${target_name} PRIVATE ${env_var})
endforeach()

include(GoogleTest)
gtest_discover_tests(${target_name} XML_OUTPUT_DIR unittest_reports/)
