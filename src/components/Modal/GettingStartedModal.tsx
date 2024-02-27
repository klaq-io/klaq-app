import { Dialog, Transition } from '@headlessui/react';
import {
  ArrowRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from 'components/Button';
import { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { handleClickHelp } from 'utils/clickOnCrisp';

type Props = {
  isOpen: boolean;
  firstName: string;
};

export const GettingStartedModal = (props: Props) => {
  const { isOpen, firstName } = props;
  const intl = useIntl();

  const [isModalOpen, setOpen] = useState<boolean>(isOpen);

  const loomLink =
    'https://www.loom.com/share/7abc9163a6db40e9be1905d3d7e09506?sid=de32b506-5bc0-4df5-9880-0874f7f6d37d';

  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={() => {
          return;
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="flex flex-col space-y-8">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    {intl.formatMessage(
                      {
                        id: `onboarding.complete.header`,
                      },
                      {
                        b: (chunks: any) => (
                          <span className="text-klaq-600">{chunks}</span>
                        ),
                        firstName,
                      },
                    )}
                  </Dialog.Title>

                  <div
                    style={{
                      position: 'relative',
                      paddingBottom: '55.833333333333336%',
                      height: 0,
                    }}
                  >
                    <iframe
                      src={`${loomLink}&hideEmbedTopBar=true`}
                      frameBorder="0"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    ></iframe>
                  </div>
                  <p className="text-sm leading-6 text-gray-500">
                    {intl.formatMessage({
                      id: `onboarding.complete.loom-description`,
                    })}
                  </p>
                  <div className="flex flex-row justify-between">
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={handleClickHelp}
                      leadingIcon={
                        <QuestionMarkCircleIcon className="w-5 h-5" />
                      }
                    >
                      {intl.formatMessage({
                        id: 'onboarding.complete.button.help',
                      })}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpen(false)}
                      trailingIcon={<ArrowRightIcon className="w-5 h-5" />}
                    >
                      {intl.formatMessage({
                        id: 'onboarding.complete.button.go',
                      })}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
