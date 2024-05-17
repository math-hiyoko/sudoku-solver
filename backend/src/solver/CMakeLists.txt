# subdirectoryなのでインデントする
set(INDENT "- - ")

message(STATUS "${INDENT}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# ライブラリDancingLinksを作成
set(TARGET_NAME "DancingLinks")
add_library(${TARGET_NAME} STATIC
  DancingNode.cpp
  ColumnNode.cpp
  RowNode.cpp
  HeaderNode.cpp
  KnuthsAlgorithm.cpp
)

target_include_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/include
)
target_compile_features(${TARGET_NAME} PRIVATE cxx_std_20)
target_compile_options(${TARGET_NAME} PRIVATE
  -O3
  -finline-functions
  -flto
  -fstrict-aliasing
  -funroll-loops
  -mavx512f
)
foreach(env_var IN LISTS ENV_VARS)
  target_compile_definitions(${TARGET_NAME} PRIVATE ${env_var})
endforeach()

set_target_properties(${TARGET_NAME} PROPERTIES
  ARCHIVE_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/lib
)

# ライブラリSudokuSolverを作成
set(TARGET_NAME "SudokuSolver")
add_library(${TARGET_NAME} STATIC
  SudokuSolver.cpp
  SudokuValidator.cpp
)

target_compile_features(${TARGET_NAME} PRIVATE cxx_std_20)
target_compile_options(${TARGET_NAME} PRIVATE
  -O3
  -finline-functions
  -flto
  -fstrict-aliasing
  -funroll-loops
  -mavx512f
)
target_include_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/include
  ${Boost_INCLUDE_DIRS}
)
target_link_directories(${TARGET_NAME} PRIVATE
  ${PROJECT_SOURCE_DIR}/lib
)
target_link_libraries(${TARGET_NAME} INTERFACE
  DancingLinks
)
foreach(env_var IN LISTS ENV_VARS)
  target_compile_definitions(${TARGET_NAME} PRIVATE ${env_var})
endforeach()

set_target_properties(${TARGET_NAME} PROPERTIES
  ARCHIVE_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/lib
)
