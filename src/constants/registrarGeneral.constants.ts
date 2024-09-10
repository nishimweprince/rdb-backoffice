import { capitalizeString, formatDate } from "@/helpers/strings.helper"
import { RegistrarGeneralType } from "@/types/models/registrarGeneral"
import { Row } from "@tanstack/react-table"

export const registrarGeneralColumns = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }: { row: Row<RegistrarGeneralType> }) =>
      `${row?.original?.parameterName}`
  },
  {
    header: "Position Label",
    accessorKey: "positionLabel",
    cell: ({ row }: { row: Row<RegistrarGeneralType> }) =>
      `${capitalizeString(row?.original?.parameterValue)}`
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }: { row: Row<RegistrarGeneralType> }) =>
      formatDate(row?.original?.createdAt)
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }: { row: Row<RegistrarGeneralType> }) =>
      capitalizeString(row?.original?.status)
  }
]
