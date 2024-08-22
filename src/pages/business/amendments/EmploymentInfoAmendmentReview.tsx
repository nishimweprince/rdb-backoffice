import { useState } from 'react';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentsReview';
import moment from 'moment';
import { EmploymentInfo } from '@/types/models/business';

const EmploymentInfoAmendmentReview = () => {
  // STATE VARIABLES
  const [selectedTab, setSelectedTab] = useState('request-summary');
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
      <BusinessAmendmentNavigation
        onSelectTab={(slug) => {
          setSelectedTab(slug);
        }}
      />
      {selectedTab === 'request-summary' && (
        <BusinessAmendmentRequestSummary
          businessAmendment={selectedBusinessAmendment}
        />
      )}
      {selectedTab === 'current-details' && (
        <menu className="grid grid-cols-2 gap-5 w-full">
          <p>
            Working Start Time:{' '}
            {(selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo)
              ?.workingStartTime || 'N/A'}
          </p>
          <p>
            Working End Time:{' '}
            {(selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo)
              ?.workingEndTime || 'N/A'}
          </p>
          <p>
            Number Of Employees:{' '}
            {(selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo)
              ?.numberOfEmployees || 'N/A'}
          </p>
          <p>
            Hiring Date:{' '}
            {(selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo)
              ?.hiringDate &&
              new Date(
                String(
                  (
                    selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo
                  )?.hiringDate
                )
              ).toLocaleDateString()}
          </p>
          <p>
            Employment Declaration Date:{' '}
            {(selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo)
              ?.employmentDeclarationDate &&
              new Date(
                String(
                  (
                    selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo
                  )?.employmentDeclarationDate
                )
              ).toLocaleDateString()}
          </p>
          <p>
            Financial Year Start Date:{' '}
            {moment(
              (selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo)
                ?.financialYearStartDate
            ).format('MMMM DD')}
          </p>
          <p>
            Financial Year End Date:{' '}
            {moment(
              (selectedBusinessAmendment?.oldValue as unknown as EmploymentInfo)
                ?.financialYearEndDate
            )
              .subtract(1, 'day')
              .format('MMMM DD')}
          </p>
        </menu>
      )}
      {selectedTab === 'proposed-changes' && (
        <menu className="grid grid-cols-2 gap-5 w-full">
          <p>
            Working Start Time:{' '}
            {(selectedBusinessAmendment?.newValue as unknown as EmploymentInfo)
              ?.workingStartTime || 'N/A'}
          </p>
          <p>
            Working End Time:{' '}
            {(selectedBusinessAmendment?.newValue as unknown as EmploymentInfo)
              ?.workingEndTime || 'N/A'}
          </p>
          <p>
            Number Of Employees:{' '}
            {(selectedBusinessAmendment?.newValue as unknown as EmploymentInfo)
              ?.numberOfEmployees || 'N/A'}
          </p>
          <p>
            Hiring Date:{' '}
            {(selectedBusinessAmendment?.newValue as unknown as EmploymentInfo)
              ?.hiringDate &&
              new Date(
                String(
                  (
                    selectedBusinessAmendment?.newValue as unknown as EmploymentInfo
                  )?.hiringDate
                )
              ).toLocaleDateString()}
          </p>
          <p>
            Employment Declaration Date:{' '}
            {(selectedBusinessAmendment?.newValue as unknown as EmploymentInfo)
              ?.employmentDeclarationDate &&
              new Date(
                String(
                  (
                    selectedBusinessAmendment?.newValue as unknown as EmploymentInfo
                  )?.employmentDeclarationDate
                )
              ).toLocaleDateString()}
          </p>
          <p>
            Financial Year Start Date:{' '}
            {moment(
              (selectedBusinessAmendment?.newValue as unknown as EmploymentInfo)
                ?.financialYearStartDate
            ).format('MMMM DD')}
          </p>
          <p>
            Financial Year End Date:{' '}
            {moment(
              (selectedBusinessAmendment?.newValue as unknown as EmploymentInfo)
                ?.financialYearEndDate
            )
              .subtract(1, 'day')
              .format('MMMM DD')}
          </p>
        </menu>
      )}
    </main>
  );
};

export default EmploymentInfoAmendmentReview;
