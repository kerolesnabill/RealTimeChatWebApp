# **RealTimeChatWebApp**

A modern, real-time chat application frontend with a responsive design, allowing users to manage profiles, search for other users, and exchange messages instantly.

## **Features**

- **User Authentication**: Secure signup and login functionality.
- **Real-Time Messaging**: Powered by SignalR for instant updates.
- **Profile Management**: Edit user profiles and manage profile images.
- **Inbox Management**: Search for users, create new chats, and view conversations.
- **Responsive Design**: Fully functional on desktops, tablets, and mobile devices.
- **Error Handling**: Clear and user-friendly error messages.

## **Technologies Used**

### Frontend:

- Vite - Fast build tool.
- React with TypeScript.
- Tailwind CSS & DaisyUI for styling.
- React Query for state management and data fetching.

### Backend:

This project interacts with a separate backend repository built with:

- ASP.NET Core for RESTful APIs.
- SignalR for real-time communication.
- SQL Server for data storage.

The backend repository can be found here: [RealTimeChatAPI](https://github.com/kerolesnabill/RealTimeChatAPI).

## **Live Demo**

Experience the live demo here: [RealTimeChatWebApp](https://real-time-chat-webapp.vercel.app/)

## **Installation**

### Prerequisites

- [Node.js](https://nodejs.org/)
- Backend API running from [RealTimeChatAPI](https://github.com/kerolesnabill/RealTimeChatAPI).

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/kerolesnabill/RealTimeChatWebApp.git
   cd chat-web-app
   ```

2. **Frontend Setup**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**:
   Follow the instructions in the [RealTimeChatAPI](https://github.com/kerolesnabill/RealTimeChatAPI) repository to set up the backend.

4. **Open Application**:
   Navigate to `http://localhost:3000` in your browser.

## **Usage**

- **Login/Signup**: Create an account or log in with existing credentials.
- **Inbox**: View conversations, search for users, and start new chats.
- **Chat Window**: Send real-time messages and view chat history.
- **Profile Management**: Edit profile information and manage images.

## **API Reference**

The API documentation is available in the [RealTimeChatAPI](https://github.com/kerolesnabill/RealTimeChatAPI) repository.

## **Architecture Overview**

### Components:

- **`Home.tsx`**: Layout containing `Inbox` and `ChatWindow`.
- **`Inbox.tsx`**: Displays the list of conversations.
- **`ChatWindow.tsx`**: Manages real-time messaging.
- **`Profile.tsx`**: Handles profile editing and image management.
- **`NewChat.tsx`**: Allows starting new conversations by searching usernames.

## **Responsive Design**

- **Small Screens**:

  - Inbox is toggled using a button.
  - Chat window adapts to fit smaller devices seamlessly.

- **Large Screens**:
  - Both Inbox and Chat Window are visible side-by-side.

## **License**

This project is licensed under the [MIT License](LICENSE).
