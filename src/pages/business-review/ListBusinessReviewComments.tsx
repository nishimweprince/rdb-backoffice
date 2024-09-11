import Modal from '@/components/cards/Modal';
import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import { formatDate, removeArrayDuplicates } from '@/helpers/strings.helper';
import {
  setCreateBusinessReviewCommentModal,
  setDeleteBusinessReviewCommentModal,
  setListBusinessReviewCommentsModal,
  setSelectedBusinessReviewComment,
  setUpdateBusinessReviewCommentModal,
  updateBusinessReviewCommentStatusThunk,
} from '@/states/features/businessReviewCommentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BusinessReviewComment } from '@/types/models/businessReviewComment';
import {
  faPenToSquare,
  faThumbsDown,
  faThumbsUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ListBusinessReviewComments = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    listBusinessReviewCommentsModal,
    businessReviewCommentsList,
    updateBusinessReviewCommentIsLoading,
  } = useSelector((state: RootState) => state.businessReviewComment);
  const { business } = useSelector((state: RootState) => state.business);
  const { selectedBusinessNavigationFlow } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const [reviewComments, setReviewComments] = useState(
    businessReviewCommentsList?.filter(
      (businessReviewComment) =>
        businessReviewComment?.navigationFlow?.id ===
        selectedBusinessNavigationFlow?.id
    )
  );

  useEffect(() => {
    setReviewComments(
      removeArrayDuplicates(
        businessReviewCommentsList?.filter(
          (businessReviewComment) =>
            businessReviewComment?.navigationFlow?.id ===
            selectedBusinessNavigationFlow?.id
        )
      ) as BusinessReviewComment[]
    );
  }, [businessReviewCommentsList, selectedBusinessNavigationFlow]);

  useEffect(() => {
    if (reviewComments?.length === 0) {
      dispatch(setListBusinessReviewCommentsModal(false));
    }
  }, [dispatch, reviewComments]);

  return (
    <Modal
      isOpen={listBusinessReviewCommentsModal}
      onClose={() => {
        dispatch(setListBusinessReviewCommentsModal(false));
      }}
      heading={`Review Comments for ${selectedBusinessNavigationFlow?.navigationFlowMass?.stepName}`}
      className="min-w-[40vw]"
    >
      <menu className="flex w-full flex-col gap-3">
        {reviewComments?.map((reviewComment) => {
          return (
            <menu
              key={reviewComment?.id}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md shadow-sm"
            >
              <article className="w-full flex flex-col gap-3">
                <p className="text-[14px]">
                  {reviewComment?.comment}{' '}
                  <span className="text-[14px] font-medium text-green-700">
                    {reviewComment?.status === 'COMMENT_ACCEPTED'
                      ? '(Marked as resolved by the user)'
                      : ''}
                    {reviewComment?.status === 'COMMENT_ACCEPTED'
                      ? '(Marked as approved)'
                      : ''}
                  </span>
                  <span className='text-[14px] font-medium text-red-700'>
                  {reviewComment?.status === 'COMMENT_DENIED' ? '(Marked as rejected)' : ''}
                  </span>
                </p>
                <ul className="flex flex-col gap-2">
                  <p className="text-secondary text-[13px]">
                    Created by: {reviewComment?.createdBy?.fullName}
                  </p>
                  <p className="text-secondary text-[13px]">
                    Date added: {formatDate(reviewComment?.createdAt)}
                  </p>
                </ul>
              </article>
              <figure className="flex flex-col gap-2">
                {reviewComment?.status === 'COMMENT_ACCEPTED' && (
                  <menu className="flex items-center gap-3">
                    <CustomTooltip label="Approve">
                      {updateBusinessReviewCommentIsLoading ? (
                        <Loader className="text-green-700" />
                      ) : (
                        <FontAwesomeIcon
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(
                              updateBusinessReviewCommentStatusThunk({
                                id: reviewComment?.id,
                                status: 'APPROVED',
                              })
                            );
                          }}
                          className="h-4 w-4 bg-green-700 text-white rounded-full p-2 cursor-pointer transition-all ease-in-out duration-300 hover:scale-[1.03]"
                          icon={faThumbsUp}
                        />
                      )}
                    </CustomTooltip>
                    <CustomTooltip label="Reject and add new comment">
                      {updateBusinessReviewCommentIsLoading ? (
                        <Loader className="text-red-600" />
                      ) : (
                        <FontAwesomeIcon
                          onClick={async (e) => {
                            e.preventDefault();
                            await dispatch(
                              updateBusinessReviewCommentStatusThunk({
                                id: reviewComment?.id,
                                status: 'REJECTED',
                              })
                            );
                            dispatch(setListBusinessReviewCommentsModal(false));
                            dispatch(setCreateBusinessReviewCommentModal(true));
                          }}
                          className="h-4 w-4 bg-red-600 text-white rounded-full p-2 cursor-pointer transition-all ease-in-out duration-300 hover:scale-[1.03]"
                          icon={faThumbsDown}
                        />
                      )}
                    </CustomTooltip>
                  </menu>
                )}
                {reviewComment?.status === 'SUBMITTED' &&
                  ['IN_REVIEW'].includes(business?.applicationStatus) && (
                    <FontAwesomeIcon
                      className="h-4 w-4 bg-primary text-white rounded-full p-2 cursor-pointer transition-all ease-in-out duration-300 hover:scale-[1.03]"
                      icon={faPenToSquare}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          setSelectedBusinessReviewComment(reviewComment)
                        );
                        dispatch(setListBusinessReviewCommentsModal(false));
                        dispatch(setUpdateBusinessReviewCommentModal(true));
                      }}
                    />
                  )}
                {reviewComment?.status === 'SUBMITTED' &&
                  ['IN_REVIEW'].includes(business?.applicationStatus) && (
                    <FontAwesomeIcon
                      className="h-4 w-4 bg-red-600 text-white rounded-full p-2 cursor-pointer transition-all ease-in-out duration-300 hover:scale-[1.03]"
                      icon={faTrash}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          setSelectedBusinessReviewComment(reviewComment)
                        );
                        dispatch(setListBusinessReviewCommentsModal(false));
                        dispatch(setDeleteBusinessReviewCommentModal(true));
                      }}
                    />
                  )}
              </figure>
            </menu>
          );
        })}
      </menu>
      <menu className="my-4 w-full flex items-center justify-end">
        <Button
          className="!py-1"
          primary
          onClick={(e) => {
            e.preventDefault();
            dispatch(setListBusinessReviewCommentsModal(false));
            dispatch(setCreateBusinessReviewCommentModal(true));
          }}
        >
          Add new comment
        </Button>
      </menu>
    </Modal>
  );
};

export default ListBusinessReviewComments;
