#!/bin/bash
# 1. Setup .gitignore (Kecualikan file sampah)
cat << 'GEOF' > .gitignore
node_modules/
sessions/
.git/
package-lock.json
.upm/
attached_assets/
