import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: '',
    timeout: 5000
  })

  instance.interceptors.request.use(config => {
    return config
  },err => {
    console.log(err);
  })
  instance.interceptors.response.use(res => {
    return res.data
  },error => {
    console.log(error);
  })

  return instance(config)
}
