"use client";

import { useState } from "react";
import { SampleForm } from "@/utils/interfaces";
import LeftSide from "@/components/rental_form/LeftSide";
import RightSide from "@/components/rental_form/RightSide";

const initialFormState: SampleForm = {
  name: "",
  phone: "",
  email: "",
  role: "rental",
  address: {
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    landmark: "",
  },
  auth_by: "phone",
  profile_pic_url: "",
  deposit: 0,
  verified: true,
  verified_through: "manually",
  vehicle_name: "",
  vehicle_number: "",
  uploaded_documents: {
    aadhar: { front: "", back: "" },
    pan: { front: "" },
    dl: { front: "", back: "" },
  },
};

function SignIn() {
  const [userForm, setUserForm] = useState<SampleForm>(initialFormState);

  const sampleFileForm = {
    profile_pic: null,
    aadhar: { front: null, back: null },
    pan: null,
    dl: { front: null, back: null },
  };
  const [selectedFiles, setSelectedFiles] = useState(sampleFileForm);

  return (
    <section className="bg-white dark:bg-darkblack-500 lg:overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between h-screen lg:overflow-hidden">
        <LeftSide
          userForm={userForm}
          setUserForm={setUserForm}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
        <RightSide />
      </div>
    </section>
  );
}

export default SignIn;