<template>
  <div class="container">
    <h1>Firebase認証テスト</h1>
    
    <div v-if="loading" class="loading">
      読み込み中...
    </div>
    
    <div v-else-if="user" class="authenticated">
      <h2>ようこそ、{{ user.email }}さん！</h2>
      <button class="btn btn-danger" @click="handleLogout">ログアウト</button>
    </div>
    
    <div v-else class="auth-form">
      <h2>ログイン / サインアップ</h2>
      
      <form class="form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            required 
            class="input"
          >
        </div>
        
        <div class="form-group">
          <label for="password">パスワード</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            class="input"
          >
        </div>
        
        <div class="buttons">
          <button type="submit" class="btn btn-primary">ログイン</button>
          <button type="button" class="btn btn-secondary" @click="handleSignup">サインアップ</button>
        </div>
      </form>
      
      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

const { user, loading, login, signup, logout } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  const result = await login(email.value, password.value)
  
  if (result.error) {
    error.value = result.error.message
  } else {
    email.value = ''
    password.value = ''
  }
}

const handleSignup = async () => {
  error.value = ''
  const result = await signup(email.value, password.value)
  
  if (result.error) {
    error.value = result.error.message
  } else {
    email.value = ''
    password.value = ''
  }
}

const handleLogout = async () => {
  error.value = ''
  const result = await logout()
  
  if (result.error) {
    error.value = result.error.message
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

.authenticated {
  text-align: center;
}

.auth-form {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>
