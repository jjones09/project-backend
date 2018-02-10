#!/bin/bash

set -eu

git remote add heroku https://git.heroku.com/$HEROKU_APP_NAME.git
wget https://cli-assets.heroku.com/branches/stable/heroku-linux-amd64.tar.gz
tar -xvsf heroku-linux-amd64.tar.gz -C /usr/local/lib
ln -s /usr/local/lib/heroku/bin/heroku /usr/local/bin/heroku

cat > ~/.netrc << EOF
machine api.heroku.com
        login $HEROKU_LOGIN
        password $HEROKU_API_KEY
machine git.heroku.com
        login $HEROKU_LOGIN
        password $HEROKU_API_KEY
EOF

chmod 600 ~/.netrc
ssh-keyscan -H heroku.com >> ~/.ssh/known_hosts