import { useSelector } from 'react-redux';
import { useStopImpersonate } from 'redux/Login/hooks';
import { getUser } from 'redux/Login/selectors';

export const Impersonate = () => {
  const isImpersonating = localStorage.getItem('impersonate') === 'true';
  const [, stopImpersonate] = useStopImpersonate();

  const user = useSelector(getUser);

  return (
    <div
      className={`${
        isImpersonating ? 'block' : 'hidden'
      } fixed top-0 left-0 w-full bg-yellow-500 text-white py-2 px-4 z-50 flex justify-between items-center`}
    >
      <p>[ADMIN] - You are connected as {user.email}</p>
      <button onClick={stopImpersonate}>Disconnect</button>
    </div>
  );
};
