#!/bin/bash

cd ocr
python3 ocr.py --receipt_name=$1
cd ..