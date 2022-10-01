export type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'

export interface Toast {
  id: number
  msg: string | number
  redirect: string
  status: boolean
}

export interface ListItem {
  title: string
  path: string
}

export interface ShowMode {
  title: string
  mode: string
}

export interface BaseShow {
  id: number
  poster_path: string | null
  backdrop_path: string | null
  popularity: number
  overview: string
  genre_ids: number[]
  vote_count: number
  vote_average: number
  original_language: string
}

export interface Movie extends BaseShow {
  title: string
  original_title: string
  adult: boolean
  release_date: Date
  video: boolean
}

export interface Tv extends BaseShow {
  name: string
  original_name: string
  origin_country: Country[]
  first_air_date: Date
}

export interface MovieDetails extends Movie {
  belongs_to_collection: null | Collection
  budget: number
  genres: Genre[]
  homepage: string | null
  imdb_id: string | null
  production_companies: Company[]
  production_countries: Country[]
  revenue: number
  runtime: number | null
  spoken_languages: Language[]
  status: string
  tagline: string | null
}

export interface TvShowDetails extends Tv {
  created_by: CastMember[]
  episode_run_time: number[]
  genres: Genre[]
  homepage: string
  in_production: boolean
  languages: Language[]
  last_air_date: string
  last_episode_to_air: Episode | null
  next_episode_to_air: Episode | null
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  production_companies: Company[]
  production_countries: Country[]
  seasons: Season[]
  spoken_languages: Language[]
  status: string
  tagline: string
  type: string
}

export type ShowDetails = MovieDetails & TvShowDetails

export interface Person {
  id: number
  name: string
  gender: 0 | 1 | 2 | 3
  birthday: string | null
  known_for_department: string
  deathday: null | string
  also_known_as: string[]
  biography: string
  popularity: number
  place_of_birth: string | null
  profile_path: string | null
  adult: boolean
  imdb_id: string
  homepage: null | string
}

export interface CastMember extends Person {
  credit_id: string
  original_name: string
  character: string
  known_for: Array<Movie | Tv>
  order: number
}

export interface Trailer {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

export interface Show extends Movie, Tv, Person {
  media_type: string
}

export interface Season {
  id: number
  episode_count: number
  poster_path: string | null
  season_number: number
  air_date: Date
  name: string
  overview: string
  episodes: Episode[]
}

export interface Genre {
  id: number
  name: string
}

export interface Country {
  iso_3166_1: string
  name: string
}

export interface Company {
  name: string
  id: number
  logo_path: string | null
  origin_country: string
}

export interface Network {
  name: string
  id: number
  logo_path: string | null
  origin_country: string
}

export interface Season {
  id: number
  episode_count: number
  poster_path: string | null
  season_number: number
  air_date: Date
}

export interface Language {
  iso_639_1: string
  name: string
  english_name: string
}

export interface Episode {
  air_date: string
  episode_number: number
  id: number
  name: string
  overview: string
  production_code: string
  season_number: number
  still_path: string | null
  vote_average: number
  vote_count: number
}

export interface Episode {
  air_date: string
  episode_number: number
  id: number
  name: string
  overview: string
  production_code: string
  season_number: number
  still_path: string | null
  vote_average: number
  vote_count: number
}

export interface Collection {
  backdrop_path: string
  id: number
  name: string
  poster_path: string
  parts: Show[]
}
