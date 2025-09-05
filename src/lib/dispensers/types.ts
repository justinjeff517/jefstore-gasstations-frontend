export type NozzleSpec = { id: 'nozzle_1' | 'nozzle_2'; product: 'Diesel' | 'Regular' }
export type DispenserSpec = { dispenser_id: 'dispenser_1' | 'dispenser_2'; location: 'East' | 'West'; nozzles: NozzleSpec[] }

export type UpdateRecord = {
  dispenser: string
  nozzle: string
  date: string
  beginning_register: number
  ending_register: number
  analog_register: number
  calibration: number
  price: number
  po: number
  cash: number
}

export type Row = UpdateRecord & {
  product_label: string
  unit: 'L'
  submitted: boolean
}
