# subdirectoryなのでインデントする
set(indent "- - ")

message(STATUS "${indent}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# ライブラリHandlerToolsを作成
set(target_name "HandlerTools")
add_library(${target_name} STATIC JsonHandler.cpp JsonHelper.cpp)

target_include_directories(${target_name} PRIVATE ${Boost_INCLUDE_DIRS}
                                                  ${PROJECT_SOURCE_DIR}/include)
target_link_directories(${target_name} PRIVATE ${PROJECT_SOURCE_DIR}/lib)
target_link_libraries(${target_name} INTERFACE AWS::aws-lambda-runtime
                                               Boost::json SudokuSolver)
target_compile_features(${target_name} PRIVATE cxx_std_20)
target_compile_options(${target_name} PRIVATE -O3 -finline-functions -flto
                                              -fstrict-aliasing -funroll-loops)
foreach(env_var IN LISTS env_vars)
  target_compile_definitions(${target_name} PRIVATE ${env_var})
endforeach()

set_target_properties(${target_name} PROPERTIES ARCHIVE_OUTPUT_DIRECTORY
                                                ${PROJECT_SOURCE_DIR}/lib)

# 実行ファイルを作成
set(target_name "SudokuSolverBackend")
add_executable(${target_name} main.cpp)

target_compile_features(${target_name} PRIVATE cxx_std_20)
target_include_directories(${target_name} PRIVATE ${Boost_INCLUDE_DIRS}
                                                  ${PROJECT_SOURCE_DIR}/include)
target_link_directories(${target_name} PRIVATE ${PROJECT_SOURCE_DIR}/lib)
target_link_libraries(
  ${target_name} PRIVATE AWS::aws-lambda-runtime Boost::json OpenMP::OpenMP_CXX
                         HandlerTools)
target_compile_options(${target_name} PRIVATE -O3 -finline-functions -flto
                                              -fstrict-aliasing -funroll-loops)
foreach(env_var IN LISTS env_vars)
  target_compile_definitions(${target_name} PRIVATE ${env_var})
endforeach()

set_target_properties(${target_name} PROPERTIES RUNTIME_OUTPUT_DIRECTORY
                                                ${PROJECT_SOURCE_DIR}/bin)

aws_lambda_package_target(${target_name} NO_LIBC)
