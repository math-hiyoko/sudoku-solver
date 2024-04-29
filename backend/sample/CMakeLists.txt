# subdirectoryなのでインデントする
set(INDENT "- ")

message(STATUS "${INDENT}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

# 実行ファイルSudokuSokverを作成
set(TARGET_NAME "SudokuSolverSample")
add_executable(${TARGET_NAME}
  SudokuSolverSample.cpp
)

target_include_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/include
  ${Boost_INCLUDE_DIRS}
)
target_link_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/lib
)
target_link_libraries(${TARGET_NAME} PRIVATE
  DancingLinks
  SudokuSolver
)
target_compile_features(${TARGET_NAME} PRIVATE cxx_std_20)
target_compile_options(${TARGET_NAME} PRIVATE
  -O3
  -flto
  -fstrict-aliasing
)
foreach(env_var IN LISTS ENV_VARS)
  target_compile_definitions(${TARGET_NAME} PRIVATE ${env_var})
endforeach()

set_target_properties(${TARGET_NAME} PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin
)
