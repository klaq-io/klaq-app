import { useIntl } from "react-intl";
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineCurrencyEuro,
  HiOutlineShoppingBag,
  HiOutlinePresentationChartLine,
  HiOutlineChartPie,
} from "react-icons/hi";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

type Props = {
  classes?: string;
};

export const Sidebar = (props: Props) => {
  const intl = useIntl();
  console.log(
    intl.formatMessage({
      id: "sidebar.dashboard",
    })
  );

  return (
    <div className="drawer drawer-mobile bg-primary">
      <div className="drawer-side">
        <div className="m-3 flex-1 text-center py-2">
          <span className="text-xl text-base-100 font-bold ">⚡ Klaq.io</span>
        </div>
        <ul className="menu w-56 p-2 text-base-100 ">
          <li className="bg-base-100 rounded-2xl text-primary">
            <a>
              <HiOutlineHome />
              {intl.formatMessage({
                id: `sidebar.dashboard`,
              })}
            </a>
          </li>
          <li>
            <a>
              <HiOutlineCalendar />
              {intl.formatMessage({
                id: `sidebar.calendar`,
              })}
            </a>
          </li>
          <li>
            <a>
              <HiOutlineBriefcase />
              {intl.formatMessage({
                id: `sidebar.events`,
              })}
            </a>
          </li>
          <li>
            <a>
              <HiOutlineUsers />
              {intl.formatMessage({
                id: `sidebar.customers`,
              })}
            </a>
          </li>
          <li>
            <a>
              <HiOutlineCurrencyEuro />
              {intl.formatMessage({
                id: `sidebar.billing`,
              })}
            </a>
          </li>
          <li>
            <a>
              <HiOutlineShoppingBag />{" "}
              {intl.formatMessage({
                id: `sidebar.products`,
              })}
            </a>
          </li>
          <li>
            <a>
              <HiOutlinePresentationChartLine />{" "}
              {intl.formatMessage({
                id: `sidebar.marketing`,
              })}
            </a>
          </li>
          <li>
            <a>
              <HiOutlineChartPie />{" "}
              {intl.formatMessage({
                id: `sidebar.analytics`,
              })}
            </a>
          </li>
          <li>
            <a>
              <HiOutlineQuestionMarkCircle />{" "}
              {intl.formatMessage({
                id: `sidebar.help`,
              })}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
