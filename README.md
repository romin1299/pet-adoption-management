# pet-adoption-management
## Installation

1. Clone the repository:
```bash
git clone https://github.com/romin1299/pet-adoption-management.git
cd pet-adoption-management
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Setup

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Create a `.env` file with the following variables:
```
PORT=5000
DATABASE_URL='mongodb://127.0.0.1:27017/pet-adoption'
```

3. Start the server:
```bash
npm start
```

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173/`.

## Database

### Dump Database

To export your database:

### Restore Database

```bash
# For MongoDB

# Navigate inside the server folder and inside dump
mongorestore dump
```

### For the credentials use email which is mentioned in Database

User and Admin password is same it's 123