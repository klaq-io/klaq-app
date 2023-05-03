import {
  HiOutlineBell,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const intl = useIntl();
  const location = useLocation();
  const path = location.pathname.slice(1);
  const actualPageName = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1 px-2 mx-2 lg:flex">
        <span className="text-lg font-bold"> {actualPageName}</span>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder={intl.formatMessage({
              id: `navbar.searchbar`,
            })}
            className="input input-bordered"
          />
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost text-xl">
            <div className="indicator">
              <HiOutlineBell />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://i.ibb.co/drBHxQw/B87-AE7-AD-84-D0-45-D4-923-F-DE49-DCE41534.jpg" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                {intl.formatMessage({
                  id: `navbar.profile`,
                })}
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>
                {intl.formatMessage({
                  id: `navbar.settings`,
                })}
              </a>
            </li>
            <li>
              <a>
                {intl.formatMessage({
                  id: `navbar.logout`,
                })}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
