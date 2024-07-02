import React, { useState } from "react";
import { Switch } from 'antd';
import { Form, Input, Modal, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { HideLoading, ShowLoading, ReloadData } from "../../redux/rootSlice";
import axios from "axios";

function AdminExperience() {
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const { portfolioData } = useSelector((state) => state.root);
  const { experiences } = portfolioData;
  const [showAddEditModel, setShowAddEditModel] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [type, setType] = useState("add");

  // const onChange = async () => {
  //   portfolioData.permissions.experience();
  // }

  const onFinish = async (values) => {
    try {
      let response;

      if (selectedItemForEdit) {
        response = await axios.post("/api/portfolio/update-experience", {
          ...values,
          _id: selectedItemForEdit._id,
        });
      } else {
        response = await axios.post("/api/portfolio/add-experience", values);
      }
      dispatch(ShowLoading());

      console.log(response);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        setShowAddEditModel(false);
        setSelectedItemForEdit(null);
        dispatch(HideLoading());
        dispatch(ReloadData());
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log("hi");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const OnDelete = async (item) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/portfolio/delete-experience", {
        _id: item._id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        dispatch(HideLoading());
        dispatch(ReloadData(true));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-end">
      {/* <Switch defaultChecked onChange={onChange} /> */}
        <button
          className="bg-primary px- py2 text-white px-5 py-2"
          onClick={() => {
            setSelectedItemForEdit(null);
            setShowAddEditModel(true);
          }}
        >
          Add Experience
        </button>
      </div>
      <div className="grid grid-cols-3 gap-5 m-5 sm:grid-cols-1">
        {experiences.map((experience) => (
          <div className="shadow border p-5 border-gray-400 flex flex-col gap-5">
            <h1 className="text-primary text-xl font-bold">
              {experience.period}
            </h1>
            <hr />
            <h1>Company : {experience.company} </h1>
            <h1>Role : {experience.title} </h1>
            <h1> {experience.description} </h1>
            <div className="flex justify-end gap-5 mt-5">
              <button
                className="bg-secondary text-white px-5 py-2"
                onClick={() => {
                  OnDelete(experience);
                }}
              >
                Delete
              </button>
              <button
                className="bg-primary text-white px-5 py-2"
                onClick={() => {
                  setSelectedItemForEdit(experience);
                  setShowAddEditModel(true);
                  setType("edit");
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {(type === "add" || selectedItemForEdit) && (
        <Modal
          open={showAddEditModel}
          title={selectedItemForEdit ? "Edit Experience" : "Add Experience"}
          footer={null}
          onCancel={() => {
            setShowAddEditModel(false);
            setSelectedItemForEdit(null); 
          }}
        >
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={selectedItemForEdit || {}}
          >
            <Form.Item
              label="Period"
              name="period"
              rules={[{ message: "Please input your Period!" }]}
            >
              <Input placeholder="Period" />
            </Form.Item>
            <Form.Item
              label="Company"
              name="company"
              rules={[{ message: "Please input your Company!" }]}
            >
              <Input placeholder="Period" />
            </Form.Item>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ message: "Please input your Title!" }]}
            >
              <Input placeholder="Title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ message: "Please input your Description!" }]}
            >
              <TextArea placeholder="Description" />
            </Form.Item>
            <div className="flex justify-end">
              <button
                className="border-primary text-primary px-5 py-2"
                onClick={() => {
                  setShowAddEditModel(false);
                }}
              >
                Cancel
              </button>
              <button className="bg-primary text-white px-5 py-2">
                {selectedItemForEdit ? "Update" : "Add"}
              </button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default AdminExperience;
