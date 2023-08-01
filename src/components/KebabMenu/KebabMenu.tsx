import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { FC, Fragment } from "react";
import { classNames } from "../../utils/utils";
import { useIntl } from "react-intl";

interface Item {
  name: string;
  onClick: () => void;
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

type Props = {
  items: Item[];
  buttonSize?: "sm" | "md" | "lg";
};

export const KebabMenu: FC<Props> = (props: Props) => {
  const { items, buttonSize } = props;
  const intl = useIntl();

  return (
    <Menu as="div" className="relative ml-3 inline-block text-left">
      <div>
        <Menu.Button className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-klaq-500">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon
            className={
              buttonSize === "sm"
                ? "h-5 w-5"
                : buttonSize === "md"
                ? "h-6 w-6"
                : buttonSize === "lg"
                ? "h-7 w-7"
                : "h-5 w-5"
            }
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items.map((item) => (
              <Menu.Item>
                {({ active }) => (
                  <span
                    onClick={item.onClick}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "group flex items-center px-4 py-2 text-sm hover:cursor-pointer"
                    )}
                  >
                    {item.icon && (
                      <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    )}
                    <span>{intl.formatMessage({ id: item.name })}</span>
                  </span>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
