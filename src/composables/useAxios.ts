import axios, { type AxiosResponse } from 'axios'
import type { RequestMethod } from '../types'

interface UseAxios {
  method?: RequestMethod
  url: string
  body?: any
}

type UAReturn = Promise<{
  data: any
  error: any
}>

// eslint-disable-next-line no-unused-vars
function useAxios(url: string): UAReturn
// eslint-disable-next-line no-unused-vars
function useAxios({ method, url, body }: UseAxios): UAReturn

async function useAxios(arg1: unknown) {
  let data = null,
    error: any = null,
    method = 'get',
    url = '',
    body = null

  if (typeof arg1 === 'string') {
    url = arg1
  } else {
    const { url: x, method: y, body: z } = arg1 as UseAxios
    url = x
    method = y ? y : method
    body = z
  }

  if (!url) throw new Error('Url is missing.\n Please enter a url.')

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
