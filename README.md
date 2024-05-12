# Mini-twitter Clone

This Mini-Twitter Clone project is a social media application that allows users to create accounts, post tweets with images or videos, follow other users, like tweets, and explore posts from different users. It is built using the MERN (MongoDB, Express, React, Node.js) stack and utilizes JWT (JSON Web Tokens) for user authentication. Additionally, it employs Multer to store user profile images in MongoDB and Firebase Cloud Storage to store uploaded images and video files.

## Features

- **User Authentication:** Users can sign up and log in to the application securely using JWT authentication.

- **Post Tweets:** Users can create, post, edit and delete their tweets, which can include either images or videos, along with text messages.

- **Profile Management:** Users can view and edit their profile information, including their profile picture.

- **Follow Other Users:** Users can follow and unfollow other users to see their tweets in their timeline.

- **Like Tweets:** Users can like and unlike tweets posted by others.

- **Explore Posts:** Users can explore and view tweets from other users to discover new content.
## Tech Stack

- **MongoDB:** The application uses MongoDB to store user data, tweets, and profile images.

- **Express.js:** Express.js is used as the backend server framework to handle API requests and routing.

- **React:** The frontend is built using React for a dynamic and interactive user interface.

- **Node.js:** Node.js is used as the runtime environment for the server.

- **JWT Authentication:** JSON Web Tokens are employed for user authentication.

- **Multer:** Multer is used to handle file uploads, allowing users to set profile pictures.

- **Firebase Cloud Storage:** Firebase Cloud Storage is used to store uploaded images and video files.
## Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/adityaS-99/mini_twitter.git
   ```

2. Install dependencies:

    ```bash
    cd mini-twitter
    cd server
    npm install
    cd ../client
    npm install
    ```
3. Set up environment variables:

Create a .env file in the server root directory and add the following variables:
   ```bash
   MONGO=<your-mongodb-connection-url>
   JWT=<your-secret-key>
   ```
- JWT can be any 32 character long text

4. Set up your MongoDB database and Firebase project. Update the configuration files (client/src/firebase.js) with your credentials.

5. Run the development server:
```bash
npm start
```
6. Change REST api call URLs accordingly


## Usage

- Sign up for an account or log in if you already have one.
- Create tweets with text messages and either images or videos.
- Explore posts from other users to discover new content.
- Follow and unfollow other users to customize your timeline.
- Like and unlike tweets that you find interesting.
- Edit your profile information and set a profile picture.
## Demo Link

https://twitter-clone-1135.netlify.app


## Contributing

Contributions are welcome! 

Feel free to submit pull requests or open issues if you encounter any problems or have suggestions for improvements.