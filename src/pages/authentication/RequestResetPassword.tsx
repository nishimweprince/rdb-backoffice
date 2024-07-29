import store from 'store';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Input from '@/components/inputs/Input';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import rdbLogo from '/rdb-logo.png';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import { useRequestPasswordResetMutation } from '@/states/api/authApiSlice';
import { useEffect } from 'react';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequestResetPassword = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();

  // SET DOCUMENT TITLE
  useEffect(() => {
    document.title = 'Reset Password | RDB Unified Services';
  }, []);

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE FORGOT PASSWORD MUTATION
  const [
    forgotPassword,
    {
      error: forgotPasswordError,
      isLoading: forgotPasswordIsLoading,
      isSuccess: forgotPasswordIsSuccess,
      isError: forgotPasswordIsError,
    },
  ] = useRequestPasswordResetMutation();

  // HANDLE FORGOT PASSWORD RESPONSE
  useEffect(() => {
    if (forgotPasswordIsSuccess) {
      store.set('email', watch('email'));
      navigate('/auth/reset-password/verify');
    } else if (forgotPasswordIsError) {
      const errorResponse =
        (forgotPasswordError as ErrorResponse)?.data?.message ||
        'An error occurred while sending reset password link. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    forgotPasswordIsSuccess,
    forgotPasswordIsError,
    navigate,
    forgotPasswordError,
    watch,
  ]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    forgotPassword({
      email: data?.email,
    });
  };

  return (
    <main className="w-full h-[100vh] items-center justify-center flex bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[30%] flex flex-col gap-4 mx-auto p-8 rounded-md shadow-md bg-white min-h-[15hv] max-[1200px]:w-[35%] max-[1100px]:w-[40%] max-[1000px]:w-[45%] max-[900px]:w-[50%] max-[850px]:w-[55%] max-[800px]:w-[60%] max-[750px]:w-[65%] max-[700px]:w-[70%] max-[600px]:w-[75%] max-[500px]:w-[80%]"
      >
        <figure className="w-full flex flex-col gap-4 my-2">
          <img
            src={rdbLogo}
            alt="RDB Logo"
            className="w-auto max-w-40 mx-auto"
          />
        </figure>
        <hr className="h-[1.5px] bg-primary" />
        <article className="flex flex-col gap-1 w-full">
          <h1 className="text-lg uppercase font-bold text-center text-primary">
            Reset Password
          </h1>
          <p className="text-center text-sm text-secondary">
            Enter the email address associated with your account.
          </p>
        </article>
        <fieldset className="flex items-center w-full">
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    label="Email"
                    placeholder="Enter your email address"
                    required
                  />
                  {errors?.email && (
                    <InputErrorMessage message={errors?.email?.message} />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="flex items-center justify-between gap-4 w-full max-[350px]:flex-col-reverse">
          <Button route="/auth/login" className="hover:underline">
            Back
          </Button>
          <Button primary submit>
            {forgotPasswordIsLoading ? <Loader /> : 'Submit'}
          </Button>
        </menu>
      </form>
    </main>
  );
};

export default RequestResetPassword;
