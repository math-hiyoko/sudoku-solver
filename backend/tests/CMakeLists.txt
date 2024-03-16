# subdirectoryなのでインデントする
set(INDENT "- ")

message(STATUS "${INDENT}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

# ライブラリターゲット名を指定
set(TARGET_NAME "unittest")

add_executable(${TARGET_NAME}
  SolveSudokuTest.cpp
)

target_compile_features(${TARGET_NAME} PRIVATE cxx_std_20)
target_include_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/include
  ${Boost_INCLUDE_DIRS}
)
target_link_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/lib
)
target_link_libraries(${TARGET_NAME}
  gtest_main
  DancingLinks
  SudokuSolver
)
foreach(env_var IN LISTS ENV_VARS)
  target_compile_definitions(${TARGET_NAME} PRIVATE ${env_var})
endforeach()

add_test(NAME ${TARGET_NAME} COMMAND ${CMAKE_CURRENT_BINARY_DIR}/${TARGET_NAME} --gtest_output=xml:unittest_reports/)
