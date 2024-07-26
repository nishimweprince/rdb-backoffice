import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '@/components/inputs/Input';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import { validateInputs } from '@/helpers/validations.helper';
import Button from '@/components/inputs/Button';
import rdbLogo from '/rdb-logo.png';
import { useEffect, useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLoginMutation } from '@/states/api/authApiSlice';
import { toast } from 'react-toastify';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { AppDispatch } from '@/states/store';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/states/features/userSlice';
import Loader from '@/components/inputs/Loader';

const Login = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm();

  // SET DOCUMENT TITLE
  useEffect(() => {
    document.title = 'Login | RDB Unified Services';
  }, []);

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE LOGIN MUTATION
  const [
    login,
    {
      data: loginData,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
      isError: loginIsError,
      error: loginError,
    },
  ] = useLoginMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    login({
      username: data?.username,
      password: data?.password,
    });
  };

  // HANDLE LOGIN RESPONSE
  useEffect(() => {
    if (loginIsError) {
      toast.error(
        (loginError as ErrorResponse)?.data?.message ||
          'An error occured while logging in. Refresh and try again'
      );
    } else if (loginIsSuccess) {
      dispatch(setToken(loginData?.data?.token));
      dispatch(setUser(loginData?.data?.user));
      navigate('/dashboard');
    }
  }, [
    loginIsSuccess,
    loginIsError,
    loginError,
    dispatch,
    loginData?.data?.token,
    loginData?.data?.user,
    navigate,
  ]);

  return (
    <main className="w-full h-[100vh] flex items-center justify-center bg-background">
      <form
        className="w-[30%] flex flex-col gap-4 mx-auto p-8 rounded-md shadow-md bg-white min-h-[50vh] max-[1200px]:w-[35%] max-[1100px]:w-[40%] max-[1000px]:w-[45%] max-[900px]:w-[50%] max-[850px]:w-[55%] max-[800px]:w-[60%] max-[750px]:w-[65%] max-[700px]:w-[70%] max-[600px]:w-[75%] max-[500px]:w-[80%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <figure className="w-full flex flex-col gap-4 my-2">
          <img src={rdbLogo} alt="RDB Logo" className="w-auto mx-auto" />
        </figure>
        <hr className="h-[1.5px] bg-primary" />
        <fieldset className="grid grid-rows-2 gap-5 w-full my-4">
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Email is required',
              validate: (value) => {
                return (
                  validateInputs(value, 'email') || 'Invalid email address'
                );
              },
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    required
                    label="Username"
                    placeholder="Enter email address"
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('username');
                    }}
                  />
                  {errors?.username && (
                    <InputErrorMessage message={errors?.username?.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    label="Password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    {...field}
                    suffixIcon={showPassword ? faEyeSlash : faEye}
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                  />
                  {errors?.password && (
                    <InputErrorMessage message={errors?.password?.message} />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="flex flex-col gap-4 w-full">
          <Button primary submit>
            {loginIsLoading ? <Loader /> : 'Login'}
          </Button>
          <Button styled={false} className="hover:underline">
            Forgot password?
          </Button>
        </menu>
      </form>
    </main>
  );
};

export default Login;
