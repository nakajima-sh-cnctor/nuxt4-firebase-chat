# nuxt3-firebase-chat

A Nuxt 3 project with Firebase authentication and Realtime Database for LINE-like chat functionality.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

## Firebase設定

1. Firebaseプロジェクトを作成し、Webアプリを追加
2. 環境変数を設定：

```bash
# .envファイルを作成
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-app-id
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
```

3. Firebaseコンソールで以下を設定：
   - Authenticationを有効化し、メール/パスワード認証を設定
   - Realtime Databaseを作成し、セキュリティルールを設定
   - Firestore Databaseを作成（スレッド管理用）

4. Realtime Databaseのセキュリティルールを設定：
   - Firebaseコンソールの「Realtime Database」→「ルール」タブ
   - `database.rules.json`の内容をコピー&ペースト

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```

## Features

- Firebase Authentication
- Email/Password login and signup
- Real-time auth state management
- LINE-like chat interface
- Real-time messaging with Firebase Realtime Database
- Thread-based chat rooms
- User profiles with avatars
- Responsive UI with Vuetify

## Project Structure

```
├── app/
│   ├── app.vue                    # Main application component
│   ├── components/
│   │   ├── AuthForm.vue          # Authentication form component
│   │   ├── AuthLoading.vue       # Authentication loading component
│   │   ├── PasswordChangeForm.vue # Password change form component
│   │   └── ProfileForm.vue       # Profile form component
│   ├── composables/
│   │   ├── useAuth.ts            # Authentication composable
│   │   ├── useDateFormat.ts      # Date formatting composable
│   │   └── useProfile.ts         # Profile management composable
│   ├── middleware/               # Route middleware
│   ├── pages/
│   │   ├── home/
│   │   │   ├── change-password.vue # Password change page
│   │   │   ├── create-profile.vue  # Profile creation page
│   │   │   ├── edit-profile.vue    # Profile editing page
│   │   │   └── index.vue         # Home page
│   │   ├── home.vue              # Home layout
│   │   ├── login.vue             # Login page
│   │   ├── signup.vue            # Signup page
│   │   └── thread/
│   │       ├── [id].vue          # Chat room page
│   │       ├── create.vue        # Create thread page
│   │       └── index.vue         # Thread list page
│   ├── stores/
│   │   ├── auth.ts               # Authentication store
│   │   ├── message.ts            # Message store (Realtime Database)
│   │   ├── profile.ts            # Profile store
│   │   └── thread.ts             # Thread store (Firestore)
│   └── store/                    # Legacy state management
├── plugins/
│   └── firebase.client.ts        # Firebase initialization
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── database.rules.json           # Firebase Realtime Database rules
├── eslint.config.js              # ESLint configuration
├── nuxt.config.ts                # Nuxt configuration
├── package.json
├── tsconfig.json                 # TypeScript configuration
└── README.md
```

## Usage

The application provides a LINE-like chat interface where users can:

- Sign up with email and password
- Log in with existing credentials
- Create and manage user profiles
- Create chat threads (rooms)
- Send and receive real-time messages
- View message history
- Log out from their account

### Chat Features

- **Real-time messaging**: Messages appear instantly using Firebase Realtime Database
- **Thread-based chat**: Create separate chat rooms for different topics
- **User profiles**: Set nicknames and avatars
- **Message history**: All messages are stored and displayed chronologically
- **Responsive design**: Works on desktop and mobile devices

The authentication state and chat data are automatically managed and persisted across page reloads.
