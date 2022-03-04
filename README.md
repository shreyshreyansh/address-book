# address-book
APIs to maintain address book

# Postnam doc
[Link](https://documenter.getpostman.com/view/11180861/UVkvHXpk)

# Achieved Task
- Implement following endpoints
  - Add a new contact ✅
  - Add bulk contacts ✅
  - Fetch details of single contact ✅
  - Fetch phase matching results ✅
  - Fetch the list of contacts with pagination ✅
  - Update the given contact ✅
  - Delete the given contact ✅
- All APIs are secured by JWT authentication ✅
- Implement an endpoint to get the JWT token ✅
- Exception handling and Error API response ✅
- Add validation wherever required ✅
- Use dependency injection ✅
- Add proper comments ✅
- Add README file for documentation and execution detail ✅
- Use of TypeScript ✅
- Write the test cases ✅

# Dependencies
- `Typescript`
- `mongoose`
- `jsonwebtoken`
- `cookie-session`
- `dotenv`
- `express-validator`
- `express-async-errors`
- `ts-node-dev`

# Dev dependencies
- `jest`
- `ts-jest`
- `supertest`
- `mongodb-memory-server`

# Installation
1. Clone the repo
   ```
   git clone https://github.com/shreyshreyansh/address-book.git
   ```
2. CD into the project
   ```
   cd address-book
   ```
3. Install NPM packages
   ```
   npm install
   ```
   
# Scripts
1. Start the typescript server
   ```
   npm start
   ```
2. Start the server for testing
   ```
   npm run test
   ```

# Installation (Alternative)
1. Clone the repo
   ```
   git clone https://github.com/shreyshreyansh/address-book.git
   ```
2. CD into the project
   ```
   cd address-book
   ```
3. Build the image using the **Dockerfile**
   ```
   docker build -t address-book .
   ```
4. Run the container
   ```
   docker container run -dp 3000:3000 address-book
   ```

# Routes
|Route|Method|Body|Purpose|
|:--------:|:--------:|:--------:|:--------:|
|api/user/signup|POST|{email: string, password: string}|A user can sign up by providing an email address and a password. This route additionally checks if the user's email address is already in the database, and if it is, the registration request is rejected.|
|api/user/signin|POST|{email: string, password: string}|An email address and a password are required to sign in. The user receives the json web token as a response. I added it in the sign in route since it was a need to create an API route that produces a JWT token. However, cookies are used by all APIs to manage the JWT token session.|
|api/user/signout|POST|{}|The JWT token is nullified by the sign out route, and the user session expires as a result.|
|api/user/currentuser|GET|-|Return info about the user|
|api/contact|POST|{name: string, street: string, city: string, phone: string}|Creates a new contact with the needed parameters of name and phone.|
|api/contacts|POST|{contacts: [{name: string, street: string, city: string, phone: string}]}|Creates a number of contacts by accepting an object containing an array of contacts, each of which must have a name and a phone number.|
|api/contact/{id}|GET|{}|By providing the contact id, user can obtain the contact information.|
|api/contacts?page={page}&limit={limit}|GET|{}|Fetches the list of contacts with pagination. Here user can give page number and declares the limit on each page.y|
|api/contacts/search?query={query}|GET|{}|Fetches a list of contacts whose name matches the search query given by the user. It is case in-sensitive|
|api/contact/{id}|PUT|{name: string, street: string, city: string, phone: string}|Updates the contact details. Here the user who is the creator of the contact can only edit the contact details.|
|api/contact/{id}|DELETE|{}|Deletes the contact details. Here the user who is the creator of the contact can only delete the contact details.|

# Schema
- *User*
  |   Name   |   Type   |
  |:--------:|:--------:|
  |  email   |  string  |
  | password |  string  |

- *Contact*
  |   Name   |   Type   |
  |:--------:|:--------:|
  |  name   |  string  |
  |  street   |  string  |
  |  city   |  string  |
  |  phone   |  string  |
  | creatorId | Ref to User |
  
# Errors
- `400` on bad request by the user
- `401` if the user is unauthorized
- `404` if the resource is not found
- `500` if database connection fails or internal server error

# Testing
![Screenshot 2022-03-05 005007](https://user-images.githubusercontent.com/53744971/156827929-248016f8-b314-4ce4-bdae-8ee2c9ed424a.jpg)
