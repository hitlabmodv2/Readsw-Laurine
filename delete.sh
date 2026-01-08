#!/bin/bash
if [ -z "$1" ]; then
  echo "Gunakan: ./delete.sh path/ke/file_atau_folder"
  exit 1
fi

TARGET=$1

# 1. Hapus secara lokal (file atau folder)
if [ -e "$TARGET" ]; then
  rm -rf "$TARGET"
  echo "Berhasil menghapus $TARGET di Replit."
else
  echo "Peringatan: $TARGET tidak ditemukan secara lokal."
fi

# 2. Hapus di Git/GitHub
# -rf memastikan folder beserta isinya ikut terhapus di Git
git rm -rf --cached "$TARGET" 2>/dev/null
git add .
git commit -m "Delete: $TARGET"
git push origin main

echo "----------------------------------------------------"
echo "BERHASIL DIHAPUS DARI REPLIT & GITHUB!"
echo "----------------------------------------------------"
