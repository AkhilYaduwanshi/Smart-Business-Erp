import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Assets() {
    const [assets, setAssets] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        assetCode: "",
        assetName: "",
        assetType: "",
        description: "",
        purchaseDate: "",
        purchasePrice: "",
        status: "AVAILABLE",
        assignedToId: "",
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchAssets = async () => {
        try {
            setError("");

            const url = filterStatus
                ? `http://localhost:8081/api/assets?status=${filterStatus}`
                : "http://localhost:8081/api/assets";

            const response = await axios.get(
                url,
                authConfig
            );

            setAssets(response.data);
        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    "You do not have permission to manage assets."
                );
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load assets."
            );
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchAssets();
    }, [token, filterStatus, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            assetCode: "",
            assetName: "",
            assetType: "",
            description: "",
            purchaseDate: "",
            purchasePrice: "",
            status: "AVAILABLE",
            assignedToId: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const payload = {
            assetCode: formData.assetCode,
            assetName: formData.assetName,
            assetType: formData.assetType,
            description: formData.description,
            purchaseDate:
                formData.purchaseDate || null,
            purchasePrice: Number(
                formData.purchasePrice
            ),
            status: formData.status,
            assignedToId: formData.assignedToId
                ? Number(formData.assignedToId)
                : null,
        };

        try {

            if (editingId) {

                await axios.put(
                    `http://localhost:8081/api/assets/${editingId}`,
                    payload,
                    authConfig
                );

                setMessage(
                    "Asset updated successfully!"
                );

            } else {

                await axios.post(
                    "http://localhost:8081/api/assets",
                    payload,
                    authConfig
                );

                setMessage(
                    "Asset added successfully!"
                );
            }

            resetForm();
            fetchAssets();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save asset."
            );
        }
    };

    const handleEdit = (asset) => {

        setEditingId(asset.id);

        setFormData({
            assetCode:
                asset.assetCode || "",

            assetName:
                asset.assetName || "",

            assetType:
                asset.assetType || "",

            description:
                asset.description || "",

            purchaseDate:
                asset.purchaseDate || "",

            purchasePrice:
                asset.purchasePrice !== null &&
                asset.purchasePrice !== undefined
                    ? String(
                        asset.purchasePrice
                    )
                    : "",

            status:
                asset.status || "AVAILABLE",

            assignedToId:
                asset.assignedTo?.id
                    ? String(
                        asset.assignedTo.id
                    )
                    : "",
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this asset?"
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {

            await axios.delete(
                `http://localhost:8081/api/assets/${id}`,
                authConfig
            );

            setMessage(
                "Asset deleted successfully!"
            );

            fetchAssets();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete asset."
            );
        }
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "AVAILABLE":
                return "status status-success";

            case "ASSIGNED":
                return "status status-info";

            case "DAMAGED":
                return "status status-danger";

            case "MAINTENANCE":
                return "status status-warning";

            case "RETIRED":
                return "status status-danger";

            default:
                return "status";
        }
    };

    const formatStatus = (status) => {

        if (!status) {
            return "-";
        }

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    return (
        <div className="erp-layout">

            <Sidebar />

            <main className="main-content">

                <header className="topbar">
                    <div>
                        <h1>Assets</h1>

                        <p>
                            Manage company assets
                            and equipment
                        </p>
                    </div>
                </header>

                <div className="page-content">

                    {message && (
                        <div className="card">
                            <p className="status status-success">
                                {message}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="card">
                            <p className="status status-danger">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ADD / EDIT FORM */}

                    <div className="card">

                        <div className="card-header">
                            <div>

                                <h2>
                                    {editingId
                                        ? "Edit Asset"
                                        : "Add New Asset"}
                                </h2>

                                <p>
                                    {editingId
                                        ? "Update asset information"
                                        : "Enter asset details"}
                                </p>

                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label className="form-label">
                                        Asset Code
                                    </label>

                                    <input
                                        type="text"
                                        name="assetCode"
                                        value={
                                            formData.assetCode
                                        }
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="AST001"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Asset Name
                                    </label>

                                    <input
                                        type="text"
                                        name="assetName"
                                        value={
                                            formData.assetName
                                        }
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Dell Laptop"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Asset Type
                                    </label>

                                    <input
                                        type="text"
                                        name="assetType"
                                        value={
                                            formData.assetType
                                        }
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Laptop"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Purchase Date
                                    </label>

                                    <input
                                        type="date"
                                        name="purchaseDate"
                                        value={
                                            formData.purchaseDate
                                        }
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Purchase Price
                                    </label>

                                    <input
                                        type="number"
                                        name="purchasePrice"
                                        value={
                                            formData.purchasePrice
                                        }
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="55000"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >

                                        <option value="AVAILABLE">
                                            Available
                                        </option>

                                        <option value="ASSIGNED">
                                            Assigned
                                        </option>

                                        <option value="DAMAGED">
                                            Damaged
                                        </option>

                                        <option value="MAINTENANCE">
                                            Maintenance
                                        </option>

                                        <option value="RETIRED">
                                            Retired
                                        </option>

                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Assigned Employee ID
                                    </label>

                                    <input
                                        type="number"
                                        name="assignedToId"
                                        value={
                                            formData.assignedToId
                                        }
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Optional"
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={handleChange}
                                        className="form-textarea"
                                        placeholder="Office laptop"
                                        rows="3"
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {editingId
                                    ? "Update Asset"
                                    : "Add Asset"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}

                        </form>

                    </div>

                    {/* ASSET TABLE */}

                    <div className="card">

                        <div
                            className="card-header"
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                gap: "15px",
                                flexWrap: "wrap",
                            }}
                        >

                            <div>

                                <h2>
                                    Asset Inventory
                                </h2>

                                <p>
                                    Company equipment
                                    and assigned assets
                                </p>

                            </div>

                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(
                                        e.target.value
                                    )
                                }
                                className="form-select"
                            >

                                <option value="">
                                    All Statuses
                                </option>

                                <option value="AVAILABLE">
                                    Available
                                </option>

                                <option value="ASSIGNED">
                                    Assigned
                                </option>

                                <option value="DAMAGED">
                                    Damaged
                                </option>

                                <option value="MAINTENANCE">
                                    Maintenance
                                </option>

                                <option value="RETIRED">
                                    Retired
                                </option>

                            </select>

                        </div>

                        <div className="table-container">

                            <table className="data-table">

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Asset Code</th>
                                    <th>Asset Name</th>
                                    <th>Asset Type</th>
                                    <th>Purchase Date</th>
                                    <th>Price</th>
                                    <th>Assigned To</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>

                                {assets.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            style={{
                                                textAlign:
                                                    "center",
                                            }}
                                        >
                                            No assets found.
                                        </td>
                                    </tr>
                                ) : (
                                    assets.map(
                                        (asset) => (
                                            <tr
                                                key={
                                                    asset.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        asset.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        asset.assetCode
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        asset.assetName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        asset.assetType ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        asset.purchaseDate ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    ₹{" "}
                                                    {
                                                        asset.purchasePrice
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        asset.assignedTo
                                                            ? `${asset.assignedTo.firstName || ""} ${
                                                                asset.assignedTo.lastName || ""
                                                            }`.trim()
                                                            : "Unassigned"
                                                    }
                                                </td>

                                                <td>
                                                        <span
                                                            className={getStatusClass(
                                                                asset.status
                                                            )}
                                                        >
                                                            {
                                                                formatStatus(
                                                                    asset.status
                                                                )
                                                            }
                                                        </span>
                                                </td>

                                                <td>

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "8px",
                                                            flexWrap:
                                                                "wrap",
                                                        }}
                                                    >

                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    asset
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    asset.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Assets;