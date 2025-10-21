# HealthMate - AI Medical Report Analyzer 🏥

<div align="center">

![HealthMate Logo](https://img.shields.io/badge/HealthMate-AI%20Medical%20Analyzer-blue?style=for-the-badge&logo=medical)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)

**Revolutionizing healthcare with AI-powered medical report analysis and multilingual support**

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Tech Stack](#tech-stack) • [API](#api) • [Contributing](#contributing)

</div>

## 🌟 Overview

HealthMate is an intelligent web application that uses artificial intelligence to analyze medical reports and lab results. It provides comprehensive insights in both English and Urdu, making healthcare information accessible to a wider audience. The platform helps patients understand their medical reports, get AI-powered analysis, and ask questions about their health conditions.

## 🎯 Features

### 🤖 AI-Powered Analysis
- **Smart Report Processing**: Upload medical reports (PDF, images, documents) for AI analysis
- **Comprehensive Insights**: Get detailed analysis including summary, key findings, abnormal values, and recommendations
- **Multi-format Support**: Supports PDF, JPG, PNG, DOC, DOCX, and TXT files

### 🌐 Multilingual Support
- **Dual Language Interface**: Full support for English and Urdu
- **Real-time Translation**: Automatic translation of medical reports and analysis
- **Urdu Script Support**: Proper RTL (Right-to-Left) rendering for Urdu text

### 💊 Medical Insights
- **Key Findings**: AI-identified important medical observations
- **Abnormal Values**: Highlighted abnormal test results and values
- **Doctor Questions**: Suggested questions to ask your healthcare provider
- **Home Remedies**: Practical home care recommendations
- **Food Suggestions**: Dietary recommendations and restrictions
- **Friendly Notes**: Important medical disclaimers and notes

### 💬 Interactive AI Chat
- **Contextual Q&A**: Ask questions about your specific medical report
- **Real-time Responses**: Get instant answers from AI
- **Report-specific Context**: Chat understands your medical report context

## 🚀 Demo

### Live Demo
🔗 https://final-hackathon-smit-afbr.vercel.app/

### Screenshots
| Upload Report | Analysis Results | Urdu Translation |
|---------------|------------------|------------------|
| <img width="953" height="407" alt="f2" src="https://github.com/user-attachments/assets/e1a8e34d-3388-4712-86f2-9c839e4c5260" />| <img width="1833" height="733" alt="Screenshot 2025-10-22 014718" src="https://github.com/user-attachments/assets/cbf80759-21d7-4961-bb79-d08587ac9849" />|<img width="917" height="367" alt="f3" src="https://github.com/user-attachments/assets/3a0bc902-a34f-4029-855e-5378bb03a879" />|

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn


The application will be available at:
- Frontend: https://final-hackathon-smit-afbr.vercel.app/
- Backend: https://final-hackathon-smit-eight.vercel.app/

## 📖 Usage

### 1. Upload Medical Report
- Click "Choose File" to select your medical report
- Supported formats: PDF, JPG, PNG, DOC, DOCX, TXT
- Maximum file size: 10MB

### 2. AI Analysis
- Click "Analyze Report" to process your file
- Wait for AI to analyze the report (typically 30-60 seconds)
- View comprehensive analysis results

### 3. View Results
- **English Summary**: AI-generated summary of the report
- **Urdu Translation**: Automatic translation of all content
- **Key Findings**: Important medical observations
- **Doctor Questions**: Questions to ask your healthcare provider
- **Home Remedies**: Self-care recommendations
- **Food Suggestions**: Dietary advice

### 4. Interactive Chat
- Click "Ask Questions About This Report"
- Chat with AI about your specific medical report
- Get personalized answers and explanations

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Material-UI (MUI)** - Component library and styling
- **Axios** - HTTP client for API calls
- **React Router** - Navigation and routing
- **React Toastify** - Notifications and alerts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for user data and reports
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Multer** - File upload handling

### AI & Translation
- **Custom AI Model** - Medical report analysis
- **Google Translate API** - Free translation service
- **LibreTranslate** - Open-source translation fallback

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Medical Analysis
- `POST /ai/analyze-file` - Upload and analyze medical report
- `GET /ai/analysis/:id` - Get specific analysis results

### Translation
- `POST /translate/english-to-urdu` - Translate English text to Urdu
- `GET /translate/status` - Check translation service status

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/reports` - Get user's medical reports

## 🗂️ Project Structure

```
healthmate/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
├── Server/                # Node.js Backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── utils/             # Utility functions
└── README.md
```

## 🤝 Contributing

We welcome contributions to HealthMate! Here's how you can help:

### Reporting Issues
- Use GitHub Issues to report bugs or suggest features
- Include detailed descriptions and steps to reproduce

### Development
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code style and patterns
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏥 Medical Disclaimer

> **Important**: HealthMate is an AI-powered tool for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 👥 Team

- **Junaid Ahmed** - Lead Developer - [GitHub](https://github.com/JunaidAhmed68)

## 🙏 Acknowledgments

- Medical professionals who provided insights
- Open-source translation services
- React and Node.js communities
- Material-UI team for excellent components

---

<div align="center">

**Made with ❤️ for better healthcare accessibility**

![HealthMate](https://img.shields.io/badge/HealthMate-Healthcare%20AI-brightgreen?style=for-the-badge)

*Empowering patients through AI and multilingual support*

</div>
