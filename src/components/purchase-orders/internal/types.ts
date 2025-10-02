/* src/components/purchase-orders/internal/types.ts */
export type FuelPO = {
  id: string;
  type: string;
  tin: string;
  created_by: string;
  creator_employee_number: string;
  created: any;
  date: any;
  fuel?: {
    plate_number?: string;
    route?: string;
    driver?: string;
    product?: string;
    quantity?: number;
  };
  po_number: string;
};
