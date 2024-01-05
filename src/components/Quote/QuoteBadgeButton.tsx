import { Menu, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { FC, Fragment } from "react";
import { useUpdateQuoteStatus } from "redux/Quote/hooks";
import { classNames } from "utils/utils";
import { QuoteBadge } from "./QuoteBadge";
import { Quote, QuoteStatus } from "interface/Quote/quote.interface";

type QuoteBadgeButtonProps = {
  quote: Quote;
};

export const QuoteBadgeButton: FC<QuoteBadgeButtonProps> = (
  props: QuoteBadgeButtonProps
) => {
  const { quote } = props;

  const [, updateQuoteStatus] = useUpdateQuoteStatus();

  const handleUpdateQuoteBadge = async (quote: Quote, status: QuoteStatus) => {
    await updateQuoteStatus(quote, status);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 bg-white px-3 py-2 text-sm font-semibold text-gray-900">
          <QuoteBadge status={quote.status} />
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="text-center overflow-scroll absolute z-40 mt-2 w-80 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {(
                Object.keys(QuoteStatus) as Array<keyof typeof QuoteStatus>
              ).map((key) => {
                const status = QuoteStatus[key];
                return (
                  <Menu.Item key={status}>
                    {({ active }) => (
                      <span
                        onClick={() => handleUpdateQuoteBadge(quote, status)}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        <QuoteBadge status={status} />
                      </span>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};
