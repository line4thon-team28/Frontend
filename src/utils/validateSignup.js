const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MAX_BYTES = 72

export const SIGNUP_MESSAGES = {
  email: {
    empty: '이메일을 입력해주세요',
    format: '이메일 형식을 확인해주세요',
    tooLong: '이메일은 100자 이하로 입력해주세요',
    duplicated: '이미 가입된 이메일이에요',
  },
  password: {
    empty: '비밀번호를 입력해주세요',
    length: '비밀번호는 8~64자로 입력해주세요',
    tooManyBytes: '비밀번호가 너무 길어요. 조금 더 짧게 입력해주세요',
  },
  nickname: {
    empty: '닉네임을 입력해주세요',
    length: '닉네임은 2~10자로 입력해주세요',
  },
}

export function isPasswordLengthValid(password) {
  return password.length >= 8 && password.length <= 64
}

function validateEmail(email) {
  if (!email) return SIGNUP_MESSAGES.email.empty
  if (email.length > 100) return SIGNUP_MESSAGES.email.tooLong
  if (!EMAIL_PATTERN.test(email)) return SIGNUP_MESSAGES.email.format
  return ''
}

function validatePassword(password) {
  if (!password) return SIGNUP_MESSAGES.password.empty
  if (!isPasswordLengthValid(password)) return SIGNUP_MESSAGES.password.length
  if (new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES) return SIGNUP_MESSAGES.password.tooManyBytes
  return ''
}

function validateNickname(nickname) {
  if (!nickname) return SIGNUP_MESSAGES.nickname.empty
  if (nickname.length < 2 || nickname.length > 10) return SIGNUP_MESSAGES.nickname.length
  return ''
}

export function validateSignup({ email, password, nickname }) {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
    nickname: validateNickname(nickname),
  }
}

export function findFieldOfMessage(message) {
  return Object.keys(SIGNUP_MESSAGES).find((field) => Object.values(SIGNUP_MESSAGES[field]).includes(message))
}
