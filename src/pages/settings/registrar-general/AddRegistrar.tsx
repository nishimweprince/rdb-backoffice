import Modal from "@/components/cards/Modal";
import { Controller } from "react-hook-form";
import useAddRegistrar from "./hooks/useAddRegistrar";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";
import Loader from "@/components/inputs/Loader";


interface Props {
    isOpen: boolean;
    onClose: (value: boolean) => void;
}

const AddRegistrar = ({isOpen, onClose}: Props) => {
    const {control, register, errors, handleSubmit, onSubmit, uploadedImage, handleImageChange, handleRemoveImage, isLoading} = useAddRegistrar({refetch: () => {}});

    return (
         <Modal className="min-w-[30vw]" isOpen={isOpen} onClose={() => onClose(!isOpen)}>
            <main className="w-full">
              <section>
              <form
                className="rounded-md flex flex-col gap-6 py-8 px-6 max-w-[600px] max-[1450px]:w-[40%] max-[1300px]:w-[45%] max-[1200px]:w-[50%] max-[1100px]:w-[55%] max-[900px]:w-[55%] max-[800px]:w-[60%] max-[700px]:w-[65%] max-[600px]:w-[70%] max-[550px]:w-[75%] max-[500px]:w-[80%] max-[450px]:w-[85%] max-[400px]:w-[90%] max-[350px]:w-[95%]"
                onSubmit={handleSubmit(onSubmit)}
                >
                <menu className="flex flex-col w-full gap-2 items-center justify-center">
                    <h1 className="flex text-center text-primary text-xl uppercase font-semibold">
                    {'Add New Registrar'}
                    </h1>
                </menu>
                <menu className="flex flex-col w-full gap-4">
                    <Controller
                    name="parameterName"
                    control={control}
                    render={({ field }) => {
                        return (
                        <label className="flex flex-col items-start gap-1 w-[90%] mx-auto">
                            <Input
                            type="text"
                            label={'Name'}
                            {...field}
                            {...register("parameterName")}
                            />
                            {(errors?.parameterName ) && (
                            <menu className="flex flex-col gap-1">
                                <p className="text-[13px] text-red-500 ml-1">
                                {errors?.parameterName?.message &&
                                    String(errors?.parameterName?.message)}
                                </p>
                            </menu>
                            )}
                        </label>
                        );
                    }}
                    />
                    <Controller
                    name="parameterValue"
                    control={control}
                    render={({ field }) => {
                        return (
                        <label className="flex flex-col items-start gap-1 w-[90%] mx-auto">
                            <Input
                            type="text"
                            label={'Position'}
                            {...field}
                            {...register("parameterValue")}
                            />
                            {(errors?.parameterValue ) && (
                            <menu className="flex flex-col gap-1">
                                <p className="text-[13px] text-red-500 ml-1">
                                {errors?.parameterValue?.message &&
                                    String(errors?.parameterValue?.message)}
                                </p>
                            </menu>
                            )}
                        </label>
                        );
                    }}
                    />

                    {/* // file upload */}
                    <label className="mt-2 ml-6 text-sm">
                        Upload signature
                    </label>
                    <Controller
                     name="signature"
                     control={control}
                     render={({ field }) => {
                        return (
                        <label className="flex flex-col items-start gap-1 w-[90%] mx-auto">
                            {!uploadedImage ? (
                                <Input
                                    type="file"
                                    accept="image/*"
                                    label={'signature'}
                                    {...field}
                                    onChange={handleImageChange}
                                />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <img src={uploadedImage} alt="Uploaded Signature" className="max-h-40 mb-2" />
                                    <Button type="button" onClick={handleRemoveImage}>
                                        Remove Image
                                    </Button>
                                </div>
                            )}
                            {(errors?.signature ) && (
                            <menu className="flex flex-col gap-1">
                                <p className="text-[13px] text-red-500 ml-1">
                                {errors?.signature?.message &&
                                    String(errors?.signature?.message)}
                                </p>
                            </menu>
                            )}
                        </label>
                        );
                    }}
                    />
                    
                    <ul className="w-full flex flex-col gap-3 items-center justify-center">
                    <Button
                        className="w-[90%] mx-auto !text-[14px]"
                        submit
                        primary
                        disabled={Object.keys(errors)?.length > 0}
                    >
                        {isLoading ? <Loader /> : `Submit`}
                    </Button>
                    </ul>
                </menu>
                </form>
                    </section>
                    </main>
                </Modal>
    );
};

export default AddRegistrar;
