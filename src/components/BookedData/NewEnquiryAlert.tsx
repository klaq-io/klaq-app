import { AlertWithButtons, MailPopUp } from 'components';
import { DangerModal } from 'components/Modal';
import { Status } from 'enum/status.enum';
import { MainEvent } from 'interface/Event/main-event.interface';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { EventStatus } from 'redux/Events/slices';
import {
  useFetchMainEvents,
  useUpdateArchivedStatus,
  useUpdateMainEventStatus,
} from 'redux/MainEvent/hooks';
import { PATHS } from 'routes';

type NewEnquiryAlertProps = {
  event: MainEvent;
};

export const NewEnquiryAlert = (props: NewEnquiryAlertProps) => {
  const { event } = props;
  const navigate = useNavigate();
  const intl = useIntl();
  const [isMailPopUpOpened, setMailPopupOpen] = useState<boolean>(false);
  const [shouldOpenDelete, setOpenDelete] = useState<boolean>(false);
  const [, updateArchivedStatus] = useUpdateArchivedStatus();
  const [, updateEventStatus] = useUpdateMainEventStatus();
  const [, fetchEvents] = useFetchMainEvents();

  const handleDeleteEvent = async () => {
    setOpenDelete(false);
    updateArchivedStatus(event.id, true);
    await fetchEvents();
    navigate(PATHS.EVENTS);
  };

  const handleAcceptEvent = () => {
    updateEventStatus(
      {
        status: EventStatus.QUALIFICATION,
      },
      event.id,
    );
  };

  return (
    <>
      {event.status === EventStatus.INBOX && (
        <AlertWithButtons
          status={Status.WARNING}
          buttons={[
            {
              text: intl.formatMessage({
                id: 'event-details.assistant.new-enquiry.infobox.button.accept',
              }),
              onClick: handleAcceptEvent,
            },
            {
              text: intl.formatMessage({
                id: 'event-details.assistant.new-enquiry.infobox.button.reject',
              }),
              onClick: () => {
                setMailPopupOpen(true);
              },
            },
          ]}
          title={intl.formatMessage({
            id: 'event-details.assistant.new-enquiry.infobox.title',
          })}
        />
      )}
      <DangerModal
        isOpen={shouldOpenDelete}
        setOpen={setOpenDelete}
        onClick={() => handleDeleteEvent()}
        title={intl.formatMessage({ id: 'event-details.delete-modal.title' })}
        message={intl.formatMessage({
          id: 'event-details.delete-modal.message',
        })}
        button1={intl.formatMessage({
          id: 'event-details.delete-modal.button.delete',
        })}
        button2={intl.formatMessage({
          id: 'event-details.delete-modal.button.cancel',
        })}
      />
      <MailPopUp
        isOpen={isMailPopUpOpened}
        setOpen={setMailPopupOpen}
        content={{
          to: event.customer.email,
          message: intl.formatMessage({
            id: 'email.template.unavailable.content',
          }),
          subject: intl.formatMessage({
            id: 'email.template.unavailable.subject',
          }),
        }}
        actionAfter={() => setOpenDelete(true)}
      />
    </>
  );
};
