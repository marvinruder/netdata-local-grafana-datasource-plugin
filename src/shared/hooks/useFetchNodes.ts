import React from 'react';
import { Get } from 'shared/utils/request';

type Node = {
  nd: string;
  mg: string;
  nm: string;
  [key: string]: any;
};

const transformNodes = (nodes: Node[] = []) =>
  nodes.map(({ nd, mg, nm, ...rest }) => ({ id: nd || mg, name: nm, ...rest }));

export const getNodes = async (baseUrl: string) => {
  const response = await Get({
    path: `/v3/nodes`,
    baseUrl,
  });

  return response?.data?.nodes;
};

export const useFetchNodes = (baseUrl: string) => {
  const [isError, setIsError] = React.useState(false);
  const [nodes, setNodes] = React.useState([]);

  const fetchNodes = React.useCallback(
    async () => {
      setIsError(false);

      try {
        const result = await getNodes(baseUrl);
        setNodes(result);
      } catch (error) {
        setIsError(true);
      }
    },
    [baseUrl]
  );

  return {
    isError,
    nodes: transformNodes(nodes),
    fetchNodes,
  };
};
