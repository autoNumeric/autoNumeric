#!/bin/sh

# This script generate the AUTHORS file
# In case of duplicates, update the `.mailmap` file

echo "The AutoNumeric authors are:\n" > ./AUTHORS
echo "Commit  Authors" >> ./AUTHORS
echo "------  ------------------------------------------------------" >> ./AUTHORS
git shortlog -sne >> ./AUTHORS
echo "\nThis list is ordered by contributions and has been generated on "`date +%Y-%m-%d`" by \`tools/authors.sh\`." >> ./AUTHORS
echo "A more detailed list can be found on [Github](https://github.com/autoNumeric/autoNumeric/graphs/contributors)." >> ./AUTHORS
echo "\nSpecial thanks to Sokolov 'funny-falcon' Yura for his contributions before autoNumeric moved to Github." >> ./AUTHORS
