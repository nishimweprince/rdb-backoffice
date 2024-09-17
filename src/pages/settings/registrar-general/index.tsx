import CustomPopover from "@/components/inputs/CustomPopover"
import CustomTooltip from "@/components/inputs/CustomTooltip"
import Loader from "@/components/inputs/Loader"
import CustomBreadcrumb from "@/components/navigation/CustomBreadcrumb"
import Table from "@/components/table/Table"
import { navigationPaths } from "@/constants/dashboard.constants"
import StaffLayout from "@/containers/navigation/StaffLayout"
import {
  faEllipsisVertical,
  faEye,
  faTrash,
  faCheckCircle,
  faBan,
  faPlus
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ColumnDef, Row } from "@tanstack/react-table"
import useFetchRegistrarGeneral from "./hooks/useFetchRegistrarGeneral"
import { registrarGeneralColumns } from "@/constants/registrarGeneral.constants"
import { RegistrarGeneralType } from "@/types/models/registrarGeneral"
import Button from "@/components/inputs/Button"
import AddRegistrar from "./AddRegistrar"
import useAddRegistrar from "./hooks/useAddRegistrar"
import { useState } from "react"
import Modal from "@/components/cards/Modal"

const RegistrarGeneral = () => {
  // STATE VARIABLES
  const { registrarGeneralData, isLoading, isSuccess, refetch } =
    useFetchRegistrarGeneral()
  const {
    showAddRegistrar,
    setShowAddRegistrar,
    handleInactivateOrActivate,
    inactivatingOrActivating,
    handleDeleteConfiguration
  } = useAddRegistrar({ refetch })
  const [showSignature, setShowSignature] = useState(false)
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null)

  // NAVIGATION LINKS
  const navigationExtendedPaths = [
    ...navigationPaths,
    {
      label: "Registrar General",
      route: "/settings/registrar-general"
    }
  ]

  const registraGeneralExtendedColumns = [
    ...registrarGeneralColumns,
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ row }: { row: Row<RegistrarGeneralType> }) => {
        const status = row.original.status.toLowerCase()
        const isActive = status === "active"

        return (
          // <CustomPopover
          //   trigger={
          //     <menu className="flex items-center justify-center w-full gap-2 text-[12px] cursor-pointer">
          //       <CustomTooltip label="Click to view options">
          //         <FontAwesomeIcon
          //           className="text-primary text-md p-0 transition-all duration-300 hover:scale-[.98]"
          //           icon={faEllipsisVertical}
          //         />
          //       </CustomTooltip>
          //     </menu>
          //   }
          // >
          //  <menu>
          //    <label>View Signature {row.original.status}</label>
          //  </menu>
          // </CustomPopover>

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
                  setSignatureBase64(row.original.binaryValue)
                  setShowSignature(true)
                }}
              >
                <FontAwesomeIcon icon={faEye} className="text-primary" />
                View Signature
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
                        ? "Registrar General inactivated successfully"
                        : "Registrar General activated successfully"
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
              <label
                className="flex items-center gap-2 cursor-pointer"
                onClick={() =>
                  handleDeleteConfiguration(
                    row.original.id,
                    "Registrar General deleted successfully"
                  )
                }
              >
                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                Delete
              </label>
            </menu>
          </CustomPopover>
        )
      }
    }
  ]

  return (
    <StaffLayout>
      <main className="flex flex-col w-full gap-4 p-6">
        <section className="flex items-center justify-between w-full">
          <CustomBreadcrumb navigationLinks={navigationExtendedPaths} />
          <Button
            primary
            onClick={() => setShowAddRegistrar(true)}
            className="cursor-pointer"
          >
            <section className="flex items-center gap-2">
              <FontAwesomeIcon
                className="text-white text-md p-0 transition-all duration-300 hover:scale-[.98]"
                icon={faPlus}
              />
              <label className="cursor-pointer">New Registrar</label>
            </section>
          </Button>
        </section>
        {isLoading ? (
          <Loader />
        ) : (
          isSuccess && (
            <Table
              data={registrarGeneralData}
              columns={
                registraGeneralExtendedColumns as ColumnDef<RegistrarGeneralType>[]
              }
            />
          )
        )}
        <AddRegistrar isOpen={showAddRegistrar} onClose={setShowAddRegistrar} />
        <Modal isOpen={showSignature} onClose={() => setShowSignature(false)}>
          <section className="flex flex-col gap-4 p-4">
            <label className="text-lg font-semibold">Signature</label>
            <img
              src={
                signatureBase64
                  ? `data:image/png;base64,${signatureBase64}`
                  : ""
              }
              alt="signature"
              className="h-auto max-w-full"
            />
          </section>
        </Modal>
      </main>
    </StaffLayout>
  )
}

export default RegistrarGeneral
