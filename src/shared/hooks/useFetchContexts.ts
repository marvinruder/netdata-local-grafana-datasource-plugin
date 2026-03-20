import { Dropdown } from './../types/dropdown.interface';
import React from 'react';
import { Get } from 'shared/utils/request';

export const getContexts = async (baseUrl: string) => {
  const response = await Get({
    path: `/v3/contexts`,
    baseUrl,
    params: {
      scope_contexts: ['*'],
    },
  });
  const { contexts = {} } = response?.data || {};
  return Object.keys(contexts) as string[];
};

export const useFetchContexts = (baseUrl: string) => {
  const [isError, setIsError] = React.useState(false);
  const [contexts, setContexts] = React.useState<Dropdown[]>([]);

  const fetchContexts = React.useCallback(
    async () => {
      setIsError(false);

      try {
        const result = await getContexts(baseUrl);
        setContexts(result.map((c) => ({ label: c, value: c })));
      } catch (error) {
        setIsError(true);
      }
    },
    [baseUrl]
  );

  return { isError, contexts, fetchContexts };
};
