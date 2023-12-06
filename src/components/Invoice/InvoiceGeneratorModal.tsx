import { Dialog, Transition } from "@headlessui/react";
import { PDFViewer } from "@react-pdf/renderer";
import { Fragment, useState } from "react";
import { InvoiceRenderer } from "./InvoiceRenderer";
import { useFormik } from "formik";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<any>;
};

export const InvoiceGeneratorModal = (props: Props) => {
  const { open, setOpen } = props;
  const [items, setItems] = useState<
    { quantity: number; price: number; description: string }[]
  >([]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        quantity: 1,
        price: 3,
        description: "test",
      },
    ]);
  };

  //   const formik = useFormik({
  //     initialValues,

  //   });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen ">
                  <div className="z-40 flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl space-y-4">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          HELLO
                        </Dialog.Title>
                        <button onClick={handleAddItem}>Add item</button>
                      </div>
                    </div>
                    <div className="relative flex flex-row px-4 sm:px-6 space-x-4">
                      <div className="flex w-1/2 h-full">
                        <PDFViewer width="100%" height="100%">
                          <InvoiceRenderer items={items} />
                        </PDFViewer>
                      </div>
                      <div className="flex">yo</div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
