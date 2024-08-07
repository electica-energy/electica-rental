"use client";

function BasicDetailsForm({ userForm, setUserForm, handleStepChange }: any) {
  // const saveProfile = async() => {
  //   try {
  //     const response = await fetch("/api/users/add", {
  //       method: "POST",
  //       body: JSON.stringify(),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setIsLoading(false);

  //       setUserForm((prev: any) => {
  //         return {
  //           ...prev,
  //           profile_pic_url: data?.profile_pic_url,
  //           uploaded_documents: {
  //             aadhar: {
  //               front: data?.aadhar_front_url,
  //               back: data?.aadhar_back_url,
  //             },
  //             pan: data?.pan_url,
  //             dl: { front: data?.dl_front_url, back: data?.dl_back_url },
  //           },
  //         };
  //       });
  //     } else {
  //       console.error("Error uploading file");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // }

  return (
    <div className="2xl:col-span-8 xl:col-span-7">
      <h3 className="text-2xl font-bold pb-5 text-bgray-900 dark:text-white dark:border-darkblack-400 border-b border-bgray-200">
        Personal Information&apos;s
      </h3>
      <div className="mt-8">
        <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
            >
              Name
            </label>
            <input
              type="text"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="name"
              value={userForm?.name}
              placeholder="Arpit Kshirsagar"
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return { ...prev, name: event.target.value };
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
            >
              {"Email (Optional)"}
            </label>
            <input
              type="email"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="email"
              value={userForm?.email}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return { ...prev, email: event.target.value };
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
            >
              {"Phone Number"}
            </label>
            <input
              type="text"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="phone"
              value={userForm?.phone}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return { ...prev, phone: event.target.value };
                });
              }}
            />
          </div>
        </div>
        <h4 className="pt-8 pb-6 text-xl font-bold text-bgray-900 dark:text-white">
          Personal Address
        </h4>
        <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="address1"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium "
            >
              Address 1
            </label>
            <input
              type="text"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="address1"
              value={userForm?.address?.address1}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return {
                    ...prev,
                    address: {
                      ...prev.address,
                      address1: event.target.value,
                    },
                  };
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="address2"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium "
            >
              Address 2
            </label>
            <input
              type="text"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="address2"
              value={userForm?.address?.address2}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return {
                    ...prev,
                    address: {
                      ...prev.address,
                      address2: event.target.value,
                    },
                  };
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="city"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
            >
              City
            </label>
            <input
              type="text"
              placeholder="Indore"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="city"
              value={userForm?.address?.city}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return {
                    ...prev,
                    address: { ...prev.address, city: event.target.value },
                  };
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="landmark"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
            >
              landmark
            </label>
            <input
              type="text"
              placeholder="Near Electica Power Center"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="landmark"
              value={userForm?.address?.landmark}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return {
                    ...prev,
                    address: {
                      ...prev.address,
                      landmark: event.target.value,
                    },
                  };
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="pincode"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium "
            >
              Postal Code
            </label>
            <input
              type="text"
              placeholder="200013"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="pincode"
              value={userForm?.address?.pincode}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return {
                    ...prev,
                    address: { ...prev.address, pincode: event.target.value },
                  };
                });
              }}
            />
          </div>
        </div>

        <h4 className="pt-8 pb-6 text-xl font-bold text-bgray-900 dark:text-white">
          Vehicle Information
        </h4>
        <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="vehicle_name"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium "
            >
              Vehicle Name
            </label>
            <input
              type="text"
              placeholder="Electica Road Runner"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="vehicle_name"
              value={userForm?.vehicle_name}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return { ...prev, vehicle_name: event.target.value };
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="vehicle_number"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
            >
              Vehicle Number
            </label>
            <input
              type="text"
              placeholder="EE-01987"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="vehicle_number"
              value={userForm?.vehicle_number}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return { ...prev, vehicle_number: event.target.value };
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="vin_number"
              className="text-base text-bgray-600 dark:text-bgray-50  font-medium"
            >
              VIN Number
            </label>
            <input
              type="text"
              placeholder="TGYG45453334566YUHRG"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
              name="vin_number"
              value={userForm?.vin_number}
              onChange={(event) => {
                setUserForm((prev: any) => {
                  return { ...prev, vin_number: event.target.value };
                });
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            aria-label="none"
            className="rounded-lg bg-success-300 text-white font-semibold mt-10 py-3.5 px-4 disabled:opacity-80"
            disabled={
              !userForm.name ||
              !userForm.phone ||
              !userForm?.address?.address1 ||
              !userForm.address?.address2 ||
              !userForm.address?.city ||
              !userForm.address?.pincode ||
              !userForm?.vehicle_name ||
              !userForm?.vehicle_number ||
              !userForm?.vin_number
            }
            onClick={() => {
              handleStepChange(2, userForm);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicDetailsForm;
