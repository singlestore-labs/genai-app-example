# GenAI App Example

**Attention**: The code in this repository is intended for experimental use only and is not fully tested, documented, or supported by SingleStore. Visit the [SingleStore Forums](https://www.singlestore.com/forum/) to ask questions about this repository.

## Getting started

1. Create a database
2. Create a `.env.local` file based on the `.env.local.example` file
3. Install dependencies by running: `npm i`
4. Insert data into the database by running: `npx dotenv -e .env.local -- npx tsx setup-db.ts`
5. Build the app by running: `npm run build`

## Run the dev environment

1. Run `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)

## Build and run the prod environment

1. Run `npm run build`
2. Run `npm run start`
3. Open [http://localhost:3000](http://localhost:3000)
