export class paged_results<T> {
  total_results: number;
  total_pages:number;
  page:number;
  results: [T]
}
