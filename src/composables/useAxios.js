import axios from 'axios'

const useAxios = async ({ method = 'get', url, body = null }) => {
  let { data } = await axios({
    method,
    baseURL: 'https://api.themoviedb.org/3/',
    url,
    data: body,
    validateStatus: function (status) {
      return status < 500
    }
  })

  return { data }
}

export default useAxios
