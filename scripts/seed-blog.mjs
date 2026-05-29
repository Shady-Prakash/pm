import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const prisma = new PrismaClient()

const posts = [
  {
    title: 'Getting Started with MERN Stack',
    slug: 'getting-started-with-mern-stack',
    excerpt: 'A comprehensive tutorial teaching developers how to build a full-stack web application using MongoDB, Express, React, and Node.js (MERN), focusing on user authentication with JWT and displaying user data through React.',
    tags: ['nodejs', 'mern-stack', 'expressjs', 'mongodb', 'react'],
    status: 'published',
    publishedAt: new Date('2022-04-05'),
    content: `# Getting Started with MERN Stack

The MERN stack is one of the most popular full-stack JavaScript frameworks. In this tutorial we'll build a full-stack web application with user authentication using **MongoDB, Express, React, and Node.js**.

---

## What is MERN?

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Database | MongoDB | NoSQL document store |
| Backend | Express + Node.js | REST API server |
| Frontend | React | UI / client side |

---

## Backend Setup

### 1. Initialise the project

\`\`\`bash
mkdir mern-app && cd mern-app
npm init -y
npm install express dotenv mongoose colors bcryptjs jsonwebtoken express-async-handler
npm install -D nodemon
\`\`\`

Add scripts to \`package.json\`:

\`\`\`json
{
  "scripts": {
    "start": "node backend/server.js",
    "dev": "nodemon backend/server.js"
  }
}
\`\`\`

### 2. Connect to MongoDB Atlas

Create \`.env\`:

\`\`\`env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mernapp
JWT_SECRET=your_jwt_secret
\`\`\`

\`\`\`javascript
// backend/config/db.js
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(\`MongoDB Connected: \${conn.connection.host}\`.cyan.underline)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB
\`\`\`

### 3. User Model

\`\`\`javascript
// backend/models/userModel.js
const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please add a name'] },
    email: { type: String, required: [true, 'Please add an email'], unique: true },
    password: { type: String, required: [true, 'Please add a password'] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
\`\`\`

### 4. Auth Controller

\`\`\`javascript
// backend/controllers/userController.js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({ name, email, password: hashedPassword })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

module.exports = { registerUser, loginUser }
\`\`\`

### 5. Routes & Middleware

\`\`\`javascript
// backend/routes/userRoutes.js
const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router
\`\`\`

\`\`\`javascript
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorised')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not authorised, no token')
  }
})

module.exports = { protect }
\`\`\`

---

## Frontend Setup

### 1. Create React App with Redux Toolkit

\`\`\`bash
npx create-react-app frontend --template redux
cd frontend
npm install axios react-toastify react-router-dom
\`\`\`

### 2. Auth Slice (Redux)

\`\`\`javascript
// frontend/src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message = error.response?.data?.message || error.message
    return thunkAPI.rejectWithValue(message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    logout: (state) => {
      localStorage.removeItem('user')
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.isLoading = true })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, logout } = authSlice.actions
export default authSlice.reducer
\`\`\`

### 3. Auth Service

\`\`\`javascript
// frontend/src/features/auth/authService.js
import axios from 'axios'

const API_URL = '/api/users/'

const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  if (response.data) localStorage.setItem('user', JSON.stringify(response.data))
  return response.data
}

const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)
  if (response.data) localStorage.setItem('user', JSON.stringify(response.data))
  return response.data
}

const authService = { register, login }
export default authService
\`\`\`

---

## Run Both Together

Install \`concurrently\` at the root level:

\`\`\`bash
npm install -D concurrently
\`\`\`

\`\`\`json
{
  "scripts": {
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",
    "server": "nodemon backend/server.js",
    "client": "npm start --prefix frontend"
  }
}
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

Both servers start simultaneously — Express on port 5000, React on port 3000.

---

## Summary

You now have a fully functional MERN authentication system. From here you can extend it with protected routes, user profiles, and any business logic you need. The patterns here — JWT auth, Redux state management, and RESTful APIs — are the foundation of most production MERN apps.`
  },
  {
    title: 'Building a Simple Sentiment Analyzer with Python (TextBlob & VADER)',
    slug: 'building-a-simple-sentiment-analyzer-with-python-textblob-vader',
    excerpt: 'A tutorial demonstrating how to create a command-line sentiment analyzer using Python that classifies text as positive, negative, or neutral using two NLP libraries: TextBlob and VADER.',
    tags: ['python', 'nlp', 'sentiment-analysis', 'textblob', 'vader'],
    status: 'published',
    publishedAt: new Date('2025-12-17'),
    content: `# Building a Simple Sentiment Analyzer with Python (TextBlob & VADER)

Sentiment analysis is the process of determining the **emotional tone** behind a piece of text. It's used everywhere — social media monitoring, product review analysis, customer feedback systems, and chatbots.

In this tutorial we'll build a command-line sentiment analyzer that classifies input as **positive**, **negative**, or **neutral** using two different NLP libraries and comparing their results.

---

## What We're Building

A Python CLI app that:
1. Accepts user text input in real time
2. Runs it through **TextBlob** and **VADER** simultaneously
3. Returns an emoji-tagged classification from both models

---

## Libraries

### TextBlob
Provides a simple API returning a **polarity score** from -1 (very negative) to +1 (very positive).

### VADER (Valence Aware Dictionary and sEntiment Reasoner)
Specialised for **informal text** — social media posts, slang, emojis. Returns a compound score for overall classification.

---

## Setup

\`\`\`bash
pip install textblob vaderSentiment
\`\`\`

Download TextBlob corpora:

\`\`\`bash
python -m textblob.download_corpora
\`\`\`

---

## Implementation

\`\`\`python
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialise VADER
analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment_textblob(text: str) -> str:
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0:
        return "Positive 😊"
    elif polarity < 0:
        return "Negative 😡"
    else:
        return "Neutral 😐"


def analyze_sentiment_vader(text: str) -> str:
    compound = analyzer.polarity_scores(text)["compound"]
    if compound >= 0.05:
        return "Positive 😊"
    elif compound <= -0.05:
        return "Negative 😡"
    else:
        return "Neutral 😐"


def main():
    print("\\n🧠 Sentiment Analyzer (TextBlob + VADER)")
    print("Type '0' to quit\\n")

    while True:
        text = input("How are you feeling? → ")
        if text.strip().lower() == "0":
            print("Exiting. Goodbye! 👋")
            break

        print(f"  TextBlob : {analyze_sentiment_textblob(text)}")
        print(f"  VADER    : {analyze_sentiment_vader(text)}\\n")


if __name__ == "__main__":
    main()
\`\`\`

---

## Sample Output

\`\`\`
🧠 Sentiment Analyzer (TextBlob + VADER)
Type '0' to quit

How are you feeling? → I love coding with Python
  TextBlob : Positive 😊
  VADER    : Positive 😊

How are you feeling? → This bug is driving me crazy
  TextBlob : Negative 😡
  VADER    : Negative 😡

How are you feeling? → The weather is okay
  TextBlob : Neutral 😐
  VADER    : Positive 😊
\`\`\`

Note how VADER and TextBlob can disagree on borderline cases — VADER is generally better for casual language.

---

## When to Use Which

| Scenario | Recommended |
|----------|------------|
| Formal text, articles | TextBlob |
| Tweets, comments, slang | VADER |
| General purpose | Both + compare |

---

## What's Next

This is your entry point into NLP. Once you're comfortable here, explore:

- **Hugging Face Transformers** — state-of-the-art sentiment models
- **Fine-tuning BERT** on custom datasets
- **Streamlit** to turn this into a web app
- **Batch processing** CSV files of reviews

Sentiment analysis is one of the most practical NLP tasks — you'll find it everywhere in real products.`
  },
  {
    title: 'Gesture-Controlled Camera Filters Using Python, OpenCV & MediaPipe',
    slug: 'gesture-controlled-camera-filters-using-python-opencv-mediapipe',
    excerpt: 'Build a real-time gesture recognition system that lets users switch between webcam filters hands-free by showing different finger counts — using Python, OpenCV, and MediaPipe.',
    tags: ['python', 'opencv', 'mediapipe', 'computer-vision'],
    status: 'published',
    publishedAt: new Date('2025-12-22'),
    content: `# Gesture-Controlled Camera Filters Using Python, OpenCV & MediaPipe

What if you could switch camera filters just by holding up fingers? No keyboard, no mouse — pure gesture control.

In this tutorial we'll build a real-time system that detects hand gestures via webcam and applies different visual filters depending on how many fingers you're showing.

---

## Technologies

| Library | Role |
|---------|------|
| **Python** | Primary language |
| **OpenCV** | Video capture and image processing |
| **MediaPipe** | Hand landmark detection |
| **NumPy** | Matrix operations for filters |

---

## How Gesture Detection Works

MediaPipe detects **21 landmarks** per hand. We determine if a finger is "up" by comparing the fingertip landmark position to the lower joint:

- **Thumb** — compared on the x-axis (horizontal)
- **Other fingers** — compared on the y-axis (vertical)

\`\`\`
Fingertip y < Lower joint y  →  Finger is UP ✓
\`\`\`

---

## Project Structure

\`\`\`
gesture-filters/
├── app.py              # Main loop
├── filters.py          # Filter functions
├── gesture.py          # Hand detection logic
└── requirements.txt
\`\`\`

\`\`\`text
# requirements.txt
opencv-python
mediapipe
numpy
\`\`\`

---

## Gesture Detection Module

\`\`\`python
# gesture.py
import mediapipe as mp

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

TIP_IDS = [4, 8, 12, 16, 20]  # thumb, index, middle, ring, pinky


def count_fingers(frame):
    rgb = frame[:, :, ::-1]  # BGR to RGB
    result = hands.process(rgb)

    if not result.multi_hand_landmarks:
        return 0, frame

    hand = result.multi_hand_landmarks[0]
    lm = hand.landmark
    mp_draw.draw_landmarks(frame, hand, mp_hands.HAND_CONNECTIONS)

    fingers = []

    # Thumb (horizontal comparison)
    fingers.append(1 if lm[TIP_IDS[0]].x < lm[TIP_IDS[0] - 1].x else 0)

    # Other four fingers (vertical comparison)
    for tip in TIP_IDS[1:]:
        fingers.append(1 if lm[tip].y < lm[tip - 2].y else 0)

    return sum(fingers), frame
\`\`\`

---

## Filters Module

\`\`\`python
# filters.py
import cv2
import numpy as np


def apply_grayscale(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)


def apply_blur(frame):
    return cv2.GaussianBlur(frame, (21, 21), 0)


def apply_sepia(frame):
    kernel = np.array([
        [0.272, 0.534, 0.131],
        [0.349, 0.686, 0.168],
        [0.393, 0.769, 0.189],
    ])
    sepia = cv2.transform(frame, kernel)
    return np.clip(sepia, 0, 255).astype(np.uint8)


def apply_edges(frame):
    edges = cv2.Canny(frame, 100, 200)
    return cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)


FILTERS = {
    0: ("No Filter",  lambda f: f),
    1: ("Grayscale",  apply_grayscale),
    2: ("Blur",       apply_blur),
    3: ("Sepia",      apply_sepia),
    4: ("Edge Detect",apply_edges),
}
\`\`\`

---

## Main Application

\`\`\`python
# app.py
import cv2
from gesture import count_fingers
from filters import FILTERS

cap = cv2.VideoCapture(0)
print("Show fingers to switch filters. Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)  # Mirror effect
    finger_count, frame = count_fingers(frame)

    name, fn = FILTERS.get(finger_count, FILTERS[0])
    output = fn(frame)

    # HUD overlay
    cv2.putText(output, f"Fingers: {finger_count}", (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(output, f"Filter: {name}", (10, 80),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Gesture Filters", output)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
\`\`\`

---

## Running It

\`\`\`bash
pip install opencv-python mediapipe numpy
python app.py
\`\`\`

Hold up fingers in front of your webcam:

| Fingers | Filter |
|---------|--------|
| 0 | Normal |
| 1 | Grayscale |
| 2 | Blur |
| 3 | Sepia |
| 4 | Edge Detection |

---

## Ideas for Extension

- **Gesture cooldown** — prevent rapid switching with a 1-second delay
- **Both hands** — left hand for filters, right hand for intensity
- **Face filters** — combine with MediaPipe Face Mesh
- **Record** — save filtered video with OpenCV's VideoWriter
- **Desktop app** — package with PyInstaller

This is a great project to demonstrate real-time computer vision skills. The same architecture applies to sign language recognition, fitness tracking, and AR applications.`
  },
  {
    title: 'Building a Calories Advisor App with Streamlit and Google Gemini Vision API',
    slug: 'building-a-calories-advisor-app-with-streamlit-and-google-gemini-vision-api',
    excerpt: 'Build an AI-powered nutrition app that accepts food images and uses Google Gemini\'s multimodal AI to analyse nutritional content, estimate calories, and assess dietary balance — all in under 50 lines of Python.',
    tags: ['python', 'ai', 'streamlit', 'gemini', 'genai'],
    status: 'published',
    publishedAt: new Date('2025-12-23'),
    content: `# Building a Calories Advisor App with Streamlit and Google Gemini Vision API

Imagine pointing your phone camera at a plate of food and instantly getting a full nutritional breakdown. That's exactly what we're building — an AI nutritionist app powered by **Google Gemini Vision** and **Streamlit**.

Upload a food image, and the app returns: identified items, estimated calories per item, total calorie count, and a health assessment.

---

## What You'll Build

![App screenshot showing food image upload and AI nutritional analysis](https://miro.medium.com/v2/resize:fit:700/1*calories-advisor-demo.png)

A Streamlit web app that:
- Accepts JPG/PNG food images via drag-and-drop
- Sends the image to Gemini 2.5 Flash with a structured prompt
- Displays an itemised calorie breakdown
- Gives a health verdict on the meal

---

## Project Structure

\`\`\`
nutritionist_app/
├── venv/
├── app.py
├── requirements.txt
└── .env
\`\`\`

---

## Setup

### 1. Create virtual environment

\`\`\`bash
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\\Scripts\\activate           # Windows
\`\`\`

### 2. Install dependencies

\`\`\`bash
pip install streamlit google-generativeai python-dotenv
\`\`\`

\`\`\`text
# requirements.txt
streamlit
google-generativeai
python-dotenv
\`\`\`

### 3. Get your Gemini API key

Go to [aistudio.google.com](https://aistudio.google.com) → Get API key → Create API key.

\`\`\`env
# .env
GOOGLE_API_KEY=your_api_key_here
\`\`\`

---

## The App

\`\`\`python
# app.py
import streamlit as st
import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


def get_gemini_response(image_data: list, prompt: str) -> str:
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content([prompt, image_data[0]])
    return response.text


def prepare_image(uploaded_file) -> list:
    if uploaded_file is None:
        raise FileNotFoundError("No file uploaded")
    return [
        {
            "mime_type": uploaded_file.type,
            "data": uploaded_file.getvalue(),
        }
    ]


PROMPT = """
You are an expert nutritionist. Analyse the food items in the image and provide:

1. A list of every food item visible
2. Estimated calories for each item in this format:
   - Item name — X calories
3. Total estimated calories
4. A brief health assessment (is this a balanced meal?)

Be specific and practical. If you can't identify something clearly, give a reasonable estimate.
"""

# ── UI ──────────────────────────────────────────────────────────────────────

st.set_page_config(page_title="AI Calories Advisor", page_icon="🥗")
st.title("🥗 AI Calories Advisor")
st.write("Upload a photo of your meal and get an instant nutritional breakdown.")

uploaded_file = st.file_uploader(
    "Choose a food image",
    type=["jpg", "jpeg", "png"]
)

if uploaded_file:
    image = Image.open(uploaded_file)
    st.image(image, caption="Your meal", use_container_width=True)

if st.button("Analyse Calories", type="primary"):
    if uploaded_file is None:
        st.warning("Please upload an image first.")
    else:
        with st.spinner("Analysing your meal..."):
            image_data = prepare_image(uploaded_file)
            response = get_gemini_response(image_data, PROMPT)

        st.subheader("📊 Nutritional Analysis")
        st.markdown(response)
\`\`\`

---

## Run It

\`\`\`bash
streamlit run app.py
\`\`\`

Open [http://localhost:8501](http://localhost:8501), upload a food photo, and click **Analyse Calories**.

---

## Example Output

Upload a photo of a burger and fries, and you'll get something like:

\`\`\`
Food Items Identified:
- Beef burger (with bun) — 550 calories
- Cheddar cheese slice — 80 calories
- Lettuce & tomato — 15 calories
- French fries (medium) — 365 calories
- Ketchup (2 tbsp) — 30 calories

Total Estimated Calories: ~1,040 calories

Health Assessment:
This is a high-calorie meal with significant saturated fat from
the cheese and beef. It's low in fibre and micronutrients.
Consider swapping fries for a side salad to improve the
nutritional balance.
\`\`\`

---

## Prompt Engineering Tips

The quality of your prompt directly determines the quality of the output. A few principles:

**Be specific about format:**
\`\`\`python
# ❌ Vague
"Tell me about the calories in this food"

# ✅ Structured
"List each food item with calories in the format: - Item — X cal"
\`\`\`

**Set the persona:**
\`\`\`python
"You are an expert nutritionist with 20 years of clinical experience..."
\`\`\`

**Request reasoning:**
\`\`\`python
"...and explain your reasoning for the calorie estimates"
\`\`\`

---

## Enhancements to Try

- **Macro breakdown** — protein, carbs, fat per item
- **Meal history** — store analyses in a database
- **Charts** — visualise calories with \`st.bar_chart\`
- **Camera input** — use \`st.camera_input\` for live capture
- **Export** — download the analysis as a PDF

This project is a great portfolio piece showing that you can integrate AI APIs into real user-facing products — which is exactly the kind of skill companies are hiring for right now.`
  },
  {
    title: 'Slack-Based Google Meet Integration System',
    slug: 'slack-based-google-meet-integration-system',
    excerpt: 'Build a Slack bot that generates Google Meet links via a /meeting slash command — users get an instant meeting link without leaving Slack, powered by Python, Flask, and the Google Calendar API.',
    tags: ['python', 'slackbot', 'google-meet', 'flask', 'automation'],
    status: 'published',
    publishedAt: new Date('2026-04-16'),
    content: `# Slack-Based Google Meet Integration System

Tired of alt-tabbing out of Slack to create a Google Meet? This integration lets your team type \`/meeting\` in any Slack channel and instantly get a meeting link — without ever leaving the app.

---

## How It Works

\`\`\`
User types /meeting in Slack
       ↓
Slack sends POST request to Flask endpoint
       ↓
Flask calls Google Calendar API
       ↓
Calendar creates event with Meet conference
       ↓
Meet link returned to Slack channel
\`\`\`

---

## Prerequisites

- Python 3.8+
- A Slack workspace (admin access)
- A Google Cloud project with Calendar API enabled
- [ngrok](https://ngrok.com) for local tunnelling during development

---

## Setup

### 1. Install dependencies

\`\`\`bash
pip install flask slack-sdk google-auth google-auth-oauthlib google-api-python-client python-dotenv
\`\`\`

### 2. Environment variables

\`\`\`env
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_BOT_TOKEN=xoxb-your-bot-token
GOOGLE_CREDENTIALS_FILE=credentials.json
\`\`\`

---

## Google Calendar API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **Google Calendar API**
3. Create OAuth 2.0 credentials → Download \`credentials.json\`
4. Add your Google account as a test user in the OAuth consent screen

\`\`\`python
# auth.py
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os, pickle

SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_credentials():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES
            )
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return creds
\`\`\`

---

## Meet Link Generator

\`\`\`python
# meet.py
from googleapiclient.discovery import build
from datetime import datetime, timedelta, timezone
import uuid
from auth import get_credentials


def create_meet_link(title: str = "Quick Meeting") -> str:
    creds = get_credentials()
    service = build('calendar', 'v3', credentials=creds)

    now = datetime.now(timezone.utc)
    event = {
        'summary': title,
        'start': {
            'dateTime': now.isoformat(),
            'timeZone': 'UTC',
        },
        'end': {
            'dateTime': (now + timedelta(hours=1)).isoformat(),
            'timeZone': 'UTC',
        },
        'conferenceData': {
            'createRequest': {
                'requestId': str(uuid.uuid4()),
                'conferenceSolutionKey': {'type': 'hangoutsMeet'},
            }
        },
    }

    result = service.events().insert(
        calendarId='primary',
        body=event,
        conferenceDataVersion=1,
    ).execute()

    return result['hangoutLink']
\`\`\`

---

## Flask Endpoint

\`\`\`python
# app.py
from flask import Flask, request, jsonify
from slack_sdk.signature import SignatureVerifier
from meet import create_meet_link
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
verifier = SignatureVerifier(os.environ['SLACK_SIGNING_SECRET'])


@app.route('/meeting', methods=['POST'])
def meeting():
    # Verify the request is genuinely from Slack
    if not verifier.is_valid_request(request.get_data(), request.headers):
        return jsonify({'error': 'Invalid request'}), 403

    user_name = request.form.get('user_name', 'Someone')
    channel = request.form.get('channel_name', 'your channel')

    try:
        meet_link = create_meet_link(f"Meeting from #{channel}")
        return jsonify({
            'response_type': 'in_channel',
            'text': f'🎥 *{user_name}* started a meeting:\\n{meet_link}',
        })
    except Exception as e:
        return jsonify({
            'response_type': 'ephemeral',
            'text': f'❌ Could not create meeting: {str(e)}',
        })


if __name__ == '__main__':
    app.run(debug=True, port=3000)
\`\`\`

---

## Slack App Configuration

### 1. Create the app

Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App → From Scratch.

### 2. Add a slash command

Navigate to **Slash Commands** → Create New Command:

| Field | Value |
|-------|-------|
| Command | \`/meeting\` |
| Request URL | \`https://your-ngrok-url.ngrok.io/meeting\` |
| Short Description | Create a Google Meet link |

### 3. Expose your local server with ngrok

\`\`\`bash
ngrok http 3000
\`\`\`

Copy the HTTPS URL → paste it into Slack's Request URL field.

### 4. Install the app to your workspace

**OAuth & Permissions** → Add scopes: \`commands\`, \`chat:write\` → Install to Workspace.

---

## Test It

Start your server:

\`\`\`bash
python app.py
\`\`\`

In any Slack channel, type:

\`\`\`
/meeting
\`\`\`

You'll see a response like:

\`\`\`
🎥 prakash started a meeting:
https://meet.google.com/abc-defg-hij
\`\`\`

---

## Challenges & Solutions

**ngrok URL resets on restart** — Use a paid ngrok plan for a static URL, or deploy to a server (Render, Railway free tier work well).

**OAuth token expiry** — The \`token.pickle\` approach handles refresh automatically. For production, store credentials in a database.

**Timezone issues** — Always use UTC internally and convert for display.

---

## Production Deployment

For production, replace ngrok with a real server:

\`\`\`bash
# Deploy to Railway
railway login
railway init
railway up
\`\`\`

Update the Slack slash command Request URL to your production domain.

---

## What's Next

- Add a meeting **title parameter**: \`/meeting Weekly Standup\`
- Send a **calendar invite** to participants mentioned in the command
- **Log meetings** to a Google Sheet for tracking
- Build a full **Slack bot** with multi-step conversations using Bolt for Python`
  },
]

async function main() {
  console.log('Seeding blog posts...')

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
    if (existing) {
      await prisma.blogPost.update({ where: { slug: post.slug }, data: post })
      console.log(`  Updated: ${post.title}`)
    } else {
      await prisma.blogPost.create({ data: post })
      console.log(`  Created: ${post.title}`)
    }
  }

  console.log(`\nDone! ${posts.length} posts seeded.`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
