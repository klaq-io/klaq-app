import {
  BoltIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';
import { EventBadge } from 'components/Event/EventBadge';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format,
} from 'date-fns';
import { useFormik } from 'formik';
import { FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  useAddCommentary,
  useFetchCommentaries,
} from '../../redux/Commentary/hooks';
import { getCommentaries } from '../../redux/Commentary/selectors';
import { EventStatus } from '../../redux/Events/slices';
import { classNames } from '../../utils/utils';
import { Button } from '../Button';
import { initialValues, validationSchema } from './form';
import { CommentaryType } from 'enum/commentary-type.enum';

type Props = {
  isCommentingAllowed?: boolean;
};

const TIME = {
  LESS_THAN_A_MINUTE: 1,
  LESS_THAN_AN_HOUR: 60,
  LESS_THAN_A_DAY: 1440,
  LESS_THAN_A_WEEK: 10080,
  LESS_THAN_A_MONTH: 40320,
  LESS_THAN_A_YEAR: 525600,
};

export const CommentaryFeed: FC<Props> = (props: Props) => {
  // eslint-disable-next-line
  const { isCommentingAllowed } = props;
  const { id } = useParams<{ id: string }>();

  const intl = useIntl();

  const [{ isLoading }, addCommentary] = useAddCommentary();
  const [{ isLoading: isFetchingCommentaries }, fetchCommentaries] =
    useFetchCommentaries();
  const commentaries = useSelector(getCommentaries);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: { text: string }) => {
      if (id) addCommentary(id, values.text, CommentaryType.COMMENTED);
      formik.resetForm();
    },
  });

  const publicatedTime = (date?: Date): { time: number; message: string } => {
    const now = new Date();
    const elapsedMinutes = differenceInMinutes(now, date || now);

    const timeMessages = [
      {
        threshold: TIME.LESS_THAN_A_MINUTE * 2,
        fn: differenceInMinutes,
        message: 'just-now',
      },
      {
        threshold: TIME.LESS_THAN_AN_HOUR,
        fn: differenceInMinutes,
        message: 'minutes-ago',
      },
      {
        threshold: TIME.LESS_THAN_A_DAY,
        fn: differenceInHours,
        message: 'hours-ago',
      },
      {
        threshold: TIME.LESS_THAN_A_WEEK,
        fn: differenceInDays,
        message: 'days-ago',
      },
      {
        threshold: TIME.LESS_THAN_A_MONTH,
        fn: differenceInWeeks,
        message: 'weeks-ago',
      },
      {
        threshold: TIME.LESS_THAN_A_YEAR,
        fn: differenceInMonths,
        message: 'months-ago',
      },
      { threshold: Infinity, fn: differenceInYears, message: 'years-ago' },
    ];

    const { message, fn } = timeMessages.find(
      ({ threshold }) => elapsedMinutes < threshold,
    ) || {
      time: elapsedMinutes,
      message: 'minutes-ago',
      fn: differenceInMinutes,
    };

    return { time: fn(now, date || now), message };
  };

  useEffect(() => {
    if (id) fetchCommentaries(id);
  }, []);

  return (
    <>
      {!isFetchingCommentaries || (commentaries && commentaries.length) ? (
        <ul role="list" className="space-y-6">
          {commentaries.map((commentary, idx) => (
            <li key={commentary.id} className="relative flex gap-x-4">
              <div
                className={classNames(
                  idx === commentaries.length - 1 ? 'h-6' : '-bottom-6',
                  'absolute left-0 top-0 flex w-6 justify-center',
                )}
              >
                <div className="w-px bg-gray-200" />
              </div>
              {commentary.type === CommentaryType.COMMENTED && (
                <>
                  <span className="relative mt-3 rounded-full bg-gray-200 flex-none w-6 h-6">
                    {commentary.user.logoUrl ? (
                      <img
                        src={commentary.user.logoUrl}
                        alt="user-logo"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <ChatBubbleBottomCenterTextIcon className="absolute inset-0 m-auto w-4 h-4 text-gray-400" />
                    )}
                  </span>
                  <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200 bg-white">
                    <div className="flex justify-between gap-x-4">
                      <div className="py-0.5 text-xs leading-5 text-gray-500">
                        <span className="font-medium text-gray-900">{`${commentary.user.firstName} ${commentary.user.lastName}`}</span>{' '}
                        {intl.formatMessage({
                          id: 'edit-event.commentaries.commented',
                        })}
                      </div>
                      <time
                        dateTime={format(
                          new Date(commentary.createdAt),
                          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
                        )}
                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                      >
                        {intl.formatMessage(
                          {
                            id: `edit-event.commentaries.publicated-time.${
                              publicatedTime(new Date(commentary.createdAt))
                                .message
                            }`,
                          },
                          {
                            time: publicatedTime(new Date(commentary.createdAt))
                              .time,
                          },
                        )}
                      </time>
                    </div>
                    <p className="text-sm leading-6 text-gray-500">
                      {commentary.text}
                    </p>
                  </div>
                </>
              )}
              {commentary.type === CommentaryType.KLAQ_COMMENTED && (
                <>
                  <span className="relative mt-3 rounded-full bg-gray-200 flex-none w-6 h-6">
                    <BoltIcon className="absolute inset-0 m-auto w-4 h-4 text-gray-400" />
                  </span>
                  <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200 bg-white">
                    <div className="flex justify-between gap-x-4">
                      <div className="py-0.5 text-xs leading-5 text-gray-500">
                        <span className="font-medium text-gray-900">{`KlaqBOT`}</span>{' '}
                        {intl.formatMessage({
                          id: 'edit-event.commentaries.commented',
                        })}
                      </div>
                      <time
                        dateTime={format(
                          new Date(commentary.createdAt),
                          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
                        )}
                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                      >
                        {intl.formatMessage(
                          {
                            id: `edit-event.commentaries.publicated-time.${
                              publicatedTime(new Date(commentary.createdAt))
                                .message
                            }`,
                          },
                          {
                            time: publicatedTime(new Date(commentary.createdAt))
                              .time,
                          },
                        )}
                      </time>
                    </div>
                    <p className="text-sm leading-6 text-gray-500">
                      {`Note additionnelle : ${commentary.text}`}
                    </p>
                  </div>
                </>
              )}
              {commentary.type === CommentaryType.EVENT_STATUS_UPDATED && (
                <>
                  <span className="relative mt-3 rounded-full bg-gray-200 flex-none w-6 h-6">
                    <BoltIcon className="absolute inset-0 m-auto w-4 h-4 text-gray-400" />
                  </span>
                  <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200 bg-white">
                    <div className="flex justify-between gap-x-4">
                      <div className="py-0.5 text-xs leading-5 text-gray-500">
                        <span className="font-medium text-gray-900">{`KlaqBOT`}</span>{' '}
                        {intl.formatMessage({
                          id: 'edit-event.commentaries.commented',
                        })}
                      </div>
                      <time
                        dateTime={format(
                          new Date(commentary.createdAt),
                          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
                        )}
                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                      >
                        {intl.formatMessage(
                          {
                            id: `edit-event.commentaries.publicated-time.${
                              publicatedTime(new Date(commentary.createdAt))
                                .message
                            }`,
                          },
                          {
                            time: publicatedTime(new Date(commentary.createdAt))
                              .time,
                          },
                        )}
                      </time>
                    </div>
                    <p className="text-sm leading-6 text-gray-500">
                      {/* //todo: intl */}
                      Changement du status en{' '}
                      {Object.values(EventStatus).includes(
                        commentary.text as EventStatus,
                      ) ? (
                        <EventBadge status={commentary.text as EventStatus} />
                      ) : (
                        intl.formatMessage({
                          id: `edit-event.commentaries.status.${commentary.text}`,
                        })
                      )}
                    </p>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-6 flex gap-x-3">
        <form
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
          className="relative flex-auto"
        >
          <div className="bg-white overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-klaq-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              value={formik.values.text}
              onChange={formik.handleChange}
              rows={2}
              name="text"
              id="text"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder={intl.formatMessage({
                id: 'edit-event.commentaries.add-commentary',
              })}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="ml-auto ">
              <Button
                type="button"
                color="secondary"
                variant="outlined"
                size="md"
                onClick={() => formik.submitForm()}
                isLoading={isLoading}
              >
                {intl.formatMessage({
                  id: 'edit-event.commentaries.submit',
                })}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CommentaryFeed;
