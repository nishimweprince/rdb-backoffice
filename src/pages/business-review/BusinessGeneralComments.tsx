import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import { getUserFullName } from '@/helpers/users.helper';
import { useLazyFetchBusinessGeneralCommentsQuery } from '@/states/api/businessRegQueryApiSlice';
import {
  setBusinessGeneralCommentsList,
  setDeleteBusinessGeneralCommentModal,
  setSelectedBusinessGeneralComment,
  setUpdateBusinessGeneralCommentModal,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Business } from '@/types/models/business';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteBusinessGeneralComment from './DeleteBusinessGeneralComment';
import UpdateBusinessGeneralComment from './UpdateBusinessGeneralComment';

interface BusinessGeneralCommentsProps {
  business: Business;
}

const BusinessGeneralComments = ({
  business,
}: BusinessGeneralCommentsProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessGeneralCommentsList } = useSelector(
    (state: RootState) => state.business
  );

  // INITIALIZE FETCH BUSINESS GENERAL COMMENTS
  const [
    fetchBusinessGeneralComments,
    {
      data: businessGeneralCommentsData,
      isFetching: businessGeneralCommentsIsFetching,
      error: businessGeneralCommentsError,
      isError: businessGeneralCommentsIsError,
      isSuccess: businessGeneralCommentsIsSuccess,
    },
  ] = useLazyFetchBusinessGeneralCommentsQuery();

  // FETCH BUSINESS GENERAL COMMENTS
  useEffect(() => {
    if (business?.id) {
      fetchBusinessGeneralComments({ businessId: business?.id });
    }
  }, [business?.id, dispatch, fetchBusinessGeneralComments]);

  // HANDLE BUSINESS GENERAL COMMENTS RESPONSE
  useEffect(() => {
    if (businessGeneralCommentsIsError) {
      const errorResponse =
        (businessGeneralCommentsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching business general comments';
      toast.error(errorResponse);
    } else if (businessGeneralCommentsIsSuccess) {
      dispatch(
        setBusinessGeneralCommentsList(businessGeneralCommentsData?.data)
      );
    }
  }, [
    businessGeneralCommentsData?.data,
    businessGeneralCommentsError,
    businessGeneralCommentsIsError,
    businessGeneralCommentsIsSuccess,
    dispatch,
  ]);

  return (
    <section className="w-full flex flex-col gap-3">
      {/* BUSINESS REVIEW COMMENTS */}
      {businessGeneralCommentsIsFetching ? (
        <figure className="w-full flex items-center gap-2 justify-center">
          <Loader className="text-primary" />
        </figure>
      ) : (
        businessGeneralCommentsList?.length > 0 && (
          <menu className="w-full flex flex-col items-start my-3 gap-3 justify-between">
            <h3 className="text-lg uppercase font-semibold text-primary">
              Review comment(s)
            </h3>
            {businessGeneralCommentsList?.map((generalComment, index) => {
              return (
                <section
                  key={index}
                  className="w-full flex items-center gap-3 pr-4 p-3 rounded-md shadow-md justify-between hover:bg-background"
                >
                  <article className="w-full flex flex-col gap-2">
                    <p className="text-[15px]">
                      {index + 1}. {generalComment?.comment}
                    </p>
                    <ul className="w-full text-[13px] text-secondary">
                      Created by:{' '}
                      <CustomTooltip label="View user details">
                        <Link
                          to={`/users/${generalComment?.createdBy?.id}`}
                          className="w-full text-[13px] text-secondary hover:underline"
                        >
                          {getUserFullName(generalComment?.createdBy)}
                        </Link>
                      </CustomTooltip>
                    </ul>
                  </article>
                  {!['ACTIVE', 'REJECTED'].includes(
                    business?.applicationStatus
                  ) && (
                    <menu className="w-fit flex items-center gap-5">
                      <CustomTooltip label="Click to update">
                        <FontAwesomeIcon
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(
                              setSelectedBusinessGeneralComment(generalComment)
                            );
                            dispatch(
                              setUpdateBusinessGeneralCommentModal(true)
                            );
                          }}
                          className="p-2 rounded-full bg-primary text-white px-[8px] cursor-pointer transition-all duration-300 hover:scale-[1.01]"
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
                              setSelectedBusinessGeneralComment(generalComment)
                            );
                            dispatch(
                              setDeleteBusinessGeneralCommentModal(true)
                            );
                          }}
                          className="p-2 rounded-full bg-red-600 text-white px-[8.1px] cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                          icon={faTrash}
                        />
                      </CustomTooltip>
                    </menu>
                  )}
                </section>
              );
            })}
          </menu>
        )
      )}
      <DeleteBusinessGeneralComment />
      <UpdateBusinessGeneralComment />
    </section>
  );
};

export default BusinessGeneralComments;
