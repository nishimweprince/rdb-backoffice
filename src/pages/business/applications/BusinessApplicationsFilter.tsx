import CustomPopover from '@/components/inputs/CustomPopover';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import { Button } from '@/components/ui/button';
import { applicationReviewStatuses } from '@/constants/business.constants';
import { capitalizeString } from '@/helpers/strings.helper';
import { fetchServicesThunk } from '@/states/features/serviceSlice';
import { fetchUsersThunk } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

interface BusinessApplicationsFilterProps {
  onSelectService: (serviceId?: UUID) => void;
  onSelectApplicationStatus: (status: string[]) => void;
  onSelectUser: (userId?: UUID) => void;
}

const BusinessApplicationsFilter = ({
  onSelectService,
  onSelectApplicationStatus,
  onSelectUser,
}: BusinessApplicationsFilterProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, fetchServicesIsSuccess, fetchServicesIsFetching } =
    useSelector((state: RootState) => state.service);
  const { usersList, fetchUsersIsFetching, fetchUsersIsSuccess } = useSelector(
    (state: RootState) => state.user
  );
  const [selectedApplicationStatuses, setSelectedApplicationStatuses] =
    useState<string[]>([
      'SUBMITTED',
      'AMENDMENT_SUBMITTED',
      'APPROVED',
      'ACTIVE',
      'IN_REVIEW',
      'ACTION_REQUIRED',
      'RESUBMITTED',
      'PENDING_DECISION',
    ]);

  // REACT HOOK FORM
  const { control } = useForm();

  // FETCH SERVICES
  useEffect(() => {
    dispatch(fetchServicesThunk({ category: 'business' }));
  }, [dispatch]);

  // FETCH USERS
  useEffect(() => {
    dispatch(
      fetchUsersThunk({
        page: 1,
        size: 100,
        roles: ['APPROVER', 'VERIFIER'],
        searchKey: '',
      })
    );
  }, [dispatch]);

  return (
    <nav className="grid grid-cols-4 gap-5 w-full items-start">
      {fetchServicesIsFetching ? (
        <Loader className="text-primary" />
      ) : (
        fetchServicesIsSuccess && (
          <Controller
            name="serviceId"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    {...field}
                    placeholder="Select application stype"
                    options={servicesList?.map((service) => {
                      return {
                        label: service?.name,
                        value: service?.id,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e);
                      onSelectService(e as UUID);
                    }}
                  />
                  <Link
                    to={`#`}
                    className="text-[13px] underline text-primary px-1"
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange(null);
                      onSelectService(undefined);
                    }}
                  >
                    Reset
                  </Link>
                </label>
              );
            }}
          />
        )
      )}
      <label className="w-full flex flex-col gap-1">
        <CustomPopover
          trigger={
            <Button
              className="w-full flex items-center gap-2 h-[38px] text-primary"
              variant="outline"
            >
              <FontAwesomeIcon icon={faFilter} />
              Filter status
            </Button>
          }
        >
          <menu className="flex flex-col gap-2">
            {applicationReviewStatuses?.map((status, index) => {
              return (
                <Input
                  type="checkbox"
                  label={capitalizeString(status)}
                  key={index}
                  checked={selectedApplicationStatuses.includes(status)}
                  onChange={(e) => {
                    if (e) {
                      setSelectedApplicationStatuses([
                        ...selectedApplicationStatuses,
                        status,
                      ]);
                    } else {
                      setSelectedApplicationStatuses(
                        selectedApplicationStatuses.filter(
                          (selectedStatus) => selectedStatus !== status
                        )
                      );
                    }
                  }}
                />
              );
            })}
            <Button
              variant={'default'}
              className="self-end py-[3px] px-[9px] w-fit text-white mt-2"
              onClick={(e) => {
                e.preventDefault();
                onSelectApplicationStatus(selectedApplicationStatuses);
              }}
            >
              Select
            </Button>
          </menu>
        </CustomPopover>
        <Link
          to={`#`}
          className="text-[13px] underline text-primary px-1"
          onClick={(e) => {
            e.preventDefault();
            setSelectedApplicationStatuses(applicationReviewStatuses);
            onSelectApplicationStatus(applicationReviewStatuses);
          }}
        >
          Reset
        </Link>
      </label>
      {fetchUsersIsFetching ? (
        <Loader className="text-primary" />
      ) : (
        fetchUsersIsSuccess && (
          <Controller
            name="userId"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    {...field}
                    placeholder="Filter by user"
                    options={usersList?.map((user) => {
                      return {
                        label: `${user?.firstName || user?.username || ''} ${
                          user?.lastName || ''
                        }`,
                        value: user?.id,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e);
                      onSelectUser(e as UUID);
                    }}
                  />
                  <Link
                    to={`#`}
                    className="text-[13px] underline text-primary px-1"
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange(null);
                      onSelectUser(undefined);
                    }}
                  >
                    Reset
                  </Link>
                </label>
              );
            }}
          />
        )
      )}
    </nav>
  );
};

export default BusinessApplicationsFilter;
