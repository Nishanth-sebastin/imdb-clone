## Installation

```sh
# cd web && cd api

npm install

```


## Project structure

| File or folder                  | Description                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| `api`                 | node express api  |
| `web`                 | a simple react app |

## Environment Setup

To set up the environment variables, follow these steps:

### 1. Copy `.env.example` to `.env`

Run the following command in both the `api` and `web` directories:

```sh
cp api/.env.example api/.env
cp web/.env.example web/.env
```

### 2. Provide Necessary Values

Open the `.env` files in both directories and replace placeholder values with actual credentials. Example:

#### `api/.env`
```env
HOST=http://localhost
API_PORT=8085
CLIENT_URL=http://localhost:8080
MONGODB_URI=<YOUR_DATABASE_URL>
ACCESS_SECRET=<YOUR_ACCESS_SECRET>
REFRESH_SECRET=<YOUR_REFRESH_SECRET>
CLOUDINARY_NAME=<YOUR_CLOUDINARY_NAME>
CLOUDINARY_KEY=<YOUR_CLOUDINARY_KEY>
CLOUDINARY_SECRET=<YOUR_CLOUDINARY_SECRET>
```

#### `web/.env`
```env
BACKEND_URL=http://localhost:8085
```

### 3. Generate New Secrets (If Needed)

For `ACCESS_SECRET` and `REFRESH_SECRET`, you can generate random secret keys using:

```sh
openssl rand -hex 32
```

Replace `<YOUR_ACCESS_SECRET>` and `<YOUR_REFRESH_SECRET>` with the generated values.

### 4. Save and Restart
After updating the `.env` files, go to the root folder of the project and run :

```sh
 npm run dev
```

## Database Seeding

After setting up the correct environment configurations, run the following command to seed the database with sample data:
```sh
npm run db:seed
```

This will populate the database with initial data required for the application.

example username : admin
example username : password

## Additional commands usages

```sh
# launch parallel all dev app (api and web)
npm run dev

# launch only web app
npm run web

# launch only api app
npm run api

# launch workspace web
# --command is replace by @repo/web script ej : npm run @repo/web lint
npm run @repo/web --command

# launch workspace api
# --command is replace by @repo/web script ej : npm run @repo/web dev
npm run @repo/api --command


```


## Database Schema and Relationships

### 1. **User Schema**
- Fields:
  - `name` (String, required)
  - `username` (String, unique, required)
  - `email` (String, unique, required)
  - `password` (String, required, hashed before saving)
- Relationships:
  - A user can submit multiple **Movie Feedback**.
  - A user can create **Movies**.

### 2. **Movie Schema**
- Fields:
  - `_id` (UUID, primary key)
  - `title` (String, required)
  - `year` (Number, required, min: 1888)
  - `description` (String, required)
  - `images` (Array of Strings, at least one required)
  - `user_id` (String, references `User`)
  - `overall_ratings` (Number, default: 0, range: 0-5)
  - `cast` (Array of objects containing `person` and `role`)
- Relationships:
  - A movie can have multiple **Actors** and **Producers**.
  - A movie can receive multiple **Movie Feedback**.

### 3. **Actor Schema**
- Fields:
  - `_id` (UUID, primary key)
  - `name` (String, required)
  - `imageUrl` (String, optional)
  - `movies` (Array of Strings, references `Movie`)
- Relationships:
  - An actor can be associated with multiple **Movies**.

### 4. **Producer Schema**
- Fields:
  - `_id` (UUID, primary key)
  - `name` (String, required)
  - `imageUrl` (String, optional)
  - `movies` (Array of Strings, references `Movie`)
- Relationships:
  - A producer can be associated with multiple **Movies**.

### 5. **Movie Feedback Schema** 
- Fields:
  - `_id` (UUID, primary key)
  - `rating` (Number, required, range: 0-5)
  - `review` (String, required)
  - `user_id` (String, references `User`)
  - `movie_id` (String, references `Movie`)
- Relationships:
  - A feedback entry belongs to a **User** and a **Movie**.

### 6. **Refresh Token Schema**
- Fields:
  - `userId` (ObjectId, references `User`, required)
  - `token` (String, required)
  - `createdAt` (Date, default: now, expires in 7 days)
- Relationships:
  - Each refresh token is associated with a **User**.
