cmake_minimum_required(VERSION 3.21)

# プロジェクト名と対象言語の指定
project(sudoku_solver_backend LANGUAGES CXX)

# 変数の設定を確認
macro(check_cmake_build_type)
  if(CMAKE_BUILD_TYPE)
    message(STATUS "CMAKE_BUILD_TYPE = ${CMAKE_BUILD_TYPE}")
  else()
    message(WARNING "CMAKE_BUILD_TYPE is not set. It is set to Debug.")
    set(CMAKE_BUILD_TYPE
        Debug
        CACHE STRING "Choose the type of build." FORCE)
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

    # コンポーネントが指定されているかチェック
    list(LENGTH dep_info dep_info_length)
    if(dep_info_length GREATER 2)
      list(GET dep_info 2 components_list)
      # コンポーネントをリストに変換
      string(REPLACE "," ";" components ${components_list})
      find_package(${lib_name} ${lib_version} REQUIRED COMPONENTS ${components})
    else()
      find_package(${lib_name} ${lib_version} REQUIRED)
    endif()

    if(${lib_name}_FOUND)
      message(STATUS "${lib_name} found - version: ${${lib_name}_VERSION}")
    else()
      message(
        FATAL_ERROR
          "${lib_name} not found. Please install the library and try again.")
    endif()
  endforeach()
endmacro()

macro(setup_format)
  set(exclude_dirs "extern" "build" "include/aws")

  # clang-formatのパスを探す
  find_program(
    clang_format_exe
    NAMES "clang-format"
    DOC "Path to clang-format executable")
  if(clang_format_exe)
    message(STATUS "clang-format found: ${clang_format_exe}")
    # 全てのソースファイルとヘッダーファイルのリストを取得する
    file(GLOB_RECURSE all_cxx_source_files ${PROJECT_SOURCE_DIR}/*.[ch]pp
         ${PROJECT_SOURCE_DIR}/*.[ch])
    # 除外ディレクトリを除外する
    foreach(exclude_dir IN LISTS exclude_dirs)
      list(FILTER all_cxx_source_files EXCLUDE REGEX
           "${PROJECT_SOURCE_DIR}/${exclude_dir}/*")
    endforeach()
    add_custom_target(
      clang-format
      COMMAND ${clang_format_exe} -i -style=file ${all_cxx_source_files}
      COMMENT "Running clang-format on source files"
      VERBATIM)
  else()
    message(
      WARNING "clang-format not found. make clang-format is not available.")
  endif()

  # cmake-formatのパスを探す
  find_program(
    cmake_format_exe
    NAMES "cmake-format"
    DOC "Path to cmake-format executable")
  if(cmake_format_exe)
    message(STATUS "cmake-format found: ${cmake_format_exe}")
    # 全てのCMakeLists.txtのリストを取得する
    file(GLOB_RECURSE all_cmake_files ${PROJECT_SOURCE_DIR}/CMakeLists.txt)
    # 除外ディレクトリを除外する
    foreach(exclude_dir IN LISTS exclude_dirs)
      list(FILTER all_cmake_files EXCLUDE REGEX
           "${PROJECT_SOURCE_DIR}/${exclude_dir}/*")
    endforeach()
    add_custom_target(
      cmake-format
      COMMAND ${cmake_format_exe} -i ${all_cmake_files}
      COMMENT "Running cmake-format on CMake files"
      VERBATIM)
  else()
    message(
      WARNING "cmake-format not found. make cmake-format is not available.")
  endif()

  # 両方のフォーマットを実行するターゲットを追加
  add_custom_target(
    format-all
    DEPENDS clang-format cmake-format
    COMMENT "Running both clang-format and cmake-format")
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
      # エスケープが必要な文字をエスケープする
      string(REPLACE "\\" "\\\\" env_val "${env_val}")
      string(REPLACE "\"" "\\\"" env_val "${env_val}")
      # env_vars リストにキーバリューペアを追加
      list(APPEND env_vars "${env_key}=${env_val}")
      # メッセージとしてキーバリューペアを出力
      message(STATUS "Set: ${env_key}=${env_val}")
    endforeach()
  else()
    message(
      WARNING "No .env file found. Please create a .env file and try again.")
  endif()
endmacro()

# サブディレクトリを追加してプロジェクトを構成
macro(add_and_report_subdirectories)
  # テストを有効化
  enable_testing()
  # 依存先から依存元の順にサブディレクトリを追加
  set(CMAKE_OPTIMIZE_DEPENDENCIES ON)
  set(subdirs extern src sample tests)
  foreach(subdir IN LISTS subdirs)
    message(STATUS "Adding subdirectory: ${subdir}")
    add_subdirectory(${subdir})
  endforeach()
endmacro()

check_cmake_build_type()
find_and_report_packages()
setup_format()
load_env_file()
add_and_report_subdirectories()

unset(CMAKE_BUILD_TYPE CACHE)
