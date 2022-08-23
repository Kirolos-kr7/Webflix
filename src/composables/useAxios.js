import axios from 'axios'

const useAxios = async ({ method = 'get', url, body = null }) => {
  let data = null,
    error = null

  try {
    let response = await axios({
      method,
      baseURL: 'https://api.themoviedb.org/3/',
      url,
      data: body,
      params: { api_key: '18cfdbd5b22952a0c5c289fbbf02c827' }
    })

    data = response.data
  } catch (err) {
    error = err
    console.log(err)
  }

  return { data, error }
}

export default useAxios
