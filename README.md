## Deployment Instruction

1. Set up an API_KEY for Open AI
Go to https://platform.openai.com/api-keys, do create a secret key. 
2. Set up a file vector: go to storage, file vectors, create a new file vector.
3. Upload the json file (question list) into the file vector, do attach.
4. Copy the file vector id

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
