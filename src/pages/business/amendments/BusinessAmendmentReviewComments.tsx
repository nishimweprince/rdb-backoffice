import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import { useLazyFetchAmendmentReviewCommentsQuery } from '@/states/api/businessRegQueryApiSlice';
import {
  setBusinessAmendmentReviewComments,
  setDeleteAmendmentReviewCommentModal,
  setSelectedAmendmentReviewComment,
  setUpdateAmendmentReviewCommentModal,
} from '@/states/features/businessAmendmentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BusinessAmendment } from '@/types/models/business';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

interface BusinessAmendmentReviewCommentsProps {
  businessAmendment?: BusinessAmendment;
}

const BusinessAmendmentReviewComments = ({
  businessAmendment,
}: BusinessAmendmentReviewCommentsProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessAmendmentReviewComments } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  // INITIALIZE FETCH AMENDMENT REVIEW COMMENTS QUERY
  const [
    fetchAmendmentReviewComments,
    {
      data: amendmentReviewCommentsData,
      isFetching: amendmentReviewCommentsIsFetching,
      error: amendmentReviewCommentsError,
      isError: amendmentReviewCommentsIsError,
      isSuccess: amendmentReviewCommentsIsSuccess,
    },
  ] = useLazyFetchAmendmentReviewCommentsQuery();

  // FETCH AMENDMENT REVIEW COMMENTS
  useEffect(() => {
    if (businessAmendment?.id) {
      fetchAmendmentReviewComments({
        amendmentDetailId: businessAmendment?.id,
      });
    }
  }, [dispatch, businessAmendment, fetchAmendmentReviewComments]);

  // HANDLE AMENDMENT REVIEW COMMENTS RESPONSE
  useEffect(() => {
    if (amendmentReviewCommentsIsError) {
      const errorResponse =
        (amendmentReviewCommentsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching amendment review comments';
      toast.error(errorResponse);
    } else if (amendmentReviewCommentsIsSuccess) {
      dispatch(
        setBusinessAmendmentReviewComments(amendmentReviewCommentsData?.data)
      );
    }
  }, [
    amendmentReviewCommentsData,
    amendmentReviewCommentsError,
    amendmentReviewCommentsIsError,
    amendmentReviewCommentsIsSuccess,
    dispatch,
  ]);

  if (!businessAmendment) {
    return null;
  }

  return (
    <section className="w-full flex flex-col gap-4 px-4">
      {amendmentReviewCommentsIsFetching ? (
        <figure className="w-full flex flex-col gap-2 min-h-[20vh] items-center justify-center">
          <Loader className="text-primary" />
          <p className="text-primary">Loading review comments...</p>
        </figure>
      ) : (
        amendmentReviewCommentsIsSuccess &&
        businessAmendmentReviewComments?.map(
          (amendmentReviewComment, index) => {
            return (
              <article
                key={index}
                className="w-full flex items-center gap-4 p-3 rounded-md shadow-md justify-between hover:bg-background"
              >
                <ul className="flex flex-col gap-2">
                  <p>{amendmentReviewComment?.comment}</p>
                  <p className="text-[13px]">
                    {amendmentReviewComment?.status}
                  </p>
                </ul>
                {[
                  'AMENDMENT_SUBMITTED',
                  'RESUBMITTED',
                  'SUBMITTED',
                  'PENDING_REJECTION',
                  'PENDING_APPROVAL',
                ].includes(businessAmendment?.status) && (
                  <menu className="flex items-center gap-2">
                    <CustomTooltip label="Click to update">
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(
                            setSelectedAmendmentReviewComment(
                              amendmentReviewComment
                            )
                          );
                          dispatch(setUpdateAmendmentReviewCommentModal(true));
                        }}
                        className="p-2 px-[8.1px] rounded-full transition-all ease-in-out duration-300 hover:scale-[1.01] shadow-md bg-primary text-white cursor-pointer"
                        icon={faPenToSquare}
                      />
                    </CustomTooltip>
                    <CustomTooltip
                      label="Click to delete"
                      labelClassName="bg-red-600"
                    >
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(
                            setSelectedAmendmentReviewComment(
                              amendmentReviewComment
                            )
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
          }
        )
      )}
    </section>
  );
};

export default BusinessAmendmentReviewComments;
