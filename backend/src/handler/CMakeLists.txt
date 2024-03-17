# subdirectoryなのでインデントする
set(INDENT "- - ")

message(STATUS "${INDENT}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# ライブラリHandlerToolsを作成
set(TARGET_NAME "HandlerTools")
add_library(${TARGET_NAME} STATIC
  JsonHandler.cpp
  JsonHelper.cpp
)

target_include_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/include
)
target_compile_features(${TARGET_NAME} PRIVATE cxx_std_20)
target_compile_options(${TARGET_NAME} PRIVATE
  -O3
  -march=native
  -flto
  -fstrict-aliasing
)
foreach(env_var IN LISTS ENV_VARS)
  target_compile_definitions(${TARGET_NAME} PRIVATE ${env_var})
endforeach()

set_target_properties(${TARGET_NAME} PROPERTIES
  ARCHIVE_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/lib
)

# 実行ファイルを作成
set(TARGET_NAME "SudokuLambda")
add_executable(${TARGET_NAME}
  main.cpp
)

target_compile_features(${TARGET_NAME} PRIVATE cxx_std_20)
target_include_directories(${TARGET_NAME} PRIVATE
  ${Boost_INCLUDE_DIRS}
  ${PROJECT_SOURCE_DIR}/include
)
target_link_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/lib
)
target_link_libraries(${TARGET_NAME}
  AWS::aws-lambda-runtime
  DancingLinks
  SudokuSolver
  HandlerTools
)
foreach(env_var IN LISTS ENV_VARS)
  target_compile_definitions(${TARGET_NAME} PRIVATE ${env_var})
endforeach()

set_target_properties(${TARGET_NAME} PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin
)
