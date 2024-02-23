import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useImpersonate } from 'redux/Login/hooks';

export const ImpersonatePage = () => {
  const [, impersonate] = useImpersonate();
  const { id } = useParams();

  useEffect(() => {
    impersonate(id);
  }, []);

  return <></>;
};
