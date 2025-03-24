import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { GrFormEdit } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsPencil } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { FaRegCheckCircle } from "react-icons/fa";
import styles from "../style/list.module.css";

import { enqueueSnackbar } from "notistack";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const [openModel, setOpenModel] = useState(false);

  const handleOpen = (a) => {
    setOpenModel(true);
    setDeleteUser(a);
  };
  const handleClose = () => setOpenModel(false);

  const filteredUsers = users.filter((user) => {
    let userName = `${user.first} ${user.last}`;
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const hasObjectChanged = (obj1, obj2) => {
    for (const key in obj1) {
      if (obj1[key] !== obj2[key]) {
        return true;
      }
    }

    return false;
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAccordionClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEditClick = (user) => {
    if (calculateAge(user.dob) >= 18) {
      setEditedUser(user);
      setIsEditing(true);
    } else {
      enqueueSnackbar("Cannot edit. User is under 18.", { variant: "info" });
    }
  };

  const handleDeleteClick = () => {
    setUsers((prevUsers) => prevUsers.filter((c) => c.id !== deleteUser?.id));
    setSearchTerm("");

    enqueueSnackbar(`${deleteUser.first} Deleted`, { variant: "success" });
  };

  const handleSaveClick = () => {
    if (editedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((c) => (c.id === editedUser.id ? editedUser : c))
      );
      setIsEditing(false);
      enqueueSnackbar("Details Updated", { variant: "success" });
    }
  };

  const handleCancelClick = () => {
    if (editedUser) {
      setEditedUser(null);
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Regex any digit in a string /\d/.
    if (name === "country" && /\d/.test(value)) {
      enqueueSnackbar("Number cant add as Country", { variant: "error" });
      return;
    }

    if (editedUser) {
      setEditedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getBirthDateFromAge = (age) => {
    const today = new Date();
    const birthYear = today.getFullYear() - age;

    const birthDate = new Date(birthYear, 0, 1);

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      birthDate.setFullYear(birthYear - 1);
    }

    return birthDate;
  };

  const handleChangeAge = (e) => {
    const { name, value } = e.target;
    console.log("value", typeof value, value);
    const age = Number(value);
    console.log("age", age);
    if (isNaN(age)) {
      enqueueSnackbar("Age Must be Number please enter number", {
        variant: "error",
      });
      return;
    }
    const birthDate = getBirthDateFromAge(age);
    if (editedUser) {
      setEditedUser((prev) => ({
        ...prev,
        [name]: birthDate,
      }));
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    (async () => {
      let response = await fetch("Data/db.json");
      let data = await response.json();
      setUsers(data);
    })();
  }, []);
  return (
    <div>
      <div className="relative w-[97%] mx-auto ml-0">

        <FaSearch className={styles.FaSearchIcon} />
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
          onFocus={(e) =>
            (e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)")
          }
          onBlur={(e) =>
            (e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)")
          }
        />
      </div>
      <div>
        {filteredUsers.length > 0 &&
          filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className="border border-red-500 rounded-lg p-4 mt-5 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"

            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", width: "60%" }}>
                  <img
                    src={user.picture}
                    alt=""
                    style={{ borderRadius: "50%" }}
                  />
                  <div style={{ marginLeft: "10%", textAlign: "left" }}>
                    {user.first} {user.last}
                  </div>
                </div>

                <div style={{ marginRight: "0%" }}>
                  {expandedIndex !== Number(user.id) - 1 ? (
                    <MdKeyboardArrowDown
                      style={{ color: "green", fontSize: "28px" }}
                      onClick={() => {
                        if (!isEditing) {
                          console.log("Number(user.id)-1", Number(user.id) - 1);
                          handleAccordionClick(Number(user.id) - 1);
                        }
                      }}
                    />
                  ) : (
                    <MdKeyboardArrowUp
                      style={{ color: "green", fontSize: "28px" }}
                      onClick={() => {
                        if (!isEditing) {
                          handleAccordionClick(index);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              {expandedIndex === Number(user.id) - 1 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "10px",
                      alignItems: "start",
                    }}
                  >
                    <div className={styles.responsiveDiv}>
                      <p style={{ color: "grey", fontWeight: "bold" }}>Age</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="dob"
                          value={calculateAge(editedUser?.dob || "")}
                          onChange={handleChangeAge}
                          className="border border-gray-400 rounded px-2 py-1 focus:outline-none focus:border-blue-500"

                        />
                      ) : (
                        <p>{calculateAge(user.dob)}</p>
                      )}
                    </div>
                    <div className={styles.responsiveDiv}>
                      <p style={{ color: "grey", fontWeight: "bold" }}>
                        Gender
                      </p>
                      {isEditing ? (
                        <div>
                          <select
                            name="gender"
                            value={editedUser?.gender || ""}
                            onChange={handleChange}
                            className="border border-gray-400 rounded px-2 py-1 focus:outline-none focus:border-blue-500"

                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="Transgender">Transgender</option>
                            <option value="Rather not say">
                              Rather not say
                            </option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      ) : (
                        <p>{user.gender}</p>
                      )}
                    </div>
                    <div className={styles.responsiveDiv}>
                      <p style={{ color: "grey", fontWeight: "bold" }}>
                        Country
                      </p>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            name="country"
                            value={editedUser?.country || ""}
                            onChange={handleChange}
                            className="border border-gray-400 rounded px-2 py-1 focus:outline-none focus:border-blue-500"

                          />
                        </div>
                      ) : (
                        <p>{user.country}</p>
                      )}
                    </div>
                  </div>
                  <div className={styles.textField}>
                    <p style={{ color: "grey", fontWeight: "bold" }}>
                      Description
                    </p>
                    {isEditing ? (
                      <div>
                        <textarea
                          style={{
                            width: "100%",
                            resize: "none",
                            height: "97px",
                          }}
                          className="border border-gray-400 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                          name="description"
                          value={editedUser?.description || ""}
                          onChange={handleChange}
                        />
                      </div>
                    ) : (
                      <p>{user.description}</p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      gap: "1%",
                      marginRight: "2%",
                      alignItems: "center",
                    }}
                  >
                    {isEditing ? (
                      <>
                        <div>
                          <FaRegCheckCircle
                            style={{ color: "red", fontSize: "24px" }}
                            onClick={() => {
                              // console.log("logger",Object.values(editedUser).some((e)=> e === "" ||  e === "0"),Object.values(editedUser));

                              let check = hasObjectChanged(user, editedUser);

                              if (
                                editedUser &&
                                Object.values(editedUser).some((e) => e === "")
                              ) {
                                enqueueSnackbar("you cant enter empty value ", {
                                  variant: "error",
                                });
                                return;
                              }

                              let a = new Date(editedUser?.dob).getFullYear();
                              let b = new Date(user?.dob).getFullYear();
                              console.log("logger", a, b);

                              if (
                                !check &&
                                new Date(editedUser?.dob).getFullYear() ===
                                  new Date(user?.dob).getFullYear()
                              ) {
                                enqueueSnackbar("PLease Update any details", {
                                  variant: "error",
                                });
                              } else {
                                handleSaveClick();
                              }
                            }}
                          />
                          <div></div>
                        </div>
                        <div>
                          {/* <button onClick={handleCancelClick}>Cancel</button> */}
                          <MdOutlineCancel
                            style={{ color: "red", fontSize: "28px" }}
                            onClick={handleCancelClick}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <BsPencil
                            style={{ color: "blue", fontSize: "21px" }}
                            onClick={() => handleEditClick(user)}
                          />
                        </div>
                        <div>
                          <RiDeleteBin6Line
                            style={{ color: "red", fontSize: "24px" }}
                            onClick={() => handleOpen(user)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <>
          <p style={{ padding: "5%" }}>No Result FOund</p>
        </>
      )}
      {openModel && (
        <div>
          <div className={styles.modalOverlay} onClick={handleClose}>
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <RxCrossCircled
                style={{
                  color: "red",
                  fontSize: "28px",
                  float: "right",
                  marginTop: "0%",
                }}
                onClick={handleClose}
              />

              <p>Are you sure you want to delete this item?</p>
              <div className={styles.modalButtons}>
                <button
                  className={styles.acceptBtn}
                  onClick={() => {
                    handleDeleteClick();
                    handleClose();
                  }}
                >
                  Delete
                </button>
                <button className={styles.rejectBtn} onClick={handleClose}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
