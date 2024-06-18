export interface Product {
  id: number,
  name: string,
  price: number,
  description: string
};

export type ProductList = {
  id: number,
  name: string, 
  price: number
}[];

export type FetchResult<T> =
  {
    result: "ok",
    value: T
  } | {
    result: "loading",
  } | {
    result: "error",
    message: string
  }