/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useAddRegistrarGeneralMutation,
  useDeleteRegistrarGeneralMutation,
  useInactiveOrActiveRegistrarGeneralMutation,
  useUploadRegistrarGeneralSignatureMutation,
} from '@/states/api/settingsApiSlice';

// Define Zod schema

interface AddRegistrarDto {
  parameterName: string;
  parameterValue: string;
  signature: File;
}
const schema: z.ZodType<AddRegistrarDto> = z.object({
  parameterName: z.string().min(1, { message: 'Name is required' }),
  parameterValue: z.string().min(1, { message: 'Position is required' }),
  signature: z.instanceof(File, {
    message: 'Signature is required and must be a file',
  }),
});

interface Props {
  refetch: () => void;
}

export default function useAddRegistrar(props: Props) {
  const [showAddRegistrar, setShowAddRegistrar] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddRegistrarDto>({
    resolver: zodResolver(schema), // Use zodResolver with your schema
  });

  const [addRegistrarGeneral, { isLoading: creatingRegistrarGeneral }] =
    useAddRegistrarGeneralMutation();

  // upload signature image

  const [uploadSignature, { isLoading: uploadingSignature }] =
    useUploadRegistrarGeneralSignatureMutation();

  // activate or inactivate registrar general
  const [inactivateOrActivate, { isLoading: inactivatingOrActivating }] =
    useInactiveOrActiveRegistrarGeneralMutation();

  // delete registrar general
  const [deleteRegistrarGeneral] = useDeleteRegistrarGeneralMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue('signature', file);
    } else {
      toast.info('No file selected');
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setValue('signature', undefined as unknown as File);
  };

  const onSubmit = async (data: AddRegistrarDto) => {
    try {
      const { signature, ...rest } = data;
      const response = await addRegistrarGeneral({
        ...rest,
        parameterType: 'REGISTRAR_GENERAL',
      }).unwrap();
      if (response) {
        if (signature) {
          const formData = new FormData();
          formData.append('file', signature);
          const uploadResponse = await uploadSignature({
            id: response?.data.id,
            formData,
          }).unwrap();
          if (uploadResponse) {
            toast.success('Registrar General added successfully');
            reset();
            props?.refetch && props.refetch();
            setShowAddRegistrar(false);
            setShowAddRegistrar(false);
          }
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          'An error occurred while adding registrar general'
      );
    }
  };

  const handleInactivateOrActivate = async (
    id: string,
    action: 'activate' | 'inactivate'
  ) => {
    try {
      const response = await inactivateOrActivate({ id, action }).unwrap();
      if (response) {
        toast.success(`Registrar General ${action}d successfully`);
        props?.refetch && props.refetch();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `An error occurred while ${action}ing registrar general`
      );
    }
  };

  const handleDeleteRegistrarGeneral = async (id: string) => {
    try {
      const response = await deleteRegistrarGeneral(id).unwrap();
      if (response) {
        toast.success('Registrar General deleted successfully');
        props?.refetch && props.refetch();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          'An error occurred while deleting registrar general'
      );
    }
  };

  return {
    showAddRegistrar,
    setShowAddRegistrar,
    handleSubmit,
    onSubmit,
    register,
    errors,
    control,
    setValue,
    handleImageChange,
    handleRemoveImage,
    uploadedImage,
    isLoading: creatingRegistrarGeneral || uploadingSignature,
    handleInactivateOrActivate,
    inactivatingOrActivating,
    handleDeleteRegistrarGeneral,
  };
}
