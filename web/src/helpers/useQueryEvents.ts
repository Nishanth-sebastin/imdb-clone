import { useEffect } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
interface Callbacks<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}
export function useQueryEvents<TData, TError>(
  query: UseQueryResult<TData, TError>,
  callbacks: Callbacks<TData, TError>
): UseQueryResult<TData, TError> {
  const { onSuccess, onError } = callbacks;
  useEffect(() => {
    if (query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.data]);
  useEffect(() => {
    if (query.error && onError) {
      onError(query.error);
    }
  }, [query.error]);
  return query;
}
