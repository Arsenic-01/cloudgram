# ☁️ Cloudgram

A **secure and fast cloud platform** that allows users to **upload and store files** using **Telegram API** and **Appwrite storage**.

🔗 **Live Website:** [Cloudgram](https://cloudgram-01.vercel.app/)  
🔗 **Source Code:** [GitHub Repository](https://github.com/Arsenic-01/cloudgram)

---

## 🚀 About Cloudgram

Cloudgram was built to **simplify file transfers** between devices without the need for emails or third-party logins.

💡 **Why?**  
I needed to print a document from my college lab’s PC, but there was no easy way to transfer the file without signing into my Google account. So, I decided to build **Cloudgram**, a platform that lets users **upload files quickly and securely** from any device.

---

## 🌟 Features

✅ **Telegram API Storage** – Upload **10 files at once**, max **20MB per file**, with **end-to-end encryption**.  
✅ **Supabase Database** - Stores the Telegram file **metadata** in a PostgreSQL database to ensure platform independence in case of a failure.  
✅ **Appwrite Storage** – Upload **20 files at once**, max **50MB per file**, stored in an **S3 bucket**.  
✅ **Secure Authentication** – Sign in with **Google, Magic Link, or Username/Password** via **Clerk**.  
✅ **Fast & Responsive** – Built with the latest web technologies for a smooth experience.  
✅ **Anonymous Upload System** – Users can upload **one file at a time** on the `/public` route. After uploading, they receive a **unique 5-digit code**, which they can use to **download the file from any device** without logging in.

---

## 🛠️ Tech Stack

### **Frontend:**

- 🚀 **Next.js (App Router) + React 19 RSC**
- 🎨 **Tailwind CSS**

### **Backend & Storage:**

- 📲 **Telegram API** + Custom **Python Bot**
- 📦 **Supabase (Database)**
- 🖥️ **Appwrite (Storage + Database)**
- 🔐 **Clerk (Authentication)**

### **State Management:**

- 🏗️ **Zustand** (Global state management)

---

## 🔧 Setup & Installation

1️⃣ **Clone the Repository**

```sh
git clone https://github.com/Arsenic-01/cloudgram.git
cd cloudgram
```

2️⃣ Install Dependencies

```sh
npm install
```

3️⃣ Set Up Environment Variables  
Create a `.env.local` file and add the following credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_BOT_TOKEN=
NEXT_PUBLIC_CHANNEL_ID=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DB=
NEXT_PUBLIC_APPWRITE_FILE_COLLECTION_ID=
APPWRITE_API_KEY=
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET=
NEXT_PUBLIC_APPWRITE_PUBLIC_COLLECTION_ID=
```

4️⃣ Run the Development Server

```sh
npm run dev
http://localhost:3000/
```

to view the app locally.

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new branch: `git checkout -b feature-branch`  
3. Commit your changes: `git commit -m "Added new feature"`  
4. Push to your branch: `git push origin feature-branch`  
5. Submit a pull request 🎉  

---

## 📜 License

This project is licensed under the MIT License.

---

## 📬 Contact

📧 **Email:** [vedbhor25@gmail.com](mailto:vedbhor25@gmail.com)  
🐦 **Twitter:** [@arsenic_dev](https://x.com/arsenic_dev)  
👨‍💻 **LinkedIn:** [Vedant Bhor](https://www.linkedin.com/in/vedant-bhor-39287828b/)  
