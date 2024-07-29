import store from 'store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';
import OTPInputs from '../../components/inputs/OTPInputs';
import { useState } from 'react';
import Loader from '@/components/inputs/Loader';
import { Link, useNavigate } from 'react-router-dom';

const VerifyPasswordReset = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      store.set('passwordResetCode', data?.otp);
      navigate('/auth/reset-password/new');
      setIsLoading(false);
    }, 1000);
    return data;
  };

  return (
    <main className="flex flex-col gap-3 w-full bg-background">
      <section className="w-full h-full min-h-[100vh] flex flex-col items-center justify-center">
        <form
          className="bg-white w-[35%] rounded-md shadwow-sm flex flex-col gap-6 py-8 px-6 max-w-[600px] max-[1450px]:w-[40%] max-[1300px]:w-[45%] max-[1200px]:w-[50%] max-[1100px]:w-[55%] max-[900px]:w-[55%] max-[800px]:w-[60%] max-[700px]:w-[65%] max-[600px]:w-[70%] max-[550px]:w-[75%] max-[500px]:w-[80%] max-[450px]:w-[85%] max-[400px]:w-[90%] max-[350px]:w-[95%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <menu className="flex flex-col w-full gap-2 items-center justify-center">
            <h1 className="flex text-center text-primary text-xl uppercase font-semibold">
              {'Verify account'}
            </h1>
            <p className='text-primary'>{store.get('email')}</p>
            <p className="text-center text-secondary text-[14px] max-w-[90%]">
              {
                'Enter the One-time Password sent to your email. Please check your spam folder if you do not find the email in your inbox.'
              }
            </p>
          </menu>
          <menu className="flex flex-col w-full gap-4">
            <Controller
              name="otp"
              rules={{
                required: `OTP is required`,
                validate: (value) => {
                  if (value.length !== 6) {
                    return `Invalid OTP`;
                  }
                  return true;
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-center gap-2 w-[90%] mx-auto">
                    <OTPInputs
                      length={6}
                      className="justify-center"
                      {...field}
                    />
                    {errors?.otp && (
                      <p className="text-red-600 text-[13px] text-center">
                        {String(errors?.otp?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <ul className="w-full flex flex-col gap-3 items-center justify-center">
              <Button className="w-[90%] mx-auto !text-[14px]" submit primary>
                {isLoading ? <Loader /> : 'Verify'}
              </Button>
              <p className="text-secondary text-[14px]">
                {'If you did not receive the code'},{' '}
                <span className="text-primary font-medium text-[14px]">
                  <Link to={'#'} className="text-[14px]">
                    Resend OTP
                  </Link>
                </span>
              </p>
              <Button
                className="!text-[14px]"
                styled={false}
                route="/auth/reset-password/request"
              >
                <menu className="flex !text-[15px] items-center gap-2 ease-in-out duration-200 hover:gap-3 max-[700px]:text-[14px] max-[500px]:text-[13px]">
                  <FontAwesomeIcon icon={faArrowLeft} />
                  {'Back'}
                </menu>
              </Button>
            </ul>
          </menu>
        </form>
      </section>
    </main>
  );
};

export default VerifyPasswordReset;
