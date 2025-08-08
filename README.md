# nuxt3-firebase-chat

A Nuxt 3 project with Firebase authentication.

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
```

3. FirebaseコンソールでAuthenticationを有効化し、メール/パスワード認証を設定

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
- Responsive UI

## Project Structure

```
├── app/
│   └── app.vue          # Main application component
├── composables/
│   └── useAuth.ts       # Authentication composable
├── plugins/
│   └── firebase.client.ts # Firebase initialization
├── nuxt.config.ts       # Nuxt configuration
└── package.json
```

## Usage

The application provides a simple authentication interface where users can:

- Sign up with email and password
- Log in with existing credentials
- Log out from their account

The authentication state is automatically managed and persisted across page reloads.
