import { AxiosResponse } from 'axios'

export interface RespStr {
  code: number,
  data: string,
  message: string
}

export interface RespObj<T> {
  code: number,
  data: T,
  message: string
}

export interface RespList<T> {
  code: number,
  data: T[],
  message: string
}

export interface RespPage<T> {
  code: number,
  data: {
    records: T[],
    current: number,
    size: number,
    total: number,
    pages: number
  },
  message: string
}

export interface RespError {
  timestamp: string,
  status: number,
  error: string,
  path: string
}

export interface AxiosRespStr extends AxiosResponse<RespStr> {}

export interface AxiosRespObj<T> extends AxiosResponse<RespObj<T>> {}

export interface AxiosRespList<T> extends AxiosResponse<RespList<T>> {}

export interface AxiosRespPage<T> extends AxiosResponse<RespPage<T>> {}

export interface AxiosRespError extends AxiosResponse<RespError> {}
