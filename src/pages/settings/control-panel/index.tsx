import CustomPopover from "@/components/inputs/CustomPopover"
import CustomTooltip from "@/components/inputs/CustomTooltip"
import Loader from "@/components/inputs/Loader"
import CustomBreadcrumb from "@/components/navigation/CustomBreadcrumb"
import Table from "@/components/table/Table"
import { navigationPaths } from "@/constants/dashboard.constants"
import StaffLayout from "@/containers/navigation/StaffLayout"
import {
  faEllipsisVertical,
  faCheckCircle,
  faBan,
  faEdit
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ColumnDef, Row } from "@tanstack/react-table"
import Modal from "@/components/cards/Modal"
import {
  useLazyFetchOtherConfigurationsQuery,
  useUpdateConfigurationValueMutation
} from "@/states/api/settingsApiSlice"
import { useEffect, useState } from "react"
import { setConfigurations } from "@/states/features/controlPanelSlice"
import { useDispatch, useSelector } from "react-redux"
import { configurationsColumns } from "@/constants/configurations"
import { Configuration } from "@/types/models/configurations"
import { RootState } from "@/states/store"
import useAddRegistrar from "../registrar-general/hooks/useAddRegistrar"
import Button from "@/components/inputs/Button"
import { Controller, useForm } from "react-hook-form"
import Input from "@/components/inputs/Input"
import { toast } from "react-toastify"

const ControlPanel = () => {
  // STATE VARIABLES
  const [showEditConfiguration, setShowEditConfiguration] = useState(false)
  const [selectedConfiguration, setSelectedConfiguration] =
    useState<Configuration | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { configurations } = useSelector(
    (state: RootState) => state.configuration
  )
  const dispatch = useDispatch()

  // INITIALIZE FETCH
  const [fetchOtherConfigurations, { data, isSuccess, isLoading }] =
    useLazyFetchOtherConfigurationsQuery()

  const refetch = () => {
    fetchOtherConfigurations({ page: 1, size: 20 })
  }

  const { handleInactivateOrActivate, inactivatingOrActivating } =
    useAddRegistrar({ refetch })

  // INITIALIZE UPDATE VALUE
  const [
    updateValue,
    {
      isLoading: updateValueIsLoading,
      isSuccess: updateValueIsSuccess,
      isError: updateValueIsError,
      error: updateValueError
    }
  ] = useUpdateConfigurationValueMutation()

  // NAVIGATION LINKS
  const navigationExtendedPaths = [
    ...navigationPaths,
    {
      label: "Control Panel",
      route: "/settings/control-panel"
    }
  ]

  // FETCH DATA

  useEffect(() => {
    fetchOtherConfigurations({ page: 1, size: 20 })
  }, [])

  // Handle fetch data
  useEffect(() => {
    if (data?.status) {
      dispatch(setConfigurations(data?.data?.data || []))
    }
  }, [data])

  // Handle update value
  useEffect(() => {
    if (updateValueIsSuccess) {
      refetch()
      setShowEditConfiguration(false)
    } else if (updateValueIsError) {
      toast.error("An error occurred while updating configuration value")
    }
  }, [updateValueIsSuccess])

  const configurationsExtendedColumns = [
    ...configurationsColumns,
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ row }: { row: Row<Configuration> }) => {
        const status = row.original.status.toLowerCase()
        const isActive = status === "active"

        return (
          <CustomPopover
            trigger={
              <menu className="flex items-center justify-center w-full gap-2 text-[12px] cursor-pointer">
                <CustomTooltip label="Click to view options">
                  <FontAwesomeIcon
                    className="text-primary text-md p-0 transition-all duration-300 hover:scale-[.98]"
                    icon={faEllipsisVertical}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <menu className="flex flex-col gap-2 p-2">
              <label
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setSelectedConfiguration(row.original)
                  setShowEditConfiguration(true)
                }}
              >
                <FontAwesomeIcon icon={faEdit} className="text-primary" />
                Edit
              </label>
              {inactivatingOrActivating ? (
                <Loader />
              ) : (
                <label
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() =>
                    handleInactivateOrActivate(
                      row.original.id,
                      isActive ? "inactivate" : "activate",
                      isActive
                        ? "Configuration has been inactivated"
                        : "Configuration has been activated"
                    )
                  }
                >
                  <FontAwesomeIcon
                    icon={isActive ? faBan : faCheckCircle}
                    className="text-primary"
                  />
                  {isActive ? "Make Inactive" : "Make Active"}
                </label>
              )}
            </menu>
          </CustomPopover>
        )
      }
    }
  ]

  return (
    <StaffLayout>
      <main className="flex flex-col w-full gap-8 p-6">
        <section className="flex items-center justify-between w-full">
          <CustomBreadcrumb navigationLinks={navigationExtendedPaths} />
        </section>
        {isLoading ? (
          <Loader />
        ) : (
          isSuccess && (
            <section className="flex flex-col justify-between w-full gap-2">
              <h1 className="text-2xl font-bold text-primary">
                All Configurations
              </h1>
              <Table
                data={configurations}
                columns={
                  configurationsExtendedColumns as ColumnDef<Configuration>[]
                }
              />
            </section>
          )
        )}
        <Modal
          isOpen={showEditConfiguration}
          onClose={() => setShowEditConfiguration(false)}
        >
          <section className="flex flex-col gap-10 px-6">
            <h1 className="text-2xl font-bold text-primary">
              Edit configuration value
            </h1>
            <form
              className="flex flex-col w-full gap-6"
              onSubmit={handleSubmit((data) => {
                updateValue({
                  id: selectedConfiguration?.id || "",
                  body: {
                    parameterValue: data.value
                  }
                })
              })}
            >
              <Controller
                name="value"
                defaultValue={selectedConfiguration?.parameterValue}
                control={control}
                rules={{ required: "Value is required" }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Input
                        required
                        placeholder="Value"
                        label="Value"
                        {...field}
                      />
                      {errors?.value && (
                        <p className="text-sm text-red-500">
                          {String(errors?.value?.message)}
                        </p>
                      )}
                    </label>
                  )
                }}
              />
              <menu
                className={`flex items-center gap-3 w-full mx-auto justify-end  max-sm:flex-col-reverse`}
              >
                <Button primary submit>
                  {updateValueIsLoading ? <Loader /> : "Save"}
                </Button>
              </menu>
            </form>
          </section>
        </Modal>
      </main>
    </StaffLayout>
  )
}

export default ControlPanel
