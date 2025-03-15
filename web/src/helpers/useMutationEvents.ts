import { useEffect } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

interface MutationCallbacks<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export function useMutationEvents<TData, TError, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  callbacks: MutationCallbacks<TData, TError>
): UseMutationResult<TData, TError, TVariables> {
  const { onSuccess, onError } = callbacks;

  useEffect(() => {
    if (mutation.isSuccess && mutation.data && onSuccess) {
      onSuccess(mutation.data);
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isError && mutation.error && onError) {
      onError(mutation.error);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
}
