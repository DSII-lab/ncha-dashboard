## Deployment Instruction

1. Run the python script to convert spss files into csv files, and place them into a data folder.
2. Set up an API_KEY for Open AI
Go to https://platform.openai.com/api-keys, do create a secret key. 
3. Set up a file vector: go to storage, file vectors, create a new file vector.
4. Upload the json file (question list) into the file vector, do attach.
5. Copy the file vector id

So now you have the api key and the id of the file vector.

Next, do 
```
docker build -t ncha-dashboard .
```

For the ncha-dashboard container, do
```
docker run -e OPENAI_API_KEY=$OPENAI_API_KEY -e OPENAI_FILE_VECTOR=$OPENAI_FILE_VECTOR -p 3000:3000 -v /var/app/data:/data ncha-dashboard
```
to run the docker container.

Where the `$OPENAI_API_KEY` should be replaced with an OpenAI's api key, and `$OPENAI_FILE_VECTOR` should be replaced with the file vector id.

## Dashboard

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker
Docker build: docker build -t ncha-dashboard .
Docker run: docker run -e OPENAI_API_KEY=$OPENAI_API_KEY -e OPENAI_FILE_VECTOR=$OPENAI_FILE_VECTOR -p 3000:3000 ncha-dashboard

Docker run: docker run -e OPENAI_API_KEY=$OPENAI_API_KEY -e OPENAI_FILE_VECTOR=$OPENAI_FILE_VECTOR -p 3000:3000 -v /var/app/data:/data ncha-dashboard

Where the $OPENAI_API_KEY should be replaced with an OpenAI's api key, and $OPENAI_FILE_VECTOR should be replaced with the file vector id.