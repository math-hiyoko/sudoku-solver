# subdirectoryなのでインデントする
set(indent "- - ")

message(STATUS "${indent}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# ライブラリDancingLinksを作成
set(target_name "DancingLinks")
add_library(${target_name} STATIC DancingNode.cpp ColumnNode.cpp RowNode.cpp
                                  HeaderNode.cpp KnuthsAlgorithm.cpp)

target_include_directories(${target_name} PRIVATE ${PROJECT_SOURCE_DIR}/include)
target_compile_features(${target_name} PRIVATE cxx_std_20)
target_compile_options(${target_name} PRIVATE -O3 -flto -fstrict-aliasing)
foreach(env_var IN LISTS env_vars)
  target_compile_definitions(${target_name} PRIVATE ${env_var})
endforeach()

set_target_properties(${target_name} PROPERTIES ARCHIVE_OUTPUT_DIRECTORY
                                                ${PROJECT_SOURCE_DIR}/lib)

# ライブラリSudokuSolverを作成
set(target_name "SudokuSolver")
add_library(${target_name} STATIC SudokuSolver.cpp SudokuValidator.cpp)

target_compile_features(${target_name} PRIVATE cxx_std_20)
target_compile_options(${target_name} PRIVATE -O3 -flto -fstrict-aliasing)
target_include_directories(${target_name} PRIVATE ${PROJECT_SOURCE_DIR}/include
                                                  ${Boost_INCLUDE_DIRS})
target_link_directories(${target_name} PRIVATE ${PROJECT_SOURCE_DIR}/lib)
target_link_libraries(${target_name} INTERFACE DancingLinks)
foreach(env_var IN LISTS env_vars)
  target_compile_definitions(${target_name} PRIVATE ${env_var})
endforeach()

set_target_properties(${target_name} PROPERTIES ARCHIVE_OUTPUT_DIRECTORY
                                                ${PROJECT_SOURCE_DIR}/lib)
