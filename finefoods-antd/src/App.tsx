import React from "react";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import {
  ShoppingOutlined,
  ShopOutlined,
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  TagsOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import jsonServerDataProvider from "@refinedev/simple-rest";
import { authProvider } from "./authProvider";

import "dayjs/locale/de";

import { DashboardPage } from "./pages/dashboard";
import { OrderList, SalesOrderEdit } from "./pages/orders";
import { SalesInvList, SalesInvEdit } from "./pages/salesinv";
import { Paymentent, PaymentEntryEdit } from "./pages/paymententry";
import { ItemPriceList , ItemPriceEdit} from "./pages/item_price";
import { WarehouseList } from "./pages/warehouse";
import { UomList } from "./pages/uom";
import { ItemGroupList } from "./pages/item_group";
import { SupplierGroupList } from "./pages/supplier_group";
import { SupplierList } from "./pages/supplier";
import { PurchaseOrderList } from "./pages/purchase_order";
import { PurchaseInvoiceList } from "./pages/purchase_invoice";
import { AuthPage } from "./pages/auth";
import { AccountList } from "./pages/chart_of_accounts";
import { ItemTaxTemplateList } from "./pages/tax_template";
import { ModeofPaymentList } from "./pages/mode_of_payment";
import { JournalEntryList } from "./pages/journal_entry";
import { CustomerShow, CustomerList } from "./pages/customers";
import { CourierList, CourierCreate, CourierEdit } from "./pages/couriers";
import {
  ProductList,
  ProductCreate,
  ProductEdit,
  ProductShow,
} from "./pages/products";
import { StoreCreate, StoreEdit, StoreList } from "./pages/stores";
import { ItemList } from "./pages/item";
import { CategoryList } from "./pages/categories";
import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { BikeWhiteIcon } from "./components/icons";
import { ConfigProvider } from "./context";
import { useAutoLoginForDemo } from "./hooks";

import "@refinedev/antd/dist/reset.css";
import { FrappeProvider } from "frappe-react-sdk";

const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.
  const { loading } = useAutoLoginForDemo();

  const API_URL = "https://api.finefoods.refine.dev";
  const dataProvider = jsonServerDataProvider(API_URL);

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <FrappeProvider socketPort={import.meta.env.VITE_SOCKET_PORT ?? ''} url='http://49.13.29.136' >
    <BrowserRouter>
      <ConfigProvider>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  icon: <DashboardOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },
              {
                name: "sales",
                meta: {
                  label:'Sales' , icon: <ShoppingOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },

              {
                name: "orders",
                list: "/orders",
                edit:"/orders/:id/edit",
                show: "/orders/:id",
                meta: {
                  parent:'sales', label:'Sales Order' 
                },
              },
              {
                name: "salesinv",
                list: "/salesinv",
                edit:"/salesinv/:id/edit",
                show: "/salesinv/:id",
                meta: {
                  parent:'sales', label:'Sales Invoice' 
                },
              },
              {
                name: "paymentent",
                list: "/paymentent",
                edit:"/paymentent/:id/edit",
                show: "/paymentent/:id",
                meta: {
                  parent:'sales', label:'Payment Entry' 
                },
              },
              {
                name: "purchase",
                meta: {
                  label: 'Purchase',
                  icon: <ShoppingOutlined />,
                },
              },
              {
                name: "supplier",
                meta: { label: 'Supplier', parent: "purchase", canDelete: true },
                list: "/supplier",
              },
              {
                name: "groups",
                meta: { label: 'Supplier Group', parent: "purchase", canDelete: true },
                list: "/supplier_group",
              },
              {
                name: "purchase_order",
                meta: { label: 'Purchase Order', parent: "purchase", canDelete: true },
                list: "/purchase_order",
              },
              {
                name: "purchase_invoice",
                meta: { label: 'Purchase Invoice', parent: "purchase", canDelete: true },
                list: "/purchase_invoice",
              },
              {
                name: "stock",
                meta: {
                  label:'Stock' , icon: <ShoppingOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },
              {
                name: "item",
                list: "/item",
                show: "/item/:id",
                meta: {
                  label:'Item',parent : 'stock'
                },
              },
              {
                name: "item_group",
                meta: { label: 'Item Group', parent: "stock", canDelete: true,},
                list: "/item_group",
              },
              {
                name:"item_price",
                list: "/item_price",
                edit:"/item_price/:id/edit",
                meta: { label: 'Item Price', parent: "stock"},
  
              },
              {
                name: "ware_house",
                meta: { label: 'Warehouse', parent: "stock", canDelete: true},
                list: "/warehouse",
  
              },
              {
                name: "UOM",
                meta: { label: 'UOM', parent: "stock", canDelete: true},
                list: "/uom",
              },
              {
                name: "account",
                meta: {
                  label: 'Account',
                  icon: <ShoppingOutlined />,
                },
              },
              {
                name: "chart_of_accounts",
                meta: { label: 'Chart Of Account', parent: "account", canDelete: true },
                list: "/chart_of_accounts",
              },
              // {
              //   name: "account_heads",
              //   meta: { label: 'Account Head', parent: "account", canDelete: true },
              //   list: "/",
              // },
              {
                name: "tax_templates",
                meta: { label: 'Tax Template', parent: "account", canDelete: true },
                list: "/tax_template",
              },
              // {
              //   name: "tax_category",
              //   meta: { label: 'Tax Category', parent: "account", canDelete: true },
              //   list: "/",
              // },
  
              {
                name: "mode_of_pays",
                meta: { label: 'Mode Of Pays', parent: "account", canDelete: true },
                list: "/mode_of_payment",
              },
              {
                name: "journal_entry",
                meta: { label: 'Journal Entry', parent: "account", canDelete: true },
                list: "/journal_entry",
              },
              // {
              //   name: "payment_entry",
              //   meta: { label: 'Payment Entry', parent: "account", canDelete: true },
              //   list: "/",
              // },
              // {
              //   name: "reconcillation",
              //   meta: { label: "Reconcillation", parent: "account", canDelete: true },
              //   list: "/payment_reconcillation",
              // },
              {
                name: "users",
                list: "/customers",
                show: "/customers/:id",
                meta: {
                  icon: <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              }
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <div
                        style={{
                          maxWidth: "1200px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <Outlet />
                      </div>
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route path="/orders">
                  <Route index element={<OrderList />} />
                  <Route path=":id" element={<SalesOrderEdit />} />
                  <Route path=":id/edit" element={<SalesOrderEdit />} />
                </Route>

                <Route path="/salesinv">
                  <Route index element={<SalesInvList />} />
                  <Route path=":id" element={<SalesInvEdit />} />
                  <Route path=":id/edit" element={<SalesInvEdit />} />
                </Route>

                <Route path="/paymentent">
                  <Route index element={<Paymentent />} />
                  <Route path=":id" element={<PaymentEntryEdit/>} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/item_group">
                  <Route index element={<ItemGroupList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/item_price">
                  <Route index element={<ItemPriceList />} />
                  <Route path=":id" element={<ItemPriceEdit/>} />
                  <Route path=":id/edit" element={<ItemPriceEdit/>} />
                </Route>

                <Route path="/warehouse">
                  <Route index element={<WarehouseList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/supplier">
                  <Route index element={<SupplierList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/mode_of_payment">
                  <Route index element={<ModeofPaymentList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/supplier_group">
                  <Route index element={<SupplierGroupList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/purchase_order">
                  <Route index element={<PurchaseOrderList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/chart_of_accounts">
                  <Route index element={<AccountList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/tax_template">
                  <Route index element={<ItemTaxTemplateList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/journal_entry">
                  <Route index element={<JournalEntryList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/purchase_invoice">
                  <Route index element={<PurchaseInvoiceList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>

                <Route path="/uom">
                  <Route index element={<UomList />} />
                  <Route path=":id" element={""} />
                  <Route path=":id/edit" element={""} />
                </Route>
                
                <Route
                  path="/item"
                  element={<ItemList/>}
                >
                  <Route path=":id" element={<CustomerShow />} />
                </Route>

                <Route
                  path="/customers"
                  element={
                    <CustomerList>
                      <Outlet />
                    </CustomerList>
                  }
                >
                  <Route path=":id" element={<CustomerShow />} />
                </Route>

                <Route
                  path="/products"
                  element={
                    <ProductList>
                      <Outlet />
                    </ProductList>
                  }
                >
                  <Route path="new" element={<ProductCreate />} />
                  <Route path=":id" element={<ProductShow />} />
                  <Route path=":id/edit" element={<ProductEdit />} />
                </Route>

                <Route path="/stores">
                  <Route index element={<StoreList />} />
                  <Route path="new" element={<StoreCreate />} />
                  <Route path=":id/edit" element={<StoreEdit />} />
                </Route>

                <Route path="/categories" element={<CategoryList />} />

                <Route path="/couriers">
                  <Route
                    path=""
                    element={
                      <CourierList>
                        <Outlet />
                      </CourierList>
                    }
                  >
                    <Route path="new" element={<CourierCreate />} />
                  </Route>

                  <Route path=":id/edit" element={<CourierEdit />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      formProps={{
                        initialValues: {
                          email: "demo@refine.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      formProps={{
                        initialValues: {
                          email: "demo@refine.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
    </FrappeProvider>
  );
};

export default App;
