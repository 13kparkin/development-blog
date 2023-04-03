# Dev Blog Project

![devdomain](https://user-images.githubusercontent.com/105998439/229639379-f34731cc-96b8-4f4c-a926-2b0fd5588887.jpg)



Personal Live Link:
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

1. Clone the repository
2. Install dependencies using `npm install` in both frontend and backend directories
3. Navigate into the backend and run `npm start`
4. Navigate into the frontend and run `npm start`


## Warning

Currently the micro service api is not public and will not work on your local machine. Meaning the ai search functionality will not work. API access is in the works and coming soon.
