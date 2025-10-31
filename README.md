⛓️ Provenance: A Supply Chain Verification PlatformThis project is a full-stack web application designed to solve the problem of "greenwashing" and lack of transparency in supply chains. It creates a verifiable, immutable, and transparent digital history for any product, allowing end-customers to verify claims like "Organic," "Fair Trade," or "Ethically Sourced" with a simple QR code scan.Instead of a complex blockchain, this project implements the core concept of immutability using cryptographic hash-chaining in a standard MongoDB database.🚀 Key FeaturesImmutable Ledger: Each new entry in the supply chain is cryptographically linked to the previous one. If any past entry is tampered with, the chain "breaks."Full-Stack Implementation: Built with a React frontend (using Material-UI) and a Node.js/Express backend.Role-Based Entry: Simple UI for different roles (Farmer, Co-op, Exporter, Retailer) to add their data to the product's history.QR Code Verification: The "Retailer" can generate a final QR code, which links customers directly to the product's public history page.Real-Time Tamper Detection: The public-facing product timeline automatically verifies the hash chain and will instantly flag any entries that have been tampered with.⚙️ How It Works: The "Mini-Blockchain"This project proves that the concept of a blockchain is more important than the technology itself.Genesis Block: When a "Farmer" creates a new product, it creates the first entry with a previous_hash of "000000".Chaining: When the "Co-op" adds the next entry, the backend first finds the hash of the Farmer's entry (e.g., a1b2c3d4). This hash is stored in the Co-op's entry as its previous_hash.Immutability: This process continues. Each new entry is "chained" to the one before it.Verification: When a customer scans the QR code, the React app fetches the entire chain. It then re-calculates the hashes. If entry[1].previous_hash does not equal the actual hash of entry[0], it knows the data has been faked, and it flags the product as TAMPERED.

💻 Tech Stack
Frontend: React.js, Material-UI (MUI), react-router-dom, qrcode.react
Backend: Node.js, Express
Database: MongoDB (with the mongodb native driver)
Core Logic: Node.js crypto library for SHA-256 hashing.

|🏁 Getting StartedTo run this project on your local machine, follow these steps.PrerequisitesNode.js (v18 or newer)MongoDB (running locally on mongodb://localhost:27017)1. Backend SetupOpen a terminal and navigate to the backend folder:Bash# Go into the backend folder
cd backend

# Install dependencies
npm install

# Start the server (it will run on http://localhost:5000)
node index.js
2. Frontend SetupOpen a second, separate terminal and navigate to the frontend folder:Bash# Go into the frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app (it will open in your browser)
npm start
The application will be running at http://localhost:3000.📜 LicenseThis project is licensed under the MIT License. See the LICENSE file for details.