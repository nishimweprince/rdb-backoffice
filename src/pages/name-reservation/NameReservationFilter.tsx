import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import { Button } from '@/components/ui/button';
import { fetchUsersThunk } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { UUID } from 'crypto';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

interface NameReservationFilterProps {
  onHandleCode?: (e: string) => void;
  onSelectStatus?: (e: string) => void;
  onSelectAssignedTo?: (e?: UUID) => void;
  onHandleSearch?: (e: string) => void;
  showFilter?: boolean;
}

const NameReservationFilter = ({
  onHandleSearch,
  showFilter = true,
  onHandleCode,
  onSelectStatus,
  onSelectAssignedTo,
}: NameReservationFilterProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { usersList, fetchUsersIsFetching, fetchUsersIsSuccess } = useSelector(
    (state: RootState) => state.user
  );

  // REACT HOOK FORM
  const { control, reset } = useForm();

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
    <nav
      className={`flex flex-col gap-3 w-full items-start ${
        showFilter ? 'flex' : 'h-0 invisible'
      }`}
    >
      <fieldset className="grid grid-cols-4 gap-3 w-full">
        <Controller
          name="code"
          control={control}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  placeholder="Enter reservation code"
                  {...field}
                  suffixIcon={faSearch}
                  suffixIconPrimary
                  suffixIconHandler={(e) => {
                    e.preventDefault();
                    onHandleCode && onHandleCode(field?.value);
                  }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (e.target.value === '') {
                      onHandleCode && onHandleCode('');
                    }
                  }}
                />
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    field.onChange(undefined);
                    onHandleCode && onHandleCode('');
                  }}
                  className="text-primary text-sm underline px-1"
                >
                  Clear
                </Link>
              </label>
            );
          }}
        />
        <Controller
          name="searchKey"
          control={control}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  placeholder="Search reservation name"
                  {...field}
                  suffixIcon={faSearch}
                  suffixIconPrimary
                  suffixIconHandler={(e) => {
                    e.preventDefault();
                    onHandleSearch && onHandleSearch(field?.value);
                  }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (e.target.value === '') {
                      onHandleSearch && onHandleSearch('');
                    }
                  }}
                />
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    field.onChange(undefined);
                    onHandleSearch && onHandleSearch('');
                  }}
                  className="text-primary text-sm underline px-1"
                >
                  Clear
                </Link>
              </label>
            );
          }}
        />
        <Controller
          name="status"
          control={control}
          defaultValue={''}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-2">
                <Select
                  {...field}
                  placeholder="Select status"
                  options={[
                    { label: 'Submitted', value: 'SUBMITTED' },
                    { label: 'Approved', value: 'APPROVED' },
                    { label: 'Rejected', value: 'REJECTED' },
                  ]}
                  onChange={(e) => {
                    field.onChange(e);
                    onSelectStatus && onSelectStatus(e);
                  }}
                />
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    field.onChange(``);
                    onSelectStatus && onSelectStatus(`SUBMITTED`);
                  }}
                  className="text-primary text-sm underline px-1"
                >
                  Reset
                </Link>
              </label>
            );
          }}
        />
        {fetchUsersIsFetching ? (
          <Loader className="text-primary" />
        ) : (
          fetchUsersIsSuccess && (
            <Controller
              name="assignedTo"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <Select
                      {...field}
                      placeholder="Select assigned to"
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
                        onSelectAssignedTo && onSelectAssignedTo(e as UUID);
                      }}
                    />
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        field.onChange(undefined);
                        onSelectAssignedTo && onSelectAssignedTo(undefined);
                      }}
                      className="text-primary text-sm underline px-1"
                    >
                      Clear
                    </Link>
                  </label>
                );
              }}
            />
          )
        )}
      </fieldset>
      <Button
        variant={'outline'}
        onClick={(e) => {
          e.preventDefault();
          reset();
          onHandleCode && onHandleCode('');
          onSelectStatus && onSelectStatus('SUBMITTED');
          onSelectAssignedTo && onSelectAssignedTo(undefined);
          onHandleSearch && onHandleSearch('');
        }}
        className="font-normal px-4 py-1 hover:bg-slate-700 hover:text-white"
      >
        Reset
      </Button>
    </nav>
  );
};

export default NameReservationFilter;
