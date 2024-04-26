import SalesInvoice from '../pages/SalesInvoice/SalesInvoice';
import SalesOrder from '../pages/SalesOrder/SalesOrder';
import Note from '../pages/Note/Note';
import PaymentEntry from '../pages/PaymentEntry/PaymentEntry';
import JournalEntry from '../pages/JournalEntry/JournalEntry';
import Customer from '../pages/Masters/Customer';
import Item from '../pages/Masters/Item'
import React, { useState } from 'react';
import { FormOutlined, FileOutlined, PieChartOutlined, TeamOutlined, SolutionOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { Dropdown, Avatar, Badge } from 'antd';
import { UserOutlined, FolderOutlined, CalculatorOutlined} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps['items']>[number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Notes', '2', <FormOutlined />),
  getItem('Sales', 'sub1', <SolutionOutlined />, [
    getItem('Sales Order', '3'),
    getItem('Sales Invoice', '4'),
    getItem('Payment Entry', '5'),
  ]),
  getItem('Accounts', 'sub2', <CalculatorOutlined />, [getItem('Journal Entry', '6')]),
  getItem('Masters', '9',<FolderOutlined />,[getItem('Item', '11'),getItem('Customer', '10')]),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  // const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '4') {
      setActiveTab('Sales Invoice');
    } else if (e.key === '2') {
      setActiveTab("Note");
    } else if (e.key === '3') {
      setActiveTab("Sales Order");
    } else if (e.key === '5'){
      setActiveTab("Payment Entry");
    }else if(e.key === '6'){
      setActiveTab("Journal Entry");
    }else if(e.key === '10'){
      setActiveTab('Customer');
    }else if(e.key === '11'){
      setActiveTab('Item');
    }else{
      setActiveTab(null);
    }
  };

  const handleHelpMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'documentation') {
      // Navigate to the documentation page
    } else if (key === 'report') {
      // Navigate to the report page
    } else if (key === 'issue') {
      // Navigate to the issue page
    }
  };

  const helpMenu = (
    <Menu theme='dark' onClick={handleHelpMenuClick}>
      <Menu.Item key="documentation">Documentation</Menu.Item>
      <Menu.Item key="report">Report a Issue</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ marginTop: '-8px',marginLeft:'-8px', minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
      <Header className="header-container" style={{ textAlign: 'right'}} >
          <Dropdown overlay={helpMenu} trigger={['click']}>
              <Badge count={3}>
                <Avatar size="large" onClick={(e) => e.preventDefault()} icon={<UserOutlined />} />
              </Badge>
          </Dropdown>
      </Header>
        <Content style={{borderBlockColor:'ActiveBorder', margin: '15px 16px' }}>
            <React.StrictMode>
              {activeTab === 'Sales Invoice' ? <SalesInvoice /> : null}
              {activeTab === 'Note' ? <Note /> : null}
              {activeTab === 'Sales Order' ? <SalesOrder /> : null}
              {activeTab === 'Payment Entry' ? <PaymentEntry /> : null}
              {activeTab === 'Journal Entry' ? <JournalEntry/> : null}
              {activeTab === "Customer" ? <Customer /> : null}
              {activeTab === "Item" ? <Item /> : null}
            </React.StrictMode>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;