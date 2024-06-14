# subdirectoryなのでインデントする
set(indent "- ")

message(STATUS "${indent}Starting configuration in ${CMAKE_CURRENT_SOURCE_DIR}")

set(subdirs googletest)
foreach(subdir IN LISTS subdirs)
  message(STATUS "${indent}Adding subdirectory: ${subdir}")
  add_subdirectory(${subdir})
endforeach()
