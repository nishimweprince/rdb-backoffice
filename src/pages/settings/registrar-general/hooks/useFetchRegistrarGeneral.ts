import { useLazyFetchRegistrarGeneralQuery } from "@/states/api/settingsApiSlice";
import { setRegistrarGeneralList } from "@/states/features/executiveManagementSlice";
import { RootState } from "@/states/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useFetchRegistrarGeneral(){
    const dispatch = useDispatch();
    const [
        fetchRegistrarGeneral, 
        {  
        data, 
        isSuccess,
        error, 
        isLoading 
    }] = useLazyFetchRegistrarGeneralQuery();

    // Select from the state 
    const {registrarGeneralList: registrarGeneralData} = useSelector((state: RootState) => state.executiveManagement);

    useEffect(() => {
        fetchRegistrarGeneral({type: 'REGISTRAR_GENERAL', page: 1, size: 100});
    }
    , []);

    useEffect(() => {
        if(data?.status){
            dispatch(setRegistrarGeneralList(data?.data || []));
        }
    }
    , [data]);

    const refetch = () => {
        fetchRegistrarGeneral({type: 'REGISTRAR_GENERAL', page: 1, size: 100});
    }

    return {
        data,
        error,
        isLoading,
        isSuccess,
        registrarGeneralData,
        refetch
    }
}