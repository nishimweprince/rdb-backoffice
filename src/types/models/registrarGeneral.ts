import { UUID } from "crypto"

export type RegistrarGeneralType = {
  id: UUID
  version: number
  state?: string
  createdAt: Date
  updatedAt: Date
  parameterType: string
  parameterName: string
  parameterValue: string
  status: string
  binaryValue: string
}
