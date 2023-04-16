# Dev Blog Project

![devdomain](https://user-images.githubusercontent.com/105998439/229639379-f34731cc-96b8-4f4c-a926-2b0fd5588887.jpg)



Personal Live Link Live:
https://development-blog-production.up.railway.app/

Live Link for demoing features:
https://developer-blog-njn5.onrender.com


## Summary

This project tested my problem-solving skills as I built a dev blog with four CRUD features that 
I completed in just two weeks. The blog has an admin sign-in, creation, deletion, editing, and viewing of posts 
and drafts, as well as a search functionality with search history creation and viewing. 
Plus, it has an AI feature that allows users to ask questions about the articles and get specific answers back. 
To handle the heavy lifting of this functionality, I built a micro service that hooks into OpenAI's API 
to answer the questions and uses the article data to train the AI's responses.

## Features

- Admin sign-in
- Creation, deletion, editing, and viewing of posts and drafts
- Search functionality with search history creation and viewing
- AI feature that allows users to ask questions about the articles and get specific answers back
- The abilty to tag and un-tag articles

## Technologies Used

- HTML/CSS
- JavaScript
- Node.js
- Express.js
- Reactjs
- Custom API into my own micro service

## Getting Started

```
PORT=8000
JWT_SECRET=4zDQXwUMtkLKlA==
JWT_EXPIRES_IN=604800
SCHEMA=my_schema
DIGITAL_BRAIN_API_KEY="your_API_key_from_openAI"
```

1. Clone the repository
2. Install dependencies using `npm install` in both frontend and backend directories
3. Navigate into the backend and run `npm start`
4. Navigate into the frontend and run `npm start`

This project assumes you have PostgreSQL setup and running on your machine. If you do not this project will fail to launch the backend. I will not walk through setting up a db.

## Note

Branches are different. If you want to play around with the live tech demo then install main branch. If you want to work play around with what I am working off of in the live verstion then clone the railway-main. 


## Warning

Currently the micro service api is not public and will not work on your local machine. Meaning the ai search functionality will not work. API access is in the works and coming soon.
