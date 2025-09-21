# subdirectoryなのでインデントする
set(indent "- ")

message(STATUS "${indent}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

# gtest設定
set(BUILD_GMOCK OFF CACHE BOOL "" FORCE)

# benchmark設定
set(BENCHMARK_ENABLE_TESTING OFF CACHE BOOL "" FORCE)
set(BENCHMARK_ENABLE_GTEST_TESTS OFF CACHE BOOL "" FORCE)
set(BENCHMARK_USE_BUNDLED_GTEST OFF CACHE BOOL "" FORCE)

set(subdirs googletest benchmark)
foreach(subdir IN LISTS subdirs)
  message(STATUS "${indent}Adding subdirectory: ${subdir}")
  add_subdirectory(${subdir})
endforeach()
