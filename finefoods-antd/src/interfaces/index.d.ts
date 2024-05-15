import { Dayjs } from "dayjs";

export interface IOrderChart {
  count: number;
  status:
    | "waiting"
    | "ready"
    | "on the way"
    | "delivered"
    | "could not be delivered";
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title?: "Order Count" | "Order Amount";
  value: number;
}

export interface IOrderStatus {
  id: number;
  text: "Draft" | "To Deliver" | "To Deliver and Bill" | "To Bill" | "Cancelled";
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  gsm: string;
  createdAt: string;
  isActive: boolean;
  avatar: IFile[];
  addresses: IAddress[];
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IAddress {
  text: string;
  coordinate: [number, number];
}

export interface IFile {
  name: string;
  percent: number;
  size: number;
  status: "error" | "success" | "done" | "uploading" | "removed";
  type: string;
  uid: string;
  url: string;
}

export interface IEvent {
  date: string;
  status: string;
}

export interface IStore {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  gsm: string;
  email: string;
  address: IAddress;
  products: IProduct[];
}

export interface ICourierStatus {
  id: number;
  text: "Available" | "Offline" | "On delivery";
}

export interface ICourier {
  id: number;
  name: string;
  surname: string;
  email: string;
  gender: string;
  gsm: string;
  createdAt: string;
  accountNumber: string;
  licensePlate: string;
  address: string;
  avatar: IFile[];
  store: IStore;
  status: ICourierStatus;
  vehicle: IVehicle;
}

export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  products: IProduct[];
  status: IOrderStatus;
  adress: IAddress;
  store: IStore;
  courier: ICourier;
  events: IEvent[];
  orderNumber: number;
  amount: number;
}

export interface ISalesOrder {
  name: string;
  status: string;
  grand_total: number;
  customer: string;
  modified_by: string;
}

export interface IItemGroup {
  name: string;
  item_group_name: string;
  parent_item_group: number;
  is_group: boolean;
}

export interface IUom {
  name:string;
  status:boolean;
  uom_name:string;
}

export interface UomStatus{
  id: number;
  text:  "Disabled" | "Enabled";
}

export interface IWarehouse {
  name:string;
  warehouse_name:string;
  status:boolean;
  parent_warehouse:string;
  company:string;
}

export interface IItemPrice {
  item_code:string;
  item_name: string;
  price_list: string;
  rate : number;
}

export interface IItemPriceEdit {
  item_code:string;
  item_name: string;
  price_list: string;
  UOM: string;
  buying :  boolean ;
  selling:  boolean;
  rate : number;
}

export interface ISOChildTable{
  item_code:string;
  delivery_date:date;
  item_name:string;
  qty:number;
  uom:string;
  rate:number;
  amount:number;
  warehouse:string;
}

export interface ISalesOrderEdit {
  name: string;
  status: string;
  customer_name:string;
  order_type:string;
  delivery_date:Date;
  company:string;
  currency:string;
  price_list_currency:string,
  items:ISOChildTable;
  grand_total: number;
  customer: string;
  modified_by: string;
  total:number;
  total_qty:number;
  grand_total:number;
  in_words:string;
}

export interface IProduct {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
  images: (IFile & { thumbnailUrl?: string })[];
  createdAt: string;
  price: number;
  category: {
    id: number;
    title: string;
  };
  stock: number;
}

export interface ICategory {
  id: number;
  title: string;
  isActive: boolean;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  createdAt?: [Dayjs, Dayjs];
  status?: string;
}

export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

export interface IReview {
  id: number;
  order: IOrder;
  user: IUser;
  star: number;
  createDate: string;
  status: "pending" | "approved" | "rejected";
  comment: string[];
}

export type IVehicle = {
  model: string;
  vehicleType: string;
  engineSize: number;
  color: string;
  year: number;
  id: number;
};

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}
