import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import { Button } from '@/components/ui/button';
import { fetchUsersThunk } from '@/states/features/userSlice';
import { AppDispatch } from '@/states/store';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { UUID } from 'crypto';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

interface NameAvailabilityFiltersProps {
  onHandleCode?: (e: string) => void;
  onSelectStatus?: (e: string) => void;
  onSelectAssignedTo?: (e?: UUID) => void;
  onHandleSearch?: (e: string) => void;
  showFilter?: boolean;
}

const NameAvailabilityFilters = ({
  onHandleSearch,
  showFilter = true,
  onSelectStatus,
}: NameAvailabilityFiltersProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

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
          name="searchKey"
          control={control}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  placeholder="Search business name"
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
                    { label: 'Active', value: 'Business' },
                    { label: 'Reserved', value: 'Reserved' },
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
                    onSelectStatus && onSelectStatus(`reset`);
                  }}
                  className="text-primary text-sm underline px-1"
                >
                  Reset
                </Link>
              </label>
            );
          }}
        />
      </fieldset>
      <Button
        variant={'outline'}
        onClick={(e) => {
          e.preventDefault();
          reset();
          onSelectStatus && onSelectStatus("");
          onHandleSearch && onHandleSearch('');
        }}
        className="font-normal px-4 py-1 hover:bg-slate-700 hover:text-white"
      >
        Reset
      </Button>
    </nav>
  );
};

export default NameAvailabilityFilters;
