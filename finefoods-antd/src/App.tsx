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
import { OrderList, SalesOrderCreate, SalesOrderShow } from "./pages/orders";
import { SalesInvList, SalesInvEdit, SalesInvoiceCreate } from "./pages/salesinv";
import { Paymentent, PaymentEntryEdit } from "./pages/paymententry";
import { AuthPage } from "./pages/auth";
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
import { ItemDrawerShow } from "./components";
import { ItemDrawerForm } from "./components/item/drawer-form/create";

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
    <FrappeProvider socketPort={import.meta.env.VITE_SOCKET_PORT ?? ''} url='http://162.55.41.54' >
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
                create:"/orders/new",
                edit:"/orders/:id/edit",
                show: "/orders/:id",
                meta: {
                  parent:'sales', label:'Sales Order' 
                },
              },
              {
                name: "salesinv",
                list: "/salesinv",
                create:"/salesinv/new",
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
                name: "item",
                list: "/item",
                show: "/item/:id",
                edit: "/item/:id/edit",
                meta: {
                  label:'Item', icon: <FolderOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },
              {
                name: "users",
                list: "/customers",
                show: "/customers/:id",
                meta: {
                  icon: <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },
              {
                name: "products",
                list: "/products",
                create: "/products/new",
                edit: "/products/:id/edit",
                show: "/products/:id",
                meta: {
                  icon: <UnorderedListOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },
              {
                name: "categories",
                list: "/categories",
                meta: {
                  icon: <TagsOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },
              {
                name: "stores",
                list: "/stores",
                create: "/stores/new",
                edit: "/stores/:id/edit",
                meta: {
                  icon: <ShopOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },
              {
                name: "couriers",
                list: "/couriers",
                create: "/couriers/new",
                edit: "/couriers/:id/edit",
                show: "/couriers/:id",
                meta: {
                  icon: <BikeWhiteIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                },
              },
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
                  <Route path=":id" element={<SalesOrderShow />} />
                  <Route path="new" element={<SalesOrderCreate />} />
                </Route>

                <Route path="/salesinv">
                  <Route index element={<SalesInvList />} />
                  <Route path=":id" element={<SalesInvEdit />} />
                  <Route path="new" element={<SalesInvoiceCreate />} />
                </Route>

                <Route path="/paymentent">
                  <Route index element={<Paymentent />} />
                  <Route path=":id" element={<PaymentEntryEdit/>} />
                  <Route path=":id/edit" element={""} />
                </Route>

                {/* <Route
                  path="/item"
                  element={<ItemList/>}
                >
                  <Route path=":id" element={<ItemDrawerShow />} />
                </Route> */}
                <Route
                  path="/item"
                  element={
                    <ItemList>
                      <Outlet />
                    </ItemList>
                  }
                >
                  {/* <Route path="new" element={<ProductCreate />} /> */}
                  <Route path=":id" element={<ItemDrawerShow />} />
                  <Route path=":id/edit" element={<ItemDrawerForm action={"edit"} />} />
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
