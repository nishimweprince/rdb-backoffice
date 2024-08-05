import { Link } from 'react-router-dom';
import { businessId } from '@/types/models/business';
import { ReactNode, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBusinessReviewCommentsThunk,
  setCreateBusinessReviewCommentModal,
  setListBusinessReviewCommentsModal,
} from '@/states/features/businessReviewCommentSlice';
import { setSelectedBusinessNavigationFlow } from '@/states/features/navigationFlowSlice';
import { NavigationFlow } from '@/types/models/navigationFlow';
import Loader from '../inputs/Loader';

type BusinessPreviewCardProps = {
  header: string;
  children: ReactNode;
  businessId?: businessId;
  applicationStatus?: string;
  businessNavigationFlow?: NavigationFlow;
};

const BusinessPreviewCard = ({
  children,
  header,
  businessNavigationFlow,
  businessId,
}: BusinessPreviewCardProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessReviewCommentsList,
    businessReviewCommentsIsFetching,
    businessReviewCommentsIsSuccess,
  } = useSelector((state: RootState) => state.businessReviewComment);

  // FETCH BUSINESS REVIEW COMMENTS
  useEffect(() => {
    if (businessNavigationFlow?.id) {
      dispatch(
        fetchBusinessReviewCommentsThunk({
          navigationFlowId: businessNavigationFlow?.id,
          businessId,
        })
      );
    }
  }, [businessId, businessNavigationFlow, dispatch]);

  return (
    <section
      className={`flex flex-col w-full gap-3 p-4 rounded-md shadow-sm border-primary border-[.3px]`}
    >
      <menu className="flex items-center justify-between w-full gap-3">
        <Link
          to={'#'}
          onClick={(e) => {
            e.preventDefault();
          }}
          className="text-lg font-semibold uppercase text-primary"
        >
          {header}
        </Link>
        {businessReviewCommentsIsFetching ? (
          <figure className="flex items-center gap-2 text-[12px]">
            <Loader className="text-primary" />
            Loading comments
          </figure>
        ) : businessReviewCommentsIsSuccess &&
          businessReviewCommentsList?.filter(
            (reviewComment) =>
              reviewComment?.navigationFlow?.id === businessNavigationFlow?.id
          )?.length > 0 ? (
          <Link
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedBusinessNavigationFlow(businessNavigationFlow));
              dispatch(setListBusinessReviewCommentsModal(true));
            }}
            className="bg-white text-primary text-[12px] p-1 px-2 rounded-md transition-all ease-in-out duration-300 hover:scale-[1.01]"
          >
            <menu className="flex items-center gap-2">
              <FontAwesomeIcon icon={faComments} />
              View comments
            </menu>
          </Link>
        ) : (
          <Link
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateBusinessReviewCommentModal(true));
              dispatch(
                setSelectedBusinessNavigationFlow(businessNavigationFlow)
              );
            }}
            className="bg-primary text-white text-[12px] p-1 px-2 rounded-md transition-all ease-in-out duration-300 hover:scale-[1.01]"
          >
            <menu className="flex items-center gap-2">
              <FontAwesomeIcon className="text-[12px]" icon={faPenToSquare} />
              <p>Add comment</p>
            </menu>
          </Link>
        )}
      </menu>
      <section className="flex flex-col w-full gap-3 my-2">{children}</section>
    </section>
  );
};

export default BusinessPreviewCard;
