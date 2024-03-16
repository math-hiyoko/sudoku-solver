cmake_minimum_required(VERSION 3.28)

# プロジェクト名と対象言語の指定
project(sudoku_solver_backend LANGUAGES CXX)

# CMAKE_BUILD_TYPEの設定を確認
macro(check_cmake_build_type)
  if(CMAKE_BUILD_TYPE)
    message(STATUS "CMAKE_BUILD_TYPE = ${CMAKE_BUILD_TYPE}")
  else()
    message(WARNING "CMAKE_BUILD_TYPE is not set. It is set to Debug.")
    set(CMAKE_BUILD_TYPE Debug CACHE STRING "Choose the type of build." FORCE)
  endif()
endmacro()

# 必要なパッケージを検索して読み込むための関数
macro(find_and_report_packages)
  # dependencies.txtからバージョン情報を1行ずつ読み込む
  file(STRINGS dependencies.txt dependencies)
  # それぞれの依存ライブラリに対してfind_packageを呼び出す
  foreach(dep IN LISTS dependencies)
    # 空白文字でライブラリ名とバージョンに分割
    string(REPLACE " " ";" dep_info ${dep})
    list(GET dep_info 0 lib_name)
    list(GET dep_info 1 lib_version)

    find_package(${lib_name} ${lib_version} REQUIRED COMPONENTS filesystem)

    if(${lib_name}_FOUND)
      message(STATUS "${lib_name} found - version: ${${lib_name}_VERSION}")
    else()
      message(FATAL_ERROR "${lib_name} not found. Please install the library and try again.")
    endif()
  endforeach()
endmacro()

macro(setup_clang_format)
  # clang-formatのパスを探す
  find_program(CLANG_FORMAT_EXE NAMES "clang-format" DOC "Path to clang-format executable")
  # 全てのソースファイルとヘッダーファイルのリストを取得する
  file(GLOB_RECURSE ALL_CXX_SOURCE_FILES ${PROJECT_SOURCE_DIR}/*.[ch]pp ${PROJECT_SOURCE_DIR}/*.[ch])
  # clang-formatによるフォーマットの有効化
  option(FORMAT_ALL_FILES_WITH_CLANG_FORMAT "Format all source and header files with clang-format before each build" ON)

  if (CLANG_FORMAT_EXE AND FORMAT_ALL_FILES_WITH_CLANG_FORMAT)
    # カスタムターゲットを追加してファイルをフォーマットする
    add_custom_target(
      format-all
      COMMAND ${CLANG_FORMAT_EXE} -i -style=file ${ALL_CXX_SOURCE_FILES}
      COMMENT "Running clang-format on all source and header files"
    )
  endif()
endmacro()

# .envファイルを読み込むための関数
macro(load_env_file)
  # .envファイルのパスを取得
  set(env_file_path "${PROJECT_SOURCE_DIR}/.env")
  # .envファイルが存在するか確認
  if(EXISTS ${env_file_path})
    # .envファイルを読み込む
    file(STRINGS ${env_file_path} env_file_content)
    # .envファイルの内容を1行ずつ読み込む
    foreach(env_line IN LISTS env_file_content)
      string(REGEX MATCH "^[^=]+" env_key "${env_line}")
      string(REPLACE "${env_key}=" "" env_val "${env_line}")
      string(STRIP "${env_val}" env_val)
      #エスケープが必要な文字をエスケープします。
      string(REPLACE "\\" "\\\\" env_val "${env_val}")
      string(REPLACE "\"" "\\\"" env_val "${env_val}")
      # ENV_VARS リストにキーバリューペアを追加します。
      list(APPEND ENV_VARS "${env_key}=${env_val}")
      # メッセージとしてキーバリューペアを出力します。
      message(STATUS "Set: ${env_key}=${env_val}")
    endforeach()
  else()
    message(WARNING "No .env file found. Please create a .env file and try again.")
  endif()
endmacro()

# サブディレクトリを追加してプロジェクトを構成
macro(add_and_report_subdirectories)
  # テストを有効化
  enable_testing()
  # 依存先から依存元の順にサブディレクトリを追加
  set(subdirs extern src tests)
  foreach(subdir IN LISTS subdirs)
    message(STATUS "Adding subdirectory: ${subdir}")
    add_subdirectory(${subdir})
  endforeach()
endmacro()

check_cmake_build_type()
find_and_report_packages()
setup_clang_format()
load_env_file()
add_and_report_subdirectories()

unset(CMAKE_BUILD_TYPE CACHE)
