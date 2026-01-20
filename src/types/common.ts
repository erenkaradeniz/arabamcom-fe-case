export interface ApiValidationError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}
export enum PaginationMode {
  Scroll = 'scroll',
  Pagination = 'pagination',
}

export enum ViewMode {
  Grid = 'grid',
  List = 'list',
  Table = 'table',
}
