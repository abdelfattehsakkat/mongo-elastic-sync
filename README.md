# 🔄 MongoDB to Elasticsearch Sync (Realtime)

A simple Node.js project to synchronize data between MongoDB and Elasticsearch in real time. This project uses MongoDB change streams to detect changes (insert, update, delete) and automatically indexes the data into Elasticsearch. It also includes an initial sync mechanism and integration with Docker to simplify environment setup.

It supports:

- Real-time sync from MongoDB to Elasticsearch using MongoDB change streams.
- Full document indexing (on insert/update).
- Delete document handling in Elasticsearch when a document is deleted in MongoDB.
- Initial sync from MongoDB to Elasticsearch if Elasticsearch is empty or forced.
- Docker Compose for easy setup of MongoDB, Elasticsearch, and Kibana services.

## Prerequisites

Make sure you have the following installed:
- Node.js >= 16.x
- MongoDB >= 4.x (for change streams support)
- Elasticsearch >= 7.x
- Docker (optional, for local setup)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/abdelfattehsakkat/mongo-elastic-sync.git
   cd mongo-elastic-sync
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   Copy `.env.example` to `.env` and update the values with your MongoDB and Elasticsearch connection details.

   Example:

   ```bash
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB=test-sync
   MONGO_COLLECTION=users
   ELASTICSEARCH_URI=http://localhost:9200
   ELASTIC_INDEX=test-sync-index
   ```

4. **Run the application:**

   To run the initial sync and start the real-time watcher, run:

   ```bash
   npx ts-node src/index.ts     
   ```

   This will connect to MongoDB and Elasticsearch, check if an initial sync is needed, and start watching for real-time changes in MongoDB.

---

## 📆 Planned Features

- Support for MongoDB TLS/SSL connection
- Write to file for Filebeat ingestion (optional)
- Save resume token for true durability
- Publish as a plug-and-play **npm package**

## 🚀 How it works

1. **Initial Sync** (optional):  
   At startup, the app checks if Elasticsearch already contains documents. If not (or if `FORCE_SYNC=true`), all MongoDB documents are read and indexed.

2. **Change Stream Watcher**:  
   A change stream is established using `collection.watch()`, listening for:
   
   - 🟢 **Insert**: new documents are mapped and indexed
   - 🟡 **Update**: document is reloaded and updated in Elasticsearch
   - 🔴 **Delete**: the corresponding document will be removed from Elasticsearch (to be implemented)

3. **Resume Token**:  
   MongoDB change streams use a resume token to track the last processed event in case of restart (not yet persisted but will be added in next versions).

---

## 📁 Project Structure

```
├── src/
│   ├── mongo/
│   │   └── watcher.ts       # Initial sync + realtime watcher
│   ├── elastic/
│   │   ├── elastic.ts       # Elastic client setup
│   │   └── writer.ts        # Indexing logic
│   ├── mapper.ts            # Maps Mongo doc to Elasticsearch schema
│   ├── config.ts            # Configuration (MongoDB + Elasticsearch)
│   ├── logger.ts            # Simple Winston logger
│   └── index.ts             # Entry point
```

---

## 🧪 Running Locally with Docker

To make it easy to test locally, use the provided Docker Compose file to spin up MongoDB, Elasticsearch, and Kibana.


### ✅ Steps to run

1. Start the stack:
   ```bash
   docker-compose up -d
   ```

2. Initialize MongoDB replica set:
   ```bash
   docker exec -it mongo mongosh
   rs.initiate()
   ```

3. Run the sync service:
   ```bash
   npx ts-node src/index.ts
   ```

---

## ⚙️ Configuration

| Key                | Description                       |
|--------------------|-----------------------------------|
| `MONGO_URI`        | MongoDB connection string         |
| `MONGO_DB`         | Database name                     |
| `MONGO_COLLECTION` | Collection to sync                |
| `ELASTIC_INDEX`    | Elasticsearch index to write to   |
| `FORCE_SYNC=true`  | Forces initial reindexing         |

You can pass these via environment variables or set them in `config.ts`.

---

## 📄 License

MIT – Feel free to fork, improve, and contribute!

