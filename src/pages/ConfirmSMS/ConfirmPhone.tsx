import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { OnboardingLayout } from "../../layouts/OnboardingLayout/OnboardingLayout";
import { useFetchUser } from "../../redux/Login/hooks";
import { getUser } from "../../redux/Login/selectors";
import {
  useInitiateSMSVerification,
  useVerifySMS,
} from "../../redux/SMS/hooks";

const OTP_LENGTH = 6;

export const ConfirmPhone = () => {
  const intl = useIntl();
  const [, fetchUser] = useFetchUser();
  const [, initiateSMSVerification] = useInitiateSMSVerification();
  const user = useSelector(getUser);
  const [otp, setOtp] = useState("");

  const [, verifySMS] = useVerifySMS();

  useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      verifySMS(otp);
    }
  }, [otp]);

  useEffect(() => {
    const initSms = async () => {
      if (!user.phone) {
        // await initiateSMSVerification();
      }
    };
    initSms();
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1491198246568-ea47742734b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: "confirm-sms.header",
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage(
            {
              id: "confirm-sms.description",
            },
            {
              b: (chunks: any) => <b>{chunks}</b>,
              phone: `+${user.phone}`,
            }
          )}
        </p>
      </div>
      <div className="flex flex-col space-y-16 mt-10">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={OTP_LENGTH}
          renderInput={(props: any) => (
            <input
              {...props}
              className="items-center justify-center text-center w-full h-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-lg sm:leading-6"
            />
          )}
          containerStyle="w-16 h-16 flex flex-row items-center justify-between w-full max-w-xs space-x-2 mx-auto"
        />
      </div>
    </OnboardingLayout>
  );
};

export default ConfirmPhone;
