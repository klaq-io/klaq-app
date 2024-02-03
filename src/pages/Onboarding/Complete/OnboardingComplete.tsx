import { Ring } from "@uiball/loaders";
import { Button } from "components";
import { OnboardingLayout } from "layouts/OnboardingLayout/OnboardingLayout";
import { useIntl } from "react-intl";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "utils/utils";
import ConfettiExplosion, { ConfettiProps } from "react-confetti-explosion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes";

type STEP_TYPE = {
  [key: string]: {
    status: string;
    title: string;
    animationDuration: number;
  };
};

const confettiProps: ConfettiProps = {
  force: 0.8,
  duration: 2000,
  particleCount: 200,
  width: window.innerWidth,
};

export const OnboardingCompletePage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [displayConfettiComponent, setDisplayConfettiComponent] =
    useState(false);

  const STATUS = {
    NOT_STARTED: "NOT_STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
  };

  const [steps, setSteps] = useState<STEP_TYPE>({
    USER_CREATION: {
      status: STATUS.IN_PROGRESS,
      title: "user",
      animationDuration: 2000,
    },
    COMPANY_CREATION: {
      status: STATUS.IN_PROGRESS,
      title: "company",
      animationDuration: 3000,
    },
    SPACE_GENERATION: {
      status: STATUS.IN_PROGRESS,
      title: "dashboard",
      animationDuration: 3500,
    },
  });

  const isComplete = Object.values(steps).every(
    (step) => step.status === STATUS.DONE
  );

  const handleComplete = () => {
    navigate(PATHS.ONBOARDING_WELCOME);
  };

  const timeoutIds: any = [];

  const updateStatusAfterDuration = (stepKey: any) => {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        setSteps((prevSteps) => ({
          ...prevSteps,
          [stepKey]: {
            ...prevSteps[stepKey],
            status: STATUS.DONE,
          },
        }));
        resolve(void 0);
      }, steps[stepKey].animationDuration);
      timeoutIds.push(timeoutId);
    });
  };

  useEffect(() => {
    const updateStatusesSequentially = async () => {
      for (const stepKey of Object.keys(steps)) {
        await updateStatusAfterDuration(stepKey);
      }
      setDisplayConfettiComponent(true);
    };

    updateStatusesSequentially();

    return () => {
      timeoutIds.forEach((timeoutId: any) => clearTimeout(timeoutId));
    };
  }, []);

  return (
    <OnboardingLayout isLoading={false}>
      {displayConfettiComponent && (
        <div className="fixed top-0 left-0 h-screen flex items-center justify-center z-999 w-2/3">
          {isComplete && (
            <ConfettiExplosion
              {...confettiProps}
              onComplete={() => setDisplayConfettiComponent(false)}
            />
          )}
        </div>
      )}

      <div>
        <h1 className="text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
      </div>
      <div className="mt-8 flex flex-col space-y-6 text-xl leading-9 tracking-tight">
        {Object.keys(steps).map((key) => (
          <div
            className={classNames(
              "flex flex-row space-x-2 items-center",
              steps[key].status === STATUS.IN_PROGRESS &&
                "animate-pulse font-bold text-gray-900",
              steps[key].status === STATUS.DONE && "font-bold text-gray-900",
              steps[key].status === STATUS.NOT_STARTED && "text-gray-500"
            )}
          >
            <span className="w-8">
              {steps[key].status === STATUS.IN_PROGRESS && (
                <Ring color="#40615d" size={25} />
              )}
              {steps[key].status === STATUS.DONE && (
                <CheckIcon className="h-8 w-8 text-klaq-500" />
              )}
              {steps[key].status === STATUS.NOT_STARTED && (
                <span className="h-8 w-8 text-klaq-500" />
              )}
            </span>
            <span>
              {intl.formatMessage({
                id: `onboarding.complete.steps.${steps[key].title}`,
              })}
            </span>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="mt-12 flex flex-row justify-end">
          <span className="inline-block relative">
            <Button
              variant="contained"
              color="primary"
              onClick={handleComplete}
              trailingIcon={<ArrowRightIcon className="h-5 w-5" />}
            >
              {intl.formatMessage({
                id: "onboarding.complete.button.discover",
              })}
            </Button>
            <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-klaq-400 ring-2 ring-white animate-ping"></span>
          </span>
        </div>
      )}
    </OnboardingLayout>
  );
};
