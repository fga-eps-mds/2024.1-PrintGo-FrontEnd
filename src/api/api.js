import { api } from "../lib/api/config";

export async function login(email, password) {
  const data = {
    email: email,
    senha: password,
  };

  try {
    // const response = await api.post('/user/login', data);
    let token_mock = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsIm5vbWUiOiJEYW5pZWwiLCJjYXJnb3MiOiJhZG1pbiJ9.tMm8nEv6qtGnL4XJIFRQJcgw6qafUUDpxgR8LUHXX08"
    return {type: 'success', token: token_mock };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return {type: 'error', error}; 
  }
}

export async function changePassword(data) {
  const token = localStorage.getItem('jwt')

  const headers = {
    'Authorization': token
  }

  try {
      const response = await api.post('/user/change-password', data, {headers});
      return response;
  } catch(error) {
    return {type: 'error', error}; 
  }
}