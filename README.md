<h3>Deploy a Next.js SSR app to Firebase hosting using Cloud Functions </h3>


<h5> Step 1 - Firebase init </h5>

The easiest way of doing this setup without having to hack around is to initialize a new project with <strong> firebase init </strong> 

For this demonstration to work, you'll need to use <strong> Firebase hosting </strong> and <strong> Cloud Functions </strong> but you can also select whatever you plan to use on your project. 

Select an existing project or create one.

Install dependencies when asked to and select <strong> N </strong> when asked about redirecting every request to index.html, this is only neeeded for a single page application.


Go through the whole process, it will ask you settings and configurations preferences related questions, just choose whatever you prefer to finish this step.

<h5> Step 2 - Folder structure (optional) </h5>

This step is optional, but since you'll be rendering everything from inside a Cloud Function, the application entrance point on your functions level, at the time of writing (November 24th, 2020) when initializing a project with <b> firebase init </b> it will automatically create and place all of your functions inside a <b> functions folder </b> along with all of it's NPM packages and such. If you choose to create your NextJS app outside of the functions levels, you'll have to download every NPM package that you use to develop your NextJS app in both your NextJS root folder and your functions root folder, since this can become quite cumbersome and error prone, I think the better approach is to move everything that is inside the functions folder to the root level of your application, where your <b> firebase.json </b> file and such is located.

When you're done doing so, your folder structure should look like the following:

<p align="center">
  <img width="200" height="250" src="https://i.imgur.com/5vLr077.png">
</p>

<h5> Step 3 - Setting up NextJS and other packages </h5>

Since now everything is at the same folder level, we can simply download all NPM packages that we'll need to use to make the application work. Run the following command on your terminal (make sure you're at your project folder before doing so):

<b> npm i next react react-dom </b>

Create a <b> next.config.js </b> file and populate it with the following: 

<pre> module.exports = {
  distDir: "build",
};
</pre>

This is used to set next build path and it will also be used when setting up our custom server that will need to know where our build is located for it to be served on request.

NextJS requires a <b> pages folder </b> for the build process to succeed, go ahead and create it a your root level. Inside it, create an <b> index.js </b> file and populated with the following code:

<pre>
import React from "react";

function Home() {
  return (
    <div>
      NextJS app being served with Firebase hosting and a Cloud Function
    </div>
  );
}

export default Home;

</pre>

A few more steps and this message between those divs tags should appear on our screen if everything is set up properly.



<h5> Step 4 - NextJS custom server </h5>

Place the following code inside your Cloud Functions file, at this point, this should still be named <b> index.js </b> if you didn't change it. 

<pre>

// Requires needed for setting up the application

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const next = require("next");
const config = require("./next.config");

admin.initializeApp();

// Checks if you're in production mode

const dev = process.env.NODE_ENV !== "production";

// Initializes next app with the build path we specificed in our next.config.js file and pulled through our config require statement.

const app = next({
  dev: dev,
  conf: config,
});

// Initializes next request handler

const handle = app.getRequestHandler();

// Cloud function export with NextJS app

exports.nextjs = functions.https.onRequest((request, response) => {
  console.log("Current page:" + request.originalUrl);

  return app.prepare().then(() => handle(request, response));
});


</pre>

This sets up the NextJS app to be served by the Cloud Function.


<h5> Step 5 - Firebase.json </h5>

This step is crucial for it all to work smoothly. First thing it to change our function source and add other our folders to the ignore array inside our functions object, as per default behavior, if this array is omitted, it will ignore node_modules by default, but since we also want to ignore other folders we included in our project, such as pages and etc, we'll have to explicitly ignore the node_modules folder.

Your functions object inside your firebase.json should look something like this:

<pre>

  "functions": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "firbease-debug.log",
      "**/.*",
      "**/node_modules/**",
      "components/**",
      "pages/**",
      "public/**",
      "firestore.rules",
      "readme.md"
    ]
  },

</pre>

Pretty much every file and folder inside our root, beats having to install  npm packages in two separates location everything if you ask me.

Notice that we're also setting our function main file source location to be firebase.json's root directory.

Now, if you were to build your next application and deploy it, it would actually work, but you would have to serve it from your function domain and that's not what we're trying to do, we're trying to also benefit from our Firebase hosting, to do so, change your firebase.json hosting object to the following:

<pre>

  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "rewrites": [
      {
        "source": "**",
        "function": "nextjs"
      }
    ]
  },

</pre>

We're setting our public path to our public folder situated at our application root level, we are also ignoring node_modules and unnecessary files/folder and most importantly we're setting our rewrites so that when users hit our hosting domain they're actually redirect to our cloud function that we named <b> nextjs </b> on our export.



<h5> Step 5 - Final touches  </h5>


Now we just have to build our NextJS app and deploy it Firebase, let's tweak our package.json file to set up some scripts that will help us out.


At this point, I would also create a components folder at our root level for proper separation of our NextJS's components.

Change your package.json so that it looks like the following:

<pre>

  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "deploy": "next build && firebase deploy",
    "logs": "firebase functions:log",
    "dev": "next dev",
    "start": "next start",
    "build": "next build"
  },
  "engines": {
    "node": "12"
  },
  "main": "server.js",

</pre>

Notice that I also changed my main file name to <b> server.js </b> this is optional, but I like to do it because I think it gives it a more declaritive nature of the script's purpose, if you choose to also do so, don't forget to change our <b> index.js </b> name as well.


Now if you followed along and replicated all of our steps, including creating a components folder, changing your main function file name to server.js and builded your NextJS app, you should have the following folder structure:




<p align="center">
  <img width="200" height="250" src="https://i.imgur.com/cMXggpI.png">
</p>


If you also edited your package.json file, you should be able to run the following command on your terminal to build and deploy your NextJS app hosted on a Cloud Function:


<b> npm run deploy </b>


Congratulations, you're running your SSR NextJS app on Firebase hosting and Cloud Functions.





