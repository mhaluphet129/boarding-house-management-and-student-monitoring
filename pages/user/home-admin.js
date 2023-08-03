import React, { useState } from "react";
import { Layout } from "antd";
import { VscGraph } from "react-icons/vsc";
import { IoIosPeople } from "react-icons/io";
import { Sider, Header, Content, Footer } from "../layout";

import Home from "../components/admin/home";
import Student from "../components/admin/student";

const MyApp = ({ app_key }) => {
  const [selectedKey, setSelectedKey] = useState("home");
  return (
    <>
      <Layout>
        <Sider
          selectedIndex={(e) => setSelectedKey(e.key)}
          selectedKey={selectedKey}
          items={[
            { label: "Home", key: "home", icon: <VscGraph /> },
            { label: "Students", key: "student", icon: <IoIosPeople /> },
          ]}
        />
        <Layout>
          <Header app_key={app_key} />
          <Content selectedKey={selectedKey} setSelectedKey={setSelectedKey}>
            {selectedKey == "home" ? <Home /> : null}
            {selectedKey == "student" ? <Student /> : null}
          </Content>
        </Layout>
      </Layout>
      {/* <Footer /> */}
    </>
  );
};

export async function getServerSideProps() {
  return { props: { app_key: process.env.FILESTACK_KEY } };
}

export default MyApp;
