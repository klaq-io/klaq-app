import { Dialog, Transition } from '@headlessui/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Button, TextField } from 'components';
import { useFormik } from 'formik';
import { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useSendMail } from 'redux/Email/hooks';
import { getUser } from 'redux/Login/selectors';
import { initialValues } from './form';

type MailContentProps = {
  to?: string;
  subject?: string;
  message?: string;
  cc?: boolean;
};

type MailPopUpProps = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  content?: MailContentProps;
  actionAfter?: () => void;
};

export const MailPopUp = (props: MailPopUpProps) => {
  const { isOpen, setOpen, content, actionAfter } = props;

  const [{ isLoading }, sendMail] = useSendMail();
  const user = useSelector(getUser);

  const replaceKnownVariables = (text: string) => {
    return text.replaceAll('{{stageName}}', user.stageName);
  };

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...content,
      message: replaceKnownVariables(content?.message || ''),
    },
    onSubmit: async (values) => {
      await sendMail(values);
      setOpen(false);
      if (actionAfter) {
        actionAfter();
      }
    },
    enableReinitialize: true,
  });

  const intl = useIntl();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-999 w-screen overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="flex flex-col space-y-4 px-4 py-5 sm:p-6 w-full h-full">
                  <TextField
                    label={intl.formatMessage({
                      id: 'quote.send.label.to',
                    })}
                    name="to"
                    value={formik.values.to}
                    type="email"
                    onChange={formik.handleChange}
                  />
                  <TextField
                    label={intl.formatMessage({
                      id: 'quote.send.label.object',
                    })}
                    name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                  />
                  <>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: 'quote.send.label.message',
                      })}
                    </label>
                    <div className="mt-2">
                      <textarea
                        rows={10}
                        name="message"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="cc"
                        name="cc"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-klaq-600 focus:ring-klaq-600"
                        checked={formik.values.cc}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label className="font-medium text-gray-900">
                        {intl.formatMessage(
                          {
                            id: 'quote.send.label.cc',
                          },
                          {
                            email: user.email,
                          },
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse space-x-4 pt-4">
                    <Button
                      leadingIcon={<PaperAirplaneIcon className="w-5 h-5" />}
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={formik.submitForm}
                      isLoading={isLoading}
                    >
                      {intl.formatMessage({
                        id: 'email.button.send',
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
