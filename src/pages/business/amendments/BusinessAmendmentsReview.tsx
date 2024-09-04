import StaffLayout from '@/containers/navigation/StaffLayout';
import { useEffect, useState } from 'react';
import queryString, { ParsedQuery } from 'query-string';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import {
  addToBusinessAmendmentReviewComments,
  approveAmendmentThunk,
  fetchAmendmentReviewCommentsThunk,
  fetchBusinessAmendmentsThunk,
  recommendAmendmentForApprovalThunk,
  recommendAmendmentRejectionThunk,
  rejectAmendmentThunk,
  setDeleteAmendmentReviewCommentModal,
  setSelectedAmendmentReviewComment,
  setSelectedBusinessAmendment,
  updateBusinessAmendmentStatusThunk,
} from '@/states/features/businessAmendmentSlice';
import Loader from '@/components/inputs/Loader';
import CompanyDetailsAmendmentReview from './CompanyDetailsAmendmentReview';
import CompanyAddressAmendmentReview from './CompanyAddressAmendmentReview';
import { BusinessAmendment } from '@/types/models/business';
import { capitalizeString, formatDateTime } from '@/helpers/strings.helper';
import BusinessActivitiesAmendmentReview from './BusinessActivitiesAmendmentReview';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import TextArea from '@/components/inputs/TextArea';
import Button from '@/components/inputs/Button';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import { useCreateAmendmentReviewCommentMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import { BusinessAmendmentReviewComment } from '@/types/models/businessAmendmentReviewComment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import DeleteAmendmentReviewComment from './DeleteAmendmentReviewComment';
import BusinessFounderAmendmentReview from './BusinessFounderAmendmentReview';
import BusinessBoardMemberAmendmentReview from './BusinessBoardMemberAmendmentReview';
import ExecutiveMemberAmendmentReview from './ExecutiveMemberAmendmentReview';
import EmploymentInfoAmendmentReview from './EmploymentInfoAmendmentReview';
import { navigationPaths } from '@/constants/dashboard.constants';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import BusinessAttachmentsTable from '@/pages/business-review/BusinessAttachmentsTable';
import BusinessDormancyDeclarationReview from './BusinessDormancyDeclarationReview';
import BusinessCessationToDormancyReview from './BusinessCessationToDormancyReview';

const BusinessAmendmentsReview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );
  const {
    fetchBusinessAmendmentsIsFetching,
    fetchBusinessAmendmentsIsSuccess,
    businessAmendmentsList,
    selectedBusinessAmendment,
    businessAmendmentReviewComments,
    businessAmendmentReviewCommentsIsFetching,
    updateBusinessAmendmentStatusIsLoading,
    updateBusinessAmendmentStatusIsSuccess,
    recommendAmendmentForApprovalIsLoading,
    recommendAmendmentForApprovalIsSuccess,
    rejectAmendmentIsLoading,
    rejectAmendmentIsSuccess,
    approveAmendmentIsLoading,
    approveAmendmentIsSuccess,
    recommendAmendmentRejectionIsLoading,
    recommendAmendmentRejectionIsSuccess,
  } = useSelector((state: RootState) => state.businessAmendment);

  // NAVIGATION
  const { search } = useLocation();
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // INITIALIZE CREATE AMENDMENT REVEW COMMENT MUTATION
  const [
    createAmendmentReviewComment,
    {
      isSuccess: createAmendmentReviewCommentIsSuccess,
      isLoading: createAmendmentReviewCommentIsLoading,
      isError: createAmendmentReviewCommentIsError,
      error: createAmendmentReviewError,
      reset: resetCreateAmendmentReviewComment,
      data: createAmendmentReviewCommentData,
    },
  ] = useCreateAmendmentReviewCommentMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createAmendmentReviewComment({
      comment: data?.amendmentReviewComment,
      amendmentDetailId: selectedBusinessAmendment?.id,
      status: 'UNRESOLVED',
    });
  };

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // FETCH BUSINESS AMENDMENT
  useEffect(() => {
    dispatch(
      fetchBusinessAmendmentsThunk({
        businessId: queryParams?.businessId,
        searchKey: queryParams?.amendmentType,
      })
    );
  }, [dispatch, queryParams]);

  // HANDLE FETCH BUSINESS AMENDMENT RESPONSE
  useEffect(() => {
    if (fetchBusinessAmendmentsIsSuccess) {
      dispatch(setSelectedBusinessAmendment(businessAmendmentsList?.[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetchBusinessAmendmentsIsSuccess]);

  // HANDLE CREATE AMENDMENT REVIEW COMMENT RESPONSE
  useEffect(() => {
    if (createAmendmentReviewCommentIsSuccess) {
      resetCreateAmendmentReviewComment();
      setValue('amendmentReviewComment', '');
      dispatch(
        addToBusinessAmendmentReviewComments(
          createAmendmentReviewCommentData?.data
        )
      );
    } else if (createAmendmentReviewCommentIsError) {
      const errorResponse =
        (createAmendmentReviewError as ErrorResponse)?.data?.message ||
        'Failed to create amendment review comment';
      toast.error(errorResponse);
    }
  }, [
    createAmendmentReviewCommentData?.data,
    createAmendmentReviewCommentIsError,
    createAmendmentReviewCommentIsSuccess,
    createAmendmentReviewError,
    dispatch,
    resetCreateAmendmentReviewComment,
    setValue,
  ]);

  // FETCH AMENDMENT REVIEW COMMENTS
  useEffect(() => {
    if (selectedBusinessAmendment?.id) {
      dispatch(
        fetchAmendmentReviewCommentsThunk({
          amendmentDetailId: selectedBusinessAmendment?.id,
        })
      );
    }
  }, [dispatch, selectedBusinessAmendment]);

  // HANDLE UPDATE BUSINESS AMENDMENT STATUS RESPONSE
  useEffect(() => {
    if (updateBusinessAmendmentStatusIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${selectedBusinessAmendment?.businessId}`
      );
      window.location.reload();
    }
  }, [
    navigate,
    selectedBusinessAmendment?.businessId,
    updateBusinessAmendmentStatusIsSuccess,
  ]);

  // HANDLE RECOMMEND AMENDMENT FOR APPROVAL RESPONSE
  useEffect(() => {
    if (recommendAmendmentForApprovalIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${selectedBusinessAmendment?.businessId}`
      );
      window.location.reload();
    }
  }, [
    navigate,
    recommendAmendmentForApprovalIsSuccess,
    selectedBusinessAmendment?.businessId,
  ]);

  // HANDLE APPROVE AMENDMENT RESPONSE
  useEffect(() => {
    if (approveAmendmentIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${selectedBusinessAmendment?.businessId}`
      );
      window.location.reload();
    }
  }, [
    approveAmendmentIsSuccess,
    navigate,
    selectedBusinessAmendment?.businessId,
  ]);

  // HANDLE REJECT AMENDMENT RESPONSE
  useEffect(() => {
    if (rejectAmendmentIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${selectedBusinessAmendment?.businessId}`
      );
      window.location.reload();
    }
  }, [
    navigate,
    rejectAmendmentIsSuccess,
    selectedBusinessAmendment?.businessId,
  ]);

  // HANDLE RECOMMEND AMENDMENT REJECTION RESPONSE
  useEffect(() => {
    if (recommendAmendmentRejectionIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${selectedBusinessAmendment?.businessId}`
      );
      window.location.reload();
    }
  }, [
    navigate,
    recommendAmendmentRejectionIsSuccess,
    selectedBusinessAmendment?.businessId,
  ]);

  // NAVIGATION LINKS
  const navigationExtendedPaths = [
    ...navigationPaths,
    {
      label: 'Business Amendments',
      route: '/applications/business/amendments',
    },
    {
      label: `${
        fetchBusinessAmendmentsIsFetching
          ? '...'
          : selectedBusinessAmendment?.business?.applicationReferenceId
      }`,
      route: `/applications/amendments?businessId=${selectedBusinessAmendment?.business?.id}`,
    },
    {
      label: `${capitalizeString(String(queryParams?.amendmentType))}`,
      route: `/applications/amendments/review?businessId=${queryParams?.businessId}&amendmentType=${queryParams?.amendmentType}`,
    },
  ];

  return (
    <StaffLayout>
      <main className="w-full flex flex-col gap-4">
        {fetchBusinessAmendmentsIsFetching ? (
          <figure className="w-full flex items-center justify-center h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <menu className="w-full flex flex-col gap-4 p-5">
            <CustomBreadcrumb navigationLinks={navigationExtendedPaths} />
            {queryParams?.amendmentType === 'AMEND_COMPANY_DETAILS' && (
              <CompanyDetailsAmendmentReview />
            )}
            {queryParams?.amendmentType === 'AMEND_COMPANY_ADDRESS' && (
              <CompanyAddressAmendmentReview />
            )}
            {queryParams?.amendmentType === 'AMEND_BUSINESS_ACTIVITIES' && (
              <BusinessActivitiesAmendmentReview />
            )}
            {queryParams?.amendmentType === 'AMEND_ADD_BUSINESS_FOUNDER' && (
              <BusinessFounderAmendmentReview />
            )}
            {queryParams?.amendmentType ===
              'AMEND_ADD_BUSINESS_BOARD_MEMBER' && (
              <BusinessBoardMemberAmendmentReview />
            )}
            {queryParams?.amendmentType ===
              'AMEND_ADD_BUSINESS_EXECUTIVE_MEMBER' && (
              <ExecutiveMemberAmendmentReview />
            )}
            {queryParams?.amendmentType ===
              'AMEND_BUSINESS_EMPLOYMENT_INFO' && (
              <EmploymentInfoAmendmentReview />
            )}
            {queryParams?.amendmentType ===
              'AMEND_BUSINESS_DORMANCY_DECLARATION' && (
              <BusinessDormancyDeclarationReview />
            )}
            {queryParams?.amendmentType === 'AMEND_CESSATION_TO_BE_DORMANT' && (
              <BusinessCessationToDormancyReview />
            )}
          </menu>
        )}
        {(selectedBusinessAmendment?.amendmentAttachmentDetails || [])?.length >
          0 && (
          <section className="w-full flex flex-col gap-3">
            <h3>Attachments</h3>
            <BusinessAttachmentsTable
              businessAttachmentsList={
                selectedBusinessAmendment?.amendmentAttachmentDetails
              }
            />
          </section>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[50%] flex flex-col gap-2 p-5"
        >
          <fieldset className="w-full flex flex-col gap-3">
            <Controller
              name="amendmentReviewComment"
              control={control}
              rules={{ required: 'Review comment is required to proceed' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <p className="px-1">
                      Amendment review comment{' '}
                      <span className="text-red-600">*</span>{' '}
                    </p>
                    <TextArea
                      resize
                      placeholder="Start typing here..."
                      required
                      {...field}
                    />
                    {errors?.amendmentReviewComment && (
                      <InputErrorMessage
                        message={errors?.amendmentReviewComment?.message}
                      />
                    )}
                  </label>
                );
              }}
            />
          </fieldset>
          <menu className="w-full flex items-center gap-3 justify-end">
            {watch('amendmentReviewComment') && (
              <Button submit primary className="flex self-end">
                {createAmendmentReviewCommentIsLoading ? <Loader /> : 'Save'}
              </Button>
            )}
          </menu>
        </form>
        {businessAmendmentReviewComments?.length > 0 && (
          <article className="w-full flex flex-col gap-5 px-5">
            {businessAmendmentReviewCommentsIsFetching ? (
              <figure className="w-full flex items-center justify-center min-h-[30vh]">
                <Loader className="text-primary" />
              </figure>
            ) : (
              <menu className="w-full flex flex-col gap-4">
                <h3 className="uppercase text-primary font-medium">
                  Comment(s)
                </h3>
                {businessAmendmentReviewComments?.map((comment, index) => {
                  return (
                    <AmendmentReviewComment
                      amendmentReviewComment={comment}
                      key={index}
                    />
                  );
                })}
              </menu>
            )}
          </article>
        )}
        {['AMENDMENT_SUBMITTED', 'RESUBMITTED'].includes(
          String(selectedBusinessAmendment?.status)
        ) && (
          <menu className="w-full flex items-center justify-between p-5">
            <Button
              route={`/applications/amendments?businessId=${selectedBusinessAmendment?.businessId}`}
            >
              Back
            </Button>
            <Button
              danger
              onClick={(e) => {
                e.preventDefault();
                if (selectedBusinessAmendment) {
                  dispatch(
                    recommendAmendmentRejectionThunk({
                      amendmentId: selectedBusinessAmendment?.id,
                    })
                  );
                }
              }}
            >
              {recommendAmendmentRejectionIsLoading ? (
                <Loader />
              ) : (
                'Recommend for rejection'
              )}
            </Button>
            <Button
              primary
              className="!bg-green-700 hover:!bg-green-700 border-none"
              onClick={(e) => {
                e.preventDefault();
                if (selectedBusinessAmendment) {
                  dispatch(
                    recommendAmendmentForApprovalThunk({
                      amendmentId: selectedBusinessAmendment?.id,
                    })
                  );
                }
              }}
            >
              {recommendAmendmentForApprovalIsLoading ? (
                <Loader />
              ) : (
                'Recommend for approval'
              )}
            </Button>
            <Button
              primary={businessAmendmentReviewComments?.length > 0}
              disabled={
                businessAmendmentReviewComments?.filter(
                  (amendmentReviewComment) =>
                    amendmentReviewComment?.status === 'UNRESOLVED'
                )?.length <= 0
              }
              onClick={(e) => {
                e.preventDefault();
                if (selectedBusinessAmendment) {
                  dispatch(
                    updateBusinessAmendmentStatusThunk({
                      id: selectedBusinessAmendment?.id,
                      amendmentStatus: 'ACTION_REQUIRED',
                    })
                  );
                }
              }}
            >
              {updateBusinessAmendmentStatusIsLoading ? (
                <Loader />
              ) : (
                'Return for correction'
              )}
            </Button>
          </menu>
        )}
        {['PENDING_APPROVAL', 'PENDING_REJECTION'].includes(
          String(selectedBusinessAmendment?.status)
        ) && (
          <menu className="w-full flex items-center justify-between p-5">
            <Button
              route={`/applications/amendments?businessId=${selectedBusinessAmendment?.businessId}`}
            >
              Back
            </Button>
            <Button
              danger
              onClick={(e) => {
                e.preventDefault();
                if (selectedBusinessAmendment) {
                  dispatch(
                    rejectAmendmentThunk({
                      amendmentId: selectedBusinessAmendment?.id,
                      entityId: selectedBusinessAmendment?.entityId,
                    })
                  );
                }
              }}
            >
              {rejectAmendmentIsLoading ? <Loader /> : 'Reject'}
            </Button>
            <Button
              className="!bg-green-700 hover:!bg-green-700 border-none text-white"
              onClick={(e) => {
                e.preventDefault();
                if (selectedBusinessAmendment) {
                  dispatch(
                    approveAmendmentThunk({
                      amendmentId: selectedBusinessAmendment?.id,
                    })
                  );
                }
              }}
            >
              {approveAmendmentIsLoading ? <Loader /> : 'Approve'}
            </Button>
            <Button
              primary={
                businessAmendmentReviewComments?.filter(
                  (amendmentReviewComment) =>
                    amendmentReviewComment?.status === 'UNRESOLVED'
                )?.length > 0
              }
              disabled={
                businessAmendmentReviewComments?.filter(
                  (amendmentReviewComment) =>
                    amendmentReviewComment?.status === 'UNRESOLVED'
                )?.length <= 0
              }
              onClick={(e) => {
                e.preventDefault();
                if (selectedBusinessAmendment) {
                  dispatch(
                    updateBusinessAmendmentStatusThunk({
                      id: selectedBusinessAmendment?.id,
                      amendmentStatus: 'ACTION_REQUIRED',
                    })
                  );
                }
              }}
            >
              {updateBusinessAmendmentStatusIsLoading ? (
                <Loader />
              ) : (
                'Return for correction'
              )}
            </Button>
          </menu>
        )}
      </main>
      <DeleteAmendmentReviewComment />
    </StaffLayout>
  );
};

export const AmendmentReviewComment = ({
  amendmentReviewComment,
}: {
  amendmentReviewComment: BusinessAmendmentReviewComment;
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  return (
    <article className="w-full flex items-center gap-4 p-3 rounded-md shadow-md justify-between">
      <ul className="flex flex-col gap-2">
        <p>{amendmentReviewComment?.comment}</p>
        <p className="text-[13px]">{amendmentReviewComment?.status}</p>
      </ul>
      {['UNRESOLVED'].includes(amendmentReviewComment?.status) && (
        <menu className="flex items-center gap-2">
          <CustomTooltip label="Click to delete" labelClassName="bg-red-600">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setSelectedAmendmentReviewComment(amendmentReviewComment)
                );
                dispatch(setDeleteAmendmentReviewCommentModal(true));
              }}
              className="p-2 px-[8.1px] rounded-full transition-all ease-in-out duration-300 hover:scale-[1.01] shadow-md bg-red-600 text-white cursor-pointer"
              icon={faTrash}
            />
          </CustomTooltip>
        </menu>
      )}
    </article>
  );
};

export const BusinessAmendmentRequestSummary = ({
  businessAmendment,
}: {
  businessAmendment?: BusinessAmendment;
}) => {
  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="uppercase text-primary font-semibold text-lg">
        Company details
      </h2>
      <menu className="grid grid-cols-2 gap-5 w-full">
        <ul className="flex items-center gap-2">
          <p>Application Reference ID:</p>
          <p className="font-medium">
            {businessAmendment?.business?.applicationReferenceId}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p> Company name:</p>
          <p className="font-medium">
            {businessAmendment?.business?.companyName ||
              businessAmendment?.business?.branchName ||
              businessAmendment?.business?.enterpriseName ||
              businessAmendment?.business?.enterpriseBusinessName}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p> Application status:</p>
          <p className="font-medium">
            {capitalizeString(businessAmendment?.business?.applicationStatus)}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Amendment type:</p>
          <p className="font-medium">
            {capitalizeString(businessAmendment?.amendmentType)}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Company code: </p>
          <p className="font-medium">
            {businessAmendment?.business?.tin || 'N/A'}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Request date:</p>
          <p className="font-medium">
            {formatDateTime(businessAmendment?.createdAt)}
          </p>
        </ul>
      </menu>
    </section>
  );
};

export default BusinessAmendmentsReview;
