
**

## Readme Contents

**

1. About the Project
2. Features and Functionality
   2.1 Data Storage and Retrieval
   2.2 API
   2.3 Admin Functionality
   2.4 Images
   2.5 Categories
   2.6 Test Suite

3. Deployment / Installation
   3.1 Glitch
   3.2 Heroku
4. Reference List
5. Image & Sample Content Credits



**1.	About the project**

This project implements a node.js/hapi web application with API (openAPI 2.0 compliant) that allows users of the system to record and share information about unusual places of interest.
It includes full user account functionality including create, read, update and delete functionality. It also implements an admin level of user account management permitting admin users to provide other users with admin permissions and to view statistics on data stored on the platform.
Admin users also have permission to add, update and delete categories which end users can tag their places of interest with.
The project also showcases a façade design pattern to allow interoperability between four different types of data storage: non-persistent memory (‘mem’), lowdb (‘json’), mongoDB (‘mongo’ and firebase cloud firestore (‘fire’).

The application is built on version 14.16.0 of Node.js and the hapi Framework version 20.2.1 with a supporting stack of compatible plug-ins that enable cookie based user authentication (@hapi/Cookie), the adoption of a model-view-controller design pattern with the assistance of @hapi/Vision plugin, and the implementation of a documented OpenAPI 2.0 compliant API with JWT authentication (hapi-swagger and hapi-auth-jwt2).

The API and data models are accompanied by extensive test suites using mocha.js testing framework and the chai assertion library.
The initial project commit was based on the following archive:

- https://wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-05-models/unit-2/book-playtime-0-5-0/archives/playtime-0.5.0.zip

The final project has the following structure:

    ├── api
    │    ├── category-api.js
    │    ├── jwt-utils.js
    │    ├── logger.js
    │    ├── place-api.js
    │    └── user-api.js
    │ 
    ├── package.json
    │
    ├── public
    │    ├── compass.jpg
    │    ├── header.png
    │    ├── header2.png
    │    ├── hero2.png
    │    ├── logo.png
    │    ├── style.css
    │    └── temp.img
    │
    ├── src
    │    ├── controllers
    │    │   ├── about-controller.js
    │    │   ├── accounts-controller.js
    │    │   ├── dashboard-controller.js
    │    │   └── placemark-controller.js
    │    │
    │    ├── models
    │    │   ├── firebase
    │    │   │   ├── category-fire-store.js
    │    │   │   ├── firebase-utils.js
    │    │   │   ├── firebaseConfig.js
    │    │   │   ├── place-fire-store.js
    │    │   │   └── user-fire-store.js
    │    │   │
    │    │   ├── json
    │    │   │   ├── categories.json
    │    │   │   ├── category-json-store.js
    │    │   │   ├── place-json-store.js
    │    │   │   ├── places.json
    │    │   │   ├── user-json-store.js
    │    │   │   └── users.json
    │    │   │
    │    │   ├── mem
    │    │   │   ├── category-mem-store.js
    │    │   │   ├── place-mem-store.js
    │    │   │   └── user-mem-store.js
    │    │   │
    │    │   ├── mongo
    │    │   │   ├── category-mongo-store.js
    │    │   │   ├── category.js
    │    │   │   ├── connect.js
    │    │   │   ├── place-mongo-store.js
    │    │   │   ├── place.js
    │    │   │   ├── user-mongo-store.js
    │    │   │   └── user.js
    │    │   │
    │    │   ├── db.js
    │    │   ├── image-store.js
    │    │   ├── joi-schemas.js
    │    │   └── temp.img
    │    │
    │    ├── views
    │    │   ├── layouts
    │    │   │   └── layout.hbs
    │    │   │
    │    │   ├── partials
    │    │   │   ├── analytics.hbs
    │    │   │   ├── brand.hbs
    │    │   │   ├── category-buttons.hbs
    │    │   │   ├── category-list.hbs
    │    │   │   ├── create-category.hbs
    │    │   │   ├── error.hbs
    │    │   │   ├── menu.hbs
    │    │   │   ├── placemark-imagejs.hbs
    │    │   │   ├── placemark-images.hbs
    │    │   │   ├── user-list.hbs
    │    │   │   └── welcome-menu.hbs
    │    │   │
    │    │   ├── about-view.hbs
    │    │   ├── admin-view.hbs
    │    │   ├── category-view.hbs
    │    │   ├── create-place-view.hbs
    │    │   ├── dashboard-view.hbs
    │    │   ├── edit-place-view.hbs
    │    │   ├── edit-user-view.hbs
    │    │   ├── login-view.hbs
    │    │   ├── main.hbs
    │    │   └── signup-view.hbs
    │    │
    │    ├── .env
    │    ├── api-routes.js
    │    ├── server.js
    │    └── web-routes.js
    │
    └─ test
         ├── api
         │   ├── auth-api-test.js
         │   ├── category-api-test.js
         │   ├── place-api-test.js
         │   ├── placemark-service.js
         │   └── user-api-test.js
         │
         ├── model
         │   ├── category-model-test.js
         │   ├── places-model-test.js
         │   └── users-model-test.js
         │
         ├── fixtures.js
         └── test-utils.js

**2. Functionality & Features**

***2.1.	Data Storage and Retrieval – Façade pattern***
Three types of data object are stored in the system: users, places, and categories. A façade file (./src/model/db.js) is used to identify which data storage technology to use on loading the server.
For the purposes of the project the naming convention of <Model> suffixed by <StorageType>Store was adopted with mem, json, mongo and fire as the storage types so an example store export object is categoryFireStore.
For interoperability the methods associated with each of the database type objects return identical data and have identical method signatures for the data object in question.
These models are detailed further below should other data storage technologies wish to be implemented e.g. PostGreSQL.
***User Model***

- getAllUsers() – returns array of user object
- getUserById(id) – takes in id string (or mongo ObjectId object) returns user object or null
- addUser(user) – takes in user object returns user object or error if fails
- getUserByEmail(email) – takes in email string returns user object or null
- deleteUserById(id)  - takes in id string (or mongo ObjectId object) and void
- deleteAll() – void
- updateUser(userId, updatedUser) – takes in userId string (or mongo ObjectId object) and updatedUserObject and returns  the updated User object. If fails promise rejects with an error
- checkAdmin(id) – takes in an id string (or mongo ObjectId object) and returns Boolean or null if not found.
- makeAdmin(id) – takes in an id string (or mongo ObjectId object) and returns Boolean or promise rejects with error if user not found.
- revokeAdmin(id) – takes in id string (or mongo ObjectId object)




***Places Model***


- *getAllPlaces()* – returns array of place objects
- *getPlaceById(id)* – takes in id string (or mongo ObjectId object) returns place object if found otherwise returns null
- *addPlace(place)* – takes in place object returns place object
- *updatePlace(id, updatedPlace)* – takes in id string (or mongo ObjectId object) and updatedPlace object and returns a place object or null if fails.
- *getUserPlaces(id)* – takes in id string (or mongo ObjectId object) belonging to user, returns array of place objects.
- *getOtherUserPlaces(id)* - takes in id string (or mongo ObjectId object) belonging to user, returns array of place objects.
- *deletePlaceById(id, createdBy)* – takes in id string (or mongo ObjectId object) and createdBy string representing a user’s id returns a resolved promise if successful or an error if unsuccessful.
- *deleteAll()* – void

***Categories Model***

- *getAllCategories()* – returns an array of category objects
- *getCategoryById(id)* – takes in an id string (or mongo ObjectId object) and returns a category object
- *addCategory(category)* – takes in a partial category object and returns a category object
- *addPlace(id, categoryId)* – takes in an id string (or mongo ObjectId object) and categoryId string (or mongo ObjectId object), and returns
  a category object or if fails an error.
- *updateCategory(id, updatedCategory)* – takes in an id string (or mongo ObjectId object) and updatedCategory object and returns a
  category object or null
- *getPlaces(id)* – takes in an id string (or mongo ObjectId object) and returns an array of place objects or an empty array.
- *getCategoryByName(name)* – takes in a name string and returns a category object
- *getCategoriesByPlace(placeId)* – takes in a placeId string (or mongo ObjectId object) and returns and array of category objects or an
  empty array.
- *deletePlace(placeId, categoryId)* – takes in a placeId string (or mongo ObjectId object) and a categoryId string (or mongo ObjectId
  object) and returns a category object or if fails an error.
- *deleteCategoryById(id, isAdmin)* – takes in an id string (or mongo ObjectId object) and isAdmin Boolean and returns a resolved promise
  or an error.
- *deleteAll()* – void

**Data Relationships**
As the relationship between categories and places is a many to many relation categories was implemented in an independent collection.

**Data Storage Types**

***memStore*** – The memStore storage option stores in RAM as an object in an array. All data stored in this Store type is lost on system restart.

***JsonStore*** - The lowdb library (https://github.com/typicode/lowdb) enables the creation of flat file JSON databases. For this data storage type each model requires two files. A JSON file which is used to store the data related to that model and a separate file containing  the lowdb boilerplate and store object methods. As this a flat file system it is only suitable for use with numbers of records and will not scale effectively.

***mongoStore*** – This store implements a MongoDB based version of the Store object. The Mongoose library is used to interface between a mongo server (credentials defined as an environment variable). This interface relies on the definition of a Data Schema and model for the Collection which is declared in a js file that accompanies the export file for the store Object. The mongo storage type is unique among the four database types implemented in that a native mongo Object objectId() is used as a unique identifier and not a String. It also returns a versioning property that is relied on by mongo servers to resolve potential issues where clusters/shards are in use. This presented challenges for the current project in terms of maintaining the interoperability between data storage types and this was resolved by updating the Validation framework (joi-schemas.js) to accept this new ObjectId data type in addition to the string ids used in the other systems and also by permitting the version control property v as an optional value.

***fireStore*** – This store implements a Google Firebase FireStore Cloud version of the Store object. The Firestore platform stores document ids separate to the Document Reference for that document, as a result additional helper functions were created (firebase-utils.js) to assist in restructuring the data available from the FireStore Cloud API into object ids that would be compatible with the data model in the current project. In particular a method to convert a query result into an array of objects, and a method to include document ids in the returned objects.

Adding alternative Storage Types / database technologies:
1.	Create Store objects for each of the three data objects:  user, place, category.
2.	Populate these with methods meeting the method signature and return objects specifications outlined above.
3.	Modify db.js to import your new store objects and add a new case to represent the new data storage type.
4.	Modify server.js on ln 92 to swap in the case of your new data type.

The Test suites will assist in identifying additional modifications needed to successfully integrate new database technologies with the project.

**2.2 API**
In parallel with the browser accessible version of PlaceMark there is a set of API endpoints which mirror the operations possible via the browser version of the app.
These are as follows:
Place Endpoints
-	GET - /api/placemark - Get all Places
-	POST - /api/placemark - Creates a new Place
-	DELETE - /api/placemark - Deletes all places.
-	GET - /api/placemark/{id} - Gets details related to a Place
-	DELETE - /api/placemark/{id} - Deletes a place.

Category Endpoints
-	GET - /api/placemark/category - Get all Categories
-	POST - /api/placemark/category - Creates a new Category
-	DELETE - /api/placemark/category - Deletes all categories.
-	POST - /api/placemark/category/{categoryId}/places - Adds a place to a category
-	DELETE - /api/placemark/category/{categoryId}/places/{placeId} - Deletes a place from a category.
-	GET - /api/placemark/category/{id} - Gets details related to a Category
-	DELETE - /api/placemark/category/{id} - Deletes a category.
-	GET - /api/placemark/category/{id}/places - Get Places tagged with Category

User Endpoints
-	GET - /api/users - Get all userApi
-	POST - /api/users - Create a new User
-	DELETE - /api/users - Deletes all users
-	GET - /api/users/{id} - Get a User by ID
-	POST - /api/users/authenticate

The Hapi-swagger library is used to provide user documentation of the requests formats expected and response payloads which will be returned. This is available at /documentation once the project is running. The Hapi-swagger generated documentation also provides a tool for exploring the API functionality. To avail of this in a live environment you must first obtain a JSON Web token (JWT) by supplying a valid set of user credentials via the POST /api/users/authenticate endpoint.

    {
      "email": "string",
      "password": "string"
    }

A demo live environment is available at: https://lit-plains-40353.herokuapp.com/documentation

To create an account use the following endpoint https://lit-plains-40353.herokuapp.com/documentation#/api/postApiUsers

**API Authentication**

With the exception of the `POST /api/users/authenticate` and the `POST /api/users`, routes are secured and require a valid JWT to obtain a successful response.

Implementing this functionality in the project relies on two packages:
-	https://github.com/dwyl/hapi-auth-jwt2
-	https://github.com/auth0/node-jsonwebtoken

The content of the JWT used mirrors the content available in the front-end cookie, storing the users email and their user id. Additional parameters can be added to the JWT by editing the /api/jwt-utils.js file to include them in the createToken() and decodeToken() methods.

To secure a route to require JWT authentication the JWT auth strategy must be included for the controller method associated with the route. This is accomplished by adding a new auth property to the controller method with a value of the following:

    auth: {
      strategy: "jwt",
    },


**2.3 Admin Functionality**
An admin role was introduced by adding an `isAdmin` Boolean property to the user model. If true the user gains access to admin functionality. This is handled via a simple if statement in the controller. More extensive modes of admin authentication using the hapi ‘scope’ property are desirable if further admin only pages are to be added in future. However the if approach provided a minimum viable product in this circumstance.
When a user arrives at an administrator route the `isAdmin` property is checked for the signed in user using the `userStore.checkAdmin(id)` function and if true the page proceeds to render.
Users with the admin role have the capability to make an admin, revoke admins as the value of `isAdmin` is passed to the `makeAdmin(), revokeAdmin()` methods respectively and required to be true to make changes to the selected users admin property.
Admins can also delete users via the dashboard.
A design decision was taken to restrict category creation, updating and deletion to admin users  This is to prevent standard users creating unnecessary categories within the system.

Admins can also rename categories directly on their dashboard via front end functions which convert the name to an editable text input which is then submittable to the back end using the fetch API.
The final set of functionality available to Admins in the system is a summary of key statistics relevant to the site. The analytics provided include
• totals for users, categories and places, obtained using the length property for the returned arrays for each respective data type.
• Average number of places per user and per category, derived by simple division from the returned totals and represented to 2 decimal places using Number.prototype.toFixed()
• A list of the top 5 users contributing places to the site is also presented. This is obtained by filtering the places array returned by db.placeStore.getAllPlaces() to find places where the createdBy property equals a users id. The length property of the returned filtered array is then added to a new array of users. This array is then sorted using the lodash _.orderBy() method and Array.prototype.slice() is then used to provide the top 5 results which are passed to the viewData object.


**2.4 Images**
The place model allows users to store image URLs related to individual placemarks.
To store these images a cloud-based hosting service, Cloudinary was selected. The implementation of the feature was guided by the process outlined in the following tutorial

>  https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-11-deployment/unit-1-deployment/book-3-cloudinary

The following modifications were applied.
-	The upload button uses the fetch API to submit the image from the front end to the server rather than relying on a separate form element.
-	A hidden input field was then updated with the URL for the newly uploaded image.
-	Users can add multiple images and the URL values are concatenated to the hidden input fields value. These are then converted to an array on the back end and added to the place.
-	Users can remove images by clicking on the image prior to submit. This removes them from the hidden field.
     The edit place view was also updated to render the images attached to a place and allow further images to be added and removed.

**2.5 Categories**
To preserve consistency in the system a design decision was taken to require users to have role of admin in order to create, update and delete categories from the system.

Admin users access this functionality from the administrator dashboard (/admin).
Standard users have the capability tag their placeMarks with the categories that are stored in the system. The tagify javascript package is used to provide an attractive front end interface.

**2.6 Test suite**

The project is accompanied by 2 test suites one focused on testing the API functionality and another focused on unit testing the integrity of the model

test
│
├── api\
│   ├── auth-api-test.js
│   ├── category-api-test.js
│   ├── place-api-test.js
│   ├── placemark-service.js
│   └── user-api-test.js
│
├── model\
│   ├── category-model-test.js
│   ├── places-model-test.js
│   └── users-model-test.js
│
├── fixtures.js
└── test-utils.js

The node `package.json` file is configured to run the test suites using: npm run test
Note that only test driven scripts are compatible and behaviour driven scripts if these are required will need to be refactored to a separate folder.

The testing suites in place rely on sample data provided in `fixtures.js`, this file should be modified according to your projects needs.

Further information on the mocha.js testing framework and chai assertion library is available in the respective documentation. Reference below.


**3.  Deployment / Installation**

**3.1 To deploy your own version of this repository on Glitch.**
1. Log into your Glitch account or create a new one (https://www.glitch.com)
2. Click [New Project] and [import from GitHub]
3. In the dialog that appears enter the repo address for this project: https://github.com/StephenSwantonIRL/PlaceMarkAssignment.git
4. Edit the Glitch project .env file to create the following variables adding your own API keys for the relevant services:

> cookie_name
> cookie_password
> db
> firebase_apiKey
> firebase_projectId
> firebase_storageBucket
> firebase_messaging
> SenderId firebase_appId
> cloudinary_name
> cloudinary_key
> cloudinary_secret

The `db` variable is the `mongodb+srv://` connection url for your mongoDB hosting. Firebase and cloudinary variables are available in your user account on these respective services.
5. Thats it!




**3.1 To deploy your own version of this repository on Heroku**
1. Use git clone https://github.com/StephenSwantonIRL/PlaceMarkAssignment.git to create your own  copy of the project.
2. If you don’t have the Heroku CLI install it now (Available here: https://devcenter.heroku.com/categories/command-line )
3. Log into your Heroku account by opening a terminal in your project folder and entering
   heroku login
4. Follow the login process
5. Once logged in type: heroku create
6. A new project will be created
7. In your browser navigate to the Heroku dashboard, find your newly created project and click it.
8. On the Heroku project settings tab enter your .env details in the Config Vars section
9. The variables required are as follows

> cookie_name
> cookie_password
> db
> firebase_apiKey
> firebase_projectId
> firebase_storageBucket
> firebase_messaging
> SenderId firebase_appId
> cloudinary_name
> cloudinary_key
> cloudinary_secret=


The `db` variable is the `mongodb+srv://` connection url for your mongoDB hosting. Firebase and cloudinary variables are available in your user account on these respective services.
10. Returning to your command line use the following command to push your project to the Heroku server:

    git push heroku master

Note that if you have previously changed your master branch to main the command will be

    git push heroku main

11. That’s it.




**4. References**
- Bulma - Documentation - https://bulma.io/documentation/
- Chai Assertion Library - Documentation, Assert - https://www.chaijs.com/api/assert/
- CKeditor - CKEditor Documentation - Getting Started - https://ckeditor.com/docs/ckeditor5/latest/installation/index.html
- Dotenv - dotenv - https://www.npmjs.com/package/dotenv
- GeeksforGeeks - Lodash _.cloneDeep() Method - https://www.geeksforgeeks.org/lodash-_-clonedeep-method/
- GeeksforGeeks - Lodash _.orderBy() Method - https://www.geeksforgeeks.org/lodash-_-orderby-method/
- Glitch Support Center - Can I change the version of node.js my project uses? - https://glitch.happyfox.com/kb/article/59-can-i-change-the-version-of-node-js-my-project-uses/
- Google - Firebase Documentation - Perform Simple and Compound Queries in Cloud FireStore - https://firebase.google.com/docs/firestore/query-data/queries
- Google - Firebase Documentation - Get Started with Cloud Firestore - https://firebase.google.com/docs/firestore/quickstart
- Handlebars - Handlebars API reference - https://handlebarsjs.com/api-reference/
- Handlebars - Handlebars Guide - https://handlebarsjs.com/guide/
- Heroku - Deploying with Git - https://devcenter.heroku.com/articles/git
- John Papa - Node.js Everywhere with Environment Variables! - https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
- Lowdb - https://github.com/typicode/lowdb
- Mastering JS - Updating Documents in Mongoose - https://masteringjs.io/tutorials/mongoose/update
- Mongoose JS - Documentation - Schema Types  - https://mongoosejs.com/docs/schematypes.html
- W3schools - JavaScript Fetch API - https://www.w3schools.com/js/js_api_fetch.asp
- W3schools - onclick Event - https://www.w3schools.com/jsref/event_onclick.asp
- WIT CompSci2021 - PlayTime version 5 - https://wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-05-models/unit-2/book-playtime-0-5-0/archives/playtime-0.5.0.zip
- WIT CompSci2021 - Full Stack Web Development Course Material - Lab 5 - https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-05-models/unit-2/book-playtime-0-5-0
- WIT CompSci2021 - Full Stack Web Development Course Material - Lab 6 - https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-06-apis/unit-2/book-playtime-0-6-0
- WIT CompSci2021 - Full Stack Web Development Course Material - Lab 7 -https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-07-rest/unit-2/book-playtime-0-7-0
- WIT CompSci2021 - Full Stack Web Development Course Material - Lab 8 - https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-08-openapi/unit-2/book-playtime-0-8-0
- WIT CompSci2021 - Full Stack Web Development Course Material - Lab 9 - https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-09-jwt/unit-1/book-1
- WIT CompSci2021 - Full Stack Web Development Course Material - Lab 10 - https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-11-deployment/unit-1-deployment/book-1-mongo-atlas
- WIT CompSci2021 - Full Stack Web Development Course Material - Lab 11 - https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-11-deployment/unit-1-deployment/book-2-deployment
- WIT CompSci2021 - Full Stack Web Development Course Material - Lab 12 - https://reader.tutors.dev/#/lab/wit-hdip-comp-sci-2021-full-stack.netlify.app/topic-11-deployment/unit-1-deployment/book-3-cloudinary
- WIT CompSci2021 - Glitch Playlist version 5 - https://github.com/wit-hdip-comp-sci-2021/playlist-5
- YairEO –  Tagify - https://github.com/yairEO/tagify


**5.	Image & Content Credits**
J Comp on FreePiK  - Happy travel photo  - https://www.freepik.com/photos/happy-travel
Foer, J., Morton, E., Thuras, D., & Obscura, A. (2019). Atlas Obscura: An Explorer's Guide to the World's Hidden Wonders. Workman Publishing.






