#! /bin/sh

set -eu

echo "Regenerating documentation."

rm -rf docs
npm run docs

echo "Copying/moving files in working dir."

rm -rf __temp_examples __temp_docs __temp_p5.play.js
cp -r examples/ __temp_examples/
mv docs __temp_docs
cp lib/p5.play.js __temp_p5.play.js

echo "Switching to gh-pages branch."

git checkout gh-pages

rm -rf examples docs lib/p5.play.js
mv __temp_examples examples
mv __temp_docs docs
mv __temp_p5.play.js lib/p5.play.js

echo "Staging new/changed files."

git add examples/ docs/ lib/p5.play.js

echo "Done. Run 'git diff --staged' to review changes."
echo "If satisfied, run 'git commit' to commit changes."
