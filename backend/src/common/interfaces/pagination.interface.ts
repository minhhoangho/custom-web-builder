export interface IPaginationEntity<E> {
  data: E[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
