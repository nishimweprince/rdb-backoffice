import Input from '@/components/inputs/Input';
import { Button } from '@/components/ui/button';
import { fetchUsersThunk } from '@/states/features/userSlice';
import { AppDispatch } from '@/states/store';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

interface CurrencySettingsProps {
  onHandleCode?: (e: string) => void;
  onHandleSearch?: (e: string) => void;
  showFilter?: boolean;
}

const CurrencySettingsFilters = ({
  onHandleSearch,
  showFilter = true,
}: CurrencySettingsProps) => {
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
      className={`flex flex-col gap-3  w-full items-start ${
        showFilter ? 'flex' : 'h-0 invisible'
      }`}
    >
      <fieldset className="grid grid-cols-4 gap-3 w-full">
        <Controller
          name="searchKey"
          control={control}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1 w-4/4">
                <Input
                  placeholder="Application reference number"
                  {...field}
                  suffixIcon={faSearch}
                  suffixIconPrimary
                  suffixIconHandler={(e) => {
                    e.preventDefault();
                    // return if field value is empty or undefined or length without spaces is 0
                    if (!field?.value || !field?.value.trim().length) return;
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
      </fieldset>
      <Button
        variant={'outline'}
        onClick={(e) => {
          e.preventDefault();
          reset();
          onHandleSearch && onHandleSearch('');
        }}
        className="font-normal px-4 py-1 hover:bg-slate-700 hover:text-white"
      >
        Reset
      </Button>
    </nav>
  );
};

export default CurrencySettingsFilters;
