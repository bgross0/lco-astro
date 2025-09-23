#!/bin/bash

# Download and compile libheif with heif-convert tool

cd /tmp

# Download libheif source
echo "Downloading libheif source..."
wget -q https://github.com/strukturag/libheif/releases/download/v1.17.6/libheif-1.17.6.tar.gz
tar -xzf libheif-1.17.6.tar.gz
cd libheif-1.17.6

# Configure and compile
echo "Configuring..."
mkdir build
cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/home/ben/.local
make -j4
make install

echo "heif-convert installed to /home/ben/.local/bin/heif-convert"
/home/ben/.local/bin/heif-convert --version