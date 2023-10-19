import { Spinner } from "components";
import Klaq from "../../assets/Klaq-2.png";

type Props = {
  children: any;
  backgroundImg?: string;
  isLoading?: boolean;
};

export const OnboardingLayout = (props: Props) => {
  const { children, backgroundImg = Klaq, isLoading } = props;
  return (
    <div className="flex h-screen flex-1 bg-white">
      <div className="flex w-2/3 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 overflow-scroll">
        {isLoading ? (
          <div className="flex h-screen">
            <div className="m-auto">
              <Spinner size="medium" color="primary" />
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-sm lg:w-96">{children}</div>
        )}
      </div>
      <div className="relative hidden w-1/3 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImg}
          alt=""
        />
      </div>
    </div>
  );
};
