import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, message } from "antd";

export interface Pharmacy {
  id: string; // using string type for GUID for simplicity in frontend
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  numberOfFilledPrescriptions: number;
  createdDate: string; // using string to simplify, conversion can be handled when needed
  updatedDate: string; // same as above
}

const App: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5195/Pharmacies");
        const jsonData = await response.json();
        setPharmacies(jsonData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [pharmacies]);

  const handleEdit = (record: Pharmacy) => {
    setEditingPharmacy(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedPharmacy = { ...editingPharmacy, ...values };
      await fetch(`http://localhost:5195/Pharmacies/${updatedPharmacy.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPharmacy),
      });

      setPharmacies(
        pharmacies.map((pharmacy) =>
          pharmacy.id === updatedPharmacy.id ? updatedPharmacy : pharmacy
        )
      );
      setIsModalVisible(false);
      message.success("Pharmacy updated successfully");
    } catch (error) {
      console.error("Failed to update pharmacy:", error);
      message.error("Failed to update pharmacy");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Zip", dataIndex: "zip", key: "zip" },
    {
      title: "Filled Prescriptions",
      dataIndex: "numberOfFilledPrescriptions",
      key: "numberOfFilledPrescriptions",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Pharmacy) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
        </>
      ),
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Table dataSource={pharmacies} columns={columns} rowKey="id" />
      {isModalVisible && editingPharmacy && (
        <Modal
          title="Edit Pharmacy"
          visible={isModalVisible}
          onOk={handleSave}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical" initialValues={editingPharmacy}>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input />
            </Form.Item>
            <Form.Item label="State" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="Zip" name="zip">
              <Input />
            </Form.Item>
            <Form.Item
              label="Number Of Filled Prescriptions"
              name="numberOfFilledPrescriptions"
            >
              <InputNumber />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default App;
