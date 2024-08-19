import StaffLayout from '@/containers/navigation/StaffLayout';
import { useParams } from 'react-router-dom';

const BusinessAmendmentsReview = () => {

    // NAVIGATION
    const { id } = useParams();

    console.log(id)

  return (
    <StaffLayout>
      <main className="w-full flex flex-col gap-4">
        Review Business amendment
      </main>
    </StaffLayout>
  );
};

export default BusinessAmendmentsReview;
