# 🎓 Student Registration CRUD App – React + Vite


![App Screenshot](image.png)
![App Screenshot](image-1.png)
![App Screenshot](image-2.png)
![App Screenshot](image-3.png)



This is a simple and responsive **Student Registration CRUD** application built using **React**, **Vite**, **Tailwind CSS**, and **React Query**. It allows users to register, view, edit, and delete student records using a mock API, with authentication powered by Firebase.

---

## 🚀 Features

- 🔐 Login and Signup using Firebase Authentication
- ➕ Add new student records
- ✏️ Edit existing student details
- 🗑️ Delete student records
- 📋 View student list in a responsive table
- ✅ Form validation
- 📱 Mobile-friendly UI with Tailwind CSS

🛠️ Tech Stack
React – Frontend library
Vite – Fast build tool
Tailwind CSS – Utility-first CSS framework
React Query – Data fetching and caching
Firebase – Authentication
Mock API – JSON Server or MockAPI.io for backend simulation


📁 Project Structure
student-crud-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── services/         # API and Firebase logic
│   ├── firebase.js       # Firebase configuration
│   └── App.jsx           # Main app component
├── public/
├── .env.example          # Firebase environment variables
├── package.json
└── README.md


🔐 Firebase Setup
This project uses Firebase Authentication. To enable it:

1. Go to Firebase Console and create a new project.
2. Enable Email/Password authentication under Authentication > Sign-in method.
3. Create a .env file in the root of your project and add your Firebase config like this:

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

4. Your Firebase config is loaded in the app using import.meta.env in firebase.js.


## 📦 Installation

git clone https://github.com/virensahu/student-crud-app
cd student-crud-app                                       
npm install
npm run dev


🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.