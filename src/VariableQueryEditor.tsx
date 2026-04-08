import React from 'react';

interface VariableQueryProps {
  query: {};
  onChange: (query: {}, definition: string) => void;
}

export const VariableQueryEditor = ({ onChange }: VariableQueryProps) => {
  React.useEffect(() => onChange({}, ""), []);

  return <>All Nodes</>;
};