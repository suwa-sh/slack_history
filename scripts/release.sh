#!/bin/bash
readonly dir_exec="$(pwd)"
readonly dir_script="$(dirname $0)"
readonly dir_root="$(cd ${dir_script}/..; pwd)"
cd "$(cd ${dir_root}; pwd)"


# dep
echo "dep" >&2
function is_installed() {
  local _cmd=${1:?}
  if [[ "$(which ${_cmd})x" == "x" ]]; then
    echo "${_cmd} is not installed." >&2
    exit 1
  fi
}
is_installed "conventional-changelog"
is_installed "jq"


# changelog
echo "changelog" >&2
conventional-changelog -p angular  -r 1 -s -i CHANGELOG.md
retcode=$?
if [[ ${retcode} -ne 0 ]]; then exit ${retcode}; fi


# tag
echo "tag" >&2
version="v$(jq .version <package.json | sed -e 's|"||g')"

git add .
retcode=$?
if [[ ${retcode} -ne 0 ]]; then exit ${retcode}; fi

git commit -m "chore: release ${version}"
retcode=$?
if [[ ${retcode} -ne 0 ]]; then exit ${retcode}; fi

git tag -a "${version}" -m ""
retcode=$?
if [[ ${retcode} -ne 0 ]]; then exit ${retcode}; fi

git push origin --tags
retcode=$?
if [[ ${retcode} -ne 0 ]]; then exit ${retcode}; fi

echo "finished" >&2
exit 0
