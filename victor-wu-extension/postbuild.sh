#!/bin/bash

# move popup.html from dist/src to dist/
mv dist/src/popup.html dist/popup.html

# remove leftover /src folder
rm -r dist/src

# build contentScript
tsc src/contentScript.ts --outDir dist