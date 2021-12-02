#!/usr/bin/env bash

#
# This script outputs a git diff of the changes you have committed to
# this repository as part of your submission.
#
# It assumes the changes you want to submit are committed on the
# current git branch.
#
# The changes will be calculated by comparing to the branch
# `empty_slate` which was a copy of this application as you received
# it.
#

set -e

EMPTY_SLATE_BRANCH=empty_slate
TIMESTAMP=`date '+%Y-%m-%d-%H-%M-%S'`
SUBMISSION_BRANCH=_submission-"${TIMESTAMP}"
COMMIT_MESSAGE=submission
PATCH_FILE=0001-"${COMMIT_MESSAGE}.patch"
SUBMISSION_FILE="submission.${TIMESTAMP}.patch"
rm -f "${PATCH_FILE}" "${SUBMISSION_FILE}"

git checkout "${EMPTY_SLATE_BRANCH}"

git checkout -b "${SUBMISSION_BRANCH}"
git merge --squash master
git commit -a -m "${COMMIT_MESSAGE}"

git format-patch "${EMPTY_SLATE_BRANCH}"
git checkout master
git branch -D "${SUBMISSION_BRANCH}"

mv "${PATCH_FILE}" "${SUBMISSION_FILE}"

echo ""
echo "Email ${SUBMISSION_FILE} back to your hiring manager or recruiter.  Thank you for your submission!"
