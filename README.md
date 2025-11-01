# green

Groceries for housemates made simple.
Maintain a grocery list, track items bought,
and the split the bill automatically by scanning receipts.

## Project Structure

Green uses React Native/Expo for frontend, Firebase for storage,
and a Python FastAPI server for running OCR on receipts.

Pages are in `app`. Adding a new file there will automatically create a new route.

Python OCR server code is in `ocr/`. `test/` contains some sample images and debug OCR output.
`imgs/` stores the files sent to the OCR server.
`app.py` is the FastAPI server code, and `ocr.py` is the code to process a given image.

## Getting Started

### Expo and Node (Frontend)

Download the "Expo Go" app on your phone.

Install dependencies: `npm install`

Start Expo App: `npx expo start --tunnel`

### Firebase Functions (Backend)

Install dependencies: `cd backend/functions; npm install -g firebase-tools; firebase login; npm install firebase-admin`

Build and start emulator: `npm run serve` or `firebase emulators:start`


### Python OCR Server (Backend)

Create virtual environment in the `ocr` folder: `cd ocr; virtualenv venv; source venv/bin/activate`

Install dependencies: `python3 -m pip install -r requirements.txt`

Start server: `python3 -m uvicorn app:app --reload`

## Testing & Scripts

You can test the OCR output by:

- Add a new receipt image into `ocr/test`
- Run `scripts/test_receipt.sh --receipt_name=<your receipt image name>`

You can clear the OCR images and debug output with `./scripts/clear_images.sh`

## Important Links

[Expo Docs](https://docs.expo.dev/tutorial/create-your-first-app/)
[NativeWind/Tailwind with Expo](https://www.nativewind.dev/quick-starts/expo)
[Cloud Functions for Firebase](https://firebase.google.com/docs/functions)
