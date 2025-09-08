# 📚 SnapRead - AI-Powered PDF Summarization Platform

SnapRead is a modern, intelligent PDF summarization platform that transforms lengthy documents into digestible summaries using advanced AI technology. Built with Next.js 15, it offers a seamless experience for users to upload, analyze, and interact with their PDF documents.

## 📸 Screenshots

### Landing Page & Authentication

![Landing Page](./images/Screenshot%202025-09-08%20221019.png)
_Beautiful landing page with modern design and clear call-to-action_

### Dashboard & PDF Management

![Dashboard](./images/Screenshot%202025-09-08%20221317.png)
_Clean dashboard interface showing uploaded PDFs and summary cards_

### PDF Upload Interface

![Upload Interface](./images/Screenshot%202025-09-08%20221330.png)
_Intuitive drag-and-drop PDF upload with progress tracking_

### AI-Generated Summary View

![Summary View](./images/Screenshot%202025-09-08%20222639.png)
_Structured AI summaries with section navigation and download options_

### Interactive Chat with PDF

![Chat Interface](./images/Screenshot%202025-09-08%20234712.png)
_Real-time chat interface for asking questions about PDF content_

## ✨ Features

### 🤖 **AI-Powered Summarization**

- **Google Gemini 2.5 Flash Integration**: State-of-the-art AI for accurate, contextual summaries
- **Smart Section Parsing**: Automatically breaks down summaries into navigable sections
- **Contextual Emojis**: Engaging summaries with relevant emojis for better readability
- **Markdown Formatting**: Well-structured output with proper formatting

### 💬 **Interactive Chat System**

- **Chat with PDFs**: Ask questions about your documents and get AI-powered responses
- **Conversation History**: Persistent chat history stored in database
- **Context-Aware Responses**: AI understands the full document context
- **Real-time Messaging**: Smooth chat experience with loading states and animations

### 📱 **Modern User Interface**

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Rose/Pink Theme**: Beautiful, professional color scheme
- **Gradient Backgrounds**: Stunning visual effects with backdrop blur
- **Tab System**: Mobile-friendly interface with Summary/Chat tabs
- **Toast Notifications**: Bottom-center notifications for user feedback

### 🔒 **Authentication & Security**

- **Clerk Integration**: Secure user authentication and management
- **User Isolation**: Each user's data is completely isolated
- **Session Management**: Persistent login sessions across devices

### 📊 **Document Management**

- **Upload Limit**: Maximum 3 PDFs per user (configurable)
- **File Storage**: Secure cloud storage with Cloudinary integration
- **Download Options**: Download summaries as formatted text files
- **View Original**: Quick access to original PDF documents
- **Delete Function**: Easy document and summary management

### 🗄️ **Database & Storage**

- **PostgreSQL**: Robust database with Prisma ORM
- **Cloud Storage**: Cloudinary for reliable file storage
- **Data Relations**: Proper user-document-chat relationships
- **Migration System**: Database versioning and updates

### 🎨 **User Experience**

- **Interactive Navigation**: Section-by-section summary navigation
- **Progress Tracking**: Visual progress bars for summary reading
- **Quick Actions**: One-click buttons for common questions
- **Scroll Optimization**: Smooth scrolling without page jumps
- **Loading States**: Professional loading animations and states

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account
- Google Gemini API key
- Clerk authentication setup

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd pdf_summarizer
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# AI Integration
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# File Storage (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

4. **Set up the database**

```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

### **Frontend**

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI component library
- **React Hot Toast**: Beautiful toast notifications

### **Backend**

- **Next.js API Routes**: Server-side functionality
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Robust relational database
- **Server Actions**: Modern server-side operations

### **AI & Processing**

- **Google Gemini 2.5 Flash**: Advanced language model
- **Vercel AI SDK**: AI integration framework
- **LangChain**: PDF text extraction and processing

### **Authentication & Storage**

- **Clerk**: Complete authentication solution
- **Cloudinary**: Cloud-based file storage
- **UploadThing**: File upload handling

## 📖 Usage

### **Uploading PDFs**

1. Sign up or log in to your account
2. Navigate to the Upload page
3. Select and upload your PDF (max 3 files)
4. Wait for AI processing to complete

### **Viewing Summaries**

1. Go to your Dashboard
2. Click on any summary card
3. Navigate through sections using the controls
4. Download summaries as text files

### **Chatting with PDFs**

1. Open any summary page
2. Switch to the Chat tab (mobile) or use the side panel (desktop)
3. Ask questions about the document
4. Get AI-powered responses based on the content

### **Managing Documents**

- **View Original**: Click the external link icon to open the PDF
- **Download Summary**: Click the download icon for a formatted text file
- **Delete**: Use the delete button to remove summaries
- **Navigate**: Use the dashboard to manage all your documents

## 🎯 Key Features Walkthrough

### **Smart Summarization**

- Upload any PDF document
- AI analyzes and creates structured summaries
- Navigate section by section with visual progress
- Export summaries for offline reading

### **Interactive Chat**

- Ask specific questions about your documents
- Get contextual answers based on the full content
- Conversation history is saved automatically
- Works on both mobile and desktop

### **Professional UI**

- Clean, modern interface with rose/pink theme
- Responsive design that works on all devices
- Smooth animations and professional loading states
- Toast notifications for user feedback

## 🔧 Configuration

### **PDF Upload Limits**

Modify the upload limit in `actions/upload-action.ts`:

```typescript
const MAX_PDFS = 3; // Change this value
```

### **AI Model Configuration**

Update the AI model in `lib/geminiAI.ts`:

```typescript
model: google("gemini-2.5-flash"); // Switch models if needed
```

### **Styling Customization**

The app uses a rose/pink theme defined in `app/globals.css` and component files. Modify CSS custom properties to change colors.

## 📁 Project Structure

```
pdf_summarizer/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (loggedIn)/        # Protected routes
│   ├── api/               # API endpoints
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── chat/             # Chat functionality
│   ├── common/           # Shared components
│   ├── dashboard/        # Dashboard components
│   ├── summary/          # Summary viewer
│   └── ui/               # Base UI components
├── lib/                  # Utility functions
├── actions/              # Server actions
├── prisma/              # Database schema
└── public/              # Static assets
```

## 🚀 Deployment

### **Vercel (Recommended)**

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically on each push

### **Environment Setup for Production**

- Set up production PostgreSQL database
- Configure Cloudinary for production
- Set up Clerk for production domain
- Add Google Gemini API key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini**: For powerful AI capabilities
- **Vercel**: For hosting and AI SDK
- **Clerk**: For authentication services
- **Cloudinary**: For file storage solutions
- **Prisma**: For database management
- **Shadcn/ui**: For beautiful UI components

---

Built with ❤️ using Next.js, TypeScript, and AI technology. Transform your PDF reading experience with SnapRead!
