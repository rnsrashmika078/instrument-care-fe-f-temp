import { fetchWithAuth } from '../utils/api';
import { API_BASE } from "../../config";
import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AllOwnerTable({ usersData }) {
  const initialUsers = usersData || [];

  const [users, setUsers] = useState(initialUsers.filter(u => u.role === "User"));
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
  };

  const handleViewClick = (user) => {
    setViewingUser(user);
  };

  const handleCloseModal = () => setEditingUser(null);
  const handleCloseViewModal = () => setViewingUser(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "user_status") {
      setEditingUser((prev) => ({
        ...prev,
        user_status: checked ? 1 : 0,
      }));
    } else {
      setEditingUser((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // ✅ Updated handleSave to call backend API
  const handleSave = async () => {
    if (!editingUser || !editingUser.id) return;

    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });

      const result = await response.json();

      if (result.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? editingUser : u))
        );
        toast.success("User updated successfully");
        handleCloseModal();
      } else {
        toast.error("Update failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user. Check console for details.");
    }
  };

  // ✅ Updated handleDelete to call backend DELETE endpoint
  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Delete failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user. Check console for details.");
    }
  };

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">

      {/* ------------------------ TABLE ------------------------ */}
      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">No users found.</p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-700">
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-orange-50 transition-colors">
                    <td className="p-3">{user.first_name} {user.last_name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.mobile_number}</td>
                    <td className="p-3 font-semibold text-green-600">{user.role}</td>
                    <td className="p-3">{user.created}</td>
                    <td className="p-3">
                      <input type="checkbox" checked={user.user_status === 1} readOnly />
                    </td>
                    <td className="p-3 flex gap-3 text-lg">
                      <button onClick={() => handleViewClick(user)} className="text-blue-600">
                        <FaEye />
                      </button>
                      <button onClick={() => handleEditClick(user)} className="text-orange-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------------------- VIEW MODAL ----------------------- */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="relative bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
            
            <div className="bg-gray-50 p-8 flex flex-col items-center w-full md:w-1/3">
              <h2 className="text-2xl font-bold text-center mb-1">
                {viewingUser.first_name} {viewingUser.last_name}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                {viewingUser.designation || "-"}
              </p>
              <p className="text-sm font-semibold">
                {viewingUser.user_status === 1 ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                <p>Email: {viewingUser.email || "-"}</p>
                <p>Mobile: {viewingUser.mobile_number || "-"}</p>
                <p>Phone: {viewingUser.phone_number || "-"}</p>
                <p>Address: {viewingUser.address || "-"}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Basic Information</h3>
                <p>User Type ID: {viewingUser.user_type_id || "-"}</p>
                <p>Institute ID: {viewingUser.institute_id || "-"}</p>
                <p>Created: {viewingUser.created || "-"}</p>
                <p>Updated: {viewingUser.updatedDtm || "-"}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Other Information</h3>
                <p>Username: {viewingUser.username || "-"}</p>
                <p>Gender: {viewingUser.gender || "-"}</p>
                <p>Other Institute: {viewingUser.other_institute_name || "-"}</p>
              </div>
            </div>

            <button
              className="absolute top-4 right-4 text-3xl font-bold"
              onClick={handleCloseViewModal}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ---------------------- EDIT / UPDATE MODAL ----------------------- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl p-8 overflow-y-auto relative">

            <h2 className="text-xl font-bold mb-6">Update User</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME */}
              <input name="first_name" value={editingUser.first_name || ""} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
              <input name="last_name" value={editingUser.last_name || ""} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />

              {/* CONTACT */}
              <input name="email" value={editingUser.email || ""} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
              <input name="mobile_number" value={editingUser.mobile_number || ""} onChange={handleChange} placeholder="Mobile" className="border p-2 rounded" />
              <input name="phone_number" value={editingUser.phone_number || ""} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
              <input name="address" value={editingUser.address || ""} onChange={handleChange} placeholder="Address" className="border p-2 rounded" />

              {/* BASIC */}
              <input name="user_type_id" value={editingUser.user_type_id || ""} onChange={handleChange} placeholder="User Type ID" className="border p-2 rounded" />
              <input name="institute_id" value={editingUser.institute_id || ""} onChange={handleChange} placeholder="Institute ID" className="border p-2 rounded" />
              <input name="designation" value={editingUser.designation || ""} onChange={handleChange} placeholder="Designation" className="border p-2 rounded" />

              {/* OTHER */}
              <input name="username" value={editingUser.username || ""} onChange={handleChange} placeholder="Username" className="border p-2 rounded" />
              <input name="gender" value={editingUser.gender || ""} onChange={handleChange} placeholder="Gender" className="border p-2 rounded" />
              <input name="other_institute_name" value={editingUser.other_institute_name || ""} onChange={handleChange} placeholder="Other Institute" className="border p-2 rounded" />

              {/* ✅ ACTIVE / INACTIVE CHECKBOX */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="user_status"
                  checked={editingUser.user_status === 1}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="font-medium">
                  {editingUser.user_status === 1 ? "Active User" : "Inactive User"}
                </label>
              </div>

            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button onClick={handleCloseModal} className="px-6 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded">
                Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
