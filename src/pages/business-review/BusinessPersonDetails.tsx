import Loader from '@/components/inputs/Loader';
import Modal from '@/components/cards/Modal';
import { countriesList } from '@/constants/location.constants';
import { capitalizeString, formatDate } from '@/helpers/strings.helper';
import { convertFileSizeToMbs } from '@/helpers/uploads.helper';
import {
  setBusinessPersonDetailsModal,
  setSelectedBusinessPerson,
} from '@/states/features/businessPeopleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { PersonAttachment } from '@/types/models/attachment';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BusinessPersonDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    selectedBusinessPerson,
    businessPersonDetailsModal,
    personAttachmentsIsSuccess,
    personAttachmentsIsFetching,
    personAttachmentsList,
  } = useSelector((state: RootState) => state.businessPeople);

  return (
    <Modal
      isOpen={businessPersonDetailsModal}
      onClose={() => {
        dispatch(setBusinessPersonDetailsModal(false));
        dispatch(setSelectedBusinessPerson(undefined));
      }}
      heading={`${
        selectedBusinessPerson?.firstName ||
        selectedBusinessPerson?.organization?.organizationName
      } ${selectedBusinessPerson?.lastName || ''}`}
      className="w-full min-w-[50vw] p-5"
    >
      <menu className="grid grid-cols-2 gap-5 w-full min-w-[45vw]">
        <p className="text-[14px]">
          First Name: {selectedBusinessPerson?.firstName}
        </p>
        <p className="text-[14px]">
          Last Name: {selectedBusinessPerson?.lastName}
        </p>
        <p className="text-[14px]">
          Date of birth:{' '}
          {formatDate(
            selectedBusinessPerson?.dateOfBirth as unknown as string
          ) || 'N/A'}
        </p>
        <p className="text-[14px]">Sex: {selectedBusinessPerson?.gender}</p>
        <p className="text-[14px]">
          Nationality:{' '}
          {
            countriesList?.find(
              (country) => country?.code === selectedBusinessPerson?.nationality
            )?.name
          }
        </p>
        <p className="text-[14px]">
          Document Type:{' '}
          {selectedBusinessPerson?.personIdentType === 'nid'
            ? 'National Identification'
            : 'Passport'}
        </p>
        <p className="text-[14px]">
          Document Issue Place:{' '}
          {
            countriesList?.find(
              (country) =>
                country?.code === selectedBusinessPerson?.persDocIssuePlace
            )?.name
          }
        </p>
        <p className="text-[14px]">
          Phone number: {selectedBusinessPerson?.phoneNumber}
        </p>
        <p className="text-[14px]">Email: {selectedBusinessPerson?.email}</p>
        <p className="text-[14px]">
          Role:{' '}
          {capitalizeString(
            selectedBusinessPerson?.personRole?.roleDescription
          ) || capitalizeString(selectedBusinessPerson?.roleDescription)}
        </p>
      </menu>
      {personAttachmentsIsFetching ? (
        <figure className="w-full flex items-center justify-center min-h-[10vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        personAttachmentsIsSuccess &&
        personAttachmentsList?.length > 0 && (
          <menu className="flex flex-col w-full gap-2 my-4">
            <h1 className="font-medium uppercase text-primary">
              {selectedBusinessPerson?.firstName}'s attachments
            </h1>
            <ul className="grid w-full grid-cols-3 gap-5">
              {personAttachmentsList?.map(
                (personAttachment: PersonAttachment) => {
                  return (
                    <ul className="p-1 px-5 flex bg-gray-100 items-center gap-2 justify-between rounded-md shadow-xs cursor-pointer transition-all duration-300 hover: scale-[1.01]">
                      <p className="flex flex-col gap-0 text-[12px]">
                        <p className="text-[12px]">
                          {capitalizeString(personAttachment?.attachmentType)}
                        </p>
                        <p className="text-[12px]">
                          {' '}
                          {convertFileSizeToMbs(
                            Number(personAttachment?.fileSize)
                          )}
                        </p>
                      </p>
                      <Link
                        to={personAttachment?.attachmentUrl}
                        target="_blank"
                        className="text-primary text-[13px]"
                      >
                        View
                      </Link>
                    </ul>
                  );
                }
              )}
            </ul>
          </menu>
        )
      )}
    </Modal>
  );
};

export default BusinessPersonDetails;
