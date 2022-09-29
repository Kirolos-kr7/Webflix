import axios, { type AxiosResponse } from 'axios'
import type { RequestMethod } from '../types'

interface UseAxios {
  method?: RequestMethod
  url: string
  body?: any
}

const useAxios = async ({ method = 'get', url = '', body = {} }: UseAxios) => {
  let data = null,
    error: any = null

  try {
    const response: AxiosResponse = await axios({
      method,
      baseURL: 'https://api.themoviedb.org/3/',
      url,
      data: body,
      params: { api_key: '18cfdbd5b22952a0c5c289fbbf02c827' }
    })

    data = response.data
  } catch (err: any) {
    error = err
    console.log(err)
  }

  return { data, error }
}

export default useAxios
