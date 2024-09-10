import { capitalizeString, formatDate } from "@/helpers/strings.helper"
import { Configuration } from "@/types/models/configurations"
import { Row } from "@tanstack/react-table"

export const configurationsColumns = [
  {
    header: "Name",
    accessorKey: "parameterName",
    cell: ({ row }: { row: Row<Configuration> }) =>
      `${capitalizeString(row?.original?.parameterName)}`
  },
  {
    header: "Value",
    accessorKey: "parameterValue",
    cell: ({ row }: { row: Row<Configuration> }) =>
      `${capitalizeString(row?.original?.parameterValue)}`
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }: { row: Row<Configuration> }) =>
      formatDate(row?.original?.createdAt)
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }: { row: Row<Configuration> }) =>
      capitalizeString(row?.original?.status)
  }
]
