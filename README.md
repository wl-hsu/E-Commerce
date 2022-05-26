# E-Commerce

## Getting Started

### Deployment 

Online Preview Address: https://wlh-ecommerce.herokuapp.com/

```
Testing account or you can signup

admin@example.com (Admin)
admin

user1@example.com 
user1

user2@example.com 
user2
```

### Configuration

Create a .env file in the root directory, and then add the following

NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri 
JWT_SECRET = 'anyString'
PAYPAL_CLIENT_ID = your paypal client id

### Install dependencies

```
npm install
cd frontend
npm install
```

### RUN

cd to root directory
```
# Run both frontend and backend
npm run dev

# Run backend
npm run server

```

### Data Base Data

cd to root directory
```
# Insert data
npm run data:import
# destroy data
npm run data:destroy
```

```
Testing account or you can signup

admin@example.com (Admin)
admin

user1@example.com 
user1

user2@example.com 
user2
```
