# subdirectoryなのでインデントする
set(INDENT "- ")

message(STATUS "${INDENT}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

set(subdirs solver)
foreach(subdir IN LISTS subdirs)
  message(STATUS "${INDENT}Adding subdirectory: ${subdir}")
  add_subdirectory(${subdir})
endforeach()
